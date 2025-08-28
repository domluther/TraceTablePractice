# 🤖 AI Agent Migration Guide: Legacy to GCSE CS Template

> **For AI Agents**: This guide provides step-by-step instructions for migrating legacy GCSE Computer Science practice projects to this modern React template.

## 📋 Prerequisites

- Legacy project code available in `/legacy/` folder
- This template already set up with complete component library
- Understanding of the legacy project's functionality

## 🎯 Migration Objectives

Transform legacy vanilla JS/HTML/CSS projects into modern React apps that:
- ✅ Use the established component library without modification
- ✅ Follow configuration-driven architecture
- ✅ Maintain consistent GCSE CS styling and behavior
- ✅ Integrate with the navigation system
- ✅ Use TypeScript with proper typing

## 📁 Template Files Already Available

### **🔧 Core Architecture (DO NOT MODIFY)**
```
src/
├── components/               # Complete reusable component library
│   ├── ui/                  # shadcn/ui primitives
│   ├── Footer.tsx           # Site footer
│   ├── Header.tsx           # Site header with navigation
│   ├── HintPanel.tsx        # Collapsible help content
│   ├── QuizButton.tsx       # Enhanced buttons with shortcuts
│   ├── QuizLayout.tsx       # Main layout wrapper
│   ├── ScoreButton.tsx      # Score display button
│   ├── SimpleQuizBody.tsx   # Generic quiz interface
│   ├── SiteNavigation.tsx   # Dropdown navigation menu
│   ├── StatsModal.tsx       # Statistics modal
│   └── index.ts             # Component exports
├── hooks/
│   ├── useQuizLogic.ts      # Generic quiz state management
│   └── index.ts
├── lib/
│   ├── navigationConfig.ts  # GCSE CS navigation menu
│   ├── scoreManager.ts      # Generic score/level management
│   ├── siteConfig.ts        # Configuration interface + example
│   └── utils.ts             # Tailwind utilities
└── test/
    └── setup.ts             # Test configuration
```

### **📄 Configuration Files (DO NOT MODIFY)**
- `biome.json` - Linting & formatting
- `components.json` - shadcn/ui config
- `package.json` - Dependencies & scripts
- `tsconfig.*.json` - TypeScript configuration
- `vite.config.ts` - Build configuration

## 🔄 Step-by-Step Migration Process

### **Step 1: Analyze Legacy Project**

Examine the `/legacy/` folder and identify:

```typescript
// Create a migration analysis
interface LegacyAnalysis {
  projectType: string;           // "binary-converter", "logic-gates", etc.
  questionTypes: string[];       // What types of questions/problems
  scoringSystem: string;         // How scoring works
  features: string[];            // Special features (hints, categories, etc.)
  styling: string;              // Color scheme, theme elements
  keyFunctions: string[];       // Main JavaScript functions
  dataStructures: any;          // How questions/answers are stored
}
```

**Example Analysis:**
```typescript
const legacyAnalysis: LegacyAnalysis = {
  projectType: "binary-converter",
  questionTypes: ["decimal-to-binary", "binary-to-decimal", "hexadecimal"],
  scoringSystem: "10 points per correct, streak bonuses",
  features: ["hint system", "difficulty levels", "conversion tables"],
  styling: "blue/green theme, tech aesthetic",
  keyFunctions: ["generateQuestion", "checkAnswer", "updateScore"],
  dataStructures: { questionFormat: "{ value: number, fromBase: number, toBase: number }" }
};
```

### **Step 2: Create Site Configuration**

**Replace the example in `src/lib/siteConfig.ts`:**

