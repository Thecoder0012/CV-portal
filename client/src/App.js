import { Routes, Route } from "react-router-dom";
import { RegisterManager } from "./components/RegisterManager.js";
import { Register } from "./components/Register.js";
import { RegisterPerson } from "./components/RegisterPerson.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterManager />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registerPerson" element={<RegisterPerson />} />
    </Routes>
  );
}

export default App;
