import { useVisualizerStore } from '../store';
import { CodeBlock } from './CodeBlock';
import { X, FileJson, Terminal } from 'lucide-react';

export function DetailPanel() {
  const { selectedNodeId, executionLog, selectNode } = useVisualizerStore();

  if (!selectedNodeId) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
        <div className="text-center text-sm text-[#8b949e]">
          <FileJson size={32} className="mx-auto mb-2 opacity-50" />
          Click on a node or log entry to see details
        </div>
      </div>
    );
  }

  const step = executionLog.find((s) => s.nodeId === selectedNodeId);
  if (!step) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
        <div className="text-center text-sm text-[#8b949e]">Node not yet executed</div>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Terminal size={16} className="text-[#58a6ff]" />
          Node Details
        </h3>
        <button
          onClick={() => selectNode(null)}
          className="p-1 hover:bg-[#30363d] rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-3 max-h-[400px] overflow-auto">
        <div className="mb-4">
          <span className="text-xs text-[#8b949e]">Node ID</span>
          <p className="text-sm font-mono text-[#58a6ff]">{step.nodeId}</p>
        </div>

        <div className="mb-4">
          <span className="text-xs text-[#8b949e]">Description</span>
          <p className="text-sm text-[#c9d1d9]">{step.description}</p>
        </div>

        <div className="mb-4">
          <span className="text-xs text-[#8b949e]">Timestamp</span>
          <p className="text-sm font-mono text-[#c9d1d9]">{step.timestamp}ms</p>
        </div>

        {step.payload && (
          <div className="mb-4">
            <span className="text-xs text-[#8b949e] block mb-2">Payload</span>
            <CodeBlock code={JSON.stringify(step.payload, null, 2)} language="json" />
          </div>
        )}

        {step.result && (
          <div>
            <span className="text-xs text-[#8b949e] block mb-2">Result</span>
            <CodeBlock code={JSON.stringify(step.result, null, 2)} language="json" />
          </div>
        )}
      </div>
    </div>
  );
}
