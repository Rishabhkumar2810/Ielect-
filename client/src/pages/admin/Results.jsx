import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import NeonCard from "../../components/NeonCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

export default function Results() {
  const { id } = useParams();
  const [data,setData]=useState([]);

  useEffect(()=> {
    (async()=>{
      try {
        const { data } = await api.get(`/vote/results/${id}`);
        setData(data.map(d => ({ name: d.nominee?.[0]?.name || "Nominee", votes: d.votes || 0 })));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load results");
      }
    })();
  },[id]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold">Election <span className="text-neon.cyan">Results</span></h2>
      <NeonCard>
        {data.length ? (
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="votes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-300">No results available yet.</p>
        )}
      </NeonCard>
    </div>
  );
}
