import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";
import { RegisterManager } from "./components/RegisterManager.js";
import { CreateProject } from "./components/CreateProject.js";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cv" element={<CvProfile />} />
      <Route path="/registerManager" element={<RegisterManager />} />
      <Route path="/createProject" element={<CreateProject />} />
    </Routes>
  );
}

export default App;
