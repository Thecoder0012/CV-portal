import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cv" element={<CvProfile />} />
    </Routes>
  );
}

export default App;
