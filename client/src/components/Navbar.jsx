import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 12 }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg-800/60 backdrop-blur-xl border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold drop-shadow-neon">
          <span className="text-neon.pink">i</span><span className="text-neon.cyan">Elect</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-neon.cyan">Voter</Link>
          <Link to="/admin" className="hover:text-neon.pink">Admin</Link>
          <button onClick={logout} className="neon-btn px-3 py-1 text-sm">Logout</button>
        </div>
      </div>
    </motion.nav>
  );
}
