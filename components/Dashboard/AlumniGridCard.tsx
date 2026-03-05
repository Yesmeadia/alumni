// components/dashboard/AlumniGridCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Mail, Facebook, Instagram, Twitter, ExternalLink, Globe } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniGridCardProps {
  alumni: AlumniData & { id: string };
  index: number;
  onClick: (alumni: AlumniData & { id: string }) => void;
}

const AlumniGridCard: React.FC<AlumniGridCardProps> = ({ alumni, index, onClick }) => {
  // Diverse professional color palettes
  const designTokens = [
    { bg: 'from-indigo-50/50 to-white', badge: 'bg-indigo-600', text: 'text-indigo-600', shadow: 'hover:shadow-indigo-500/20' },
    { bg: 'from-blue-50/50 to-white', badge: 'bg-blue-600', text: 'text-blue-600', shadow: 'hover:shadow-blue-500/20' },
    { bg: 'from-emerald-50/50 to-white', badge: 'bg-emerald-600', text: 'text-emerald-600', shadow: 'hover:shadow-emerald-500/20' },
    { bg: 'from-violet-50/50 to-white', badge: 'bg-violet-600', text: 'text-violet-600', shadow: 'hover:shadow-violet-500/20' },
    { bg: 'from-rose-50/50 to-white', badge: 'bg-rose-600', text: 'text-rose-600', shadow: 'hover:shadow-rose-500/20' },
  ];

  const token = designTokens[index % designTokens.length];

  const formatSocialLink = (link?: string, platform?: string) => {
    if (!link) return '';
    if (link.startsWith('http')) return link;

    switch (platform) {
      case 'facebook': return `https://facebook.com/${link}`;
      case 'instagram': return `https://instagram.com/${link}`;
      case 'twitter': return `https://x.com/${link}`;
      case 'linkedin': return `https://linkedin.com/in/${link}`;
      default: return `https://${link}`;
    }
  };

  const socialLinks = [
    { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: Linkedin, color: 'hover:bg-[#0077b5]', iconColor: 'text-[#0077b5]' },
    { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: Facebook, color: 'hover:bg-[#1877F2]', iconColor: 'text-[#1877F2]' },
    { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: Instagram, color: 'hover:bg-[#E4405F]', iconColor: 'text-[#E4405F]' },
    { id: 'twitter', label: 'Twitter/X', value: alumni.twitterLink, icon: Twitter, color: 'hover:bg-slate-900', iconColor: 'text-slate-600' },
    { id: 'email', label: 'Email', value: alumni.email, icon: Mail, color: 'hover:bg-indigo-600', iconColor: 'text-slate-400' },
    { id: 'website', label: 'Website', value: alumni.socialMediaLink, icon: Globe, color: 'hover:bg-emerald-600', iconColor: 'text-emerald-500' },
  ].filter(link => !!link.value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="h-full"
    >
      <Card
        className={`group relative h-full bg-white border border-slate-100 shadow-sm hover:shadow-2xl ${token.shadow} hover:translate-y-[-8px] transition-all duration-500 cursor-pointer rounded-[2rem] overflow-hidden flex flex-col`}
        onClick={() => onClick(alumni)}
      >
        {/* Colorful gradient header strip */}
        <div className={`h-20 w-full bg-gradient-to-br ${token.bg} relative shrink-0`}>
          <div className="absolute top-3 right-5">
            <span className={`px-3 py-1 ${token.badge} text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-current/20`}>
              {alumni.yearOfGraduation}
            </span>
          </div>
        </div>

        <CardContent className="px-6 pb-6 flex-1 flex flex-col items-center">
          {/* Overlapping Avatar */}
          <div className="relative -mt-10 mb-4">
            <div className={`absolute inset-0 ${token.badge} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
            <Avatar className="h-20 w-20 ring-[5px] ring-white shadow-xl rounded-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
              <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
              <AvatarFallback className="bg-slate-50 text-slate-300 text-2xl font-black">
                {alumni.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Identity */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900 leading-tight tracking-tight px-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {alumni.fullName}
            </h3>
            <div className="flex flex-col">
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider line-clamp-1">
                {alumni.currentJobTitle || 'Alumni Member'}
              </p>
              <p className="text-slate-400 font-medium text-[9px] uppercase line-clamp-1">
                {alumni.companyName || 'Private Organization'}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlumniGridCard;
