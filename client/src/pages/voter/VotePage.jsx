import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import NeonCard from "../../components/NeonCard";
import toast from "react-hot-toast";

export default function VotePage() {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async()=>{
      try {
        const { data } = await api.get(`/elections/${id}`);
        setElection(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching election");
      } finally {
        setLoading(false);
      }
    })();
  },[id]);

  const castVote = async (nomineeId) => {
    try {
      const { data } = await api.post("/vote", { electionId: id, nomineeId });
      toast.success(data.message || "Vote cast successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Voting failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!election) return <p className="p-6 text-red-400">Election not found.</p>;

  const now = new Date();
  const active = now >= new Date(election.startDate) && now <= new Date(election.endDate);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold">{election.title}</h2>
      <p className="text-gray-300">{election.description}</p>
      {!active && (
        <NeonCard hover={false}>
          <p className="text-neon.pink font-semibold">
            {now < new Date(election.startDate) ? "Voting has not started yet." : "Voting has ended."}
          </p>
        </NeonCard>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {election.nominees?.map(n => (
          <NeonCard key={n._id}>
            <h3 className="text-lg font-semibold">{n.name}</h3>
            <p className="text-sm text-gray-300">{n.party}</p>
            <button className="neon-btn mt-3 px-4 py-2 disabled:opacity-50" disabled={!active} onClick={()=>castVote(n._id)}>
              Vote
            </button>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
