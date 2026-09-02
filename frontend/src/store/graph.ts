/** Zustand store for the current graph + selection. */

import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  emptyGraph,
  type Graph,
  type NodeConfig,
  type NodeKind,
  type Edge,
} from "../lib/schema";

interface GraphState {
  graph: Graph;
  selectedNodeId: string | null;
  addNode: (kind: NodeKind, position: { x: number; y: number }) => void;
  updateNode: (id: string, patch: Partial<NodeConfig>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Omit<Edge, "id">) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  graph: emptyGraph(),
  selectedNodeId: null,

  addNode: (kind, position) =>
    set((s) => ({
      graph: {
        ...s.graph,
        nodes: [
          ...s.graph.nodes,
          {
            id: nanoid(8),
            kind,
            label: kind,
            position,
            inputs: { in: "any" },
            outputs: { out: "any" },
            config: {},
          },
        ],
      },
    })),

  updateNode: (id, patch) =>
    set((s) => ({
      graph: {
        ...s.graph,
        nodes: s.graph.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      },
    })),

  removeNode: (id) =>
    set((s) => ({
      graph: {
        ...s.graph,
        nodes: s.graph.nodes.filter((n) => n.id !== id),
        edges: s.graph.edges.filter((e) => e.source !== id && e.target !== id),
      },
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  addEdge: (edge) =>
    set((s) => ({
      graph: {
        ...s.graph,
        edges: [...s.graph.edges, { id: nanoid(8), ...edge }],
      },
    })),

  removeEdge: (id) =>
    set((s) => ({
      graph: { ...s.graph, edges: s.graph.edges.filter((e) => e.id !== id) },
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  reset: () => set({ graph: emptyGraph(), selectedNodeId: null }),
}));