import { motion } from "framer-motion";
import { Zap, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="about"
      className="w-full max-w-4xl mx-auto py-32 px-4 mb-48"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="space-y-12 text-center">
        <motion.div
          variants={cardVariants}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About tiltq</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your ultimate League of Legends companion for those heated moments.
            We analyze player stats and match history to give you the perfect comeback.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* How it works card */}
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 shadow-sm 
              hover:shadow-md transition-all duration-300 transform-gpu"
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="space-y-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">How it works</h3>
              <p className="text-gray-600">
                Simply enter a player&apos;s Riot ID, and we&apos;ll analyze their recent matches
                using AI to generate witty, stat-based responses that&apos;ll leave them speechless.
              </p>
              <motion.div 
                className="flex items-center justify-center gap-2 text-red-600 group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span>Try it now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </motion.div>

          {/* Privacy card */}
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 shadow-sm 
              hover:shadow-md transition-all duration-300 transform-gpu"
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="space-y-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Privacy First</h3>
              <p className="text-gray-600">
                We only use publicly available match data, and nothing is stored on our servers.
                Your trash talk stays between you and your &quot;friends&quot;.
              </p>
              <motion.div 
                className="flex items-center justify-center gap-2 text-red-600 group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 