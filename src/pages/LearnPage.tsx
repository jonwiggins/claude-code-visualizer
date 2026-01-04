import { useState } from 'react';
import { ChevronRight, Terminal, Cpu, Shield, Zap, Users, Database, FileCode, BookOpen } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';
import clsx from 'clsx';

// Table of contents sections
const sections = [
  { id: 'introduction', title: 'Introduction', icon: BookOpen },
  { id: 'session-lifecycle', title: 'Session Lifecycle', icon: Terminal },
  { id: 'context-loading', title: 'Context Loading', icon: Database },
  { id: 'agentic-loop', title: 'The Agentic Loop', icon: Cpu },
  { id: 'tool-execution', title: 'Tool Execution', icon: FileCode },
  { id: 'permission-system', title: 'Permission System', icon: Shield },
  { id: 'hooks', title: 'Hooks System', icon: Zap },
  { id: 'subagents', title: 'Subagents', icon: Users },
  { id: 'context-compaction', title: 'Context Compaction', icon: Database },
];

// Simple diagram component
function Diagram({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 overflow-x-auto">
        <pre className="text-[11px] text-[#7d8590] font-mono leading-relaxed whitespace-pre">{children}</pre>
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-[#484f58] mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Callout box component
function Callout({ type, title, children }: { type: 'info' | 'warning' | 'tip'; title: string; children: React.ReactNode }) {
  const styles = {
    info: 'border-blue-500/50 bg-blue-500/5',
    warning: 'border-amber-500/50 bg-amber-500/5',
    tip: 'border-green-500/50 bg-green-500/5',
  };

  const titleColors = {
    info: 'text-blue-400',
    warning: 'text-amber-400',
    tip: 'text-green-400',
  };

  return (
    <div className={clsx('border-l-4 rounded-r-lg p-5 my-8', styles[type])}>
      <div className={clsx('font-semibold text-sm mb-2', titleColors[type])}>{title}</div>
      <div className="text-sm text-[#8b949e] leading-relaxed">{children}</div>
    </div>
  );
}

export function LearnPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left sidebar - Table of Contents */}
      <aside className="flex-none w-72 border-r border-[#30363d] bg-[#0d1117] overflow-auto">
        <div className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] px-6 py-4">
          <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Table of Contents
          </h3>
        </div>
        <nav className="p-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left',
                  activeSection === section.id
                    ? 'bg-[#1f6feb]/20 text-[#58a6ff] font-medium'
                    : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1f2428]'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {section.title}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content - Article */}
      <main className="flex-1 overflow-auto bg-[#010409]">
        <div className="max-w-3xl mx-auto px-16 py-20">
          <article className="space-y-6">
          {/* Introduction */}
          <section id="introduction" className="mb-20">
            <h1 className="text-4xl font-bold mb-8 text-[#e6edf3]">Understanding the Claude Code Algorithm</h1>

            <p className="text-lg text-[#8b949e] leading-relaxed mb-8">
              Claude Code is Anthropic's official agentic coding assistant. Unlike simple chatbots that respond to
              single queries, Claude Code operates as an autonomous agent capable of reading files, executing commands,
              making edits, and even spawning sub-agents to handle complex tasks. This guide provides a comprehensive
              look at the algorithm that powers this behavior.
            </p>

            <Callout type="info" title="What makes it 'agentic'?">
              An agentic system can take multiple autonomous actions to achieve a goal. Instead of just answering
              questions, Claude Code can plan multi-step approaches, use tools, handle errors, and adapt its
              strategy based on results.
            </Callout>

            <h2 className="text-2xl font-semibold mt-12 mb-6 text-[#e6edf3]">High-Level Architecture</h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              At its core, Claude Code operates through an <strong className="text-[#c9d1d9]">agentic loop</strong> that
              continuously processes user input, makes decisions, executes tools, and generates responses. Here's a
              simplified view:
            </p>

            <Diagram caption="Figure 1: Simplified Agentic Loop">
{`┌─────────────────────────────────────────────────────────────────┐
│                        AGENTIC LOOP                              │
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│   │  User    │───▶│  Model   │───▶│  Tool    │───▶│ Response │  │
│   │  Input   │    │ Inference│    │ Execution│    │          │  │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│        ▲                               │                         │
│        │                               │                         │
│        └───────────────────────────────┘                         │
│                    (loop until done)                             │
└─────────────────────────────────────────────────────────────────┘`}
            </Diagram>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Core Pseudocode</h3>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              The entire algorithm can be expressed in this high-level pseudocode:
            </p>

            <CodeBlock
              language="typescript"
              code={`async function agenticLoop(userMessage: string) {
  // Add user message to conversation history
  conversation.push({ role: 'user', content: userMessage });

  while (true) {
    // Get model's response
    const response = await claude.inference(conversation);

    if (response.stopReason === 'end_turn') {
      // Model is done - return response to user
      return response.content;
    }

    if (response.stopReason === 'tool_use') {
      // Model wants to use a tool
      for (const toolCall of response.toolCalls) {
        // Check permissions
        if (!isAllowed(toolCall)) {
          const approved = await askUser(toolCall);
          if (!approved) continue;
        }

        // Execute tool and add result to conversation
        const result = await executeTool(toolCall);
        conversation.push({ role: 'tool_result', content: result });
      }
    }
  }
}`}
            />
          </section>

          {/* Session Lifecycle */}
          <section id="session-lifecycle" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Terminal size={24} className="text-green-500" />
              Session Lifecycle
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              When you run <code className="bg-[#30363d] px-1.5 py-0.5 rounded text-sm">claude</code> in your terminal,
              a new session is initialized. This session maintains state throughout your interaction, including
              conversation history, tool permissions, and configuration.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Session Initialization</h3>

            <Diagram caption="Figure 2: Session Startup Sequence">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Start     │────▶│ SessionStart│────▶│   Context   │────▶│  Permission │
