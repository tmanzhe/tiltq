"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Footer from "../components/Footer";

function ResultsContent() {
  const searchParams = useSearchParams();
  const fullRiotId = searchParams.get("fullRiotId") || "";
  const [message, setMessage] = useState<string>("Loading..."); // We'll update this later with actual message
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get PUUID from Riot ID
        console.log('Fetching player data for:', fullRiotId);
        const response = await fetch(`/api/player?fullRiotId=${encodeURIComponent(fullRiotId)}`);
        const data = await response.json();
        console.log('Player data received:', data);

        if (!data.puuid) {
          setMessage("No player data found.");
          return;
        }

        // Get match IDs using the PUUID
        console.log('Fetching match IDs for PUUID:', data.puuid);
        const matchIdResponse = await fetch(`/api/matchId?puuid=${encodeURIComponent(data.puuid)}`);
        const matchIdData = await matchIdResponse.json();
        const matchIds = matchIdData.matchIds;
        console.log('Match IDs received:', matchIds);

        if (!matchIds || matchIds.length === 0) {
          setMessage("No match history found.");
          return;
        }

        // Get match statistics
        const matchParams = new URLSearchParams();
        matchIds.forEach((id: string) => matchParams.append('matchIds', id));
        console.log('Fetching match details for IDs:', matchIds);
        const matchResponse = await fetch(`/api/matches?${matchParams}`);
        const matchData = await matchResponse.json();
        console.log('Match data received:', JSON.stringify(matchData, null, 2));
        
        if (!matchData.matchStatistics || matchData.matchStatistics.length === 0) {
          setMessage("Failed to fetch match statistics.");
          return;
        }

        const statsPayload = {
          matchData: matchData.matchStatistics,
          playerName: data.gameName,
          puuid: data.puuid
        };

        console.log('Sending to stats endpoint:', JSON.stringify(statsPayload, null, 2));

        // Send to Gemini for analysis
        const geminiResponse = await fetch('/api/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(statsPayload)
        });
        
        console.log('Gemini response status:', geminiResponse.status);
        const responseText = await geminiResponse.text();
        console.log('Raw Gemini response:', responseText);
        
        if (!geminiResponse.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { error: responseText || "Unknown error" };
          }
          console.error('Gemini API error:', errorData);
          throw new Error(errorData.error || "Failed to get analysis");
        }
        
        let geminiData;
        try {
          geminiData = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse Gemini response:', e);
          throw new Error("Invalid response from analysis service");
        }

        if (geminiData.error) {
          throw new Error(geminiData.error);
        }
        
        setMessage(geminiData.analysis || "Failed to generate analysis.");

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred while processing the data.";
        setError(errorMessage);
        setMessage(errorMessage);
        console.error('Error in fetchData:', error);
      }
    };

    if (fullRiotId) {
      fetchData();
    }
  }, [fullRiotId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = '/';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#faf9f6] to-white text-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          className="w-full max-w-3xl mx-auto space-y-12 text-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 shadow-sm p-8 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Logo/Title */}
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight font-sans"
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
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            here&apos;s what you can say to {fullRiotId}:
          </motion.p>

          {/* Message Display */}
          <motion.div
            className="space-y-4 p-6 bg-white rounded-lg border border-gray-200/50 whitespace-pre-line text-left relative shadow-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            <p className="text-xl text-gray-800 font-sans pr-12 leading-relaxed">{message}</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
            >
              Search Another Player
              <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </button>
          </motion.form>
        </motion.div>
      </main>

      <Footer />

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2.5 }}
        >
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-red-200 rounded-full blur-[120px]" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#faf9f6] to-white text-black flex flex-col items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </motion.div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}