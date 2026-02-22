import { useVisualizerStore } from '../store';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

export function ExecutionLog() {
  const { executionLog, currentStep, selectNode } = useVisualizerStore();

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#30363d]">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock size={16} className="text-[#58a6ff]" />
          Execution Log
        </h3>
      </div>

      <div className="max-h-[300px] overflow-auto">
        {executionLog.length === 0 ? (
          <div className="p-4 text-center text-sm text-[#8b949e]">
            Select a scenario and press Play to see the execution log
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {executionLog.map((step, index) => (
              <button
                key={`${step.nodeId}-${index}`}
                onClick={() => selectNode(step.nodeId)}
                className={clsx(
                  'w-full p-3 text-left hover:bg-[#1f2428] transition-colors',
                  index === currentStep && 'bg-[#1f2428]',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-[#8b949e] font-mono">
                    {(step.timestamp / 1000).toFixed(2)}s
                  </span>
                  <span
                    className={clsx(
                      'w-2 h-2 rounded-full',
                      index === currentStep ? 'bg-green-500' : 'bg-[#30363d]',
                    )}
                  />
                </div>
                <p className="text-sm text-[#c9d1d9] truncate">{step.description}</p>
                {step.payload && (
                  <p className="text-xs text-[#8b949e] truncate mt-1">
                    {Object.keys(step.payload).slice(0, 3).join(', ')}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
