import { Routes, Route } from "react-router-dom";
import { Register } from "./components/Register.js";
import { Login } from "./components/Login.js";
import { CvProfile } from "./components/CvProfile.js";
import { RegisterManager } from "./components/RegisterManager.js";
import { CreateProject } from "./components/CreateProject.js";
import { ProjectDetails } from "./components/ProjectDetails.js";
import  {UpdatePerson} from "./components/UpdatePerson.js";
import {Projects} from "./components/Projects.js";
import {SearchSkills} from "./components/SearchSkills.js";
import { MainPage } from "./components/MainPage.js";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.js";
import { NotFound } from "./utils/NotFound.js";
import { ManagerProjects } from "./components/ManagerProjects.js";
import { ProjectAssignment } from "./components/ProjectAssignment.js";



function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/cv" element={<CvProfile />} />
        <Route path="/registerManager" element={<RegisterManager />} />
        <Route path="/createProject" element={<CreateProject />} />
        <Route path="/profile/update/:id" element={<UpdatePerson />} />
        <Route path="/project/:id" element={<ProjectDetails/>}/>
        <Route path="/projects" element={<Projects />} />
        <Route path="/searchSkills" element={<SearchSkills />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/manager/projects" element={<ManagerProjects />} />
        <Route path="/manager/assignEmployees" element={<ProjectAssignment />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
