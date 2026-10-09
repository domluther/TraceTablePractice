# Agent guide: TraceTablePractice

Read this before changing the interpreter or adding programs. (`AI_AGENT_GUIDE.md` is a generic template-porting guide and not specific to this app.)

## What matters most

The **GCSE programs (easy, medium, hard) are the critical product**. A-Level is bonus functionality and must never put them at risk.

- [src/test/gcse-golden.test.ts](src/test/gcse-golden.test.ts) snapshots the full trace and outputs of every GCSE program and input set (`src/test/__snapshots__/gcse-golden.test.ts.snap`). **It must pass unchanged.**
- **Never run `vitest -u` to make it pass.** A snapshot diff means the interpreter's behaviour changed for GCSE programs. Fix the interpreter instead. Only update the snapshot if a GCSE program is deliberately changed (and say so).
- If you add or edit GCSE programs in `programs.ts`, new snapshots are written for them. Check they look right.

## Changing the interpreter ([src/lib/astInterpreter.ts](src/lib/astInterpreter.ts))

It is a string/regex based interpreter with many interacting special cases, so small changes can have wide effects. Rules:

1. **Make additive, non-breaking changes.** New behaviour should only apply to input that previously failed or was meaningless (for example, only when a bracket contains an operator, only when the regex that used to match did not). Keep the original code path for existing syntax.
2. **Prefer pre-processing over editing the existing detection logic.** `resolveArrayReferences` rewrites `a[i + 1]` to `a[3]` and `arr.length` to a number up front, so the fragile splitters (string concatenation detection, arithmetic tokenising) never see the new syntax.
3. **Watch for unanchored regexes.** A regex that matches a prefix will silently ignore the rest (for example `for j = 0 to 4 - 1` read as `0 to 4`). Anchor new and old patterns when you extend them.
4. **Leave string literals alone.** Text inside quotes must not be rewritten or evaluated.
5. **Run a differential check on risky changes.** Copy the previous interpreter (`git show HEAD:src/lib/astInterpreter.ts`) next to the new one, run many programs and expressions through both, and diff the results. The only differences should be the intentional ones. Delete the temporary files afterwards.
6. **Add tests for every new capability** (see `src/test/array-index-expressions.test.ts`), including edge cases: empty/one-element arrays, out-of-range indexes, loops that should not run, and "existing behaviour unchanged" cases.
7. Do not fix unrelated existing quirks as a side effect. Known example: `word.length + 1` evaluates incorrectly in assignments (pre-existing).

Currently supported additions beyond the original GCSE feature set: expression array indexes (`a[i + 1]`), `array a[size]` with a variable size, `arr.length` on arrays, `for` loops with variable/expression bounds and step, and alphabetical `<`/`>`/`<=`/`>=` for text.

Also supported: `print(array)` (prints `[1, 2, 4, 5]`), numeric literals in `print`, and user-defined `procedure name(a, b) ... endprocedure` / `function name(a) ... return x ... endfunction`, including recursion (limit: 100 nested calls). How calls work:
- Calls are replaced by their return value before the line is evaluated (`resolveFunctionCalls`), so the existing parsers never see them. Programs without a `function`/`procedure` take the original code path.
- Each call has its own variables, inheriting the main program's (so a procedure can read and change a global array, but a plain variable assigned inside a call is local). Programs must not reuse a name inside and outside a subprogram. Arrays passed as arguments are copied; arrays cannot be returned.
- Trace: binding the parameters is a row on the `function`/`procedure` header line; each `return value` is a row on the return line with a `return` column.

## Programs ([src/lib/programs.ts](src/lib/programs.ts))

- Programs are grouped by `Difficulty` (`easy | medium | hard | alevel`, defined with its labels and order in [src/lib/types.ts](src/lib/types.ts)). Use `DIFFICULTY_ORDER`, `DIFFICULTY_LABELS` and `isDifficulty` instead of hard-coding the list.
- **Scores are saved by `<difficulty>-<index>`.** Reordering or inserting programs in the middle of a list changes which program old scores belong to. Append new programs to existing GCSE lists unless you accept that.
- Two ways to vary a program between attempts:
  - `inputSets` / `randomValues`: values supplied to `input()` and `random()`. The student sees them beside the code.
  - `setupVariants`: alternative versions of the opening lines of `code` (for example `array items = [...]` and `target = 19`). One replaces those lines when the program is picked (`pickProgramInputs` in `src/lib/utils.ts`) or shuffled (`TraceTableBody`). Use this when students should not have to trace input. All variants of a program must have the same number of lines, and the first variant must match the opening lines of `code`.
- Keep programs small enough to trace on screen: short arrays (about 3 to 8 values), short numeric values rather than long words.
- The A-Level order is teaching order: linear search, binary search, bubble sort, insertion sort, then recursion (factorial, Fibonacci, Towers of Hanoi, recursive binary search), then merge sort and quick sort.

## Checklist when adding a program

1. Write it in OCR ERL (`==`, `AND`/`OR`, `DIV`/`MOD`, `if ... then ... elseif ... else ... endif`, `for ... next`, `while ... endwhile`, `array name = [...]`, `name.length`).
2. If it needs syntax the interpreter lacks, follow the interpreter rules above first.
3. Add tests in `src/test/programs.test.ts`: compute the expected result for **every variant** independently in plain JavaScript and compare with the interpreter's output. Find programs by `description`, not by index.
4. Run all checks (below), and confirm `gcse-golden.test.ts` is untouched.

## Commands

```bash
npm run test:run    # all tests, including the GCSE golden snapshots
npm run type-check  # or: npx tsc -b
npm run lint:fix    # biome
npm run build
```

All of these should pass before finishing.
