import ReactFlow, { type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Start Task" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Process Data" },
  },
  {
    id: "3",
    position: { x: 200, y: 100 },
    data: { label: "Validate Results" },
  },
  {
    id: "4",
    position: { x: 100, y: 200 },
    data: { label: "Complete Task" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e2-4", source: "2", target: "4" },
];

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
}

export default App;
