"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  //puuid is the unique identifier for the victim's account
  const [fullRiotId, setFullRiotId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/results?fullRiotId=${encodeURIComponent(fullRiotId)}`;
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
            cant win that one argument? we'll help you end it. 
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          >
            <div className="space-y-2">
              <label htmlFor="riot-id" className="text-sm font-medium text-left block">
                Enter victim's Riot ID
              </label>
              <input
                id="riot-id"
                type="text"
                placeholder="Username#TAG"
                value={fullRiotId}
                onChange={(e) => setFullRiotId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-600 focus:ring-red-600 rounded-md px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Get Started
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