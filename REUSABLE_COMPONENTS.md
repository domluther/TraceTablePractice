# 🎓 GCSE CS Reusable Component Library

A comprehensive set of reusable React components for creating consistent GCSE Computer Science practice sites. Built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

### 1. Basic Site Setup

```tsx
import { QuizLayout } from "@/components/QuizLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";

export function MyQuizSite() {
  const siteConfig = SITE_CONFIG;
  
  return (
    <QuizLayout
      title={siteConfig.title}
      subtitle={siteConfig.subtitle}
      titleIcon={siteConfig.icon}
    >
      {/* Your quiz content here */}
    </QuizLayout>
  );
}
```

### 2. Full Quiz Implementation

```tsx
import { SimpleQuizBody } from "@/components/SimpleQuizBody";
import { StatsModal } from "@/components/StatsModal";
import { ScoreManager } from "@/lib/scoreManager";
import { useQuizLogic } from "@/hooks/useQuizLogic";

// See src/routes/index.tsx for complete example
```

## 📦 Components

### Core Layout Components

#### `QuizLayout`
Main layout wrapper providing consistent header, navigation, and structure.

**Props:**
- `title: string` - Site title
- `subtitle: string` - Site description  
- `titleIcon?: string` - Icon/emoji (default: "🎓")
### Core Layout Components

#### `QuizLayout`
Main layout wrapper providing consistent header, navigation, and structure.

**Props:**
- `title: string` - Site title
- `subtitle: string` - Site description  
- `titleIcon?: string` - Icon/emoji (default: "🎓")
- `scoreButton?: ReactNode` - Score button component
- `children: ReactNode` - Main content

#### `Header`
Configurable header with responsive typography and score button positioning.

**Props:**
- `title?: string` - Header title
- `subtitle?: string` - Header subtitle
- `titleIcon?: string` - Header icon/emoji
- `scoreButton?: ReactNode` - Score button component

### Interactive Components

#### `SimpleQuizBody<T>`
Generic quiz component handling questions, answers, feedback, and keyboard shortcuts.

**Props:**
- `quizLogic: ReturnType<typeof useQuizLogic>` - Quiz state from hook
- `currentQuestion: T | null` - Current question data
- `answers: QuizAnswer[]` - Answer options
- `questionRenderer: (question: T) => ReactNode` - Custom question renderer
- `isCorrectAnswer: (answerId: number, question: T) => boolean` - Answer validator
- `generateFeedback: (isCorrect: boolean, answerId: number, question: T) => { message: string; explanation?: string }` - Feedback generator
- `title?: string` - Quiz title
- `showStreakEmojis?: boolean` - Show streak visualization
- `helpSection?: ReactNode` - Optional help content

**Features:**
- ✅ Keyboard shortcuts (1-4 for answers, Enter/Space for next)
- ✅ Automatic feedback display with explanations
- ✅ Streak tracking with emoji visualization
- ✅ Responsive design with proper mobile support
- ✅ Loading states and smooth transitions

#### `StatsModal`
Comprehensive statistics modal showing progress, levels, and breakdowns.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `scoreManager: ScoreManager` - Score manager instance
- `title?: string` - Modal title (default: "Quiz Statistics")

**Features:**
- ✅ Level progression display with custom levels
- ✅ Overall statistics grid (attempts, accuracy, points)
- ✅ Category-wise breakdown (by address type, etc.)
- ✅ Progress bars and visual feedback
- ✅ Reset scores functionality

### Navigation Components

#### `SiteNavigation`
Navigation dropdown using shadcn/ui with responsive design.

**Props:**
- Internal component - configured via `navigationConfig.ts`

### Utility Components

#### `ScoreButton`
Responsive score display button showing current level and points.

**Props:**
- `levelEmoji: string` - Level emoji
- `levelTitle: string` - Level title
- `points: number` - Current points
- `onClick?: () => void` - Click handler

#### `QuizButton`
Enhanced button component with variants and keyboard shortcut display.

**Props:**
- `children: ReactNode` - Button content
- `onClick?: () => void` - Click handler
- `variant?: "primary" | "secondary"` - Button style variant
- `size?: "sm" | "md" | "lg"` - Button size
- `shortcut?: string` - Keyboard shortcut to display
- All standard button props

#### `HintPanel`
Collapsible hint panel for displaying help content.

**Props:**
- `isVisible: boolean` - Panel visibility
- `title: string` - Panel title
- `items: HintItem[]` - Hint content items

### Footer Component

#### `Footer`
Standard footer with copyright and links.

## 🔧 Configuration System

### Site Configuration

Create consistent site configurations using the `SiteConfig` interface:

```tsx
import { SITE_CONFIG } from "@/lib/siteConfig";

// Current site configuration
const config = SITE_CONFIG;

// Site config structure
const customSite: SiteConfig = {
  siteKey: "my-quiz",
  title: "My Quiz Site",
  subtitle: "Learn something awesome",
  icon: "🧠",
  scoring: {
    pointsPerCorrect: 10,
    pointsPerIncorrect: -2,
    customLevels: [
      // Custom level progression...
    ]
  },
  hints: [
    // Site-specific help content...
  ]
};
```

### Score Management

The `ScoreManager` class handles all scoring logic and accepts custom level systems:

