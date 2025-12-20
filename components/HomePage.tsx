'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, Target, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

const HomePage: React.FC<HeaderProps> = ({ 
  currentStep = 1, 
  totalSteps = 6,
  showProgress = true 
}) => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="w-full">
      {/* Main Header Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/bg.png)',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Animated Floating Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-8 left-8 hidden lg:block z-20"
        >
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-8 right-8 hidden lg:block z-20"
        >
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <div className="relative z-10 px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <span className="text-sm font-medium text-white">
                Join 5000+ Successful Alumni
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                Welcome to the{' '}
                <span className="bg-[#ffd700] bg-clip-text text-transparent">
                  YES INDIA
                </span>{' '}
                Alumni Network
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl">
                Reconnect with old friends, grow your network, and give back to the community 
                that shaped your future
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">5K+</div>
                <div className="text-sm text-blue-200">Active Alumni</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-blue-200">Networking Events</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-blue-200">Mentorship Programs</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">25+</div>
                <div className="text-sm text-blue-200">Cities</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push('/register')}
                className="bg-white text-[#ffd700] hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 lg:h-20"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
            <path
              d="M0 90L60 80C120 70 240 50 360 40C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V90H1380C1320 90 1200 90 1080 90C960 90 840 90 720 90C600 90 480 90 360 90C240 90 120 90 60 90H0Z"
              fill="white"
              fillOpacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            Why Join Our Alumni Network?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg"
          >
            Unlock exclusive benefits and opportunities
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"
            >
              <Users className="w-6 h-6 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Network & Connect</h3>
            <p className="text-gray-600">
              Connect with fellow alumni across industries, attend exclusive networking events, 
              and build meaningful professional relationships.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4"
            >
              <Target className="w-6 h-6 text-purple-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Career Growth</h3>
            <p className="text-gray-600">
              Access job opportunities, mentorship programs, career counseling, 
              and professional development workshops.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4"
            >
              <HeartHandshake className="w-6 h-6 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Give Back</h3>
            <p className="text-gray-600">
              Mentor current students, volunteer for community initiatives, 
              and contribute to the growth of future generations.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Footer Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-12 py-12 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] shadow-lg"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Join Our Alumni Network?
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Complete your registration today and become part of a vibrant community 
              that supports lifelong learning and professional growth.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-blue-400/30 pt-6 mt-6"
          >
            <div className=" border-blue-400/30 pt-6">
              <p className="text-blue-100 text-center text-sm">
                &copy; {new Date().getFullYear()} YES INDIA FOUNDATION. All rights reserved. 
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;