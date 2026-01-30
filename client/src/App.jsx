import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VoterDashboard from "./pages/voter/VoterDashboard";
import VotePage from "./pages/voter/VotePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Results from "./pages/admin/Results";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PrivateRoute><Layout><VoterDashboard /></Layout></PrivateRoute>} />
          <Route path="/vote/:id" element={<PrivateRoute><Layout><VotePage /></Layout></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Layout><AdminDashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/results/:id" element={<PrivateRoute><Layout><Results /></Layout></PrivateRoute>} />
          <Route path="/login" element={<Layout bare><Login /></Layout>} />
          <Route path="/register" element={<Layout bare><Register /></Layout>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
