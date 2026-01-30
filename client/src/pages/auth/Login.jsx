import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center">
      <motion.div initial={{ scale:.96, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:.35 }}
        className="neon-card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6"><span className="text-neon.cyan">Login</span> to iElect</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input w-full" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="neon-btn w-full py-3" disabled={loading}>{loading? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="text-sm mt-4 text-gray-300">New here? <Link className="link" to="/register">Create an account</Link></p>
      </motion.div>
    </div>
  );
}
