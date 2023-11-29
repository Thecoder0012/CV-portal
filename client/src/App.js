import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";
import { RegisterManager } from "./components/RegisterManager.js";
import  {UpdateEmployee} from "./components/UpdateEmployee.js";
import {Projects} from "./components/Projects.js";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.js";
import { NotFound } from "./utils/NotFound.js";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/cv" element={<CvProfile />} />
        <Route path="/employee/update" element={<UpdateEmployee />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
      <Route path="/registerManager" element={<RegisterManager />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
