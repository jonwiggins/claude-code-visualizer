import { useState } from 'react';
import { Shield, Zap, Trash2, ChevronDown, ChevronRight, Brain, Gauge } from 'lucide-react';
import { useVisualizerStore } from '../store';
import type { PermissionMode, HookConfig } from '../types';
import clsx from 'clsx';

export function SandboxPanel() {
  const {
    sandbox,
    setPermissionMode,
    togglePermissionRule,
    removePermissionRule,
    toggleHook,
    removeHook,
    updateHookBehavior,
    toggleThinking,
  } = useVisualizerStore();

  const [expandedSections, setExpandedSections] = useState({
    permissions: true,
    hooks: true,
    context: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const permissionModes: { value: PermissionMode; label: string; desc: string }[] = [
    { value: 'default', label: 'Default', desc: 'Ask on first use' },
    { value: 'acceptEdits', label: 'Accept Edits', desc: 'Auto-accept file edits' },
    { value: 'plan', label: 'Plan Mode', desc: 'Read-only analysis' },
    { value: 'dontAsk', label: "Don't Ask", desc: 'Deny unless allowed' },
    { value: 'bypassPermissions', label: 'Bypass', desc: 'Skip all checks' },
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#30363d]">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield size={16} className="text-[#58a6ff]" />
          Sandbox Configuration
        </h3>
      </div>

      <div className="max-h-[500px] overflow-auto">
        {/* Permission Mode */}
        <div className="p-3 border-b border-[#30363d]">
          <label className="text-xs text-[#8b949e] block mb-2">Permission Mode</label>
          <select
            value={sandbox.permissionMode}
            onChange={(e) => setPermissionMode(e.target.value as PermissionMode)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#58a6ff]"
          >
            {permissionModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label} - {mode.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Permission Rules */}
        <div className="border-b border-[#30363d]">
          <button
            onClick={() => toggleSection('permissions')}
            className="w-full p-3 flex items-center justify-between hover:bg-[#1f2428] transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {expandedSections.permissions ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              Permission Rules
            </span>
            <span className="text-xs text-[#8b949e]">
              {sandbox.permissionRules.filter((r) => r.enabled).length} active
            </span>
          </button>

          {expandedSections.permissions && (
            <div className="px-3 pb-3 space-y-2">
              {sandbox.permissionRules.map((rule) => (
                <div
                  key={rule.id}
                  className={clsx(
                    'flex items-center gap-2 p-2 rounded text-xs',
                    rule.enabled ? 'bg-[#0d1117]' : 'bg-[#0d1117]/50 opacity-50',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => togglePermissionRule(rule.id)}
                    className="rounded"
                  />
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase',
                      rule.type === 'allow' && 'bg-green-500/20 text-green-400',
                      rule.type === 'deny' && 'bg-red-500/20 text-red-400',
                      rule.type === 'ask' && 'bg-yellow-500/20 text-yellow-400',
                    )}
                  >
                    {rule.type}
                  </span>
                  <code className="flex-1 text-[#c9d1d9]">{rule.pattern}</code>
                  <button
                    onClick={() => removePermissionRule(rule.id)}
                    className="p-1 hover:bg-[#30363d] rounded transition-colors"
                  >
                    <Trash2 size={12} className="text-[#8b949e]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hooks */}
        <div className="border-b border-[#30363d]">
          <button
            onClick={() => toggleSection('hooks')}
            className="w-full p-3 flex items-center justify-between hover:bg-[#1f2428] transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {expandedSections.hooks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Zap size={14} className="text-purple-400" />
              Hooks
            </span>
            <span className="text-xs text-[#8b949e]">
              {sandbox.hooks.filter((h) => h.enabled).length} active
            </span>
          </button>

          {expandedSections.hooks && (
            <div className="px-3 pb-3 space-y-2">
              {sandbox.hooks.map((hook) => (
                <div
                  key={hook.id}
                  className={clsx(
                    'p-2 rounded text-xs',
                    hook.enabled ? 'bg-[#0d1117]' : 'bg-[#0d1117]/50 opacity-50',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={hook.enabled}
                      onChange={() => toggleHook(hook.id)}
                      className="rounded"
                    />
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-semibold">
                      {hook.event}
                    </span>
                    <select
                      value={hook.behavior}
                      onChange={(e) =>
                        updateHookBehavior(hook.id, e.target.value as HookConfig['behavior'])
                      }
                      className="ml-auto bg-[#161b22] border border-[#30363d] rounded px-1 py-0.5 text-[10px]"
                    >
                      <option value="allow">Allow</option>
                      <option value="deny">Deny</option>
                      <option value="modify">Modify</option>
                      <option value="block">Block</option>
                    </select>
                    <button
                      onClick={() => removeHook(hook.id)}
                      className="p-1 hover:bg-[#30363d] rounded transition-colors"
                    >
                      <Trash2 size={12} className="text-[#8b949e]" />
                    </button>
                  </div>
                  <code className="text-[#8b949e] block truncate">{hook.command}</code>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context & Thinking */}
        <div>
          <button
            onClick={() => toggleSection('context')}
            className="w-full p-3 flex items-center justify-between hover:bg-[#1f2428] transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {expandedSections.context ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Gauge size={14} className="text-cyan-400" />
              Context & Thinking
            </span>
          </button>

          {expandedSections.context && (
            <div className="px-3 pb-3 space-y-3">
              {/* Token usage */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#8b949e]">Token Usage</span>
                  <span className="text-[#c9d1d9]">
                    {sandbox.currentTokens.toLocaleString()} /{' '}
                    {sandbox.contextLimit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-[#30363d] rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full transition-all duration-300',
                      sandbox.currentTokens / sandbox.contextLimit > 0.9
                        ? 'bg-red-500'
                        : sandbox.currentTokens / sandbox.contextLimit > 0.7
                          ? 'bg-yellow-500'
                          : 'bg-green-500',
                    )}
                    style={{
                      width: `${Math.min((sandbox.currentTokens / sandbox.contextLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Thinking toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-2">
                  <Brain size={14} className="text-amber-400" />
                  Extended Thinking
                </span>
                <button
                  onClick={toggleThinking}
                  className={clsx(
                    'relative w-10 h-5 rounded-full transition-colors',
                    sandbox.thinkingEnabled ? 'bg-[#238636]' : 'bg-[#30363d]',
                  )}
                >
                  <span
                    className={clsx(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                      sandbox.thinkingEnabled ? 'left-5' : 'left-0.5',
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
