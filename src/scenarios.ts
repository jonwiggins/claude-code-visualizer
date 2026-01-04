import type { Scenario } from './types';
import { overviewNodes } from './algorithmOverview';

// Convert overview nodes to scenario steps for the Algorithm Overview
const algorithmOverviewSteps = overviewNodes.map((node, index) => ({
  nodeId: node.id,
  timestamp: index * 100,
  description: node.label,
  payload: {
    category: node.category,
    summary: node.description,
    details: node.details,
    codeExample: node.codeExample,
  },
}));

export const scenarios: Scenario[] = [
  // Algorithm Overview - first in list
  {
    id: 'algorithm-overview',
    name: 'Algorithm Overview',
    description: 'Complete reference of the Claude Code algorithm showing all major components: session lifecycle, context management, agentic loop, tool execution, hooks, subagents, and output. Click on any node to see detailed explanations and code examples.',
    userCommand: '(Reference diagram - not a specific command)',
    steps: algorithmOverviewSteps,
  },
  {
    id: 'simple-read',
    name: 'Simple File Read',
    description: 'User asks to read a file - basic tool execution flow',
    userCommand: 'Read the contents of src/App.tsx',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session initialized',
        payload: { sessionId: 'sess_abc123', model: 'claude-sonnet-4' },
      },
      {
        nodeId: 'hook-session-start',
        timestamp: 100,
        description: 'SessionStart hook fires',
        payload: {
          event: 'SessionStart',
          matcher: 'startup',
          hooks: [],
        },
      },
      {
        nodeId: 'context-load',
        timestamp: 200,
        description: 'Loading CLAUDE.md and context',
        payload: {
          sources: [
            '~/.claude/CLAUDE.md',
            '.claude/CLAUDE.md',
            '.claude/rules/*.md',
          ],
          tokensLoaded: 1250,
        },
      },
      {
        nodeId: 'permission-mode',
        timestamp: 300,
        description: 'Permission mode: default',
        payload: { mode: 'default' },
      },
      {
        nodeId: 'user-input',
        timestamp: 400,
        description: 'User prompt received',
        payload: { prompt: 'Read the contents of src/App.tsx' },
      },
      {
        nodeId: 'hook-prompt-submit',
        timestamp: 500,
        description: 'UserPromptSubmit hook fires',
        payload: {
          event: 'UserPromptSubmit',
          decision: null,
          additionalContext: null,
        },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 600,
        description: 'Model inference (streaming)',
        payload: {
          inputTokens: 1450,
          thinkingEnabled: true,
          thinking: 'User wants to read a file. I should use the Read tool...',
        },
      },
      {
        nodeId: 'tool-decision',
        timestamp: 800,
        description: 'Tool selected: Read',
        payload: {
          tool: 'Read',
          reasoning: 'User explicitly requested to read a file',
          input: { file_path: 'src/App.tsx' },
        },
      },
      {
        nodeId: 'hook-pre-tool',
        timestamp: 900,
        description: 'PreToolUse hooks run (parallel)',
        payload: {
          event: 'PreToolUse',
          tool: 'Read',
          hooks: [],
          decision: null,
        },
      },
      {
        nodeId: 'permission-check',
        timestamp: 1000,
        description: 'Permission check: Read(src/App.tsx)',
        payload: {
          tool: 'Read',
          pattern: 'src/App.tsx',
          matchedRule: { type: 'allow', pattern: 'Read(*)' },
          decision: 'allow',
        },
      },
      {
        nodeId: 'tool-execution',
        timestamp: 1100,
        description: 'Executing Read tool',
        payload: {
          tool: 'Read',
          input: { file_path: 'src/App.tsx' },
        },
        result: {
          success: true,
          output: 'import React from "react";\n\nfunction App() {\n  return <div>Hello</div>;\n}\n\nexport default App;',
          tokensUsed: 45,
        },
      },
      {
        nodeId: 'hook-post-tool',
        timestamp: 1200,
        description: 'PostToolUse hooks run (parallel)',
        payload: {
          event: 'PostToolUse',
          tool: 'Read',
          hooks: [],
        },
      },
      {
        nodeId: 'result-integration',
        timestamp: 1300,
        description: 'Tool result integrated into context',
        payload: {
          toolUseId: 'toolu_01ABC',
          result: 'File contents added to conversation',
        },
      },
      {
        nodeId: 'model-inference-2',
        timestamp: 1400,
        description: 'Model inference - generating response',
        payload: {
          inputTokens: 1550,
          stopReason: 'end_turn',
        },
      },
      {
        nodeId: 'hook-stop',
        timestamp: 1500,
        description: 'Stop hook evaluation',
        payload: {
          event: 'Stop',
          decision: null,
          stopHookActive: false,
        },
      },
      {
        nodeId: 'response',
        timestamp: 1600,
        description: 'Response sent to user',
        payload: {
          outputTokens: 120,
          response: 'Here are the contents of src/App.tsx:\n\n```tsx\nimport React...',
        },
      },
    ],
  },
  {
    id: 'multi-tool',
    name: 'Multi-Tool Task',
    description: 'Claude uses multiple tools to complete a task',
    userCommand: 'Find all TypeScript files and show me the one with the most lines',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session initialized',
        payload: { sessionId: 'sess_def456' },
      },
      {
        nodeId: 'hook-session-start',
        timestamp: 100,
        description: 'SessionStart hook fires',
        payload: { event: 'SessionStart' },
      },
      {
        nodeId: 'context-load',
        timestamp: 200,
        description: 'Loading context',
        payload: { tokensLoaded: 1100 },
      },
      {
        nodeId: 'user-input',
        timestamp: 300,
        description: 'User prompt received',
        payload: { prompt: 'Find all TypeScript files and show me the one with the most lines' },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 400,
        description: 'Model inference - planning',
        payload: {
          thinking: 'I need to: 1) Use Glob to find .ts files, 2) Count lines in each, 3) Read the largest',
        },
      },
      {
        nodeId: 'tool-decision-1',
        timestamp: 500,
        description: 'Tool selected: Glob',
        payload: {
          tool: 'Glob',
          input: { pattern: '**/*.ts' },
        },
      },
      {
        nodeId: 'hook-pre-tool-1',
        timestamp: 550,
        description: 'PreToolUse: Glob',
        payload: { tool: 'Glob' },
      },
      {
        nodeId: 'permission-check-1',
        timestamp: 600,
        description: 'Permission: allow',
        payload: { matchedRule: 'Glob(*)' },
      },
      {
        nodeId: 'tool-execution-1',
        timestamp: 700,
        description: 'Executing Glob',
        result: {
          files: ['src/App.tsx', 'src/main.tsx', 'src/types.ts', 'src/store.ts'],
        },
      },
      {
        nodeId: 'result-integration-1',
        timestamp: 800,
        description: 'Glob result integrated',
        payload: {},
      },
      {
        nodeId: 'model-inference-2',
        timestamp: 900,
        description: 'Model analyzing results',
        payload: {
          thinking: 'Found 4 files. Now I need to check line counts...',
        },
      },
      {
        nodeId: 'tool-decision-2',
        timestamp: 1000,
        description: 'Tool selected: Bash',
        payload: {
          tool: 'Bash',
          input: { command: 'wc -l src/*.ts*' },
        },
      },
      {
        nodeId: 'permission-check-2',
        timestamp: 1100,
        description: 'Permission check: Bash',
        payload: {
          matchedRule: { type: 'ask', pattern: 'Bash(*)' },
          decision: 'prompt_user',
        },
      },
      {
        nodeId: 'user-approval',
        timestamp: 1200,
        description: 'User approves Bash command',
        payload: { approved: true },
      },
      {
        nodeId: 'tool-execution-2',
        timestamp: 1300,
        description: 'Executing Bash',
        result: {
          output: '  45 src/App.tsx\n  12 src/main.tsx\n 180 src/types.ts\n 210 src/store.ts',
        },
      },
      {
        nodeId: 'model-inference-3',
        timestamp: 1400,
        description: 'Model analyzing line counts',
        payload: {
          thinking: 'store.ts has the most lines (210). I should read it.',
        },
      },
      {
        nodeId: 'tool-decision-3',
        timestamp: 1500,
        description: 'Tool selected: Read',
        payload: {
          tool: 'Read',
          input: { file_path: 'src/store.ts' },
        },
      },
      {
        nodeId: 'tool-execution-3',
        timestamp: 1600,
        description: 'Executing Read',
        result: { success: true },
      },
      {
        nodeId: 'response',
        timestamp: 1700,
        description: 'Response sent to user',
        payload: {
          response: 'The file with the most lines is src/store.ts (210 lines)...',
        },
      },
    ],
  },
  {
    id: 'subagent-delegation',
    name: 'Subagent Delegation',
    description: 'Claude spawns a subagent for a complex exploration task',
    userCommand: 'How does authentication work in this codebase?',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session initialized',
        payload: { sessionId: 'sess_ghi789' },
      },
      {
        nodeId: 'context-load',
        timestamp: 100,
        description: 'Loading context',
        payload: { tokensLoaded: 1300 },
      },
      {
        nodeId: 'user-input',
        timestamp: 200,
        description: 'User prompt received',
        payload: { prompt: 'How does authentication work in this codebase?' },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 300,
        description: 'Model inference - deciding approach',
        payload: {
          thinking: 'This is an exploratory question. I should delegate to an Explore subagent for thorough investigation.',
        },
      },
      {
        nodeId: 'tool-decision',
        timestamp: 400,
        description: 'Tool selected: Task (Explore agent)',
        payload: {
          tool: 'Task',
          input: {
            subagent_type: 'Explore',
            prompt: 'Find and analyze authentication-related code',
            description: 'Explore auth implementation',
          },
        },
      },
      {
        nodeId: 'subagent-spawn',
        timestamp: 500,
        description: 'Spawning Explore subagent',
        payload: {
          agentId: 'agent_xyz',
          type: 'Explore',
          contextWindow: 'isolated',
          tools: ['Read', 'Glob', 'Grep'],
        },
      },
      {
        nodeId: 'subagent-context',
        timestamp: 550,
        description: 'Subagent context isolated',
        payload: {
          parentContext: 'not inherited',
          transcriptFile: 'agent-xyz.jsonl',
        },
      },
      {
        nodeId: 'subagent-exec-1',
        timestamp: 600,
        description: 'Subagent: Grep for auth patterns',
        payload: {
          tool: 'Grep',
          pattern: 'auth|login|session|token',
        },
      },
      {
        nodeId: 'subagent-exec-2',
        timestamp: 800,
        description: 'Subagent: Read auth files',
        payload: {
          tool: 'Read',
          files: ['src/auth/login.ts', 'src/middleware/auth.ts'],
        },
      },
      {
        nodeId: 'subagent-exec-3',
        timestamp: 1000,
        description: 'Subagent: Analyze dependencies',
        payload: {
          tool: 'Grep',
          pattern: 'import.*auth',
        },
      },
      {
        nodeId: 'hook-subagent-stop',
        timestamp: 1100,
        description: 'SubagentStop hook evaluation',
        payload: {
          event: 'SubagentStop',
          agentId: 'agent_xyz',
          decision: null,
        },
      },
      {
        nodeId: 'subagent-complete',
        timestamp: 1200,
        description: 'Subagent returns results',
        payload: {
          agentId: 'agent_xyz',
          result: 'Found JWT-based authentication in src/auth/...',
          canResume: true,
        },
      },
      {
        nodeId: 'result-integration',
        timestamp: 1300,
        description: 'Subagent results integrated',
        payload: {
          contextBefore: 1300,
          contextAfter: 2100,
        },
      },
      {
        nodeId: 'model-inference-2',
        timestamp: 1400,
        description: 'Model synthesizing findings',
        payload: {
          thinking: 'Based on the subagent findings, I can now explain the auth system...',
        },
      },
      {
        nodeId: 'response',
        timestamp: 1500,
        description: 'Response sent to user',
        payload: {
          response: 'Your codebase uses JWT-based authentication. Here\'s how it works:\n\n1. Login endpoint in src/auth/login.ts...',
        },
      },
    ],
  },
  {
    id: 'permission-denied',
    name: 'Permission Denied',
    description: 'A tool call is blocked by permission rules',
    userCommand: 'Show me the contents of .env',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session initialized',
        payload: {},
      },
      {
        nodeId: 'context-load',
        timestamp: 100,
        description: 'Loading context',
        payload: {},
      },
      {
        nodeId: 'user-input',
        timestamp: 200,
        description: 'User prompt received',
        payload: { prompt: 'Show me the contents of .env' },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 300,
        description: 'Model inference',
        payload: {
          thinking: 'User wants to read .env file. I\'ll use Read tool.',
        },
      },
      {
        nodeId: 'tool-decision',
        timestamp: 400,
        description: 'Tool selected: Read',
        payload: {
          tool: 'Read',
          input: { file_path: '.env' },
        },
      },
      {
        nodeId: 'hook-pre-tool',
        timestamp: 450,
        description: 'PreToolUse hooks run',
        payload: { event: 'PreToolUse', tool: 'Read' },
      },
      {
        nodeId: 'permission-check',
        timestamp: 500,
        description: 'Permission DENIED: Read(.env)',
        payload: {
          tool: 'Read',
          pattern: '.env',
          matchedRule: { type: 'deny', pattern: 'Read(.env)' },
          decision: 'deny',
          reason: 'File matches deny rule: Read(.env)',
        },
      },
      {
        nodeId: 'tool-blocked',
        timestamp: 600,
        description: 'Tool execution blocked',
        payload: {
          error: 'Permission denied for Read(.env)',
        },
      },
      {
        nodeId: 'model-inference-2',
        timestamp: 700,
        description: 'Model handles denial',
        payload: {
          thinking: 'The Read tool was blocked for .env. I should explain why I cannot access this file.',
        },
      },
      {
        nodeId: 'response',
        timestamp: 800,
        description: 'Response sent to user',
        payload: {
          response: 'I cannot read the .env file as it is blocked by a security rule. This file typically contains sensitive credentials and should not be exposed.',
        },
      },
    ],
    sandboxOverrides: {
      permissionRules: [
        { id: 'r1', type: 'deny', pattern: 'Read(.env)', enabled: true },
        { id: 'r2', type: 'allow', pattern: 'Read(*)', enabled: true },
      ],
    },
  },
  {
    id: 'hook-blocking',
    name: 'Hook Blocking',
    description: 'A PreToolUse hook blocks and modifies tool execution',
    userCommand: 'Run npm install',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session initialized',
        payload: {},
      },
      {
        nodeId: 'context-load',
        timestamp: 100,
        description: 'Loading context',
        payload: {},
      },
      {
        nodeId: 'user-input',
        timestamp: 200,
        description: 'User prompt received',
        payload: { prompt: 'Run npm install' },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 300,
        description: 'Model inference',
        payload: {
          thinking: 'User wants to run npm install. I\'ll use Bash tool.',
        },
      },
      {
        nodeId: 'tool-decision',
        timestamp: 400,
        description: 'Tool selected: Bash',
        payload: {
          tool: 'Bash',
          input: { command: 'npm install' },
        },
      },
      {
        nodeId: 'hook-pre-tool',
        timestamp: 500,
        description: 'PreToolUse hook: security-check',
        payload: {
          event: 'PreToolUse',
          tool: 'Bash',
          hooks: [
            {
              name: 'security-check',
              command: 'if [[ "$COMMAND" == *"rm -rf"* ]]; then exit 2; fi',
            },
            {
              name: 'audit-logger',
              command: 'echo "$TOOL_NAME: $COMMAND" >> /var/log/claude.log',
            },
          ],
          parallel: true,
        },
      },
      {
        nodeId: 'hook-execution',
        timestamp: 600,
        description: 'Hooks execute in parallel',
        payload: {
          results: [
            { hook: 'security-check', exitCode: 0, decision: 'allow' },
            { hook: 'audit-logger', exitCode: 0, logged: true },
          ],
        },
      },
      {
        nodeId: 'hook-modify',
        timestamp: 650,
        description: 'Hook modifies input (npm ci instead)',
        payload: {
          originalInput: { command: 'npm install' },
          updatedInput: { command: 'npm ci' },
          reason: 'CI environment prefers deterministic installs',
        },
      },
      {
        nodeId: 'permission-check',
        timestamp: 700,
        description: 'Permission check: Bash(npm ci)',
        payload: {
          matchedRule: { type: 'ask', pattern: 'Bash(*)' },
        },
      },
      {
        nodeId: 'user-approval',
        timestamp: 800,
        description: 'User approves modified command',
        payload: { command: 'npm ci', approved: true },
      },
      {
        nodeId: 'tool-execution',
        timestamp: 900,
        description: 'Executing Bash: npm ci',
        result: {
          output: 'added 150 packages in 3.2s',
          exitCode: 0,
        },
      },
      {
        nodeId: 'hook-post-tool',
        timestamp: 1000,
        description: 'PostToolUse hooks run',
        payload: {
          event: 'PostToolUse',
          tool: 'Bash',
        },
      },
      {
        nodeId: 'response',
        timestamp: 1100,
        description: 'Response sent to user',
        payload: {
          response: 'Dependencies installed successfully using `npm ci` (150 packages).',
        },
      },
    ],
    sandboxOverrides: {
      hooks: [
        {
          id: 'h1',
          event: 'PreToolUse',
          command: 'security-check.sh',
          enabled: true,
          behavior: 'modify',
        },
        {
          id: 'h2',
          event: 'PreToolUse',
          command: 'audit-logger.sh',
          enabled: true,
          behavior: 'allow',
        },
      ],
    },
  },
  {
    id: 'context-compaction',
    name: 'Context Compaction',
    description: 'Context limit approached, triggering compaction',
    userCommand: 'Continue analyzing the codebase',
    steps: [
      {
        nodeId: 'session-start',
        timestamp: 0,
        description: 'Session continues (long conversation)',
        payload: { currentTokens: 185000, limit: 200000 },
      },
      {
        nodeId: 'user-input',
        timestamp: 100,
        description: 'User prompt received',
        payload: { prompt: 'Continue analyzing the codebase' },
      },
      {
        nodeId: 'model-inference-1',
        timestamp: 200,
        description: 'Model inference',
        payload: { inputTokens: 185500 },
      },
      {
        nodeId: 'tool-decision',
        timestamp: 300,
        description: 'Tool: Read (large file)',
        payload: {
          tool: 'Read',
          input: { file_path: 'src/large-module.ts' },
        },
      },
      {
        nodeId: 'tool-execution',
        timestamp: 400,
        description: 'Read returns 15K tokens',
        result: { tokensReturned: 15000 },
      },
      {
        nodeId: 'context-check',
        timestamp: 500,
        description: 'Context limit check',
        payload: {
          currentTokens: 200500,
          limit: 200000,
          exceeded: true,
        },
      },
      {
        nodeId: 'hook-pre-compact',
        timestamp: 600,
        description: 'PreCompact hook fires',
        payload: {
          event: 'PreCompact',
          matcher: 'auto',
          reason: 'Context limit exceeded',
        },
      },
      {
        nodeId: 'compaction-start',
        timestamp: 700,
        description: 'Compaction initiated',
        payload: {
          strategy: 'summarize_old_messages',
          targetTokens: 150000,
        },
      },
      {
        nodeId: 'compaction-summary',
        timestamp: 900,
        description: 'Claude generates summary',
        payload: {
          summaryTokens: 2000,
          preservedMessages: 10,
          summarizedMessages: 45,
        },
      },
      {
        nodeId: 'compaction-complete',
        timestamp: 1000,
        description: 'Compaction complete',
        payload: {
          beforeTokens: 200500,
          afterTokens: 152000,
          savedTokens: 48500,
        },
      },
      {
        nodeId: 'model-inference-2',
        timestamp: 1100,
        description: 'Model continues with compacted context',
        payload: { inputTokens: 152000 },
      },
      {
        nodeId: 'response',
        timestamp: 1200,
        description: 'Response sent to user',
        payload: {
          response: 'Based on my analysis (context was compacted to preserve session)...',
          note: 'Session automatically compacted due to context limits',
        },
      },
    ],
    sandboxOverrides: {
      currentTokens: 185000,
      contextLimit: 200000,
    },
  },
];
