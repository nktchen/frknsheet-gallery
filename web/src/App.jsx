import "./App.css";
import UploadForm from "./components/UploadForm/UploadForm.jsx";
import ProjectsScreen from "./components/screens/ProjectsScreen/ProjectsScreen.jsx";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Project from "./components/Project/Project.jsx";
import Header from "./components/Header/Header.jsx";

const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ProjectsScreen />} />
          <Route path="projects" element={<ProjectsScreen />} />
          <Route path="projects/:id" element={<Project />} />
        </Route>
        <Route path="/admin" element={<AppLayout />}>
          <Route path="upload" element={<UploadForm />} />
          <Route path="projects" element={<ProjectsScreen />} />
          <Route path="projects/:id" element={<Project />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
