import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TripForm from "./pages/TripForm";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public (logged-out only) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips/new" element={<ProtectedRoute><TripForm /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
        <Route path="/trips/:id/edit" element={<ProtectedRoute><TripForm /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;