│   Claude    │     │    Hook     │     │   Loading   │     │    Mode     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                    │
                           ▼                   ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │  Run setup  │     │Load CLAUDE.md│    │  Set mode:  │
                    │  scripts    │     │Load rules    │     │  default/   │
                    │             │     │Load memory   │     │  plan/etc   │
                    └─────────────┘     └─────────────┘     └─────────────┘`}
            </Diagram>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              The session startup triggers the <strong className="text-[#c9d1d9]">SessionStart hook</strong>,
              which allows custom initialization scripts to run. This is commonly used to:
            </p>

            <ul className="list-disc list-inside text-[#8b949e] space-y-2 mb-6">
              <li>Set up environment variables (nvm, pyenv, etc.)</li>
              <li>Load project-specific configurations</li>
              <li>Initialize development tools</li>
            </ul>

            <CodeBlock
              language="json"
              code={`// .claude/settings.json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "command": "source ~/.nvm/nvm.sh && nvm use"
      }
    ]
  }
}`}
            />

            <Callout type="tip" title="Session Matchers">
              SessionStart hooks support different matchers: <code>startup</code> (new session),
              <code>resume</code> (resuming previous), <code>clear</code> (after /clear),
              and <code>compact</code> (after context compaction).
            </Callout>
          </section>

          {/* Context Loading */}
          <section id="context-loading" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Database size={24} className="text-blue-500" />
              Context Loading
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Context is the information that shapes Claude's understanding of your project. It includes
              project documentation, coding conventions, tool definitions, and conversation history.
              Claude Code loads context from multiple sources in a specific precedence order.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Context Sources (Precedence Order)</h3>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 mb-8">
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li className="text-[#c9d1d9]"><strong>Enterprise policy</strong> <span className="text-[#8b949e]">- /Library/Application Support/ClaudeCode/CLAUDE.md (highest precedence)</span></li>
                <li className="text-[#c9d1d9]"><strong>Project memory</strong> <span className="text-[#8b949e]">- .claude/CLAUDE.md or ./CLAUDE.md</span></li>
                <li className="text-[#c9d1d9]"><strong>Project rules</strong> <span className="text-[#8b949e]">- .claude/rules/*.md files</span></li>
                <li className="text-[#c9d1d9]"><strong>User memory</strong> <span className="text-[#8b949e]">- ~/.claude/CLAUDE.md</span></li>
                <li className="text-[#c9d1d9]"><strong>Local overrides</strong> <span className="text-[#8b949e]">- ./CLAUDE.local.md (gitignored)</span></li>
                <li className="text-[#c9d1d9]"><strong>User rules</strong> <span className="text-[#8b949e]">- ~/.claude/rules/*.md files</span></li>
                <li className="text-[#c9d1d9]"><strong>Imported files</strong> <span className="text-[#8b949e]">- Via @path syntax in CLAUDE.md</span></li>
                <li className="text-[#c9d1d9]"><strong>MCP resources</strong> <span className="text-[#8b949e]">- From configured MCP servers</span></li>
              </ol>
            </div>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Example CLAUDE.md</h3>

            <CodeBlock
              language="markdown"
              code={`# Project: My Application

