import { Routes, Route } from "react-router-dom";
import { RegisterManager } from "./components/RegisterManager.js";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { RegisterPerson } from "./components/CvProfile.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterManager />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cv" element={<RegisterPerson />} />
    </Routes>
  );
}

export default App;
