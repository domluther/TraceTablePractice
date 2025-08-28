# AI Agent Guide: Using This Vite + React Template

This documentation is specifically designed for AI agents (Claude Sonnet 4+) to understand how to port existing projects into this modern React + TypeScript + Vite template.

## Template Overview

This is a **production-ready React template** with the following tech stack:

- **React 19** + **TypeScript**
- **Vite** (build tool with SWC for fast refresh)
- **TanStack React Router** (file-based routing)
- **Tailwind CSS** (utility-first styling)
- **Vitest + Testing Library** (testing framework)
- **Biome** (linting and formatting)

## Project Structure

```
├── src/
│   ├── routes/              # File-based routing (TanStack Router)
│   │   ├── __root.tsx       # Root layout component
│   │   └── index.tsx        # Home page (/)
│   ├── components/          # React components
│   │   ├── ui/             # UI primitives (shadcn/ui)
│   │   ├── *.tsx           # Custom components
│   │   └── index.ts        # Component exports
│   ├── hooks/              # Custom React hooks
│   │   ├── *.ts            # Hook files
│   │   └── index.ts        # Hook exports  
│   ├── lib/                # Utilities and business logic
│   │   ├── utils.ts        # Utility functions (cn helper)
│   │   ├── siteConfig.ts   # Site configuration
│   │   ├── scoreManager.ts # Score management
│   │   └── *.ts            # Other utilities
│   ├── test/
│   │   ├── setup.ts        # Test configuration
│   │   └── *.test.tsx      # Test files
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles + Tailwind
├── public/                 # Public static files
└── dist/                   # Build output (generated)
```

## Key Configuration Files

- `vite.config.ts` - Vite + Vitest configuration
- `tsconfig.json` - TypeScript configuration
- `biome.json` - Linting and formatting rules
- `tailwind.config.js` - Tailwind configuration (if present)

## Porting Strategy for AI Agents

### 1. **Analyze the Source Project**

Before porting, understand:
- What type of project it is (SPA, multi-page, etc.)
- Current framework/library (vanilla JS, jQuery, old React, etc.)
- Existing features and functionality
- Current routing structure
- Styling approach (CSS, SCSS, inline styles, etc.)
- State management patterns
- API integrations

### 2. **Routing Migration**

**TanStack React Router uses file-based routing:**

- Each file in `src/routes/` becomes a route
- `__root.tsx` is the layout wrapper
- `index.tsx` = `/` route
- `about.tsx` = `/about` route
- `products/index.tsx` = `/products` route
- `products/$id.tsx` = `/products/123` route (dynamic)

**Migration Pattern:**
```tsx
// Old routing (React Router v6)
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

// New: Create src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <div>Home content</div>
}
```

### 3. **Component Migration**

**Convert class components to functional components:**
```tsx
// Old class component
class MyComponent extends React.Component {
  state = { count: 0 }
  
  render() {
    return <button onClick={() => this.setState({count: this.state.count + 1})}>
      {this.state.count}
    </button>
  }
}

// New functional component
import { useState } from 'react'

function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

### 4. **Styling Migration**

**This template uses Tailwind CSS:**

```tsx
// Old CSS-in-JS or CSS classes
<div className="header" style={{padding: '20px', backgroundColor: '#blue'}}>

// New Tailwind classes
<div className="p-5 bg-blue-500">

// Use the cn() utility for conditional classes
import { cn } from '@/lib/utils'

