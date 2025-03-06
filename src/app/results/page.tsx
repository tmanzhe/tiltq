"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Participant {
  summonerName: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealt: number;
  goldEarned: number;
  win: boolean;
}

interface MatchStatistics {
  matchId: string;
  gameMode: string;
  duration: number;
  participants: Participant[];
}

export default function Results() {
  const [fullRiotId, setFullRiotId] = useState<string>("");
  const [message, setMessage] = useState<string>("Loading..."); // We'll update this later with actual message
  const searchParams = useSearchParams();

  useEffect(() => {
    const riotId = searchParams.get("fullRiotId");
    if (riotId) {
      setFullRiotId(decodeURIComponent(riotId));
      // Call the API to fetch match history and pass to Gemini
      fetchMatchAndAnalyze(decodeURIComponent(riotId));
    }
  }, [searchParams]);

  const fetchMatchAndAnalyze = async (fullRiotId: string) => {
    try {
      // Step 1: Get PUUID from Riot ID
      const response = await fetch(`/api/player?fullRiotId=${encodeURIComponent(fullRiotId)}`);
      const data = await response.json();
      const puuid = data.puuid;

      if (!puuid) {
        setMessage("No player data found.");
        return;
      }

      // Step 2: Get match IDs using the PUUID
      const matchIdResponse = await fetch(`/api/matchId?puuid=${encodeURIComponent(puuid)}`);
      const matchIdData = await matchIdResponse.json();
      const matchIds = matchIdData.matchIds;

      if (!matchIds || matchIds.length === 0) {
        setMessage("No match history found.");
        return;
      }

      // Step 3: Get detailed match statistics for each match
      console.log("Match IDs to fetch:", matchIds); // Debug log
      const matchParams = new URLSearchParams();
      matchIds.forEach((id: string) => matchParams.append('matchIds', id));
      const matchResponse = await fetch(`/api/matches?${matchParams}`);
      console.log("Match response status:", matchResponse.status); // Debug log
      
      const matchData = await matchResponse.json();
      console.log("Match data received:", matchData); // Debug log
      
      if (!matchData.matchStatistics || matchData.matchStatistics.length === 0) {
        console.error("No match statistics in response:", matchData); // Debug log
        setMessage("Failed to fetch match statistics.");
        return;
      }

      // Step 5: Send to Gemini for analysis
      console.log("Sending match data to Gemini for analysis..."); // Debug log
      const geminiResponse = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchData: matchData.matchStatistics,
          playerName: data.gameName
        })
      });
      
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini API error:", errorText);
        throw new Error("Failed to get analysis");
      }
      
      const geminiData = await geminiResponse.json();
      setMessage(geminiData.analysis || "Failed to generate analysis.");
      
    } catch (error) {
      setMessage("An error occurred while processing the data.");
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          className="w-full max-w-3xl mx-auto space-y-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Logo/Title */}
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.4,
            }}
          >
            <span className="text-red-600">tilt</span>q
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            here's what we found about {fullRiotId}:
          </motion.p>

          {/* Message Display */}
          <motion.div
            className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-line text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <p className="text-xl text-gray-800 font-mono">{message}</p>
          </motion.div>

          {/* Form - Now just for the button */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Search Another Player
              <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </button>
          </motion.form>
        </motion.div>

        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2.5 }}
          >
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-600 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-red-600 rounded-full blur-[100px]" />
          </motion.div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Not affiliated with Riot Games</p>
      </footer>
    </div>
  );
}