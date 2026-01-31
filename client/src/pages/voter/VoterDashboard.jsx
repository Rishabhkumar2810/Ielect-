import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import NeonCard from "../../components/NeonCard";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async()=>{
      try {
        const { data } = await api.get("/elections/active");
        setElections(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load elections");
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  if (loading) return (
    <div className="h-[60vh] grid place-items-center">
      <ClipLoader size={64} />
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold">Active <span className="text-neon.cyan">Elections</span></h2>
      {elections.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {elections.map(e => (
            <motion.div key={e._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
              <NeonCard>
                <h3 className="text-xl font-semibold mb-1">{e.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{e.description}</p>
                <p className="text-gray-400 text-xs">Ends: {new Date(e.endDate).toLocaleString()}</p>
                <Link to={`/vote/${e._id}`} className="neon-btn mt-4 px-4 py-2 inline-block">Vote →</Link>
              </NeonCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <NeonCard hover={false}><p className="text-gray-300">No active elections right now.</p></NeonCard>
      )}
    </div>
  );
}