```typescript
import type { LevelInfo } from "@/lib/scoreManager";
import type { HintItem } from "@/components/HintPanel";

/** YOUR_PROJECT site configuration */
export const SITE_CONFIG: SiteConfig = {
  siteKey: "your-project-key",           // Unique identifier
  title: "Your Project Title",
  subtitle: "Learn something specific",
  icon: "🎯",                            // Choose appropriate emoji
  scoring: {
    pointsPerCorrect: 10,                // From legacy analysis
    pointsPerIncorrect: -2,              // From legacy analysis
    customLevels: [                      // Create themed progression
      {
        emoji: "🥚",
        title: "Beginner",               // Theme-appropriate titles
        description: "Just getting started!",
        minPoints: 0,
        minAccuracy: 0,
      },
      // ... more levels with your theme
    ],
  },
  hints: [                               // Convert legacy help content
    {
      title: "Concept 1",
      description: "Explanation of concept 1",
      examples: ["Example 1", "Example 2"],
      color: "blue",
    },
    // ... more hints
  ],
};
```

### **Step 3: Convert Legacy Question Logic**

**Create `src/lib/questionGenerator.ts` (or similar):**

```typescript
// Convert legacy question generation
export interface YourQuestionType {
  // Define based on legacy analysis
  problem: string;
  correctAnswer: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export function generateRandomQuestion(): YourQuestionType {
  // Convert legacy JavaScript function to TypeScript
  // Example:
  return {
    problem: "Convert 42 to binary",
    correctAnswer: "101010",
    category: "decimal-to-binary",
    difficulty: "easy",
  };
}

// Convert legacy answer validation
export function validateAnswer(question: YourQuestionType, userAnswer: string): boolean {
  // Convert legacy validation logic
  return userAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
}
```

### **Step 4: Create Quiz Answers Configuration**

```typescript
// Define in your index.tsx or separate file
const QUIZ_ANSWERS = [
  { id: 1, text: "Option 1", shortcut: "1" },
  { id: 2, text: "Option 2", shortcut: "2" },
  { id: 3, text: "Option 3", shortcut: "3" },
  { id: 4, text: "Option 4", shortcut: "4" },
];

// Map answer IDs to your domain logic
const ANSWER_TO_RESULT: Record<number, string> = {
  1: "result1",
  2: "result2",
  3: "result3",
  4: "result4",
};
```

### **Step 5: Implement Main Quiz Route**

**Replace `src/routes/index.tsx` completely:**

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { QuizLayout, SimpleQuizBody } from "@/components";
import { HintPanel } from "@/components/HintPanel";
import { QuizButton } from "@/components/QuizButton";
import { ScoreButton } from "@/components/ScoreButton";
import { StatsModal } from "@/components/StatsModal";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { ScoreManager } from "@/lib/scoreManager";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { generateRandomQuestion, validateAnswer, type YourQuestionType } from "@/lib/questionGenerator";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const siteConfig = SITE_CONFIG;
  
  // Score manager with custom levels
  const [scoreManager] = useState(() => new ScoreManager(
    siteConfig.siteKey,
    siteConfig.scoring.customLevels
  ));

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<YourQuestionType | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Quiz logic hook
  const quizLogic = useQuizLogic({
    scoreManager,
    onQuestionGenerate: () => {
      const newQuestion = generateRandomQuestion();
      setCurrentQuestion(newQuestion);
    },
    correctPoints: 100,
    maxPoints: 100,
  });

  const { overallStats } = quizLogic;

  // Question renderer (customize for your question type)
  const questionRenderer = useCallback((question: YourQuestionType) => (
    <div className="p-6 font-mono text-2xl font-semibold tracking-wider text-center text-white break-all border-blue-600 shadow-lg sm:text-3xl sm:p-8 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 rounded-xl border-3">
      {question.problem}
    </div>
  ), []);

  // Answer validation (customize for your logic)
  const isCorrectAnswer = useCallback((answerId: number, question: YourQuestionType) => {
    const selectedResult = ANSWER_TO_RESULT[answerId];
    return selectedResult === question.correctAnswer;
  }, []);

  // Feedback generation (customize messages)
  const generateFeedback = useCallback((
    isCorrect: boolean,
    answerId: number,
    question: YourQuestionType,
  ) => {
    if (isCorrect) {
      return {
        message: "Correct! 🎉",
        explanation: `Great job! The answer was ${question.correctAnswer}.`
      };
    } else {
      return {
        message: "Incorrect. Try again! ❌",
        explanation: `The correct answer was ${question.correctAnswer}.`
      };
    }
  }, []);

  // Generate initial question
  useEffect(() => {
    const initialQuestion = generateRandomQuestion();
    setCurrentQuestion(initialQuestion);
  }, []);

  // Help section
  const helpSection = (
    <div className="p-6 border-l-4 border-green-500 rounded-lg bg-gray-50">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Need Help?</h2>
      <QuizButton variant="secondary" onClick={() => setShowHints(!showHints)}>
        {showHints ? "Hide" : "Show"} Help
      </QuizButton>
      <HintPanel
        isVisible={showHints}
        title="📝 Help:"
        items={siteConfig.hints || []}
      />
    </div>
  );

  return (
    <QuizLayout
      title={siteConfig.title}
      subtitle={siteConfig.subtitle}
      titleIcon={siteConfig.icon}
      scoreButton={
        <ScoreButton
          levelEmoji={overallStats.level.emoji}
          levelTitle={overallStats.level.title}
          points={overallStats.totalPoints}
          onClick={() => setShowStatsModal(true)}
        />
      }
    >
      <SimpleQuizBody
        quizLogic={quizLogic}
        currentQuestion={currentQuestion}
        answers={QUIZ_ANSWERS}
        questionRenderer={questionRenderer}
        isCorrectAnswer={isCorrectAnswer}
        generateFeedback={generateFeedback}
        title="Your Quiz Title"
        showStreakEmojis={true}
        helpSection={helpSection}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        scoreManager={scoreManager}
        title="Your Statistics"
      />
    </QuizLayout>
  );
}
```

### **Step 6: Update Navigation (Optional)**

**If you want to add to the GCSE CS navigation, update `src/lib/navigationConfig.ts`:**

```typescript
// Add your site to the navigation menu
export const GCSE_NAVIGATION_MENU: NavMenuItem[] = [
  // ... existing items
  {
    title: "Your Project",
    description: "Your project description",
    href: "https://your-project-url.netlify.app/",
    isExternal: true,
    icon: "🎯",
  },
];
```

### **Step 7: Update Project Metadata**

**Update `package.json`:**
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "version": "1.0.0"
}
```

