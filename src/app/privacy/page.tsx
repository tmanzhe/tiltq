"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function Privacy() {
  const features = [
    {
      icon: <Eye className="h-6 w-6 text-red-600" />,
      title: "Public Data Only",
      description: "We only access publicly available match data through Riot's official API. No private information is ever accessed or processed."
    },
    {
      icon: <Lock className="h-6 w-6 text-red-600" />,
      title: "No Data Storage",
      description: "Your searches and results are never stored anywhere. Everything is processed in real-time and then discarded."
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Secure Processing",
      description: "All API calls are made securely using HTTPS, and we never share your data with third parties."
    },
    {
      icon: <Trash2 className="h-6 w-6 text-red-600" />,
      title: "Automatic Cleanup",
      description: "Match data is automatically cleared after analysis. We maintain zero historical records of your searches."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#faf9f6] to-white text-black flex flex-col">
      <main className="flex-1 py-16 px-4">
        <motion.div
          className="max-w-4xl mx-auto space-y-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1
              className="text-5xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              At tiltq, we take your privacy seriously. Here&apos;s everything you need to know about how we handle your data.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1
                }}
                whileHover={{ 
                  y: -5,
                  transition: { 
                    duration: 0.2
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Back to Home */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md">
                Back to Home
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
} 