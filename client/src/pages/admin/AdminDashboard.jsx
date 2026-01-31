import { useEffect, useState } from "react";
import api from "../../lib/api";
import NeonCard from "../../components/NeonCard";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [elections,setElections]=useState([]);
  const [nominees,setNominees]=useState([]);
  const [assignElection,setAssignElection]=useState("");
  const [assignNominee,setAssignNominee]=useState("");

  const load = async () => {
    const [el,nom] = await Promise.all([api.get("/elections"), api.get("/nominees")]);
    setElections(el.data);
    setNominees(nom.data);
  };

  useEffect(()=>{ load().catch(()=>toast.error("Failed to load admin data")); },[]);

  const createElection = async (e) => {
    e.preventDefault();
    try {
      await api.post("/elections", { title, description, startDate, endDate });
      toast.success("Election created");
      setTitle(""); setDescription(""); setStartDate(""); setEndDate("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const assign = async () => {
    try {
      await api.post("/nominees/assign", { electionId: assignElection, nomineeId: assignNominee });
      toast.success("Nominee assigned");
      setAssignElection(""); setAssignNominee("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assign failed");
    }
  };

  const removeNominee = async (nomineeId, electionId) => {
    try {
      await api.post("/nominees/remove", { nomineeId, electionId });
      toast.success("Nominee removed");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold"><span className="text-neon.pink">Admin</span> Dashboard</h2>

      <NeonCard>
        <h3 className="text-xl font-semibold mb-4">Create Election</h3>
        <form onSubmit={createElection} className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <input className="input" type="datetime-local" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
          <input className="input" type="datetime-local" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
          <div className="md:col-span-2">
            <button className="neon-btn px-4 py-2">Create</button>
          </div>
        </form>
      </NeonCard>

      <NeonCard>
        <h3 className="text-xl font-semibold mb-4">Assign Nominee</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <select className="input" value={assignElection} onChange={e=>setAssignElection(e.target.value)}>
            <option value="">Select Election</option>
            {elections.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
          <select className="input" value={assignNominee} onChange={e=>setAssignNominee(e.target.value)}>
            <option value="">Select Nominee</option>
            {nominees.filter(n=>!n.electionId).map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
          <div className="md:col-span-2">
            <button onClick={assign} className="neon-btn px-4 py-2">Assign</button>
          </div>
        </div>
      </NeonCard>

      <div className="grid md:grid-cols-2 gap-5">
        {elections.map(el => (
          <NeonCard key={el._id}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{el.title}</h4>
                <p className="text-xs text-gray-400">{new Date(el.startDate).toLocaleString()} → {new Date(el.endDate).toLocaleString()}</p>
              </div>
              <a className="link" href={`/admin/results/${el._id}`}>View Results →</a>
            </div>
            <div className="mt-4 space-y-2">
              <h5 className="font-semibold">Nominees</h5>
              {el.nominees?.length ? el.nominees.map(n => {
                const full = nominees.find(x => x._id === (n._id || n));
                if (!full) return null;
                return (
                  <div key={n._id || n} className="flex items-center justify-between bg-bg-700/50 rounded-lg px-3 py-2">
                    <span className="text-sm">{full.name} — {full.party}</span>
                    <button className="text-red-400 hover:text-red-300 text-sm" onClick={()=>removeNominee(full._id, el._id)}>Remove</button>
                  </div>
                );
              }) : <p className="text-sm text-gray-400">No nominees assigned.</p>}
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
