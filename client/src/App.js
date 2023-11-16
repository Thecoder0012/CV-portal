import { Routes, Route } from "react-router-dom";
import { RegisterManager } from "./components/RegisterManager.js";
import { Register } from "./components/Register.jsx";
import { Login } from "./components/Login.jsx";
import { RegisterPerson } from "./components/RegisterPerson.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterManager />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registerPerson" element={<RegisterPerson />} />
    </Routes>
  );
}

export default App;