```tsx
import { ScoreManager } from "@/lib/scoreManager";

// Create with custom levels from site config
const scoreManager = new ScoreManager(
  siteConfig.siteKey,
  siteConfig.scoring.customLevels
);

// Record scores
scoreManager.recordScore("question-1", 100, 100, "IPv4", "192.168.1.1");

// Get statistics
const stats = scoreManager.getOverallStats();
const breakdown = scoreManager.getScoresByType();

// Manage streaks
scoreManager.updateStreak(isCorrect);
const currentStreak = scoreManager.getStreak();
```

### Quiz Logic Hook

Use the `useQuizLogic` hook for consistent quiz behavior:

```tsx
import { useQuizLogic } from "@/hooks/useQuizLogic";

const quizLogic = useQuizLogic({
  scoreManager,
  onQuestionGenerate: () => {
    // Generate new question logic
  },
  correctPoints: 100,
  maxPoints: 100,
});

// Access quiz state
const { overallStats, currentStreak, handleAnswerSubmit, nextQuestion } = quizLogic;
```

## 🎨 Styling & Theming

### Consistent Design System

All components use:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for base components
- **Consistent color palette** (indigo/purple gradients)
- **Responsive breakpoints** (sm:, xl: breakpoints)
- **Animation classes** for smooth interactions

### Custom Animations

Available animation classes:
- `animate-gentle-bounce` - Subtle bounce effect
- `text-shadow` - Text shadow utility
- Gradient backgrounds for visual appeal

## 🎯 Best Practices

### 1. Component Composition

```tsx
// ✅ Good: Compose reusable components
<QuizLayout title="My Quiz" subtitle="Learn stuff">
  <SimpleQuizBody
    quizLogic={quizLogic}
    currentQuestion={currentQuestion}
    answers={answers}
    questionRenderer={CustomRenderer}
    isCorrectAnswer={isCorrectAnswer}
    generateFeedback={generateFeedback}
  />
</QuizLayout>

// ❌ Avoid: Building everything from scratch
```

### 2. Type Safety

```tsx
// ✅ Good: Define question types
interface MyQuestionType {
  content: string;
  difficulty: "easy" | "medium" | "hard";
}

// Use with SimpleQuizBody for full type safety
<SimpleQuizBody<MyQuestionType>
  currentQuestion={currentQuestion}
  questionRenderer={(q) => <div>{q.content}</div>}
  // ... other props
/>
```

### 3. Configuration-Driven Development

```tsx
// ✅ Good: Use site configuration
const siteConfig = SITE_CONFIG;

<QuizLayout
  title={siteConfig.title}
  subtitle={siteConfig.subtitle}
  titleIcon={siteConfig.icon}
>
  <HintPanel
    items={siteConfig.hints || []}
    // ... other props
  />
</QuizLayout>

// ❌ Avoid: Hardcoding site-specific content
```

### 4. Absolute Imports

```tsx
// ✅ Good: Use absolute imports
import { QuizLayout } from "@/components/QuizLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { useQuizLogic } from "@/hooks/useQuizLogic";

// ❌ Avoid: Relative imports for cross-module dependencies
import { QuizLayout } from "../../components/QuizLayout";
```
  questionRenderer={(content) => <div>{content.content}</div>}
/>
```

### 3. Configuration-Driven

```tsx
// ✅ Good: Use site configuration
const config = SITE_CONFIG;

// ❌ Avoid: Hardcoded values
const title = "Hardcoded Title";
```

## 📱 Responsive Design

All components are fully responsive:
- **Mobile-first** approach
- **Hamburger navigation** on smaller screens
- **Compact score display** on mobile
- **Touch-friendly** interactions
- **Readable typography** at all sizes

## ⌨️ Keyboard Shortcuts

Built-in keyboard support:
- **1-9**: Select answers
- **Enter/Space**: Next question
- **H**: Toggle hints
- **Escape**: Close modals

## 🔄 Migration Guide

### From Legacy Components

1. **Replace custom layout** with `QuizLayout`
2. **Use `SimpleQuizBody` + `useQuizLogic`** instead of custom quiz logic
3. **Switch to `StatsModal`** for statistics
4. **Update site config** using the configuration system
5. **Use absolute imports** (`@/components`) for consistency

### Example Migration

```tsx
// Before (legacy)
<div className="min-h-screen">
  <Header scoreButton={<ScoreButton />} />
  <main>
    {/* Custom quiz logic */}
  </main>
</div>

// After (reusable with current architecture)
<QuizLayout 
  title={siteConfig.title} 
  subtitle={siteConfig.subtitle}
  titleIcon={siteConfig.icon}
  scoreButton={<ScoreButton />}
>
  <SimpleQuizBody
    quizLogic={quizLogic}
    currentQuestion={question}
    answers={answers}
    questionRenderer={customRenderer}
    isCorrectAnswer={customValidator}
    generateFeedback={customFeedback}
  />
</QuizLayout>
```

## 📊 Performance

- **Lazy loading** for heavy components
- **Efficient re-renders** with proper state management
- **Minimal bundle size** with tree-shaking
- **Fast development** with Vite HMR

## 🧪 Testing

Components are designed for testability:
- **Clear prop interfaces**
- **Predictable behavior**
- **Accessible markup**
- **Keyboard navigation**

## 🚀 Deployment

Each site can be deployed independently while sharing the component library:
- **Shared components** via npm package or monorepo
- **Site-specific configurations**
- **Independent deployments**
- **Consistent user experience**

---

## 🎉 Getting Started

1. Copy the reusable components to your project
2. Configure your site in `siteConfig.ts`
3. Implement your question renderer
4. Add custom scoring logic
5. Deploy your GCSE CS practice site!

See `examples/NumberSystemsQuiz.tsx` for a complete implementation example.
