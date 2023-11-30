import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";
import { RegisterManager } from "./components/RegisterManager.js";
import  {UpdateEmployee} from "./components/UpdateEmployee.js";
import  { SingleProject } from "./components/SingleProject.js";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.js";
import { NotFound } from "./utils/NotFound.js";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/cv" element={<CvProfile />} />
        <Route path="/registerManager" element={<RegisterManager />} />
        <Route path="/employee/update" element={<UpdateEmployee />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />     
      <Route path="*" element={<NotFound />} />
      <Route path="/singleProject/:id" element={<SingleProject />} />
    </Routes>
  );
}

export default App;
