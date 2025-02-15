"use client";

// components/Leaderboard.tsx
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Score {
  user_id: string;
  score: number;
  username: string;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);

  const supabase = createClient();

  useEffect(() => {
    // Fetch top 10 scores
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data) setScores(data);
    };

    fetchScores();

    // Real-time updates
    const subscription = supabase
      .channel("scores")
      .on("postgres_changes", { event: "*", schema: "public" }, fetchScores)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="p-4 bg-white/10 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div key={score.user_id} className="flex justify-between">
            <span>
              #{index + 1} {score.username}
            </span>
            <span>{score.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
