import { useGraphStore } from "../store/graph";

export function Inspector() {
  const graph = useGraphStore((s) => s.graph);
  const selectedId = useGraphStore((s) => s.selectedNodeId);
  const selected = graph.nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="inspector">
      <h3>Inspector</h3>
      {selected ? (
        <dl>
          <dt>ID</dt>
          <dd>{selected.id}</dd>
          <dt>Kind</dt>
          <dd>{selected.kind}</dd>
          <dt>Label</dt>
          <dd>{selected.label}</dd>
          <dt>Position</dt>
          <dd>
            ({selected.position.x.toFixed(0)}, {selected.position.y.toFixed(0)})
          </dd>
        </dl>
      ) : (
        <p className="muted small">Select a node to inspect.</p>
      )}
      <h3>Stats</h3>
      <p className="muted small">
        nodes: {graph.nodes.length} · edges: {graph.edges.length}
      </p>
    </div>
  );
}