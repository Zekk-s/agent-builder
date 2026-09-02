/** Shared types for the agent-builder graph. */

import { z } from "zod";

export const NodeKindSchema = z.enum([
  "llm",
  "tool",
  "router",
  "human-gate",
  "subgraph",
  "memory",
]);
export type NodeKind = z.infer<typeof NodeKindSchema>;

export const NodeConfigSchema = z.object({
  id: z.string(),
  kind: NodeKindSchema,
  label: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  inputs: z.record(z.string()).default({}),
  outputs: z.record(z.string()).default({}),
  config: z.record(z.unknown()).default({}),
});
export type NodeConfig = z.infer<typeof NodeConfigSchema>;

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceHandle: z.string().optional(),
  target: z.string(),
  targetHandle: z.string().optional(),
  contract: z
    .object({
      inputSchema: z.string().optional(),
      outputSchema: z.string().optional(),
    })
    .default({}),
});
export type Edge = z.infer<typeof EdgeSchema>;

export const GraphSchema = z.object({
  version: z.literal(1),
  nodes: z.array(NodeConfigSchema),
  edges: z.array(EdgeSchema),
});
export type Graph = z.infer<typeof GraphSchema>;

export const emptyGraph = (): Graph => ({
  version: 1,
  nodes: [],
  edges: [],
});

export const NODE_CATALOG: { kind: NodeKind; label: string; description: string }[] = [
  { kind: "llm", label: "LLM", description: "Run a prompt through a model provider." },
  { kind: "tool", label: "Tool", description: "Call an external function or API." },
  { kind: "router", label: "Router", description: "Branch flow based on a predicate." },
  { kind: "human-gate", label: "Human Gate", description: "Pause until a human approves." },
  { kind: "subgraph", label: "Sub-graph", description: "Embed another graph by reference." },
  { kind: "memory", label: "Memory", description: "Read/write persistent state." },
];