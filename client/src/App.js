import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";
import { RegisterManager } from "./components/RegisterManager.js";
import  {UpdateEmployee} from "./components/UpdateEmployee.js";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cv" element={<CvProfile />} />
      <Route path="/registerManager" element={<RegisterManager />} />
      <Route path="/employee/update" element={<UpdateEmployee />} />
    </Routes>
  );
}

export default App;
