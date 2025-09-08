import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Admin/Dashboard";
import Boards from "./pages/Boards";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import CreateBoard from "./pages/CreateBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DndProvider backend={HTML5Backend}>
              <Dashboard />
            </DndProvider>{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/createboard"
        element={
          <ProtectedRoute>
            <CreateBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
