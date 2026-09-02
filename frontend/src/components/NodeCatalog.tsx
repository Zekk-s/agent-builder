import { NODE_CATALOG, type NodeKind } from "../lib/schema";
import { useGraphStore } from "../store/graph";

export function NodeCatalog() {
  const addNode = useGraphStore((s) => s.addNode);

  const onDragStart = (event: React.DragEvent, kind: NodeKind) => {
    event.dataTransfer.setData("application/agent-builder-kind", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="catalog">
      <h3>Nodes</h3>
      <p className="muted small">Drag onto canvas</p>
      <ul>
        {NODE_CATALOG.map((entry) => (
          <li
            key={entry.kind}
            draggable
            onDragStart={(e) => onDragStart(e, entry.kind)}
            className="catalog-item"
          >
            <strong>{entry.label}</strong>
            <span className="muted small">{entry.description}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="reset"
        onClick={() => useGraphStore.getState().reset()}
      >
        Reset canvas
      </button>
    </div>
  );
}