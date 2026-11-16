import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripForm from "./pages/TripForm";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips/new" element={<ProtectedRoute><TripForm /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
        <Route path="/trips/:id/edit" element={<ProtectedRoute><TripForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;