## ✅ **Quality Checklist**

Before completing the migration, ensure:

- [ ] **Builds successfully**: `npm run build` completes without errors
- [ ] **TypeScript passes**: `npm run type-check` has no errors
- [ ] **Linting passes**: `npm run lint` has no errors
- [ ] **All features work**: Quiz, scoring, hints, navigation, statistics
- [ ] **Responsive design**: Works on mobile and desktop
- [ ] **Consistent styling**: Matches GCSE CS design language
- [ ] **Configuration-driven**: Site-specific content in `siteConfig.ts`
- [ ] **Proper imports**: All use absolute imports (`@/`)
- [ ] **Generic components**: No modifications to component library

## 🚫 **Common Pitfalls to Avoid**

1. **DON'T modify the component library** - Customize through props and configuration
2. **DON'T use relative imports** - Always use `@/components`, `@/lib`, `@/hooks`
3. **DON'T hardcode site-specific content** - Use `siteConfig.ts`
4. **DON'T create custom quiz logic** - Use `SimpleQuizBody` + `useQuizLogic`
5. **DON'T skip TypeScript typing** - Properly type all interfaces
6. **DON'T ignore the navigation system** - Integrate with `navigationConfig.ts`

## 📚 **Additional Resources**

- **`AI_AGENT_GUIDE.md`** - General React/TypeScript patterns
- **`REUSABLE_COMPONENTS.md`** - Component library documentation
- **`QUICK_REFERENCE.md`** - API patterns and examples
- **Legacy Network Address Project** - Reference implementation in this repo

## 🎯 **Success Criteria**

A successful migration will:
- ✅ Maintain all legacy functionality
- ✅ Follow established architectural patterns
- ✅ Integrate seamlessly with the component library
- ✅ Provide improved user experience
- ✅ Be maintainable and extensible
- ✅ Match the GCSE CS design system

---

**Remember**: The goal is to leverage the existing architecture, not recreate it. Focus on converting the legacy business logic while using the established patterns and components.
