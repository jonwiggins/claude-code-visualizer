import { create } from 'zustand';
import type {
  AlgorithmNode,
  ExecutionStep,
  SandboxConfig,
  Scenario,
  PlaybackState,
  PermissionMode,
  PermissionRule,
  HookConfig,
} from './types';
import { scenarios } from './scenarios';

interface VisualizerState {
  // Current scenario
  currentScenario: Scenario | null;
  scenarios: Scenario[];

  // Algorithm state
  nodes: Map<string, AlgorithmNode>;
  currentStep: number;
  executionLog: ExecutionStep[];

  // Playback
  playbackState: PlaybackState;
  playbackSpeed: number; // ms per step

  // Sandbox configuration
  sandbox: SandboxConfig;

  // Selected node for detail view
  selectedNodeId: string | null;

  // Actions
  selectScenario: (scenarioId: string) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setPlaybackSpeed: (speed: number) => void;
  selectNode: (nodeId: string | null) => void;

  // Sandbox actions
  setPermissionMode: (mode: PermissionMode) => void;
  addPermissionRule: (rule: PermissionRule) => void;
  removePermissionRule: (id: string) => void;
  togglePermissionRule: (id: string) => void;
  addHook: (hook: HookConfig) => void;
  removeHook: (id: string) => void;
  toggleHook: (id: string) => void;
  updateHookBehavior: (id: string, behavior: HookConfig['behavior']) => void;
  setContextLimit: (limit: number) => void;
  toggleThinking: () => void;

  // Internal
  _executeStep: (step: number) => void;
}

const defaultSandbox: SandboxConfig = {
  permissionMode: 'default',
  permissionRules: [
    { id: 'r1', type: 'allow', pattern: 'Read(*)', enabled: true },
    { id: 'r2', type: 'allow', pattern: 'Glob(*)', enabled: true },
    { id: 'r3', type: 'allow', pattern: 'Grep(*)', enabled: true },
    { id: 'r4', type: 'ask', pattern: 'Edit(*)', enabled: true },
    { id: 'r5', type: 'ask', pattern: 'Write(*)', enabled: true },
    { id: 'r6', type: 'ask', pattern: 'Bash(*)', enabled: true },
    { id: 'r7', type: 'deny', pattern: 'Read(.env)', enabled: true },
  ],
  hooks: [
    {
      id: 'h1',
      event: 'PreToolUse',
      command: 'echo "Tool: $TOOL_NAME"',
      enabled: false,
      behavior: 'allow',
    },
    {
      id: 'h2',
      event: 'PostToolUse',
      command: 'prettier --write $FILE',
      enabled: false,
      behavior: 'allow',
    },
  ],
  contextLimit: 200000,
  currentTokens: 0,
  thinkingEnabled: true,
};

const initialNodes = new Map<string, AlgorithmNode>();

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  currentScenario: null,
  scenarios,
  nodes: initialNodes,
  currentStep: -1,
  executionLog: [],
  playbackState: 'idle',
  playbackSpeed: 1000,
  sandbox: defaultSandbox,
  selectedNodeId: null,

  selectScenario: (scenarioId) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Reset nodes
    const nodes = new Map<string, AlgorithmNode>();

    // Apply sandbox overrides
    const sandbox = {
      ...defaultSandbox,
      ...scenario.sandboxOverrides,
    };

    set({
      currentScenario: scenario,
      nodes,
      currentStep: -1,
      executionLog: [],
      playbackState: 'idle',
      sandbox,
      selectedNodeId: null,
    });
  },

  play: () => {
    const { playbackState, currentScenario } = get();
    if (!currentScenario) return;
    if (playbackState === 'finished') {
      get().reset();
    }

    set({ playbackState: 'playing' });

    const runStep = () => {
      const state = get();
      if (state.playbackState !== 'playing') return;

      const nextStep = state.currentStep + 1;
      if (nextStep >= state.currentScenario!.steps.length) {
        set({ playbackState: 'finished' });
        return;
      }

      state._executeStep(nextStep);
      setTimeout(runStep, state.playbackSpeed);
    };

    runStep();
  },

  pause: () => set({ playbackState: 'paused' }),

  reset: () => {
    const { currentScenario } = get();
    if (!currentScenario) return;

    set({
      currentStep: -1,
      executionLog: [],
      playbackState: 'idle',
      nodes: new Map(),
      selectedNodeId: null,
    });
  },

  stepForward: () => {
    const { currentScenario, currentStep } = get();
    if (!currentScenario) return;

    const nextStep = currentStep + 1;
    if (nextStep >= currentScenario.steps.length) return;

    get()._executeStep(nextStep);
    set({ playbackState: 'paused' });
  },

  stepBackward: () => {
    const { currentScenario, currentStep } = get();
    if (!currentScenario || currentStep <= 0) return;

    // Re-execute from beginning up to previous step
    set({ nodes: new Map(), executionLog: [], currentStep: -1 });

    for (let i = 0; i < currentStep; i++) {
      get()._executeStep(i);
    }
    set({ playbackState: 'paused' });
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setPermissionMode: (mode) =>
    set((state) => ({
      sandbox: { ...state.sandbox, permissionMode: mode },
    })),

  addPermissionRule: (rule) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        permissionRules: [...state.sandbox.permissionRules, rule],
      },
    })),

  removePermissionRule: (id) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        permissionRules: state.sandbox.permissionRules.filter((r) => r.id !== id),
      },
    })),

  togglePermissionRule: (id) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        permissionRules: state.sandbox.permissionRules.map((r) =>
          r.id === id ? { ...r, enabled: !r.enabled } : r,
        ),
      },
    })),

  addHook: (hook) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        hooks: [...state.sandbox.hooks, hook],
      },
    })),

  removeHook: (id) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        hooks: state.sandbox.hooks.filter((h) => h.id !== id),
      },
    })),

  toggleHook: (id) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        hooks: state.sandbox.hooks.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)),
      },
    })),

  updateHookBehavior: (id, behavior) =>
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        hooks: state.sandbox.hooks.map((h) => (h.id === id ? { ...h, behavior } : h)),
      },
    })),

  setContextLimit: (limit) =>
    set((state) => ({
      sandbox: { ...state.sandbox, contextLimit: limit },
    })),

  toggleThinking: () =>
    set((state) => ({
      sandbox: { ...state.sandbox, thinkingEnabled: !state.sandbox.thinkingEnabled },
    })),

  _executeStep: (stepIndex) => {
    const { currentScenario, nodes, sandbox } = get();
    if (!currentScenario) return;

    const step = currentScenario.steps[stepIndex];
    const newNodes = new Map(nodes);

    // Update node status based on step
    const nodeUpdate: AlgorithmNode = {
      id: step.nodeId,
      type: step.nodeId.split('-')[0] as AlgorithmNode['type'],
      label: step.description,
      description: step.description,
      status: 'active',
      jsonPayload: step.payload,
    };

    // Mark previous active nodes as completed
    newNodes.forEach((node, id) => {
      if (node.status === 'active') {
        newNodes.set(id, { ...node, status: 'completed' });
      }
    });

    newNodes.set(step.nodeId, nodeUpdate);

    // Update token count simulation
    const newTokens = sandbox.currentTokens + Math.floor(Math.random() * 500) + 100;

    set((state) => ({
      currentStep: stepIndex,
      nodes: newNodes,
      executionLog: [...state.executionLog, step],
      sandbox: { ...state.sandbox, currentTokens: newTokens },
    }));
  },
}));