## Tech Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management

## Coding Conventions
- Use functional components with hooks
- Prefer named exports over default exports
- Use absolute imports via @/ alias

## Testing
- Run \`npm test\` before committing
- Minimum 80% coverage for new code

## Important Notes
- Never modify files in /generated directory
- API keys are in .env (never commit)`}
            />

            <Callout type="info" title="Token Budget">
              Context consumes tokens from Claude's context window. Large CLAUDE.md files or many rules
              can reduce available space for conversation. The context window is typically 200K tokens.
            </Callout>
          </section>

          {/* The Agentic Loop */}
          <section id="agentic-loop" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Cpu size={24} className="text-amber-500" />
              The Agentic Loop
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              The agentic loop is the heart of Claude Code. It's a continuous cycle where Claude receives input,
              reasons about it, optionally uses tools, and generates output. The loop continues until Claude
              decides the task is complete.
            </p>

            <Diagram caption="Figure 3: Detailed Agentic Loop">
{`                              ┌─────────────────┐
                              │   User Input    │
                              └────────┬────────┘
                                       │
                              ┌────────▼────────┐
                              │ UserPromptSubmit│
                              │     Hook        │
                              └────────┬────────┘
                                       │
                     ┌─────────────────▼─────────────────┐
                     │         MODEL INFERENCE           │
                     │  ┌───────────────────────────┐   │
                     │  │ • Analyze conversation    │   │
                     │  │ • Extended thinking       │   │
                     │  │ • Decide on action        │   │
                     │  └───────────────────────────┘   │
                     └─────────────────┬─────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
           ┌────────▼────────┐                   ┌────────▼────────┐
           │  stop_reason:   │                   │  stop_reason:   │
           │   tool_use      │                   │   end_turn      │
           └────────┬────────┘                   └────────┬────────┘
                    │                                     │
           ┌────────▼────────┐                   ┌────────▼────────┐
           │ Tool Execution  │                   │   Stop Hook     │
           │    Pipeline     │                   │   Evaluation    │
           └────────┬────────┘                   └────────┬────────┘
                    │                                     │
           ┌────────▼────────┐                   ┌────────▼────────┐
           │ Result added to │                   │    Response     │
           │   conversation  │───────────┐      │    to User      │
           └─────────────────┘           │      └─────────────────┘
                                         │
                         (loop back to inference)`}
            </Diagram>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Model Inference</h3>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              During inference, Claude analyzes the entire conversation history plus context to determine
              the best response. With extended thinking enabled, Claude first reasons through the problem
              before acting:
            </p>

            <CodeBlock
              language="typescript"
              code={`// Model inference with thinking
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 16000,
  thinking: {
    type: 'enabled',
    budget_tokens: 10000  // Tokens allocated for reasoning
  },
  messages: conversation,
  tools: availableTools,
  system: systemPrompt + contextFromClaudeMd
});

// Response contains:
// - thinking: Claude's reasoning process (if enabled)
// - content: Text response or tool calls
// - stop_reason: 'end_turn' | 'tool_use' | 'max_tokens'`}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Stop Reasons</h3>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-[#21262d]">
                  <tr>
                    <th className="text-left p-3 font-semibold">Stop Reason</th>
                    <th className="text-left p-3 font-semibold">Meaning</th>
                    <th className="text-left p-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[#8b949e]">
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-[#58a6ff]">end_turn</code></td>
                    <td className="p-3">Claude finished responding</td>
                    <td className="p-3">Evaluate Stop hook, then return response</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-[#58a6ff]">tool_use</code></td>
                    <td className="p-3">Claude wants to use a tool</td>
                    <td className="p-3">Execute tool pipeline, then loop</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-[#58a6ff]">max_tokens</code></td>
                    <td className="p-3">Response was truncated</td>
                    <td className="p-3">Continue generation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tool Execution */}
          <section id="tool-execution" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <FileCode size={24} className="text-orange-500" />
              Tool Execution
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Tools are Claude's interface to the outside world. When Claude decides to use a tool,
              a multi-stage pipeline processes the request before execution.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Available Tools</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">File Operations</h4>
                <ul className="text-xs text-[#8b949e] space-y-1">
                  <li><code>Read</code> - Read file contents</li>
                  <li><code>Write</code> - Create/overwrite files</li>
                  <li><code>Edit</code> - Make targeted edits</li>
                  <li><code>NotebookEdit</code> - Edit Jupyter notebooks</li>
                </ul>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Search</h4>
                <ul className="text-xs text-[#8b949e] space-y-1">
                  <li><code>Glob</code> - Find files by pattern</li>
                  <li><code>Grep</code> - Search file contents</li>
                </ul>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Execution</h4>
                <ul className="text-xs text-[#8b949e] space-y-1">
                  <li><code>Bash</code> - Run shell commands</li>
                  <li><code>Task</code> - Spawn subagents</li>
                </ul>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Web & User</h4>
                <ul className="text-xs text-[#8b949e] space-y-1">
                  <li><code>WebFetch</code> - Fetch URL content</li>
                  <li><code>WebSearch</code> - Search the web</li>
                  <li><code>AskUserQuestion</code> - Get user input</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Tool Execution Pipeline</h3>

            <Diagram caption="Figure 4: Tool Execution Pipeline">
{`┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Tool Decision│───▶│  PreToolUse  │───▶│  Permission  │───▶│    Tool      │
│              │    │    Hooks     │    │    Check     │    │  Execution   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                   │                    │
                           ▼                   ▼                    │
                    ┌──────────────┐    ┌──────────────┐            │
                    │ Can: allow,  │    │ deny > ask   │            │
                    │ deny, modify │    │   > allow    │            │
                    └──────────────┘    └──────────────┘            │
                                                                    │
                                                              ┌─────▼────┐
                                                              │PostToolUse│
                                                              │  Hooks   │
                                                              └──────────┘`}
            </Diagram>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Tool Call Format</h3>

            <CodeBlock
              language="json"
              code={`// Claude's tool call request
{
  "type": "tool_use",
  "id": "toolu_01ABC123",
  "name": "Read",
  "input": {
    "file_path": "/absolute/path/to/file.ts"
  }
}

// Tool result sent back to Claude
{
  "type": "tool_result",
  "tool_use_id": "toolu_01ABC123",
  "content": "import React from 'react';\\n\\nfunction App() {..."
}`}
            />

            <Callout type="warning" title="Absolute Paths">
              Claude Code requires absolute paths for file operations. The system automatically resolves
              relative paths against the working directory, but Claude is instructed to always use absolute paths.
            </Callout>
          </section>

          {/* Permission System */}
          <section id="permission-system" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Shield size={24} className="text-red-500" />
              Permission System
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              The permission system is a critical safety layer that controls which tools Claude can use
              and what operations it can perform. Rules are evaluated in a specific order with deny rules
              taking highest precedence.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Permission Modes</h3>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-[#21262d]">
                  <tr>
                    <th className="text-left p-3 font-semibold">Mode</th>
                    <th className="text-left p-3 font-semibold">Behavior</th>
                  </tr>
                </thead>
                <tbody className="text-[#8b949e]">
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-green-400">default</code></td>
                    <td className="p-3">Prompts on first use of each tool type, remembers for session</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-blue-400">acceptEdits</code></td>
                    <td className="p-3">Auto-accepts file modifications (Edit, Write)</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-amber-400">plan</code></td>
                    <td className="p-3">Read-only mode - only analysis tools allowed</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-red-400">dontAsk</code></td>
                    <td className="p-3">Denies all tools unless explicitly in allow list</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-purple-400">bypassPermissions</code></td>
                    <td className="p-3">Skips all checks (requires --dangerously-skip-permissions)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Rule Evaluation Order</h3>

            <CodeBlock
              language="typescript"
              code={`function evaluatePermission(tool: string, input: object): Decision {
  // 1. Check deny rules first (highest priority)
  for (const rule of denyRules) {
    if (matchesPattern(tool, input, rule.pattern)) {
      return { decision: 'deny', reason: rule.pattern };
    }
  }

  // 2. Check ask rules
  for (const rule of askRules) {
    if (matchesPattern(tool, input, rule.pattern)) {
      return { decision: 'ask', reason: rule.pattern };
    }
  }

  // 3. Check allow rules
  for (const rule of allowRules) {
    if (matchesPattern(tool, input, rule.pattern)) {
      return { decision: 'allow', reason: rule.pattern };
    }
  }

  // 4. Fall back to permission mode default
  return getDefaultForMode(currentMode, tool);
}`}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Pattern Matching</h3>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Different tools use different pattern matching styles:
            </p>

            <ul className="list-disc list-inside text-[#8b949e] space-y-2 mb-6">
              <li><strong className="text-[#c9d1d9]">Read/Edit</strong>: Use gitignore-style glob patterns (<code>**/*.ts</code>, <code>*.env</code>)</li>
              <li><strong className="text-[#c9d1d9]">Bash</strong>: Use prefix matching with <code>:*</code> suffix (<code>npm run:*</code> matches <code>npm run test</code>)</li>
              <li><strong className="text-[#c9d1d9]">WebFetch</strong>: Use domain matching (<code>domain:api.github.com</code>)</li>
            </ul>

            <CodeBlock
              language="json"
              code={`{
  "permissions": {
    "deny": [
      "Read(.env)",           // Exact file match
      "Read(**/*secret*)",    // Glob pattern (gitignore style)
      "Bash(rm -rf:*)"        // Prefix match for dangerous commands
    ],
    "ask": [
      "Bash(*)",              // All bash commands
      "Edit(*)"               // All file edits
    ],
    "allow": [
      "Read(*)",              // All file reads
      "Glob(*)",              // All glob searches
      "Grep(*)",              // All grep searches
      "Bash(npm run:*)",      // npm run commands (prefix match)
      "WebFetch(domain:api.github.com)"  // Specific domain
    ]
  }
}`}
            />
          </section>

          {/* Hooks System */}
          <section id="hooks" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Zap size={24} className="text-purple-500" />
              Hooks System
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Hooks are user-defined scripts that execute at specific points in Claude Code's lifecycle.
              They provide extensibility, allowing you to validate inputs, modify behavior, log actions,
              and integrate with external systems.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Hook Events</h3>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-[#21262d]">
                  <tr>
                    <th className="text-left p-3 font-semibold">Event</th>
                    <th className="text-left p-3 font-semibold">Timing</th>
                    <th className="text-left p-3 font-semibold">Can Modify</th>
                  </tr>
                </thead>
                <tbody className="text-[#8b949e]">
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-green-400">SessionStart</code></td>
                    <td className="p-3">Session initialization</td>
                    <td className="p-3">Environment, add context</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-blue-400">UserPromptSubmit</code></td>
                    <td className="p-3">Before processing user message</td>
                    <td className="p-3">Can add context, block prompt</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-amber-400">PreToolUse</code></td>
                    <td className="p-3">Before processing tool call</td>
                    <td className="p-3">Can allow/deny/modify tool input</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-orange-400">PostToolUse</code></td>
                    <td className="p-3">After tool execution</td>
                    <td className="p-3">Can add feedback to Claude</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-pink-400">Notification</code></td>
                    <td className="p-3">When Claude emits notifications</td>
                    <td className="p-3">Can handle/log notifications</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-purple-400">PreCompact</code></td>
                    <td className="p-3">Before context compaction</td>
                    <td className="p-3">Can save important context</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-red-400">Stop</code></td>
                    <td className="p-3">When Claude wants to stop</td>
                    <td className="p-3">Can force continuation</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-cyan-400">SubagentStop</code></td>
                    <td className="p-3">When subagent wants to stop</td>
                    <td className="p-3">Can force subagent continuation</td>
                  </tr>
                  <tr className="border-t border-[#30363d]">
                    <td className="p-3"><code className="text-gray-400">SessionEnd</code></td>
                    <td className="p-3">Session termination</td>
                    <td className="p-3">Cleanup actions</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Hook Execution Flow</h3>

            <CodeBlock
              language="typescript"
              code={`// PreToolUse hook example
interface PreToolUseHookInput {
  tool_name: string;
  tool_input: object;
  session_id: string;
}

interface PreToolUseHookOutput {
  // Return via stdout JSON
  hookSpecificOutput?: {
    // Override permission decision
    permissionDecision?: 'allow' | 'deny' | 'ask';

    // Modify the tool input
    updatedInput?: object;

    // Add feedback for Claude
    feedback?: string;
  };
}

// Hook receives input via environment variables:
// - TOOL_NAME, TOOL_INPUT (JSON), SESSION_ID
//
// Hook can return JSON to stdout to affect behavior
// Exit code 2 = block/deny the action`}
            />

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Example: Auto-format on Save</h3>

            <CodeBlock
              language="json"
              code={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "prettier --write \\"$TOOL_INPUT_FILE_PATH\\""
      }
    ]
  }
}`}
            />

            <Callout type="warning" title="Hook Timeout">
              Hooks have a default timeout of 60 seconds. Long-running hooks should be designed carefully
              to avoid blocking Claude's execution.
            </Callout>
          </section>

          {/* Subagents */}
          <section id="subagents" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Users size={24} className="text-cyan-500" />
              Subagents
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Subagents are isolated Claude instances that Claude can spawn to handle complex or
              specialized tasks. Each subagent has its own context window and can use a subset of tools,
              allowing for parallel work and specialized expertise.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Built-in Agent Types</h3>

            <div className="space-y-4 mb-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400 font-semibold">Explore</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">Haiku</span>
                </div>
                <p className="text-sm text-[#8b949e]">
                  Fast, read-only agent for codebase exploration. Has access to Read, Glob, and Grep tools.
                  Uses a smaller, faster model for quick searches.
                </p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-semibold">general-purpose</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Sonnet</span>
                </div>
                <p className="text-sm text-[#8b949e]">
                  Full-capability agent for complex tasks. Has access to all tools and can perform
                  multi-step operations autonomously.
                </p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-semibold">Plan</span>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Sonnet</span>
                </div>
                <p className="text-sm text-[#8b949e]">
                  Architecture and planning focused agent. Designed for analyzing codebases and
                  creating implementation plans.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Subagent Lifecycle</h3>

            <Diagram caption="Figure 5: Subagent Execution">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Parent    │     │  Subagent   │     │  Subagent   │
│   Claude    │     │   Spawned   │     │  Execution  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  Task tool call   │                   │
       │──────────────────▶│                   │
       │                   │   Independent     │
       │                   │   context window  │
       │                   │──────────────────▶│
       │                   │                   │
       │                   │                   │  Can use tools
       │                   │                   │  (based on type)
       │                   │                   │
       │                   │◀──────────────────│
       │                   │   Results         │
       │◀──────────────────│                   │
       │   Summary returned│                   │
       │   to parent       │                   │`}
            </Diagram>

            <CodeBlock
              language="typescript"
              code={`// Spawning a subagent
const result = await tools.Task({
  subagent_type: 'Explore',
  prompt: 'Find all files related to authentication and summarize how the auth system works',
  description: 'Explore auth implementation'
});

// Result
{
  agentId: 'agent_abc123',
  result: 'Found JWT-based authentication in src/auth/...',
  canResume: true  // Can continue this agent later
}

// Resume a previous agent
const continued = await tools.Task({
  resume: 'agent_abc123',
  prompt: 'Now look at how tokens are refreshed'
});`}
            />

            <Callout type="info" title="Context Isolation">
              Subagents have completely isolated context windows. They don't inherit the parent's
              conversation history, but they do inherit permission settings and hooks.
            </Callout>
          </section>

          {/* Context Compaction */}
          <section id="context-compaction" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-[#e6edf3]">
              <Database size={24} className="text-emerald-500" />
              Context Compaction
            </h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Claude has a finite context window (typically 200K tokens). As conversations grow,
              context compaction automatically summarizes older messages to free up space while
              preserving important information.
            </p>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Compaction Process</h3>

            <Diagram caption="Figure 6: Context Compaction">
{`Before Compaction (200K tokens)
┌────────────────────────────────────────────────────────────────┐
│ System │ Old Messages (150K) │ Recent Messages │ New Content  │
│ Prompt │ (will be summarized)│    (preserved)  │   (added)    │
└────────────────────────────────────────────────────────────────┘

                              │
                              ▼ Compaction triggered

After Compaction (150K tokens)
┌────────────────────────────────────────────────────────────────┐
│ System │ Summary  │ Recent Messages │ New Content │   Free    │
│ Prompt │  (2K)    │   (preserved)   │   (added)   │   Space   │
└────────────────────────────────────────────────────────────────┘`}
            </Diagram>

            <h3 className="text-xl font-semibold mt-10 mb-4 text-[#e6edf3]">Compaction Algorithm</h3>

            <CodeBlock
              language="typescript"
              code={`async function compactContext(conversation: Message[]): Message[] {
  // 1. Identify messages to preserve (recent + pinned)
  const recentCount = 10;  // Keep last N messages
  const toPreserve = conversation.slice(-recentCount);
  const toSummarize = conversation.slice(0, -recentCount);

  // 2. Generate summary using Claude
  const summary = await claude.summarize({
    messages: toSummarize,
    instructions: \`
      Summarize the key information from this conversation:
      - Important decisions made
      - Files modified and why
      - Outstanding tasks
      - Technical context needed for continuation
    \`
  });

  // 3. Construct compacted conversation
  return [
    { role: 'system', content: 'Previous conversation summary:\\n' + summary },
    ...toPreserve
  ];
}

// Compaction is triggered when:
// - Token count approaches limit (usually ~90%)
// - User runs /compact command
// - Automatic threshold is reached`}
            />

            <Callout type="tip" title="PreCompact Hook">
              Use the PreCompact hook to save important context before compaction. For example,
              you could write key decisions to a file that gets loaded via CLAUDE.md.
            </Callout>

            <h3 className="text-lg font-semibold mt-8 mb-3">The Complete Picture</h3>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Here's how all these systems work together in a typical interaction:
            </p>

            <CodeBlock
              language="typescript"
              code={`// Complete flow pseudocode
async function handleUserMessage(message: string) {
  // 1. UserPromptSubmit hook - validate/augment prompt
  const hookResult = await runHook('UserPromptSubmit', { message });
  if (hookResult.decision === 'block') return hookResult.feedback;
  message = hookResult.additionalContext
    ? message + '\\n' + hookResult.additionalContext
    : message;

  // 2. Add to conversation
  conversation.push({ role: 'user', content: message });

  // 3. Agentic loop
  while (true) {
    // Check context limits
    if (getTokenCount(conversation) > THRESHOLD) {
      await runHook('PreCompact');
      conversation = await compactContext(conversation);
    }

    // Model inference
    const response = await claude.inference(conversation);

    // Handle tool use
    if (response.stopReason === 'tool_use') {
      for (const tool of response.toolCalls) {
        // PreToolUse hooks (run in parallel)
        const preHook = await runHook('PreToolUse', { tool });
        if (preHook.decision === 'deny') continue;

        // Permission check
        const permission = evaluatePermission(tool);
        if (permission === 'deny') continue;
        if (permission === 'ask' && !await askUser(tool)) continue;

        // Execute tool
        const result = await executeTool(tool);

        // PostToolUse hooks
        await runHook('PostToolUse', { tool, result });

        // Add result to conversation
        conversation.push({ role: 'tool_result', ...result });
      }
      continue;  // Loop back for more inference
    }

    // Handle end turn
    if (response.stopReason === 'end_turn') {
      const stopHook = await runHook('Stop', { response });
      if (stopHook.decision === 'block') {
        // Force continuation
        conversation.push({
          role: 'user',
          content: stopHook.reason || 'Please continue.'
        });
        continue;
      }
      return response.content;
    }
  }
}`}
            />
          </section>

          {/* Conclusion */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-[#e6edf3]">Conclusion</h2>

            <p className="text-[#8b949e] leading-relaxed mb-6">
              Claude Code's algorithm is a sophisticated orchestration of model inference, tool execution,
              permission management, and extensibility hooks. Understanding these components helps you:
            </p>

            <ul className="list-disc list-inside text-[#8b949e] space-y-2 mb-6">
              <li>Configure Claude Code effectively for your workflow</li>
              <li>Write hooks that enhance productivity and safety</li>
              <li>Debug unexpected behavior by understanding the execution flow</li>
              <li>Build custom integrations using MCP servers</li>
            </ul>

            <p className="text-[#8b949e]">
              For hands-on exploration, check out the <strong className="text-[#58a6ff]">Visualizer</strong> tab
              to see these concepts in action with interactive scenarios.
            </p>
          </section>
          </article>
        </div>
      </main>
    </div>
  );
}
