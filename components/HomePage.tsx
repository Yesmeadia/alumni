'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, Target, HeartHandshake, ArrowRight, 
  Zap, Award, Globe, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image paths - replace with your actual images
  const images = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Navigation for single page - smooth scrolling
  const navigationLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Benefits', href: '#benefits' },
  ];

  // For smooth scrolling
  const handleScroll = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header/Navigation */}
      <header id="home" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <nav className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Only logo, no text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* Logo Image */}
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="YES INDIA Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if logo doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center w-full h-full">
                        <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          YIF
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex items-center gap-8"
            >
              {navigationLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleScroll(link.href)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              {/* Single Join Now Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Join Now
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden mt-4 border-t border-gray-200"
              >
                <div className="py-4 space-y-3">
                  {navigationLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleScroll(link.href)}
                      className="block w-full text-left py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                  {/* Single Join Now Button for mobile */}
                  <button
                    onClick={() => router.push('/register')}
                    className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-md mt-2"
                  >
                    Join Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-12 lg:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-gray-200"
              >
                <span className="text-sm font-semibold text-gray-700">
                  Join 5,000+ Successful Alumni
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Welcome to the{' '}
                <span className="bg-blue-900 bg-clip-text text-transparent">
                  YES INDIA
                </span>{' '}
                Alumni Network
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Reconnect with friends, expand your professional network, and make a lasting impact on the next generation through mentorship and community engagement.
              </motion.p>

              {/* CTA Button - Single Join Now button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Auto-scrolling Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg">
                {/* Auto-scrolling Image Carousel Container */}
                <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={images[currentImageIndex]} 
                        alt={`YES INDIA Alumni Memory ${currentImageIndex + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100">
                              <div class="text-center">
                                <div class="text-4xl font-bold text-gray-700 mb-2">
                                  Memory ${currentImageIndex + 1}
                                </div>
                                <div class="text-lg text-gray-600">
                                  Alumni Network
                                </div>
                              </div>
                            </div>
                          `;
                        }}
                      />
                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Image Indicators/Dots */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white w-6' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        title={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Join Our <span className="text-blue-900">Community?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock exclusive benefits and opportunities designed for your growth and success
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Users,
                title: "Network & Connect",
                description: "Connect with fellow alumni across industries, attend exclusive networking events, and build meaningful professional relationships.",
                bgColor: "from-blue-100 to-white",
                textColor: "text-blue-600",
                features: ["Industry Mixers", "Alumni Directory", "Regional Chapters"]
              },
              {
                icon: Target,
                title: "Career Growth",
                description: "Access job opportunities, mentorship programs, career counseling, and professional development workshops.",
                bgColor: "from-purple-100 to-white",
                textColor: "text-purple-600",
                features: ["Job Board", "Mentorship", "Workshops"]
              },
              {
                icon: HeartHandshake,
                title: "Give Back",
                description: "Mentor current students, volunteer for community initiatives, and contribute to the growth of future generations.",
                bgColor: "from-green-100 to-white",
                textColor: "text-green-600",
                features: ["Student Mentorship", "Volunteering", "Scholarships"]
              },
              {
                icon: Award,
                title: "Recognition",
                description: "Get recognized for your achievements and contributions through awards and featured alumni spotlights.",
                bgColor: "from-orange-100 to-white",
                textColor: "text-orange-600",
                features: ["Alumni Awards", "Spotlights", "Hall of Fame"]
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Connect with alumni worldwide and participate in international conferences and exchange programs.",
                bgColor: "from-cyan-100 to-white",
                textColor: "text-cyan-600",
                features: ["Global Chapters", "Conferences", "Exchanges"]
              },
              {
                icon: Zap,
                title: "Lifetime Access",
                description: "Enjoy lifetime membership benefits, continuous learning opportunities, and exclusive alumni discounts.",
                bgColor: "from-pink-100 to-white",
                textColor: "text-pink-600",
                features: ["Lifetime Access", "Discounts", "Resources"]
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 lg:p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`w-7 h-7 ${benefit.textColor}`} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section with Multiple Auto-scrolling Carousels */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-900">Alumni</span> Memories
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              See the moments that define our community
            </p>
          </motion.div>

          {/* Grid of Auto-scrolling Mini Carousels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Events", images: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'] },
              { title: "Networking", images: ['/images/4.jpg', '/images/5.jpg', '/images/6.jpg'] },
              { title: "Community", images: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'] },
            ].map((category, categoryIndex) => (
              <div key={categoryIndex} className="relative">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Mini Auto-scrolling Carousel */}
                  <div className="relative h-64 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {category.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: index === categoryIndex % category.images.length ? 1 : 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`absolute inset-0 ${index === categoryIndex % category.images.length ? 'block' : 'hidden'}`}
                        >
                          <img 
                            src={image} 
                            alt={`${category.title} ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Join the YES INDIA Family?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Connect with thousands of successful alumni, access exclusive opportunities, and be part of a legacy that shapes the future.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simplified Footer - Only Copyright */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} YES INDIA FOUNDATION Alumni Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;