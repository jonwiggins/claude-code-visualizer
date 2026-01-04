// Complete Claude Code Algorithm Reference
// This defines all the nodes and edges for the overview flowchart

export interface OverviewNode {
  id: string;
  label: string;
  category: 'session' | 'context' | 'loop' | 'tool' | 'hook' | 'subagent' | 'output';
  description: string;
  details: string;
  codeExample?: string;
}

export interface OverviewEdge {
  source: string;
  target: string;
  label?: string;
  condition?: string;
  isLoopBack?: boolean; // Edges that go back up the flow
}

export const overviewNodes: OverviewNode[] = [
  // Session lifecycle
  {
    id: 'session-start',
    label: 'Session Start',
    category: 'session',
    description: 'Claude Code session initializes',
    details: `When you run 'claude' or start a new conversation, a session is created. This establishes the execution environment, loads configuration, and prepares the context window.

Key actions:
- Generate unique session ID
- Load user settings from ~/.claude/settings.json
- Load project settings from .claude/settings.json
- Initialize the conversation transcript
- Set up tool definitions`,
    codeExample: `{
  "sessionId": "sess_abc123",
  "model": "claude-sonnet-4",
  "workingDirectory": "/path/to/project"
}`,
  },
  {
    id: 'hook-session-start',
    label: 'SessionStart Hook',
    category: 'hook',
    description: 'Hooks fire on session initialization',
    details: `The SessionStart hook fires immediately when a session begins. It can be used to set up the environment, load dependencies, or configure the session.

Matchers:
- 'startup': Normal session start
- 'resume': Resuming a previous session
- 'clear': After /clear command
- 'compact': After context compaction

Common uses:
- Set environment variables via CLAUDE_ENV_FILE
- Install project dependencies
- Load development environment`,
    codeExample: `{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "command": "source ~/.nvm/nvm.sh && nvm use"
    }]
  }
}`,
  },
  {
    id: 'context-load',
    label: 'Context Loading',
    category: 'context',
    description: 'CLAUDE.md, memory, and rules are loaded',
    details: `Claude Code loads contextual information from multiple sources in a specific precedence order:

1. Enterprise policy CLAUDE.md (highest precedence)
2. Project memory (.claude/CLAUDE.md or ./CLAUDE.md)
3. Project rules (.claude/rules/*.md)
4. Imported files via @path syntax
5. Local overrides (.claude/CLAUDE.md.local)
6. User memory (~/.claude/CLAUDE.md)
7. Tool definitions
8. Skill descriptions

This context shapes Claude's understanding of your project, coding standards, and preferences.`,
    codeExample: `// .claude/CLAUDE.md
# Project: My App

## Tech Stack
- React 18 + TypeScript
- Tailwind CSS

## Conventions
- Use functional components
- Prefer named exports`,
  },
  {
    id: 'permission-mode',
    label: 'Permission Mode',
    category: 'context',
    description: 'Active permission mode determines behavior',
    details: `The permission mode affects how Claude handles tool execution:

- **default**: Prompts on first use of each tool type, remembers for session
- **acceptEdits**: Auto-accepts file modifications (Edit, Write)
- **plan**: Read-only mode - only analysis tools allowed
- **dontAsk**: Denies all tools unless explicitly in allow list
- **bypassPermissions**: Skips all checks (requires safe environment flag)

Toggle with Shift+Tab or set in settings.`,
    codeExample: `// settings.json
{
  "permissions": {
    "defaultMode": "default",
    "allow": ["Read(*)", "Glob(*)", "Grep(*)"],
    "deny": ["Read(.env)"]
  }
}`,
  },
  {
    id: 'user-input',
    label: 'User Input',
    category: 'loop',
    description: 'User sends a message or command',
    details: `The user's message enters the agentic loop. This can be:

- A natural language request ("Fix the bug in auth.ts")
- A question ("How does the routing work?")
- A command (/clear, /compact, /help)
- Follow-up to a previous response

The message is added to the conversation history and sent to Claude for inference.`,
  },
  {
    id: 'hook-prompt-submit',
    label: 'UserPromptSubmit Hook',
    category: 'hook',
    description: 'Hook can validate or modify the prompt',
    details: `Fires before the user's message is processed. Can be used to:

- Validate prompts against policies
- Add additional context automatically
- Block certain types of requests
- Log prompts for auditing

Hook can return:
- Nothing: Allow prompt as-is
- additionalContext: Append context to the prompt
- decision: "block" to reject the prompt`,
    codeExample: `{
  "hooks": {
    "UserPromptSubmit": [{
      "command": "check-prompt-policy.sh"
    }]
  }
}

// Hook output to add context:
{
  "hookSpecificOutput": {
    "additionalContext": "Remember to follow our style guide."
  }
}`,
  },
  {
    id: 'model-inference',
    label: 'Model Inference',
    category: 'loop',
    description: 'Claude processes the request',
    details: `Claude analyzes the conversation history, context, and current request to determine the best response. This may include:

- Extended thinking (if enabled) for complex reasoning
- Semantic analysis of the request
- Planning multi-step approaches
- Deciding whether tools are needed

The model outputs either:
- Direct text response (stop_reason: end_turn)
- Tool use request (stop_reason: tool_use)
- Continuation needed (stop_reason: max_tokens)`,
    codeExample: `// With thinking enabled:
{
  "thinking": "The user wants to read a file. I should use the Read tool with the specified path...",
  "thinkingTokens": 1250
}`,
  },
  {
    id: 'tool-decision',
    label: 'Tool Decision',
    category: 'tool',
    description: 'Claude decides which tool to use',
    details: `Claude selects a tool based on:

1. Semantic matching between request and tool descriptions
2. Current context and conversation history
3. Available tools and their capabilities
4. Permission constraints

Available tools:
- Read, Write, Edit, NotebookEdit (file operations)
- Glob, Grep (search)
- Bash (shell commands)
- Task (spawn subagents)
- WebFetch, WebSearch (web access)
- AskUserQuestion (user interaction)`,
    codeExample: `{
  "tool": "Read",
  "input": {
    "file_path": "/absolute/path/to/file.ts"
  },
  "reasoning": "User asked to see the file contents"
}`,
  },
  {
    id: 'hook-pre-tool',
    label: 'PreToolUse Hook',
    category: 'hook',
    description: 'Hooks run BEFORE permission check',
    details: `PreToolUse hooks execute in parallel before the permission system evaluates the tool call. They can:

- Allow the tool (bypass permission check)
- Deny the tool (block execution)
- Ask the user (defer to permission prompt)
- Modify the tool input (updatedInput)

Important: Hooks run BEFORE permission rules, giving them higher authority.

Timeout: 60 seconds per hook (configurable).`,
    codeExample: `// Hook that modifies npm install to npm ci
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "command": "modify-npm-command.sh"
    }]
  }
}

// Hook output:
{
  "hookSpecificOutput": {
    "permissionDecision": "allow",
    "updatedInput": {
      "command": "npm ci"
    }
  }
}`,
  },
  {
    id: 'permission-check',
    label: 'Permission Check',
    category: 'tool',
    description: 'Rules evaluated: deny > ask > allow',
    details: `The permission system evaluates rules in priority order:

1. **Deny rules** (highest priority) - Always block
2. **Ask rules** - Prompt user for approval
3. **Allow rules** - Permit without asking
4. **Default mode** - Apply mode-specific behavior

Pattern matching:
- Glob patterns: Read(src/**/*)
- Prefix matching for Bash: Bash(npm:*)
- Domain matching: WebFetch(domain:api.example.com)`,
    codeExample: `{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(**/*credentials*)"
    ],
    "ask": [
      "Bash(*)",
      "Edit(*)"
    ],
    "allow": [
      "Read(*)",
      "Glob(*)",
      "Grep(*)"
    ]
  }
}`,
  },
  {
    id: 'tool-execution',
    label: 'Tool Execution',
    category: 'tool',
    description: 'Tool runs with provided parameters',
    details: `The tool executes with the (possibly modified) input parameters:

- File operations access the filesystem
- Bash commands run in a persistent shell
- Web tools make HTTP requests
- Task tool spawns subagents

Results are captured including:
- Output content
- Exit codes (for Bash)
- Errors if any
- Token count of result`,
    codeExample: `// Tool execution
Input: { "file_path": "src/App.tsx" }

// Tool result
{
  "type": "tool_result",
  "tool_use_id": "toolu_01ABC",
  "content": "import React from 'react';\\n..."
}`,
  },
  {
    id: 'hook-post-tool',
    label: 'PostToolUse Hook',
    category: 'hook',
    description: 'Hooks run after tool completes',
    details: `PostToolUse hooks execute after a tool finishes. Common uses:

- Format code after file writes
- Run linters after edits
- Log tool usage for auditing
- Notify external systems
- Provide feedback to Claude

The hook receives tool name, input, and output in the environment.`,
    codeExample: `{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "command": "prettier --write $TOOL_INPUT_FILE_PATH"
    }]
  }
}`,
  },
  {
    id: 'result-integration',
    label: 'Result Integration',
    category: 'loop',
    description: 'Tool result added to context',
    details: `The tool result is formatted and added to the conversation history:

{
  "type": "tool_result",
  "tool_use_id": "toolu_01ABC...",
  "content": "..."
}

This becomes part of the context for the next inference. Claude analyzes the result to:
- Determine if the task is complete
- Decide on next actions
- Generate a response to the user`,
  },
  {
    id: 'subagent-spawn',
    label: 'Subagent Spawned',
    category: 'subagent',
    description: 'Task tool creates isolated agent',
    details: `When Claude uses the Task tool, a subagent is spawned:

Built-in agent types:
- **Explore**: Fast, read-only codebase exploration (Haiku)
- **general-purpose**: Full capabilities for complex tasks
- **Plan**: Architecture and planning focus

Each subagent has:
- Isolated context window (separate from parent)
- Own conversation transcript
- Specified tool access
- Can be resumed later with agent ID`,
    codeExample: `{
  "tool": "Task",
  "input": {
    "subagent_type": "Explore",
    "prompt": "Find all authentication-related code",
    "description": "Explore auth implementation"
  }
}

// Returns:
{
  "agentId": "agent_xyz",
  "result": "Found JWT auth in src/auth/...",
  "canResume": true
}`,
  },
  {
    id: 'hook-subagent-stop',
    label: 'SubagentStop Hook',
    category: 'hook',
    description: 'Hook can force subagent to continue',
    details: `Fires when a subagent is about to complete. Can be used to:

- Validate subagent output quality
- Force continuation if work is incomplete
- Log subagent results

Similar to Stop hook but for subagents specifically. Setting decision: "block" forces the subagent to continue working.`,
    codeExample: `{
  "hooks": {
    "SubagentStop": [{
      "type": "prompt",
      "prompt": "Did the agent fully answer the question? Return {decision: 'block', reason: '...'} if not."
    }]
  }
}`,
  },
  {
    id: 'context-check',
    label: 'Context Check',
    category: 'context',
    description: 'Monitor context window usage',
    details: `Claude Code monitors token usage throughout the session:

- Input tokens (conversation + context)
- Output tokens (responses)
- Thinking tokens (if extended thinking enabled)

When approaching the context limit, compaction may be triggered automatically. You can also manually compact with /compact.`,
    codeExample: `// Token tracking
{
  "contextLimit": 200000,
  "currentTokens": 185000,
  "percentUsed": 92.5,
  "warningThreshold": 90
}`,
  },
  {
    id: 'hook-pre-compact',
    label: 'PreCompact Hook',
    category: 'hook',
    description: 'Fires before context compaction',
    details: `Triggers before context is compacted, either:
- Automatically when approaching limit
- Manually via /compact command

Matchers:
- 'auto': Automatic compaction
- 'manual': User-initiated /compact

Use this to save important context or log the compaction event.`,
    codeExample: `{
  "hooks": {
    "PreCompact": [{
      "matcher": "auto",
      "command": "echo 'Context compacting...' >> ~/.claude/compaction.log"
    }]
  }
}`,
  },
  {
    id: 'compaction',
    label: 'Context Compaction',
    category: 'context',
    description: 'Old messages summarized to save space',
    details: `When context approaches limits, Claude summarizes older messages:

1. Preserve recent messages intact
2. Generate summary of older conversation
3. Replace old messages with summary
4. Continue session with reduced context

This allows indefinitely long sessions while maintaining relevant context. Some detail is lost, but key information is preserved.`,
    codeExample: `// Before compaction: 200,500 tokens
// After compaction: 152,000 tokens

{
  "summarizedMessages": 45,
  "preservedMessages": 10,
  "summaryTokens": 2000,
  "savedTokens": 48500
}`,
  },
  {
    id: 'hook-stop',
    label: 'Stop Hook',
    category: 'hook',
    description: 'Hook can block completion and force continue',
    details: `The Stop hook fires when Claude is about to finish responding. It can:

- Allow Claude to stop (default)
- Block and force continuation
- Validate output quality

Supports both command-based and prompt-based (LLM) evaluation.

Warning: Be careful not to create infinite loops - use stop_hook_active flag to detect repeated blocking.`,
    codeExample: `{
  "hooks": {
    "Stop": [{
      "type": "prompt",
      "prompt": "Did Claude complete ALL requested tasks? If not, return {decision: 'block', reason: 'incomplete'}."
    }]
  }
}`,
  },
  {
    id: 'response',
    label: 'Response',
    category: 'output',
    description: 'Final response sent to user',
    details: `Claude's response is displayed to the user. This may include:

- Explanations and answers
- Code snippets with syntax highlighting
- File paths and line references
- Next steps or suggestions

The response is added to conversation history for future context. The session remains active for follow-up messages.`,
  },
];

