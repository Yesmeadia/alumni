// app/components/registration/Header.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Target, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentStep = 1, 
  totalSteps = 6,
  showProgress = true 
}) => {
  return (
    <div className="w-full">
      {/* Main Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
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
          className="absolute top-8 left-8 hidden lg:block"
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
          className="absolute bottom-8 right-8 hidden lg:block"
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
              <Sparkles className="w-4 h-4 text-yellow-300" />
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
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
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
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-2xl backdrop-blur-sm"
              >
                Learn More
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

      {/* Progress Bar (Conditional) */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Registration Progress
                </h3>
                <p className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps} completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
              >
                {/* Progress Animation */}
                <motion.div
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>

            {/* Steps Indicators */}
            <div className="flex justify-between mt-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 transition-all duration-300 ${
                      index + 1 <= currentStep
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1 <= currentStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Why Join Our Alumni Network?
          </h2>
          <p className="text-gray-600 text-lg">
            Unlock exclusive benefits and opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Network & Connect</h3>
            <p className="text-gray-600">
              Connect with fellow alumni across industries, attend exclusive networking events, 
              and build meaningful professional relationships.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Career Growth</h3>
            <p className="text-gray-600">
              Access job opportunities, mentorship programs, career counseling, 
              and professional development workshops.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Give Back</h3>
            <p className="text-gray-600">
              Mentor current students, volunteer for community initiatives, 
              and contribute to the growth of future generations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;