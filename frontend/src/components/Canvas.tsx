import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useGraphStore } from "../store/graph";
import type { NodeKind } from "../lib/schema";

const kindToType: Record<NodeKind, string> = {
  llm: "llmNode",
  tool: "toolNode",
  router: "routerNode",
  "human-gate": "humanGateNode",
  subgraph: "subgraphNode",
  memory: "memoryNode",
};

const rfNodeToInternal = (n: Node): import("../lib/schema").NodeConfig => ({
  id: n.id,
  kind: (Object.keys(kindToType).find((k) => kindToType[k as NodeKind] === n.type) ??
    "llm") as NodeKind,
  label: (n.data?.label as string) ?? n.id,
  position: n.position,
  inputs: {},
  outputs: {},
  config: {},
});

const internalToRfNode = (n: import("../lib/schema").NodeConfig): Node => ({
  id: n.id,
  type: kindToType[n.kind],
  position: n.position,
  data: { label: n.label },
});

export function Canvas() {
  const graph = useGraphStore((s) => s.graph);
  const addNode = useGraphStore((s) => s.addNode);
  const addEdgeStore = useGraphStore((s) => s.addEdge);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(graph.nodes.map(internalToRfNode));
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(graph.edges);

  // Sync internal -> RF (when store changes)
  if (
    rfNodes.length !== graph.nodes.length ||
    rfNodes.some((n, i) => n.id !== graph.nodes[i]?.id)
  ) {
    setRfNodes(graph.nodes.map(internalToRfNode));
  }
  if (
    rfEdges.length !== graph.edges.length ||
    rfEdges.some((e, i) => e.id !== graph.edges[i]?.id)
  ) {
    setRfEdges(graph.edges);
  }

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      addEdgeStore({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
      });
      setRfEdges((eds) => addEdge({ ...params, id: `e-${Date.now()}` }, eds));
    },
    [addEdgeStore, setRfEdges],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData("application/agent-builder-kind") as NodeKind;
      if (!kind) return;
      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      addNode(kind, {
        x: event.clientX - bounds.left - 60,
        y: event.clientY - bounds.top - 30,
      });
    },
    [addNode],
  );

  return (
    <div
      className="canvas-host"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}