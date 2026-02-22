import { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import {
  overviewNodes,
  overviewEdges,
  categoryColors,
  type OverviewNode,
} from '../algorithmOverview';
import { CodeBlock } from './CodeBlock';
import { BookOpen, X } from 'lucide-react';
import clsx from 'clsx';

// Node dimensions
const NODE_WIDTH = 160;
const NODE_HEIGHT = 50;

// Custom node component for overview
function OverviewFlowNode({
  data,
  selected,
}: {
  data: Record<string, unknown>;
  selected: boolean;
}) {
  const colorClass =
    categoryColors[data.category as OverviewNode['category']] || 'border-gray-500 bg-gray-500/10';

  return (
    <div
      className={clsx(
        'px-3 py-2 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer',
        colorClass,
        selected && 'ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#0d1117]',
        !selected && 'hover:ring-1 hover:ring-[#58a6ff]/50',
      )}
      style={{ minWidth: NODE_WIDTH, maxWidth: NODE_WIDTH }}
    >
      <span className="text-xs font-medium leading-tight block">{data.label}</span>
    </div>
  );
}

const nodeTypes = {
  overview: OverviewFlowNode,
};

// Use dagre for layout
function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: 'TB',
    nodesep: 40,
    ranksep: 60,
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function AlgorithmOverview() {
  const [selectedNode, setSelectedNode] = useState<OverviewNode | null>(null);

  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = overviewNodes.map((node) => ({
      id: node.id,
      type: 'overview',
      position: { x: 0, y: 0 },
      data: {
        label: node.label,
        category: node.category,
      },
      selected: selectedNode?.id === node.id,
    }));

    const flowEdges: Edge[] = overviewEdges.map((edge, index) => ({
      id: `e-${index}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      label: edge.label,
      labelStyle: { fontSize: 9, fill: '#8b949e' },
      labelBgStyle: { fill: '#0d1117', fillOpacity: 0.8 },
      style: {
        stroke: '#30363d',
        strokeWidth: 1,
      },
    }));

    return getLayoutedElements(flowNodes, flowEdges);
  }, [selectedNode]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const overviewNode = overviewNodes.find((n) => n.id === node.id);
    setSelectedNode(overviewNode || null);
  }, []);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
      <div className="p-3 border-b border-[#30363d] flex items-center gap-2">
        <BookOpen size={16} className="text-[#58a6ff]" />
        <h3 className="text-sm font-semibold">Algorithm Overview</h3>
      </div>

      {/* Mini flow canvas */}
      <div className="h-[300px] border-b border-[#30363d]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.3}
          maxZoom={1.5}
          panOnScroll
          zoomOnScroll
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#30363d" />
          <Controls
            showInteractive={false}
            className="!bg-[#161b22] !border-[#30363d] !rounded [&>button]:!bg-[#161b22] [&>button]:!border-[#30363d] [&>button]:!text-[#c9d1d9] [&>button]:!w-6 [&>button]:!h-6 [&>button:hover]:!bg-[#30363d]"
          />
        </ReactFlow>
      </div>

      {/* Node details panel */}
      <div className="flex-1 overflow-auto min-h-[150px] max-h-[300px]">
        {selectedNode ? (
          <div className="p-3 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={clsx(
                    'text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded font-semibold',
                    selectedNode.category === 'session' && 'bg-green-500/20 text-green-400',
                    selectedNode.category === 'context' && 'bg-blue-500/20 text-blue-400',
                    selectedNode.category === 'loop' && 'bg-amber-500/20 text-amber-400',
                    selectedNode.category === 'tool' && 'bg-orange-500/20 text-orange-400',
                    selectedNode.category === 'hook' && 'bg-purple-500/20 text-purple-400',
                    selectedNode.category === 'subagent' && 'bg-cyan-500/20 text-cyan-400',
                    selectedNode.category === 'output' && 'bg-emerald-500/20 text-emerald-400',
                  )}
                >
                  {selectedNode.category}
                </span>
                <h4 className="text-sm font-semibold mt-1">{selectedNode.label}</h4>
                <p className="text-xs text-[#8b949e]">{selectedNode.description}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-[#30363d] rounded transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <div>
              <p className="text-xs text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                {selectedNode.details}
              </p>
            </div>

            {selectedNode.codeExample && (
              <div>
                <span className="text-[10px] text-[#8b949e] uppercase tracking-wide block mb-1">
                  Example
                </span>
                <CodeBlock code={selectedNode.codeExample} language="json" />
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-[#8b949e]">Click a node to see details</div>
        )}
      </div>

      {/* Legend */}
      <div className="p-2 border-t border-[#30363d] flex flex-wrap gap-2 justify-center">
        {[
          { category: 'session', label: 'Session' },
          { category: 'context', label: 'Context' },
          { category: 'loop', label: 'Loop' },
          { category: 'tool', label: 'Tool' },
          { category: 'hook', label: 'Hook' },
          { category: 'subagent', label: 'Agent' },
        ].map(({ category, label }) => (
          <div key={category} className="flex items-center gap-1">
            <div
              className={clsx(
                'w-2 h-2 rounded-sm border',
                categoryColors[category as OverviewNode['category']],
              )}
            />
            <span className="text-[10px] text-[#8b949e]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
