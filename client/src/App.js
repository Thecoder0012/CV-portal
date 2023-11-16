import { Routes, Route } from "react-router-dom";
import { RegisterManager } from "./components/RegisterManager.js";
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterManager />} />
    </Routes>
  );
}

export default App;
