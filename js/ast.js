// AST-based Interpreter for OCR Exam Reference Language

// ============================================================================
// AST NODE TYPES
// ============================================================================

class ASTNode {
  constructor(type, line = 0) {
    this.type = type;
    this.line = line;
  }
}

// Expression nodes
class LiteralNode extends ASTNode {
  constructor(value, dataType = 'auto', line = 0) {
    super('literal', line);
    this.value = value;
    this.dataType = dataType;
  }
}

class VariableNode extends ASTNode {
  constructor(name, line = 0) {
    super('variable', line);
    this.name = name;
  }
}

class ArrayAccessNode extends ASTNode {
  constructor(arrayName, index, line = 0) {
    super('arrayAccess', line);
    this.arrayName = arrayName;
    this.index = index; // Can be another expression node
  }
}

class BinaryOpNode extends ASTNode {
  constructor(operator, left, right, line = 0) {
    super('binaryOp', line);
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

class UnaryOpNode extends ASTNode {
  constructor(operator, operand, line = 0) {
    super('unaryOp', line);
    this.operator = operator;
    this.operand = operand;
  }
}

class FunctionCallNode extends ASTNode {
  constructor(functionName, args, line = 0) {
    super('functionCall', line);
    this.functionName = functionName;
    this.args = args;
  }
}

class StringMethodNode extends ASTNode {
  constructor(object, method, args = [], line = 0) {
    super('stringMethod', line);
    this.object = object;
    this.method = method;
    this.args = args;
  }
}

// Statement nodes
class AssignmentNode extends ASTNode {
  constructor(target, value, isConstant = false, line = 0) {
    super('assignment', line);
    this.target = target; // Can be VariableNode or ArrayAccessNode
    this.value = value;
    this.isConstant = isConstant;
  }
}

class PrintNode extends ASTNode {
  constructor(expression, line = 0) {
    super('print', line);
    this.expression = expression;
  }
}

class ArrayDeclarationNode extends ASTNode {
  constructor(name, size = null, initialValues = null, line = 0) {
    super('arrayDeclaration', line);
    this.name = name;
    this.size = size;
    this.initialValues = initialValues;
  }
}

// Control flow nodes
class IfNode extends ASTNode {
  constructor(condition, thenBlock, elseifBlocks = [], elseBlock = null, line = 0) {
    super('if', line);
    this.condition = condition;
    this.thenBlock = thenBlock;
    this.elseifBlocks = elseifBlocks; // Array of {condition, block}
    this.elseBlock = elseBlock;
  }
}

class WhileNode extends ASTNode {
  constructor(condition, body, line = 0) {
    super('while', line);
    this.condition = condition;
    this.body = body;
  }
}

class DoUntilNode extends ASTNode {
  constructor(body, condition, line = 0) {
    super('doUntil', line);
    this.body = body;
    this.condition = condition;
  }
}

class ForNode extends ASTNode {
  constructor(variable, start, end, step, body, line = 0) {
    super('for', line);
    this.variable = variable;
    this.start = start;
    this.end = end;
    this.step = step;
    this.body = body;
  }
}

class SwitchNode extends ASTNode {
  constructor(expression, cases, defaultCase = null, line = 0) {
    super('switch', line);
    this.expression = expression;
    this.cases = cases; // Array of {value, body}
    this.defaultCase = defaultCase;
  }
}

class BlockNode extends ASTNode {
  constructor(statements, line = 0) {
    super('block', line);
    this.statements = statements;
  }
}

// ============================================================================
// LEXER
// ============================================================================

class Token {
  constructor(type, value, line = 0, column = 0) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Lexer {
  constructor(code) {
    this.code = code;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize() {
    while (this.position < this.code.length) {
      this.skipWhitespace();
      
      if (this.position >= this.code.length) break;

      const char = this.code[this.position];

      // Skip comments
      if (char === '/' && this.peek() === '/') {
        this.skipComment();
        continue;
      }

      // String literals
      if (char === '"' || char === "'") {
        this.readString(char);
        continue;
      }

      // Numbers
      if (this.isDigit(char)) {
        this.readNumber();
        continue;
      }

      // Identifiers and keywords
      if (this.isAlpha(char) || char === '_') {
        this.readIdentifier();
        continue;
      }

      // Two-character operators
      if (this.position + 1 < this.code.length) {
        const twoChar = this.code.substr(this.position, 2);
        if (['==', '!=', '<=', '>=', 'MOD', 'DIV', 'AND', 'OR'].includes(twoChar.toUpperCase())) {
          this.addToken('OPERATOR', twoChar.toUpperCase());
          this.advance(2);
          continue;
        }
      }

      // Single character tokens
      const singleCharTokens = {
        '+': 'OPERATOR',
        '-': 'OPERATOR', 
        '*': 'OPERATOR',
        '/': 'OPERATOR',
        '^': 'OPERATOR',
        '=': 'EQUALS',
        '<': 'OPERATOR',
        '>': 'OPERATOR',
        '(': 'LPAREN',
        ')': 'RPAREN',
        '[': 'LBRACKET',
        ']': 'RBRACKET',
        ',': 'COMMA',
        ':': 'COLON',
        '.': 'DOT',
        '\n': 'NEWLINE'
      };

      if (singleCharTokens[char]) {
        this.addToken(singleCharTokens[char], char);
        if (char === '\n') {
          this.line++;
          this.column = 1;
        } else {
          this.column++;
        }
        this.position++;
        continue;
      }

      // Unknown character
      throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
    }

    this.addToken('EOF', '');
    return this.tokens;
  }

  addToken(type, value) {
    this.tokens.push(new Token(type, value, this.line, this.column));
  }

  advance(count = 1) {
    this.position += count;
    this.column += count;
  }

  peek(offset = 1) {
    const pos = this.position + offset;
    return pos < this.code.length ? this.code[pos] : '\0';
  }

  skipWhitespace() {
    while (this.position < this.code.length) {
      const char = this.code[this.position];
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else {
        break;
      }
    }
  }

  skipComment() {
    while (this.position < this.code.length && this.code[this.position] !== '\n') {
      this.advance();
    }
  }

  readString(quote) {
    const start = this.position;
    this.advance(); // Skip opening quote

    let value = '';
    while (this.position < this.code.length && this.code[this.position] !== quote) {
      if (this.code[this.position] === '\\') {
        this.advance();
        if (this.position < this.code.length) {
          const escaped = this.code[this.position];
          switch (escaped) {
            case 'n': value += '\n'; break;
            case 't': value += '\t'; break;
            case 'r': value += '\r'; break;
            case '\\': value += '\\'; break;
            case '"': value += '"'; break;
            case "'": value += "'"; break;
            default: value += escaped;
          }
          this.advance();
        }
      } else {
        value += this.code[this.position];
        this.advance();
      }
    }

    if (this.position >= this.code.length) {
      throw new Error(`Unterminated string starting at line ${this.line}`);
    }

    this.advance(); // Skip closing quote
    this.addToken('STRING', value);
  }

  readNumber() {
    let value = '';
    let hasDecimal = false;

    while (this.position < this.code.length) {
      const char = this.code[this.position];
      if (this.isDigit(char)) {
        value += char;
        this.advance();
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        value += char;
        this.advance();
      } else {
        break;
      }
    }

    this.addToken('NUMBER', hasDecimal ? parseFloat(value) : parseInt(value));
  }

  readIdentifier() {
    let value = '';
    
    while (this.position < this.code.length) {
      const char = this.code[this.position];
      if (this.isAlphaNumeric(char) || char === '_') {
        value += char;
        this.advance();
      } else {
        break;
      }
    }

    // Check for keywords
    const keywords = {
      'if': 'IF',
      'then': 'THEN', 
      'else': 'ELSE',
      'elseif': 'ELSEIF',
      'endif': 'ENDIF',
      'while': 'WHILE',
      'endwhile': 'ENDWHILE',
      'do': 'DO',
      'until': 'UNTIL',
      'for': 'FOR',
      'to': 'TO',
      'step': 'STEP',
      'next': 'NEXT',
      'switch': 'SWITCH',
      'case': 'CASE',
      'default': 'DEFAULT',
      'endswitch': 'ENDSWITCH',
      'array': 'ARRAY',
      'const': 'CONST',
      'print': 'PRINT',
      // 'input': 'INPUT', // Remove this - input should be treated as a function, not a keyword
      'true': 'BOOLEAN',
      'false': 'BOOLEAN',
      'and': 'OPERATOR',
      'or': 'OPERATOR',
      'mod': 'OPERATOR',
      'div': 'OPERATOR'
    };

    const lowerValue = value.toLowerCase();
    const tokenType = keywords[lowerValue] || 'IDENTIFIER';
    
    if (tokenType === 'BOOLEAN') {
      this.addToken(tokenType, lowerValue === 'true');
    } else if (tokenType === 'OPERATOR') {
      this.addToken(tokenType, value.toUpperCase());
    } else {
      this.addToken(tokenType, value);
    }
  }

  isDigit(char) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }
}

// ============================================================================
// PARSER
// ============================================================================

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    
    while (!this.isAtEnd()) {
      // Skip newlines at the top level
      if (this.check('NEWLINE')) {
        this.advance();
        continue;
      }
      
      const stmt = this.statement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return new BlockNode(statements);
  }

  statement() {
    try {
      const startLine = this.peek().line;
      
      if (this.match('CONST')) return this.constDeclaration(startLine);
      if (this.match('ARRAY')) return this.arrayDeclaration(startLine);
      if (this.match('PRINT')) return this.printStatement(startLine);
      if (this.match('IF')) return this.ifStatement(startLine);
      if (this.match('WHILE')) return this.whileStatement(startLine);
      if (this.match('DO')) return this.doUntilStatement(startLine);
      if (this.match('FOR')) return this.forStatement(startLine);
      if (this.match('SWITCH')) return this.switchStatement(startLine);
      
      return this.assignmentOrExpression(startLine);
    } catch (error) {
      // Skip to next line on parse error
      this.synchronize();
      return null;
    }
  }

  constDeclaration(line) {
    const name = this.consume('IDENTIFIER', 'Expected variable name after const').value;
    this.consume('EQUALS', 'Expected = after const variable name');
    const value = this.expression();
    this.consumeNewlineOrEOF();
    return new AssignmentNode(new VariableNode(name, line), value, true, line);
  }

  arrayDeclaration(line) {
    const name = this.consume('IDENTIFIER', 'Expected array name').value;
    
    if (this.match('LBRACKET')) {
      // array name[size] format
      const size = this.expression();
      this.consume('RBRACKET', 'Expected ] after array size');
      this.consumeNewlineOrEOF();
      return new ArrayDeclarationNode(name, size, null, line);
    } else if (this.match('EQUALS')) {
      // array name = [values] format
      this.consume('LBRACKET', 'Expected [ after =');
      const values = [];
      
      if (!this.check('RBRACKET')) {
        do {
          values.push(this.expression());
        } while (this.match('COMMA'));
      }
      
      this.consume('RBRACKET', 'Expected ] after array values');
      this.consumeNewlineOrEOF();
      return new ArrayDeclarationNode(name, null, values, line);
    }
    
    throw new Error('Invalid array declaration syntax');
  }

  printStatement(line) {
    this.consume('LPAREN', 'Expected ( after print');
    const expr = this.expression();
    this.consume('RPAREN', 'Expected ) after print expression');
    this.consumeNewlineOrEOF();
    return new PrintNode(expr, line);
  }

  ifStatement(line) {
    const condition = this.expression();
    this.consume('THEN', 'Expected then after if condition');
    this.consumeNewlineOrEOF();
    
    const thenBlock = this.block(['ELSEIF', 'ELSE', 'ENDIF']);
    const elseifBlocks = [];
    let elseBlock = null;
    
    while (this.match('ELSEIF')) {
      const elseifCondition = this.expression();
      this.consume('THEN', 'Expected then after elseif condition');
      this.consumeNewlineOrEOF();
      const elseifBody = this.block(['ELSEIF', 'ELSE', 'ENDIF']);
      elseifBlocks.push({ condition: elseifCondition, block: elseifBody });
    }
    
    if (this.match('ELSE')) {
      this.consumeNewlineOrEOF();
      elseBlock = this.block(['ENDIF']);
    }
    
    this.consume('ENDIF', 'Expected endif');
    this.consumeNewlineOrEOF();
    
    return new IfNode(condition, thenBlock, elseifBlocks, elseBlock, line);
  }

  whileStatement(line) {
    const condition = this.expression();
    this.consumeNewlineOrEOF();
    const body = this.block(['ENDWHILE']);
    this.consume('ENDWHILE', 'Expected endwhile');
    this.consumeNewlineOrEOF();
    return new WhileNode(condition, body, line);
  }

  doUntilStatement(line) {
    this.consumeNewlineOrEOF();
    const body = this.block(['UNTIL']);
    this.consume('UNTIL', 'Expected until');
    const condition = this.expression();
    this.consumeNewlineOrEOF();
    return new DoUntilNode(body, condition, line);
  }

  forStatement(line) {
    const variable = this.consume('IDENTIFIER', 'Expected variable name in for loop').value;
    this.consume('EQUALS', 'Expected = after for variable');
    const start = this.expression();
    this.consume('TO', 'Expected to in for loop');
    const end = this.expression();
    
    let step = new LiteralNode(1, 'number', line);
    if (this.match('STEP')) {
      step = this.expression();
    }
    
    this.consumeNewlineOrEOF();
    const body = this.block(['NEXT']);
    this.consume('NEXT', 'Expected next');
    
    // The variable name after NEXT is optional in some syntaxes
    if (this.check('IDENTIFIER')) {
      this.advance(); // Skip the variable name after next
    }
    
    this.consumeNewlineOrEOF();
    
    return new ForNode(variable, start, end, step, body, line);
  }

  switchStatement(line) {
    const expr = this.expression();
    this.consume('COLON', 'Expected : after switch expression');
    this.consumeNewlineOrEOF();
    
    const cases = [];
    let defaultCase = null;
    
    while (this.check('CASE') || this.check('DEFAULT')) {
      if (this.match('CASE')) {
        const value = this.expression();
        this.consume('COLON', 'Expected : after case value');
        this.consumeNewlineOrEOF();
        const body = this.block(['CASE', 'DEFAULT', 'ENDSWITCH']);
        cases.push({ value, body });
      } else if (this.match('DEFAULT')) {
        this.consume('COLON', 'Expected : after default');
        this.consumeNewlineOrEOF();
        defaultCase = this.block(['ENDSWITCH']);
      }
    }
    
    this.consume('ENDSWITCH', 'Expected endswitch');
    this.consumeNewlineOrEOF();
    
    return new SwitchNode(expr, cases, defaultCase, line);
  }

  assignmentOrExpression(line) {
    const expr = this.expression();
    
    if (this.match('EQUALS')) {
      // Check if we're trying to assign to a keyword
      if (expr.type === 'variable') {
        const varName = expr.name.toLowerCase();
        const keywords = ['if', 'then', 'else', 'elseif', 'endif', 'while', 'endwhile', 'do', 'until', 'for', 'to', 'step', 'next', 'switch', 'case', 'default', 'endswitch', 'array', 'const', 'print', 'true', 'false', 'and', 'or', 'mod', 'div'];
        if (keywords.includes(varName)) {
          throw new Error(`Cannot use reserved keyword '${expr.name}' as a variable name at line ${line}`);
        }
      }
      
      const value = this.expression();
      this.consumeNewlineOrEOF();
      return new AssignmentNode(expr, value, false, line);
    }
    
    this.consumeNewlineOrEOF();
    return expr;
  }

  block(terminators) {
    const statements = [];
    
    while (!this.isAtEnd() && !this.checkAny(terminators)) {
      if (this.check('NEWLINE')) {
        this.advance();
        continue;
      }
      
      const stmt = this.statement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    return new BlockNode(statements);
  }

  expression() {
    return this.logicalOr();
  }

  logicalOr() {
    let expr = this.logicalAnd();
    
    while (this.matchOperator('OR')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.logicalAnd();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  logicalAnd() {
    let expr = this.equality();
    
    while (this.matchOperator('AND')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.equality();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  equality() {
    let expr = this.comparison();
    
    while (this.matchOperator('==', '!=')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.comparison();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  comparison() {
    let expr = this.term();
    
    while (this.matchOperator('>', '>=', '<', '<=')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.term();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  term() {
    let expr = this.factor();
    
    while (this.matchOperator('+', '-')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.factor();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  factor() {
    let expr = this.exponent();
    
    while (this.matchOperator('*', '/', 'MOD', 'DIV')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.exponent();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  exponent() {
    let expr = this.unary();
    
    // Right associative
    if (this.matchOperator('^')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.exponent();
      expr = new BinaryOpNode(operator, expr, right, line);
    }
    
    return expr;
  }

  unary() {
    if (this.matchOperator('-', '+')) {
      const operator = this.previous().value;
      const line = this.previous().line;
      const right = this.unary();
      return new UnaryOpNode(operator, right, line);
    }
    
    return this.postfix();
  }

  postfix() {
    let expr = this.primary();
    
    while (true) {
      if (this.match('LBRACKET')) {
        const index = this.expression();
        this.consume('RBRACKET', 'Expected ] after array index');
        expr = new ArrayAccessNode(expr.name, index, expr.line);
      } else if (this.match('DOT')) {
        const method = this.consume('IDENTIFIER', 'Expected method name after .').value;
        
        if (this.match('LPAREN')) {
          const args = [];
          if (!this.check('RPAREN')) {
            do {
              args.push(this.expression());
            } while (this.match('COMMA'));
          }
          this.consume('RPAREN', 'Expected ) after method arguments');
          expr = new StringMethodNode(expr, method, args, expr.line);
        } else {
          // Property access (e.g., .length)
          expr = new StringMethodNode(expr, method, [], expr.line);
        }
      } else {
        break;
      }
    }
    
    return expr;
  }

  primary() {
    const line = this.peek().line;
    
    if (this.match('BOOLEAN')) {
      return new LiteralNode(this.previous().value, 'boolean', line);
    }
    
    if (this.match('NUMBER')) {
      return new LiteralNode(this.previous().value, 'number', line);
    }
    
    if (this.match('STRING')) {
      return new LiteralNode(this.previous().value, 'string', line);
    }
    
    if (this.match('IDENTIFIER')) {
      const name = this.previous().value;
      
      if (this.match('LPAREN')) {
        // Function call
        const args = [];
        if (!this.check('RPAREN')) {
          do {
            args.push(this.expression());
          } while (this.match('COMMA'));
        }
        this.consume('RPAREN', 'Expected ) after function arguments');
        return new FunctionCallNode(name, args, line);
      }
      
      return new VariableNode(name, line);
    }
    
    if (this.match('LPAREN')) {
      const expr = this.expression();
      this.consume('RPAREN', 'Expected ) after expression');
      return expr;
    }
    
    throw new Error(`Unexpected token ${this.peek().type} at line ${this.peek().line}`);
  }

  // Helper methods
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  matchOperator(...operators) {
    if (this.check('OPERATOR')) {
      const token = this.peek();
      if (operators.includes(token.value)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  checkAny(types) {
    return types.some(type => this.check(type));
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(`${message}. Got ${this.peek().type} at line ${this.peek().line}`);
  }

  consumeNewlineOrEOF() {
    if (!this.check('EOF') && !this.check('NEWLINE')) {
      // Allow implicit newlines at end of statement
      return;
    }
    if (this.check('NEWLINE')) {
      this.advance();
    }
  }

  synchronize() {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === 'NEWLINE') return;
      
      const peek = this.peek();
      if (['IF', 'FOR', 'WHILE', 'DO', 'SWITCH', 'PRINT', 'CONST', 'ARRAY'].includes(peek.type)) {
        return;
      }
      
      this.advance();
    }
  }
}

// ============================================================================
// INTERPRETER
// ============================================================================

export class ASTInterpreter {
  constructor() {
    this.variables = {};
    this.constants = {};
    this.outputs = [];
    this.trace = [];
    this.inputs = [];
    this.inputIndex = 0;
    this.randomValue = undefined;
  }

  reset() {
    this.variables = {};
    this.constants = {};
    this.outputs = [];
    this.trace = [];
    this.inputs = [];
    this.inputIndex = 0;
    this.randomValue = undefined;
  }

  executeProgram(code, inputData = { inputs: [], randomValue: undefined }) {
    this.reset();
    this.inputs = inputData.inputs || [];
    this.inputIndex = 0;
    this.randomValue = inputData.randomValue;

    try {
      // Tokenize
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      // Parse
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      // Execute
      this.executeNode(ast);
      
      return {
        variables: this.getExpandedVariableNames(),
        outputs: this.outputs,
        trace: this.trace
      };
    } catch (error) {
      console.error('Execution error:', error);
      throw error;
    }
  }

  executeNode(node) {
    if (!node) return null;

    switch (node.type) {
      case 'block':
        return this.executeBlock(node);
      case 'assignment':
        return this.executeAssignment(node);
      case 'print':
        return this.executePrint(node);
      case 'arrayDeclaration':
        return this.executeArrayDeclaration(node);
      case 'if':
        return this.executeIf(node);
      case 'while':
        return this.executeWhile(node);
      case 'doUntil':
        return this.executeDoUntil(node);
      case 'for':
        return this.executeFor(node);
      case 'switch':
        return this.executeSwitch(node);
      case 'functionCall':
      case 'variable':
      case 'literal':
      case 'binaryOp':
      case 'unaryOp':
      case 'arrayAccess':
      case 'stringMethod':
        // These are expressions that might be standalone statements
        // Evaluate them but don't do anything with the result
        return this.evaluateExpression(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  executeBlock(blockNode) {
    for (const statement of blockNode.statements) {
      this.executeNode(statement);
    }
  }

  executeAssignment(node) {
    const value = this.evaluateExpression(node.value);
    const changeRecord = {};

    if (node.target.type === 'variable') {
      const varName = node.target.name;
      
      if (node.isConstant) {
        this.constants[varName] = true;
      } else if (this.constants[varName]) {
        throw new Error(`Cannot reassign constant: ${varName}`);
      }
      
      this.variables[varName] = value;
      changeRecord[varName] = value;
    } else if (node.target.type === 'arrayAccess') {
      const arrayName = node.target.arrayName;
      const index = this.evaluateExpression(node.target.index);
      
      if (!this.variables[arrayName] || !Array.isArray(this.variables[arrayName])) {
        this.variables[arrayName] = [];
      }
      
      this.variables[arrayName][index] = value;
      changeRecord[`${arrayName}[${index}]`] = value;
    }

    // Always add trace entry for assignments, even if no variables changed
    this.addTraceEntry(node.line, this.variables, '', changeRecord);
  }

  executePrint(node) {
    const value = this.evaluateExpression(node.expression);
    const output = value.toString();
    this.outputs.push(output);
    this.addTraceEntry(node.line, this.variables, output);
  }

  executeArrayDeclaration(node) {
    const changeRecord = {};
    
    if (node.initialValues) {
      const values = node.initialValues.map(expr => this.evaluateExpression(expr));
      this.variables[node.name] = values;
      
      // Only add individual array elements to the change record for trace table
      for (let i = 0; i < values.length; i++) {
        changeRecord[`${node.name}[${i}]`] = values[i];
      }
    } else if (node.size) {
      const size = this.evaluateExpression(node.size);
      this.variables[node.name] = new Array(size).fill(0);
      // Don't trace empty array declarations
    }

    if (Object.keys(changeRecord).length > 0) {
      this.addTraceEntry(node.line, this.variables, '', changeRecord);
    }
  }

  executeIf(node) {
    const condition = this.evaluateExpression(node.condition);
    
    if (condition) {
      this.executeNode(node.thenBlock);
    } else {
      // Check elseif conditions
      for (const elseif of node.elseifBlocks) {
        if (this.evaluateExpression(elseif.condition)) {
          this.executeNode(elseif.block);
          return;
        }
      }
      
      // Execute else block if no conditions matched
      if (node.elseBlock) {
        this.executeNode(node.elseBlock);
      }
    }
  }

  executeWhile(node) {
    let iterations = 0;
    const maxIterations = 10000;
    
    while (this.evaluateExpression(node.condition)) {
      iterations++;
      if (iterations > maxIterations) {
        throw new Error(`Infinite while loop detected after ${maxIterations} iterations`);
      }
      this.executeNode(node.body);
    }
  }

  executeDoUntil(node) {
    let iterations = 0;
    const maxIterations = 10000;
    
    do {
      iterations++;
      if (iterations > maxIterations) {
        throw new Error(`Infinite do-until loop detected after ${maxIterations} iterations`);
      }
      this.executeNode(node.body);
    } while (!this.evaluateExpression(node.condition));
  }

  executeFor(node) {
    const start = this.evaluateExpression(node.start);
    const end = this.evaluateExpression(node.end);
    const step = this.evaluateExpression(node.step);
    
    const shouldContinue = step > 0 
      ? (val) => val <= end 
      : (val) => val >= end;
    
    for (let i = start; shouldContinue(i); i += step) {
      this.variables[node.variable] = i;
      
      // Trace the loop variable assignment
      const changeRecord = {};
      changeRecord[node.variable] = i;
      this.addTraceEntry(node.line, this.variables, '', changeRecord);
      
      this.executeNode(node.body);
    }
  }

  executeSwitch(node) {
    const switchValue = this.evaluateExpression(node.expression);
    
    // Find matching case
    for (const caseItem of node.cases) {
      const caseValue = this.evaluateExpression(caseItem.value);
      if (switchValue === caseValue) {
        this.executeNode(caseItem.body);
        return;
      }
    }
    
    // Execute default case if no match
    if (node.defaultCase) {
      this.executeNode(node.defaultCase);
    }
  }

  evaluateExpression(node) {
    if (!node) return null;

    switch (node.type) {
      case 'literal':
        return node.value;
        
      case 'variable':
        return this.variables[node.name] ?? 0;
        
      case 'arrayAccess':
        const arrayName = node.arrayName;
        const index = this.evaluateExpression(node.index);
        const array = this.variables[arrayName];
        if (array && Array.isArray(array) && index >= 0 && index < array.length) {
          return array[index];
        }
        return 0;
        
      case 'binaryOp':
        return this.evaluateBinaryOperation(node);
        
      case 'unaryOp':
        return this.evaluateUnaryOperation(node);
        
      case 'functionCall':
        return this.evaluateFunctionCall(node);
        
      case 'stringMethod':
        return this.evaluateStringMethod(node);
        
      default:
        throw new Error(`Unknown expression type: ${node.type}`);
    }
  }

  evaluateBinaryOperation(node) {
    const left = this.evaluateExpression(node.left);
    const right = this.evaluateExpression(node.right);
    
    switch (node.operator) {
      case '+':
        // Handle string concatenation
        if (typeof left === 'string' || typeof right === 'string') {
          return left.toString() + right.toString();
        }
        return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case 'DIV': return Math.floor(left / right);
      case 'MOD': return left % right;
      case '^': return Math.pow(left, right);
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '<=': return left <= right;
      case '>': return left > right;
      case '>=': return left >= right;
      case 'AND': return left && right;
      case 'OR': return left || right;
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  evaluateUnaryOperation(node) {
    const operand = this.evaluateExpression(node.operand);
    
    switch (node.operator) {
      case '-': return -operand;
      case '+': return +operand;
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  evaluateFunctionCall(node) {
    const funcName = node.functionName.toLowerCase();
    const args = node.args.map(arg => this.evaluateExpression(arg));
    
    switch (funcName) {
      case 'input':
        if (this.inputIndex < this.inputs.length) {
          return this.inputs[this.inputIndex++];
        }
        return '';
        
      case 'int':
        return parseInt(args[0] ?? 0);
        
      case 'float':
      case 'real':
        return parseFloat(args[0] ?? 0);
        
      case 'str':
        return (args[0] ?? '').toString();
        
      case 'bool':
        const val = args[0];
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase() === 'true';
        if (typeof val === 'number') return val !== 0;
        return false;
        
      case 'asc':
        const char = args[0]?.toString() ?? '';
        return char.length > 0 ? char.charCodeAt(0) : 0;
        
      case 'chr':
        const code = parseInt(args[0] ?? 0);
        return String.fromCharCode(code);
        
      case 'random':
        if (this.randomValue !== undefined) {
          return this.randomValue;
        }
        const min = parseInt(args[0] ?? 0);
        const max = parseInt(args[1] ?? 100);
        return Math.floor(Math.random() * (max - min + 1)) + min;
        
      default:
        throw new Error(`Unknown function: ${funcName}`);
    }
  }

  evaluateStringMethod(node) {
    const object = this.evaluateExpression(node.object);
    const str = object?.toString() ?? '';
    const args = node.args.map(arg => this.evaluateExpression(arg));
    
    switch (node.method.toLowerCase()) {
      case 'length':
        return str.length;
        
      case 'upper':
        return str.toUpperCase();
        
      case 'lower':
        return str.toLowerCase();
        
      case 'left':
        const leftLength = parseInt(args[0] ?? 1);
        return str.substring(0, leftLength);
        
      case 'right':
        const rightLength = parseInt(args[0] ?? 1);
        return str.substring(str.length - rightLength);
        
      case 'substring':
        const start = parseInt(args[0] ?? 0);
        const length = parseInt(args[1] ?? 1);
        return str.substring(start, start + length);
        
      default:
        throw new Error(`Unknown string method: ${node.method}`);
    }
  }

  addTraceEntry(lineNum, vars, output = '', changedVariables = {}) {
    this.trace.push({
      lineNumber: lineNum,
      variables: { ...vars },
      output: output,
      changedVariables: changedVariables
    });
  }

  getExpandedVariableNames() {
    const expandedNames = [];
    
    for (const [name, value] of Object.entries(this.variables)) {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          expandedNames.push(`${name}[${i}]`);
        }
      } else {
        expandedNames.push(name);
      }
    }
    
    return expandedNames;
  }

  // Convenience methods for compatibility
  execute(code) {
    return this.executeProgram(code, { inputs: [], randomValue: undefined });
  }

  executeWithoutReset(code) {
    // For testing - execute without resetting state
    const oldVars = { ...this.variables };
    const oldConstants = { ...this.constants };
    const oldOutputs = [...this.outputs];
    const oldTrace = [...this.trace];
    
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      this.executeNode(ast);
      
      return {
        variables: this.getExpandedVariableNames(),
        outputs: this.outputs,
        trace: this.trace
      };
    } catch (error) {
      // Restore state on error
      this.variables = oldVars;
      this.constants = oldConstants;
      this.outputs = oldOutputs;
      this.trace = oldTrace;
      throw error;
    }
  }
}