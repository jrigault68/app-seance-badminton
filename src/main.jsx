import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./contexts/UserContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Accueil from "./pages/Accueil";
import ConnexionInscription from "./pages/ConnexionInscription";
import AuthSuccess from "./pages/AuthSuccess";
import Profil from "./pages/Profil";
import PrivateRoute from "./components/PrivateRoute";
import Seances from "./pages/Seances";
import SeanceDetail from "./pages/SeanceDetail";
import SeanceExecution from "./pages/SeanceExecution";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import AdminExercices from "./pages/AdminExercices";
import Exercices from "./pages/Exercices";
import ExerciceDetail from "./pages/ExerciceDetail";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/profil",
    element: <UserProvider><PrivateRoute><Profil /></PrivateRoute></UserProvider>,
  },
  {
    path: "/auth-success",
    element: <UserProvider><AuthSuccess /></UserProvider>,
  },
  {
    path: "/login",
    element: <UserProvider><ConnexionInscription /></UserProvider>,
  },
  {
    path: "/",
    element: <UserProvider><Accueil /></UserProvider>,
  },
  {
    path: "/seances/:id/execution",
    element: <UserProvider><SeanceExecution /></UserProvider>,
  },
  {
    path: "/seances/:id",
    element: <UserProvider><SeanceDetail /></UserProvider>,
  },
  {
    path: "/seances",
    element: <UserProvider><Seances /></UserProvider>,
  },
  {
    path: "/programmes",
    element: <UserProvider><Programmes /></UserProvider>,
  },
  {
    path: "/programmes/:id",
    element: <UserProvider><ProgrammeDetail /></UserProvider>,
  },
  {
    path: "/exercices",
    element: <UserProvider><Exercices /></UserProvider>,
  },
  {
    path: "/exercices/new",
    element: <UserProvider><ExerciceDetail /></UserProvider>,
  },
  {
    path: "/exercices/:id",
    element: <UserProvider><ExerciceDetail /></UserProvider>,
  },
  {
    path: "/admin-exercices",
    element: <UserProvider><PrivateRoute><AdminExercices /></PrivateRoute></UserProvider>,
  },
  {
    path: "/seances/:id/modifier",
    element: <UserProvider><PrivateRoute><SeanceDetail mode="edit" /></PrivateRoute></UserProvider>,
  },

  {
    path: "*",
    element: <UserProvider><Accueil /></UserProvider>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);