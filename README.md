# 🦆 OCR ERL Trace Table Practice

A modern React application for mastering OCR ERL (Exam Reference Language) trace tables with instant feedback and progressive scoring.

## 🚀 Features

- **Interactive Trace Tables**: Practice tracing OCR ERL algorithms with real-time feedback
- **Progressive Difficulty**: Easy, medium, and hard programs to match your skill level
- **Instant Scoring**: Get immediate feedback on your answers with detailed explanations
- **Comprehensive ERL Support**: Full implementation of OCR ERL language features
- **Gamified Learning**: Leveling system with achievements to track progress
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Efficient navigation with keyboard controls

## 🎯 What are Trace Tables?

Trace tables are a fundamental concept in computer science education, used to track the execution of algorithms step by step. Students fill in variable values and outputs as the program executes, helping them understand program flow and logic.

## 🏗️ Tech Stack

- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and building with SWC
- **TanStack React Router** for file-based routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Vitest** with Testing Library for comprehensive testing
- **Biome** for fast linting and formatting

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/domluther/TraceTablePractice.git
cd TraceTablePractice
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Use

1. **Select Difficulty**: Choose from Easy, Medium, or Hard programs
2. **Pick a Program**: Browse available OCR ERL programs with descriptions
3. **Fill the Trace Table**: 
   - Enter line numbers where variables change
   - Fill in variable values at each step
   - Record any output produced
4. **Mark Your Answer**: Get instant feedback on your solution
5. **Track Progress**: View your statistics and level up!

### Keyboard Shortcuts

- `Enter` - Mark your answer
- `N` - Next program
- `P` - Previous program  
- `S` - Shuffle inputs (get new test data)

## 🧠 Supported OCR ERL Features

### Core Language Features
- ✅ Variables and assignment
- ✅ Basic arithmetic (`+`, `-`, `*`, `/`, `MOD`, `DIV`)
- ✅ String operations and concatenation
- ✅ Input/Output (`input()`, `print()`)
- ✅ Type conversion (`int()`, `str()`, `float()`, `real()`)

### Control Structures  
- ✅ If-then-else statements
- ✅ While loops
- ✅ For loops (with optional step)
- ✅ Do-until loops
- ✅ Switch-case statements

### Advanced Features
- ✅ Arrays (declaration, access, assignment)
- ✅ String methods (`.upper`, `.lower`, `.length`, `.substring`)
- ✅ Constants (`const`)
- ✅ Random number generation
- ✅ Comments (`//`)

## 📊 Scoring System

The application features a comprehensive scoring system with:

- **Points**: Earned for correct answers (varies by difficulty)
- **Accuracy**: Percentage of correct answers
- **Levels**: Progress through titles like "Trace Trainee" → "Algorithm Ace"
- **Persistent Progress**: Scores saved locally in your browser

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode  
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run format       # Format code with Biome
npm run type-check   # Check TypeScript types
```

## 📁 Project Structure

```
src/
├── routes/              # File-based routing
│   ├── __root.tsx       # Root layout component
│   └── index.tsx        # Home page
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── TraceTableBody.tsx  # Main trace table component
│   ├── ProgramSelector.tsx # Program selection interface
│   └── ...             # Other components
├── lib/                # Core business logic
│   ├── astInterpreter.ts   # OCR ERL interpreter
│   ├── programs.ts      # Program definitions
│   ├── scoreManager.ts  # Scoring and persistence
│   └── types.ts         # TypeScript definitions
└── test/               # Test files
```

## 🎨 Customization

The application is designed to be easily customizable:

- **Programs**: Add new OCR ERL programs in `src/lib/programs.ts`
- **Scoring**: Modify levels and scoring in `src/lib/siteConfig.ts`
- **Styling**: Customize appearance with Tailwind CSS
- **Components**: Extend functionality with new React components

## 🚀 Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Platforms

- **Netlify**: Automatic deployment from Git (includes `netlify.toml`)
- **Vercel**: Zero-config React deployment
- **GitHub Pages**: Free hosting for public repositories
- **Any static host**: Upload the `dist/` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Ensure all tests pass (`npm run test`)
5. Format your code (`npm run format`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📚 Educational Context

This application is designed for GCSE Computer Science students learning algorithm tracing and the OCR ERL specification. It provides:

- **Structured Learning**: Programs progress from simple to complex concepts
- **Real-time Feedback**: Immediate correction and explanation of errors
- **Gamification**: Engaging progression system to motivate learning
- **Comprehensive Coverage**: All major OCR ERL language features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Check the existing documentation
- Review the test files for usage examples

## 📈 Roadmap

Future enhancements planned:

- 📱 Mobile app version
- 🔗 Classroom integration features
- 📊 Advanced analytics and reporting
- 🎓 Additional programming languages
- 🤖 AI-powered hint system

---

Built with ❤️ for computer science education. Happy tracing! 🦆
