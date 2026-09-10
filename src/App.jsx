import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";
import { AdminThemeProvider } from "./context/adminThemeContext";

// Lazy load all public routes
const Home = lazy(() => import("./pages/home"));
const ProjectDetail = lazy(() => import("./pages/projectDetails"));

// Lazy load all admin routes so admin panel code is never downloaded by standard users
const AdminLogin = lazy(() => import("./pages/adminlogin"));
const AdminDashboard = lazy(() => import("./pages/adminDashboard"));
const AdminProjects = lazy(() => import("./pages/adminProject"));
const AdminProjectForm = lazy(() => import("./pages/adminProjectForm"));
const AdminEditProject = lazy(() => import("./pages/adminEditProject"));
const AdminTeam = lazy(() => import("./pages/adminTeam"));
const AdminTeamForm = lazy(() => import("./pages/adminTeamForm"));
const AdminEditTeamMember = lazy(() => import("./pages/adminEditTeam"));
const AdminServiceForm = lazy(() => import("./pages/adminServiceForm"));
const AdminEditServices = lazy(() => import("./pages/adminEditServices"));
const AdminServices = lazy(() => import("./pages/adminServices"));

// Secret admin entry path, e.g. "portal-x7k2m9" — set in .env, never hardcoded/guessable
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(`/${ADMIN_PATH}`);

  return (
    <AdminThemeProvider>
      <div className="min-h-screen bg-cream dark:bg-zinc-900 transition-colors duration-300">
        {!isAdminRoute && <Navbar />}
        <Suspense fallback={<div className="min-h-screen bg-cream dark:bg-zinc-900" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            <Route path={`/${ADMIN_PATH}/login`} element={<AdminLogin />} />

            <Route
              path={`/${ADMIN_PATH}/projects`}
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/projects/new`}
              element={
                <ProtectedRoute>
                  <AdminProjectForm />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/projects/:id`}
              element={
                <ProtectedRoute>
                  <AdminEditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/team`}
              element={
                <ProtectedRoute>
                  <AdminTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/team/new`}
              element={
                <ProtectedRoute>
                  <AdminTeamForm />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/team/:id`}
              element={
                <ProtectedRoute>
                  <AdminEditTeamMember />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/services`}
              element={
                <ProtectedRoute>
                  <AdminServices />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/services/new`}
              element={
                <ProtectedRoute>
                  <AdminServiceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}/services/:id`}
              element={
                <ProtectedRoute>
                  <AdminEditServices />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/${ADMIN_PATH}`}
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Old/guessable admin paths and anything unmatched → send to homepage, no trace */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </AdminThemeProvider>
  );
}

export default App;