import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./contexts/UserContext";
import { PageTitleProvider } from "./contexts/PageTitleContext";
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
import DynamicTitle from "./components/DynamicTitle";

import "./index.css";

// Composant wrapper pour encapsuler la structure commune
const PageWrapper = ({ children, requireAuth = false }) => {
  const content = (
    <PageTitleProvider>
      <DynamicTitle />
      <UserProvider>
        {requireAuth ? <PrivateRoute>{children}</PrivateRoute> : children}
      </UserProvider>
    </PageTitleProvider>
  );

  return content;
};

// Configuration des routes avec leurs éléments
const routes = [
  {
    path: "/profil",
    element: <Profil />,
    requireAuth: true,
  },
  {
    path: "/auth-success",
    element: <AuthSuccess />,
  },
  {
    path: "/login",
    element: <ConnexionInscription />,
  },
  {
    path: "/",
    element: <Accueil />,
  },
  {
    path: "/seances/:id/execution",
    element: <SeanceExecution />,
  },
  {
    path: "/seances/:id",
    element: <SeanceDetail />,
  },
  {
    path: "/seances",
    element: <Seances />,
  },
  {
    path: "/programmes",
    element: <Programmes />,
  },
  {
    path: "/programmes/:id",
    element: <ProgrammeDetail />,
  },
  {
    path: "/exercices",
    element: <Exercices />,
  },
  {
    path: "/exercices/new",
    element: <ExerciceDetail />,
  },
  {
    path: "/exercices/:id",
    element: <ExerciceDetail />,
  },
  {
    path: "/admin-exercices",
    element: <AdminExercices />,
    requireAuth: true,
  },
  {
    path: "/seances/:id/modifier",
    element: <SeanceDetail mode="edit" />,
    requireAuth: true,
  },
  {
    path: "*",
    element: <Accueil />,
  },
];

// Création du router avec la structure simplifiée
const router = createBrowserRouter(
  routes.map(({ path, element, requireAuth }) => ({
    path,
    element: <PageWrapper requireAuth={requireAuth}>{element}</PageWrapper>,
  }))
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);