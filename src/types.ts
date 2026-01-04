// Algorithm node types
export type NodeType =
  | 'session-start'
  | 'hook'
  | 'context-load'
  | 'user-input'
  | 'model-inference'
  | 'decision'
  | 'tool-call'
  | 'permission-check'
  | 'tool-execution'
  | 'result-integration'
  | 'subagent'
  | 'stop'
  | 'response';

export type NodeStatus = 'idle' | 'active' | 'completed' | 'error' | 'skipped';

export interface AlgorithmNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  status: NodeStatus;
  codeExample?: string;
  jsonPayload?: object;
  details?: string;
}

export interface AlgorithmEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
  animated?: boolean;
}

export interface ExecutionStep {
  nodeId: string;
  timestamp: number;
  description: string;
  payload?: object;
  result?: object;
}

// Sandbox configuration
export interface PermissionRule {
  id: string;
  type: 'allow' | 'deny' | 'ask';
  pattern: string;
  enabled: boolean;
}

export interface HookConfig {
  id: string;
  event: 'SessionStart' | 'UserPromptSubmit' | 'PreToolUse' | 'PostToolUse' | 'PreCompact' | 'Stop' | 'SubagentStop';
  command: string;
  enabled: boolean;
  behavior: 'allow' | 'deny' | 'modify' | 'block';
}

export type PermissionMode = 'default' | 'acceptEdits' | 'plan' | 'dontAsk' | 'bypassPermissions';

export interface SandboxConfig {
  permissionMode: PermissionMode;
  permissionRules: PermissionRule[];
  hooks: HookConfig[];
  contextLimit: number;
  currentTokens: number;
  thinkingEnabled: boolean;
}

// Scenarios
export interface Scenario {
  id: string;
  name: string;
  description: string;
  userCommand: string;
  steps: ExecutionStep[];
  sandboxOverrides?: Partial<SandboxConfig>;
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';
