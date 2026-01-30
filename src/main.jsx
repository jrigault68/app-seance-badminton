import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./contexts/UserContext";
import { PageTitleProvider } from "./contexts/PageTitleContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import DynamicTitle from "./components/DynamicTitle";

import "./index.css";

// Lazy load des pages : chaque route charge son .jsx uniquement à la navigation
const Accueil = lazy(() => import("./pages/Accueil"));
const ConnexionInscription = lazy(() => import("./pages/ConnexionInscription"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));
const Profil = lazy(() => import("./pages/Profil"));
const Seances = lazy(() => import("./pages/Seances"));
const SeanceDetail = lazy(() => import("./pages/SeanceDetail"));
const SeanceExecution = lazy(() => import("./pages/SeanceExecution"));
const Programmes = lazy(() => import("./pages/Programmes"));
const ProgrammeDetail = lazy(() => import("./pages/ProgrammeDetail"));
const AdminExercices = lazy(() => import("./pages/AdminExercices"));
const AdminUtilisateurs = lazy(() => import("./pages/AdminUtilisateurs"));
const AdminUtilisateurDetail = lazy(() => import("./pages/AdminUtilisateurDetail"));
const AdminSeances = lazy(() => import("./pages/AdminSeances"));
const AdminZones = lazy(() => import("./pages/AdminZones"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const Exercices = lazy(() => import("./pages/Exercices"));
const ExerciceDetail = lazy(() => import("./pages/ExerciceDetail"));

/**
 * Prefetch des pages "grand public" en arrière-plan après le premier affichage.
 * Les chunks sont mis en cache : au clic, la navigation est quasi instantanée.
 * On ne précharge pas les pages admin (réservées à quelques utilisateurs).
 */
function prefetchPublicPages() {
  const publicPages = [
    () => import("./pages/Seances"),
    () => import("./pages/Programmes"),
    () => import("./pages/Exercices"),
    () => import("./pages/ConnexionInscription"),
    () => import("./pages/Profil"),
    () => import("./pages/Accueil"),
  ];
  publicPages.forEach((load) => load().catch(() => {}));
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white" role="status" aria-label="Chargement">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Chargement...</span>
      </div>
    </div>
  );
}

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
    path: "/admin-utilisateurs",
    element: <AdminUtilisateurs />,
    requireAuth: true,
  },
  {
    path: "/admin-utilisateurs/:id",
    element: <AdminUtilisateurDetail />,
    requireAuth: true,
  },
  {
    path: "/admin-seances",
    element: <AdminSeances />,
    requireAuth: true,
  },
  {
    path: "/admin-zones",
    element: <AdminZones />,
    requireAuth: true,
  },
  {
    path: "/admin-categories",
    element: <AdminCategories />,
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

// Prefetch des pages publiques en arrière-plan (après que la 1ère page soit bien chargée, pour ne pas concurrencer)
const PREFETCH_DELAY_MS = 5000;
const schedulePrefetch = () => {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => prefetchPublicPages(), { timeout: PREFETCH_DELAY_MS });
  } else {
    setTimeout(prefetchPublicPages, PREFETCH_DELAY_MS);
  }
};
schedulePrefetch();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);