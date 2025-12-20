"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer = () => {
  const [ipAddress, setIpAddress] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const projectVersion = process.env.NEXT_PUBLIC_VERSION || '1.0.1';

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.ipify.org?format=json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error('Error fetching IP address:', err);
        setError('Unable to fetch IP address');
        setIpAddress('Not available');
      } finally {
        setLoading(false);
      }
    };

    fetchIPAddress();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white text-blue-900 py-8 mt-12 border-t-4 border-[#ffd700]"
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content - Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
          
          {/* Left Column: Logo & Copyright */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <div className="relative w-16 h-16 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Image
                src="/logo.png"
                alt="YES INDIA Logo"
                fill
                className="object-contain p-1"
                sizes="90px"
              />
            </div>
            <div>
              <p className="font-bold text-lg">YES INDIA FOUNDATION</p>
              <p className="text-blue-900 text-sm">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </motion.div>

          {/* Center Column: Empty for spacing */}
          <div></div>

          {/* Right Column: Version & IP Address */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-end space-y-3"
          >
            {/* Version */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-grey-900 text-sm font-medium">Version:</span>
              <code className="text-blue-900 font-bold font-mono text-sm">
                {projectVersion}
              </code>
            </div>

            {/* IP Address */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-grey-900 text-sm font-medium">IP Address:</span>
              <div className="min-w-fit">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 bg-[#ffd700] rounded-full animate-pulse"></span>
                    <span className="text-blue-100 text-sm">Loading...</span>
                  </div>
                ) : error ? (
                  <span className="text-red-300 text-sm font-mono">{error}</span>
                ) : (
                  <code className="text-blue-900 font-mono text-sm font-bold">
                    {ipAddress}
                  </code>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6"></div>
      </div>
    </motion.footer>
  );
};

export default Footer;