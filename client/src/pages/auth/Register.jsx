import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";

export default function Register() {
  const nav = useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("voter");
  const [loading,setLoading]=useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/register", { name, email, password, role });
      toast.success("Registered! Please sign in.");
      nav("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center">
      <div className="neon-card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Create <span className="text-neon.pink">Account</span></h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input w-full" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input w/full" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <select className="input w/full" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
          <button className="neon-btn w-full py-3" disabled={loading}>{loading? "Creating..." : "Register"}</button>
        </form>
        <p className="text-sm mt-4 text-gray-300">Already have an account? <Link className="link" to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
