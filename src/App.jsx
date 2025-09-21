import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Loading from "./components/Loading";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
// const Boards = lazy(() => import("./pages/Boards"));
// const CreateBoard = lazy(() => import("./pages/CreateBoard"));
const NotificationCenter = lazy(() =>
  import("./components/NotificationCenter")
);
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DndProvider backend={HTML5Backend}>
                <Dashboard />
              </DndProvider>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/createboard"
          element={
            <ProtectedRoute>
              <CreateBoard />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