export const overviewEdges: OverviewEdge[] = [
  // Session flow (linear initialization)
  { source: 'session-start', target: 'hook-session-start' },
  { source: 'hook-session-start', target: 'context-load' },
  { source: 'context-load', target: 'permission-mode' },
  { source: 'permission-mode', target: 'user-input' },

  // Main agentic loop entry
  { source: 'user-input', target: 'hook-prompt-submit' },
  { source: 'hook-prompt-submit', target: 'model-inference' },

  // Model decision branches
  { source: 'model-inference', target: 'tool-decision', label: 'tool_use' },
  { source: 'model-inference', target: 'hook-stop', label: 'end_turn' },

  // Tool flow (main path)
  { source: 'tool-decision', target: 'hook-pre-tool' },
  { source: 'hook-pre-tool', target: 'permission-check' },
  { source: 'permission-check', target: 'tool-execution', label: 'allowed' },
  { source: 'tool-execution', target: 'hook-post-tool' },
  { source: 'hook-post-tool', target: 'result-integration' },

  // Subagent flow (branch from tool-decision)
  { source: 'tool-decision', target: 'subagent-spawn', label: 'Task' },
  { source: 'subagent-spawn', target: 'hook-subagent-stop' },
  { source: 'hook-subagent-stop', target: 'result-integration' },

  // Context management (branch from result-integration)
  { source: 'result-integration', target: 'context-check' },
  { source: 'context-check', target: 'hook-pre-compact', label: 'limit' },
  { source: 'hook-pre-compact', target: 'compaction' },

  // Output flow
  { source: 'hook-stop', target: 'response', label: 'allow' },

  // Loop-back edges (styled differently, excluded from layout)
  { source: 'result-integration', target: 'model-inference', label: 'loop', isLoopBack: true },
  { source: 'context-check', target: 'model-inference', label: 'ok', isLoopBack: true },
  { source: 'compaction', target: 'model-inference', isLoopBack: true },
  { source: 'hook-stop', target: 'model-inference', label: 'block', isLoopBack: true },
  { source: 'response', target: 'user-input', label: 'next', isLoopBack: true },
];

// Color mapping for categories
export const categoryColors: Record<OverviewNode['category'], string> = {
  session: 'border-green-500 bg-green-500/10',
  context: 'border-blue-500 bg-blue-500/10',
  loop: 'border-amber-500 bg-amber-500/10',
  tool: 'border-orange-500 bg-orange-500/10',
  hook: 'border-purple-500 bg-purple-500/10',
  subagent: 'border-cyan-500 bg-cyan-500/10',
  output: 'border-emerald-500 bg-emerald-500/10',
};
