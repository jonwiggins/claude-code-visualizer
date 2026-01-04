import { useVisualizerStore } from '../store';
import { Play, FileText, Users, Shield, Zap, Database, ChevronRight, Terminal, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const scenarioIcons: Record<string, React.ElementType> = {
  'algorithm-overview': BookOpen,
  'simple-read': FileText,
  'multi-tool': Play,
  'subagent-delegation': Users,
  'permission-denied': Shield,
  'hook-blocking': Zap,
  'context-compaction': Database,
};

export function ScenarioPicker() {
  const { scenarios, currentScenario, selectScenario } = useVisualizerStore();

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#30363d]">
        <h3 className="text-sm font-semibold">Scenarios</h3>
      </div>

      {/* Scenario list */}
      <div className="max-h-[250px] overflow-auto border-b border-[#30363d]">
        {scenarios.map((scenario, index) => {
          const Icon = scenarioIcons[scenario.id] || Play;
          const isSelected = currentScenario?.id === scenario.id;
          const isOverview = scenario.id === 'algorithm-overview';

          return (
            <button
              key={scenario.id}
              onClick={() => selectScenario(scenario.id)}
              className={clsx(
                'w-full px-3 py-2 text-left border-b border-[#30363d] last:border-0 transition-colors flex items-center gap-2',
                isSelected
                  ? 'bg-[#1f6feb]/20 border-l-2 border-l-[#58a6ff]'
                  : 'hover:bg-[#1f2428]',
                isOverview && !isSelected && 'bg-[#238636]/10',
                isOverview && index === 0 && 'border-b-2 border-b-[#30363d]'
              )}
            >
              <Icon
                size={14}
                className={clsx(
                  'flex-shrink-0',
                  isSelected ? 'text-[#58a6ff]' : isOverview ? 'text-[#3fb950]' : 'text-[#8b949e]'
                )}
              />
              <span className={clsx(
                'text-sm font-medium flex-1 truncate',
                isOverview && !isSelected && 'text-[#3fb950]'
              )}>
                {scenario.name}
              </span>
              {isOverview && !isSelected && (
                <span className="text-[9px] bg-[#238636]/30 text-[#3fb950] px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Start
                </span>
              )}
              {isSelected && (
                <ChevronRight size={14} className="text-[#58a6ff] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected scenario details */}
      {currentScenario ? (
        <div className="p-3 space-y-3">
          <div>
            <h4 className="text-xs text-[#8b949e] uppercase tracking-wide mb-1">Description</h4>
            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              {currentScenario.description}
            </p>
          </div>

          {currentScenario.id !== 'algorithm-overview' && (
            <div>
              <h4 className="text-xs text-[#8b949e] uppercase tracking-wide mb-1">User Command</h4>
              <div className="bg-[#0d1117] rounded-lg p-2 flex items-start gap-2">
                <Terminal size={14} className="text-[#58a6ff] flex-shrink-0 mt-0.5" />
                <code className="text-xs text-[#58a6ff] break-words">
                  {currentScenario.userCommand}
                </code>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs text-[#8b949e] uppercase tracking-wide mb-1">
              {currentScenario.id === 'algorithm-overview' ? 'Components' : 'Steps'}
            </h4>
            <p className="text-sm text-[#c9d1d9]">
              {currentScenario.steps.length} {currentScenario.id === 'algorithm-overview' ? 'algorithm nodes' : 'execution steps'}
            </p>
          </div>

          {currentScenario.sandboxOverrides && (
            <div>
              <h4 className="text-xs text-[#8b949e] uppercase tracking-wide mb-1">Sandbox Overrides</h4>
              <div className="text-xs text-[#f0883e] bg-[#f0883e]/10 rounded px-2 py-1">
                This scenario modifies sandbox settings
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-[#8b949e]">
          Select a scenario to see details
        </div>
      )}
    </div>
  );
}
