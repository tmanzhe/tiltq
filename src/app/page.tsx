"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Footer from "./components/Footer";
import About from "./components/About";

export default function Home() {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScroll(false);
      } else {
        setShowScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //puuid is the unique identifier for the victim's account
  const [fullRiotId, setFullRiotId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/results?fullRiotId=${encodeURIComponent(fullRiotId)}`;
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#faf9f6] to-white text-black">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
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

      <div className="flex flex-col">
        <main>
          {/* Hero Section */}
          <section className="h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
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
                cant win that one argument? we&apos;ll help you end it.
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
                    Enter Your Victim&apos;s Riot ID
                  </label>
                  <input
                    id="riot-id"
                    type="text"
                    placeholder="Username#TAG"
                    value={fullRiotId}
                    onChange={(e) => setFullRiotId(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-600 focus:ring-red-600 rounded-lg px-4 py-2.5 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
                >
                  Run it
                  <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </button>
              </motion.form>
            </motion.div>

            {/* Arrow Key Button */}
            <motion.button
              onClick={scrollToAbout}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
                w-10 h-10 flex items-center justify-center rounded-lg 
                border border-gray-200 bg-white shadow-md
                hover:border-red-200 hover:shadow-lg group transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: showScroll ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Scroll down"
            >
              <motion.div
                animate={{ 
                  y: [0, 3, 0] 
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronDown 
                  className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" 
                />
              </motion.div>
            </motion.button>
          </section>

          {/* About Section */}
          <About />
        </main>

        <Footer />
      </div>
    </div>
  );
}