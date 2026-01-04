# Claude Code Algorithm Visualizer

An interactive educational webapp that visualizes how [Claude Code](https://github.com/anthropics/claude-code) works internally. Explore the agentic loop algorithm through interactive flowcharts and step-by-step scenario walkthroughs.

![Claude Code Visualizer](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue)

## Features

### Interactive Visualizer
- **Scenario-based learning**: Walk through real-world scenarios like file reads, multi-tool tasks, permission denials, and subagent delegation
- **Step-by-step playback**: Use playback controls to step forward/backward through each execution step
- **Live flowchart**: Watch the algorithm flow animate as you step through scenarios
- **Detailed inspection**: Click any node to see payload data, tool inputs/outputs, and hook configurations

### Algorithm Overview
- **Complete reference diagram**: See the entire Claude Code algorithm as an interactive flowchart
- **20 algorithm nodes** covering session lifecycle, context management, agentic loop, tool execution, hooks, subagents, and output
- **Click for details**: Each node shows detailed explanations and code examples

### Comprehensive Documentation
- **Learn tab**: ~15 minute read covering all aspects of the algorithm
- **ASCII diagrams**: Visual explanations of data flow
- **Pseudocode**: Understand the logic without implementation details
- **Real code examples**: JSON configurations and TypeScript snippets

### Sandbox Configuration
- **Permission modes**: Toggle between default, acceptEdits, plan, and more
- **Permission rules**: See how deny/ask/allow rules affect execution
- **Hook configuration**: Understand how hooks intercept and modify behavior

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Flow** (@xyflow/react) for interactive flowcharts
- **Dagre** for automatic graph layout
- **Zustand** for state management
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Prism React Renderer** for syntax highlighting
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-code-visualizer.git
cd claude-code-visualizer

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── FlowCanvas.tsx   # Main flowchart visualization
│   ├── FlowNode.tsx     # Custom node component
│   ├── ScenarioPicker.tsx
│   ├── PlaybackControls.tsx
│   ├── ExecutionLog.tsx
│   ├── DetailPanel.tsx
│   ├── SandboxPanel.tsx
│   └── CodeBlock.tsx    # Syntax-highlighted code
├── pages/
│   ├── VisualizerPage.tsx  # Interactive visualizer
│   └── LearnPage.tsx       # Documentation article
├── algorithmOverview.ts # Algorithm nodes and edges data
├── scenarios.ts         # Scenario definitions
├── store.ts            # Zustand state management
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## Scenarios

The visualizer includes several pre-built scenarios:

1. **Algorithm Overview** - Complete reference diagram of the Claude Code algorithm
2. **Simple File Read** - Basic tool execution flow with Read tool
3. **Multi-Tool Task** - Multiple tools used in sequence (Glob → Bash → Read)
4. **Subagent Delegation** - Spawning an Explore subagent for codebase analysis
5. **Permission Denied** - How deny rules block tool execution
6. **Hook Blocking** - PreToolUse hook modifying tool input
7. **Context Compaction** - Automatic summarization when context limit is reached

## How It Works

### The Agentic Loop

Claude Code operates through a continuous loop:

1. **User Input** → User sends a message
2. **Model Inference** → Claude analyzes and decides on action
3. **Tool Execution** → If needed, tools are executed (with permission checks)
4. **Result Integration** → Tool results are added to context
5. **Loop** → Back to inference until task is complete
6. **Response** → Final response sent to user

### Key Concepts Visualized

- **Session Lifecycle**: Initialization, hooks, context loading
- **Permission System**: deny > ask > allow rule evaluation
- **Hooks**: PreToolUse, PostToolUse, Stop, and other extension points
- **Subagents**: Isolated agents for specialized tasks
- **Context Compaction**: Automatic summarization for long conversations

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Built to help developers understand [Claude Code](https://github.com/anthropics/claude-code) by Anthropic
- Uses [React Flow](https://reactflow.dev/) for flowchart visualization
- Inspired by the official Claude Code documentation

---

**Note**: This is an educational visualization tool and is not officially affiliated with Anthropic. For official documentation, visit [claude.ai/code](https://claude.ai/code).