<div className={cn(
  'p-4 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)}>
```

**For complex existing styles:**
1. Try to convert to Tailwind utilities first
2. If complex, add custom CSS to `src/index.css`
3. Use CSS modules if component-scoped styles are needed

### 5. **State Management**

**Simple state:** Use `useState` and `useReducer`
**Complex state:** Consider adding Zustand or similar:

```bash
npm install zustand
```

### 6. **API Integration**

**Modern fetch patterns:**
```tsx
// Use native fetch or add a library like TanStack Query
import { useQuery } from '@tanstack/react-query'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  return <div>{user.name}</div>
}
```

### 7. **This Project's Architecture Patterns**

This template implements several specific patterns for GCSE CS quiz applications:

#### **Site Configuration Pattern**
```tsx
// Define site-specific configuration
export const SITE_CONFIG: SiteConfig = {
  siteKey: "my-quiz",
  title: "Quiz Title",
  subtitle: "Quiz Description", 
  icon: "🧠",
  scoring: {
    pointsPerCorrect: 10,
    pointsPerIncorrect: -2,
    customLevels: [ /* custom level progression */ ]
  },
  hints: [ /* site-specific help content */ ]
};
```

#### **Generic ScoreManager**
```tsx
// Create score manager with custom levels
const scoreManager = new ScoreManager(
  siteConfig.siteKey,
  siteConfig.scoring.customLevels
);
```

#### **Quiz Logic Hook Pattern**
```tsx
// Reusable quiz state management
const quizLogic = useQuizLogic({
  scoreManager,
  onQuestionGenerate: () => {
    // Generate new question logic
  },
  correctPoints: 100,
  maxPoints: 100,
});
```

#### **Component Composition Pattern**
```tsx
// Compose reusable components with configuration
<QuizLayout title={siteConfig.title} subtitle={siteConfig.subtitle}>
  <SimpleQuizBody
    quizLogic={quizLogic}
    currentQuestion={currentQuestion}
    answers={answers}
    questionRenderer={customRenderer}
    isCorrectAnswer={customValidator}
    generateFeedback={customFeedback}
    helpSection={<HintPanel items={siteConfig.hints || []} />}
  />
</QuizLayout>
```

#### **Absolute Import Pattern**
```tsx
// Use absolute imports throughout
import { QuizLayout } from "@/components/QuizLayout";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { useQuizLogic } from "@/hooks/useQuizLogic";
```

### 8. **Testing Migration**

**Convert existing tests to Vitest + Testing Library:**

```tsx
// Old Jest + Enzyme
import { shallow } from 'enzyme'
test('renders correctly', () => {
  const wrapper = shallow(<MyComponent />)
  expect(wrapper.find('.title').text()).toBe('Hello')
})

// New Vitest + Testing Library  
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### 8. **Build and Deployment**

**Scripts available:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Check code quality
- `npm run format` - Format code

## Common Migration Patterns

### Legacy jQuery → React
```jsx
// Old jQuery
$('#button').click(function() {
  $(this).toggleClass('active')
})

// New React
function Button() {
  const [isActive, setIsActive] = useState(false)
  
  return (
    <button 
      className={cn('btn', isActive && 'active')}
      onClick={() => setIsActive(!isActive)}
    >
      Click me
    </button>
  )
}
```

### Vanilla JS Modules → React Components
```js
// Old vanilla JS module
export function createModal(title, content) {
  const modal = document.createElement('div')
  modal.innerHTML = `<h2>${title}</h2><p>${content}</p>`
  document.body.appendChild(modal)
}

// New React component
interface ModalProps {
  title: string
  content: string
  onClose: () => void
}

function Modal({ title, content, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
```

## Step-by-Step Migration Process

1. **Setup**: Copy legacy project files to a `legacy/` folder
2. **Analyze**: Identify components, routes, and functionality
3. **Routes**: Create route files in `src/routes/`
4. **Components**: Convert/create React components
5. **Styles**: Migrate to Tailwind CSS
6. **State**: Implement state management
7. **APIs**: Update API calls to modern patterns
8. **Tests**: Write new tests with Vitest
9. **Cleanup**: Remove legacy files, update dependencies

## Things to Remember

- **Always use TypeScript** - Add proper type annotations
- **File-based routing** - Each route is a separate file
- **Tailwind first** - Prefer utility classes over custom CSS
- **Modern React patterns** - Functional components, hooks
- **Test coverage** - Write tests for new components
- **Code quality** - Run `npm run lint` and `npm run format`

## Available Utilities

- `cn()` from `@/lib/utils` - Conditional className helper
- `clsx` and `class-variance-authority` - Advanced className utilities
- Lucide React icons - Modern icon library
- TanStack Router devtools - Available in development

## Getting Help

If you encounter issues during migration:
1. Check the existing example components in `src/routes/`
2. Look at the test examples in `src/test/`
3. Refer to official docs:
   - [TanStack Router](https://tanstack.com/router/v1)
   - [Tailwind CSS](https://tailwindcss.com)
   - [Vitest](https://vitest.dev)

This template is designed to be a solid foundation for modern React applications. Focus on incremental migration and maintaining functionality at each step.
