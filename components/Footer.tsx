"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Footer = () => {
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectVersion = process.env.NEXT_PUBLIC_VERSION || "1.0.2";

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) throw new Error("Failed to fetch IP");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (err) {
        setError("Not available");
        setIpAddress("—");
      } finally {
        setLoading(false);
      }
    };
    fetchIPAddress();
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white text-blue-900 border-t-4 border-[#ffd700] mt-12"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Left: Logo */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="relative w-14 h-14">
              <Image
                src="/logo.png"
                alt="YES INDIA Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-lg">YES INDIA FOUNDATION</p>
            </div>
          </div>

          {/* Center: Version & IP */}
          <div className="flex flex-col items-center md:items-center gap-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium">Version:</span>
              <code className="font-mono font-bold">{projectVersion}</code>
            </div>

            <div className="flex gap-2">
              <span className="font-medium">IP:</span>
              {loading ? (
                <span className="animate-pulse">Loading…</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <code className="font-mono font-bold">{ipAddress}</code>
              )}
            </div>
          </div>

          {/* Right: Copyright */}
          <div className="text-center md:text-right text-sm">
            © {new Date().getFullYear()} YES INDIA FOUNDATION  
            <br />
            All rights reserved.
          </div>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
