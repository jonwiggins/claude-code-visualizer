import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Play,
  Zap,
  FileText,
  MessageSquare,
  Brain,
  GitBranch,
  Wrench,
  Shield,
  Cog,
  CheckCircle,
  XCircle,
  Users,
  Square,
} from 'lucide-react';
import clsx from 'clsx';

interface FlowNodeProps {
  data: {
    label: string;
    nodeType: string;
    status: 'idle' | 'active' | 'completed' | 'error' | 'skipped';
    description?: string;
  };
  selected: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  'session-start': Play,
  hook: Zap,
  'context-load': FileText,
  'user-input': MessageSquare,
  'model-inference': Brain,
  decision: GitBranch,
  'tool-call': Wrench,
  'tool-decision': GitBranch,
  'permission-check': Shield,
  'tool-execution': Cog,
  'result-integration': CheckCircle,
  subagent: Users,
  'subagent-spawn': Users,
  'subagent-exec': Cog,
  'subagent-complete': CheckCircle,
  stop: Square,
  response: MessageSquare,
  'tool-blocked': XCircle,
  'user-approval': Shield,
  compaction: FileText,
  'context-check': FileText,
};

const colorMap: Record<string, string> = {
  'session-start': 'border-green-500 bg-green-500/10',
  hook: 'border-purple-500 bg-purple-500/10',
  'context-load': 'border-blue-500 bg-blue-500/10',
  'user-input': 'border-cyan-500 bg-cyan-500/10',
  'model-inference': 'border-amber-500 bg-amber-500/10',
  decision: 'border-amber-500 bg-amber-500/10',
  'tool-decision': 'border-amber-500 bg-amber-500/10',
  'tool-call': 'border-orange-500 bg-orange-500/10',
  'permission-check': 'border-yellow-500 bg-yellow-500/10',
  'tool-execution': 'border-orange-500 bg-orange-500/10',
  'result-integration': 'border-green-500 bg-green-500/10',
  subagent: 'border-blue-400 bg-blue-400/10',
  'subagent-spawn': 'border-blue-400 bg-blue-400/10',
  'subagent-exec': 'border-blue-300 bg-blue-300/10',
  'subagent-complete': 'border-blue-500 bg-blue-500/10',
  stop: 'border-red-500 bg-red-500/10',
  response: 'border-green-500 bg-green-500/10',
  'tool-blocked': 'border-red-500 bg-red-500/10',
  'user-approval': 'border-yellow-500 bg-yellow-500/10',
  compaction: 'border-purple-400 bg-purple-400/10',
  'context-check': 'border-yellow-400 bg-yellow-400/10',
};

function FlowNode({ data, selected }: FlowNodeProps) {
  const nodeType = data.nodeType.split('-').slice(0, 2).join('-');
  const Icon = iconMap[nodeType] || iconMap[data.nodeType.split('-')[0]] || Cog;
  const colorClass =
    colorMap[nodeType] || colorMap[data.nodeType.split('-')[0]] || 'border-gray-500 bg-gray-500/10';

  const statusClasses = {
    idle: 'opacity-50',
    active: 'node-active ring-2 ring-green-500 ring-offset-2 ring-offset-[#0d1117]',
    completed: 'opacity-100',
    error: 'ring-2 ring-red-500',
    skipped: 'opacity-30 line-through',
  };

  return (
    <div
      className={clsx(
        'px-3 py-2 rounded-lg border-2 min-w-[160px] max-w-[220px] transition-all duration-300',
        colorClass,
        statusClasses[data.status],
        selected && 'ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#0d1117]',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#30363d] !border-[#58a6ff] !w-2.5 !h-2.5"
      />
      <div className="flex items-center gap-2">
        <Icon
          size={16}
          className={clsx(
            'flex-none',
            data.status === 'active' && 'text-green-400',
            data.status === 'error' && 'text-red-400',
            data.status === 'completed' && 'text-[#c9d1d9]',
          )}
        />
        <span className="text-[13px] font-medium leading-tight">{data.label}</span>
      </div>
      {data.description && data.status === 'active' && (
        <p className="text-xs text-[#8b949e] mt-1 truncate">{data.description}</p>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#30363d] !border-[#58a6ff] !w-2.5 !h-2.5"
      />
    </div>
  );
}

export default memo(FlowNode);
