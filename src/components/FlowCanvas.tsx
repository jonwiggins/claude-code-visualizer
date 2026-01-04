import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import { useVisualizerStore } from '../store';
import FlowNode from './FlowNode';
import { overviewEdges, categoryColors } from '../algorithmOverview';

const nodeTypes = {
  custom: FlowNode,
};

// Node dimensions for layout calculation
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

// Layout options for different modes
interface LayoutOptions {
  direction: 'TB' | 'LR';
  nodesep: number;
  ranksep: number;
  isOverview?: boolean;
}

// Use dagre for automatic hierarchical layout
function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = { direction: 'TB', nodesep: 60, ranksep: 80 }
) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: options.direction,
    nodesep: options.nodesep,
    ranksep: options.ranksep,
    marginx: 50,
    marginy: 50,
    ranker: 'tight-tree', // Better for complex graphs
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to the graph (skip loop-back edges for layout calculation to reduce tangles)
  const loopBackEdges = new Set(['response-user-input', 'hook-stop-model-inference', 'compaction-model-inference', 'context-check-model-inference']);

  edges.forEach((edge) => {
    const edgeId = `${edge.source}-${edge.target}`;
    // Include loop-back edges in layout unless it's an overview
    if (!options.isOverview || !loopBackEdges.has(edgeId)) {
      g.setEdge(edge.source, edge.target);
    }
  });

  // Run the layout algorithm
  Dagre.layout(g);

  // Get the positioned nodes
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

export function FlowCanvas() {
  const { executionLog, currentStep, selectedNodeId, selectNode, currentScenario } = useVisualizerStore();

  const isOverview = currentScenario?.id === 'algorithm-overview';

  const { nodes, edges } = useMemo(() => {
    if (executionLog.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Generate nodes from execution log
    const nodeMap = new Map<string, Node>();

    executionLog.forEach((step, index) => {
      const status =
        index < currentStep
          ? 'completed'
          : index === currentStep
          ? 'active'
          : 'idle';

      // For overview, get category from payload
      const category = step.payload?.category as string | undefined;

      // Only add node if not already present (handles duplicate node IDs)
      if (!nodeMap.has(step.nodeId)) {
        nodeMap.set(step.nodeId, {
          id: step.nodeId,
          type: 'custom',
          position: { x: 0, y: 0 }, // Will be set by dagre
          data: {
            label: step.description,
            nodeType: category || step.nodeId,
            status,
            description: isOverview
              ? step.payload?.summary
              : (step.payload ? Object.keys(step.payload).join(', ') : undefined),
          },
          selected: step.nodeId === selectedNodeId,
        });
      } else {
        // Update status if node already exists
        const existing = nodeMap.get(step.nodeId)!;
        nodeMap.set(step.nodeId, {
          ...existing,
          data: {
            ...existing.data,
            status,
          },
          selected: step.nodeId === selectedNodeId,
        });
      }
    });

    // Generate edges
    let edgeList: Edge[] = [];
    const edgeSet = new Set<string>();

    if (isOverview) {
      // Use the predefined overview edges for proper algorithm flow
      const nodeIds = new Set(executionLog.map(s => s.nodeId));

      overviewEdges.forEach((edge) => {
        // Only include edges where both nodes exist
        if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
          const edgeId = `${edge.source}-${edge.target}`;
          if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId);

            // Style loop-back edges differently (dashed, muted color)
            const isLoopBack = edge.isLoopBack;

            edgeList.push({
              id: edgeId,
              source: edge.source,
              target: edge.target,
              type: 'smoothstep',
              label: edge.label,
              labelStyle: {
                fontSize: 9,
                fill: isLoopBack ? '#484f58' : '#8b949e'
              },
              labelBgStyle: { fill: '#0d1117', fillOpacity: 0.9 },
              labelBgPadding: [4, 2] as [number, number],
              style: {
                stroke: isLoopBack ? '#21262d' : '#30363d',
                strokeWidth: isLoopBack ? 1 : 1.5,
                strokeDasharray: isLoopBack ? '4 4' : undefined,
              },
            });
          }
        }
      });
    } else {
      // Generate edges from execution log sequence for scenarios
      for (let i = 0; i < executionLog.length - 1; i++) {
        const current = executionLog[i];
        const next = executionLog[i + 1];

        const edgeId = `${current.nodeId}-${next.nodeId}`;
        if (edgeSet.has(edgeId)) continue;
        edgeSet.add(edgeId);

        const isActive = i === currentStep || i === currentStep - 1;

        edgeList.push({
          id: edgeId,
          source: current.nodeId,
          target: next.nodeId,
          type: 'smoothstep',
          animated: isActive,
          style: {
            stroke: isActive ? '#58a6ff' : '#30363d',
            strokeWidth: isActive ? 2 : 1,
          },
        });
      }
    }

    const nodeArray = Array.from(nodeMap.values());

    // Apply dagre layout with different settings for overview
    const layoutOptions: LayoutOptions = isOverview
      ? { direction: 'TB', nodesep: 100, ranksep: 100, isOverview: true }
      : { direction: 'TB', nodesep: 60, ranksep: 80 };

    return getLayoutedElements(nodeArray, edgeList, layoutOptions);
  }, [executionLog, currentStep, selectedNodeId, isOverview]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  if (executionLog.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0d1117] rounded-lg border border-[#30363d]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">{'>'}_</div>
          <p className="text-[#8b949e]">Select a scenario to visualize the algorithm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden border border-[#30363d]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#30363d"
        />
        <Controls
          className="!bg-[#161b22] !border-[#30363d] !rounded-lg [&>button]:!bg-[#161b22] [&>button]:!border-[#30363d] [&>button]:!text-[#c9d1d9] [&>button:hover]:!bg-[#30363d]"
        />
        <MiniMap
          nodeColor={(node) => {
            const status = (node.data as any).status;
            if (status === 'active') return '#238636';
            if (status === 'completed') return '#58a6ff';
            return '#30363d';
          }}
          maskColor="rgba(13, 17, 23, 0.8)"
          className="!bg-[#161b22] !border-[#30363d]"
        />
      </ReactFlow>
    </div>
  );
}
