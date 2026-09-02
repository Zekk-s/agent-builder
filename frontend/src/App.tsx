import { ReactFlowProvider } from "reactflow";
import { Canvas } from "./components/Canvas";
import { NodeCatalog } from "./components/NodeCatalog";
import { Inspector } from "./components/Inspector";

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
        <header className="topbar">
          <h1>agent-builder</h1>
          <span className="muted">visual agent orchestration</span>
        </header>
        <aside className="left">
          <NodeCatalog />
        </aside>
        <main className="canvas">
          <Canvas />
        </main>
        <aside className="right">
          <Inspector />
        </aside>
      </div>
    </ReactFlowProvider>
  );
}