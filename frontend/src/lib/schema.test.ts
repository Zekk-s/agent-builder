import { describe, it, expect } from "vitest";
import { GraphSchema, emptyGraph, NODE_CATALOG } from "./schema";

describe("graph schema", () => {
  it("accepts an empty graph", () => {
    const g = emptyGraph();
    expect(GraphSchema.parse(g)).toEqual(g);
  });

  it("rejects an unknown node kind", () => {
    expect(() =>
      GraphSchema.parse({
        version: 1,
        nodes: [{ id: "n1", kind: "alien", label: "x", position: { x: 0, y: 0 } }],
        edges: [],
      }),
    ).toThrow();
  });

  it("exposes the canonical node catalog", () => {
    const kinds = NODE_CATALOG.map((n) => n.kind);
    expect(kinds).toContain("llm");
    expect(kinds).toContain("human-gate");
  });
});