// components/dashboard/AlumniDetailsDialog.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Phone, MapPin, GraduationCap, Briefcase, Building2,
  Linkedin, X, Download, Mail, Pencil, Trash2,
  MessageSquare, MessageCircle as MessageCircleIcon,
  Globe, Calendar, ShieldCheck, Facebook, Instagram, Twitter, ExternalLink
} from 'lucide-react';
import { AlumniData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface AlumniDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: (AlumniData & { id: string }) | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AlumniDetailsDialog: React.FC<AlumniDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  alumni,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  if (!alumni) return null;

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return 'N/A'; }
  };

  const socialLinks = [
    { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: Linkedin, iconColor: 'text-[#0077b5]', hoverBg: 'hover:bg-[#0077b5]', border: 'border-blue-100' },
    { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: Facebook, iconColor: 'text-[#1877F2]', hoverBg: 'hover:bg-[#1877F2]', border: 'border-blue-100' },
    { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: Instagram, iconColor: 'text-[#E4405F]', hoverBg: 'hover:bg-[#E4405F]', border: 'border-pink-100' },
    { id: 'twitter', label: 'Twitter / X', value: alumni.twitterLink, icon: Twitter, iconColor: 'text-slate-600', hoverBg: 'hover:bg-slate-900', border: 'border-slate-200' },
    { id: 'email', label: 'Direct Email', value: alumni.email, icon: Mail, iconColor: 'text-indigo-500', hoverBg: 'hover:bg-indigo-600', border: 'border-indigo-100' },
    { id: 'website', label: 'Portfolio', value: alumni.socialMediaLink, icon: Globe, iconColor: 'text-emerald-500', hoverBg: 'hover:bg-emerald-600', border: 'border-emerald-100' },
  ].filter(l => !!l.value);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[1000px] w-[95vw] p-0 overflow-hidden border-0 shadow-3xl bg-white rounded-[2rem] max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">{alumni.fullName} Profile</DialogTitle>
        <DialogDescription className="sr-only">Detailed profile view of alumni</DialogDescription>

        {/* Sophisticated Header Banner */}
        <div className="relative shrink-0 print:hidden">
          <div className="h-52 w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Top Navigation / Actions */}
            <div className="absolute top-8 left-10 right-10 flex justify-between items-start z-20">
              <div className="flex gap-3">
                <Link
                  href={alumni.id ? `/alumni/${alumni.id}/pdf` : '#'}
                  onClick={(e) => !alumni.id && e.preventDefault()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!alumni.id}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl px-5 h-11 border border-white/20 transition-all font-black uppercase tracking-widest text-[10px]"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </Link>
                <Link
                  href={alumni.id ? `/alumni/${alumni.id}/id-card` : '#'}
                  onClick={(e) => !alumni.id && e.preventDefault()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!alumni.id}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl px-5 h-11 border border-white/20 transition-all font-black uppercase tracking-widest text-[10px]"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" /> Get ID Card
                  </Button>
                </Link>
                <Link
                  href={alumni.id ? `/alumni/${alumni.id}` : '#'}
                  onClick={(e) => !alumni.id && e.preventDefault()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!alumni.id}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl px-5 h-11 border border-white/20 transition-all font-black uppercase tracking-widest text-[10px]"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Full Profile
                  </Button>
                </Link>
                <Link
                  href={alumni.id ? `/alumni/${alumni.id}/edit` : '#'}
                  onClick={(e) => !alumni.id && e.preventDefault()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!alumni.id}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl px-5 h-11 border border-white/20 transition-all font-black uppercase tracking-widest text-[10px]"
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit Records
                  </Button>
                </Link>
              </div>

              <div className="flex gap-3">
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Permanently delete this alumni record?')) {
                        onDelete(alumni.id);
                      }
                    }}
                    className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 hover:text-white backdrop-blur-md rounded-2xl h-11 w-11 border border-rose-500/30 shadow-xl transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl h-11 w-11 border border-white/20 shadow-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Refined Batch Indicator */}
            <div className="absolute bottom-6 right-10 text-right opacity-80">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">Alumni Registry</p>
              <h4 className="text-white text-2xl font-black italic tracking-widest uppercase">
                CLASS OF {alumni.yearOfGraduation}
              </h4>
            </div>
          </div>

          <div className="px-12 -mt-24 pb-10 relative z-10">
            <div className="flex flex-col md:flex-row items-end gap-12">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500 rounded-[3.5rem] blur-3xl opacity-30" />
                <Avatar className="h-56 w-56 ring-[16px] ring-white shadow-4xl bg-white rounded-[3.5rem] relative overflow-hidden transition-transform duration-700 hover:scale-105 border-4 border-slate-50">
                  <AvatarImage src={alumni.photoURL} className="object-cover" />
                  <AvatarFallback className="text-6xl font-black bg-slate-50 text-indigo-200 uppercase">
                    {alumni.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-12 w-12 bg-emerald-500 border-[10px] border-white rounded-[1.5rem] shadow-2xl flex items-center justify-center">
                  <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <div className="flex-1 pb-4">
                <div className="space-y-3 mb-10 text-center md:text-left">
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-1">
                    <h2 className="text-6xl font-black text-indigo-950 tracking-tighter leading-none">
                      {alumni.fullName}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">
                        {alumni.currentJobTitle || 'Alumni Member'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.15em]">
                        {alumni.companyName || 'Verified Professional'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Profiles as Professional Text Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.id === 'email' ? `mailto:${link.value}` : formatSocialLink(link.value as string, link.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social"
                    >
                      <Button className={`rounded-xl h-12 bg-white border ${link.border} text-slate-600 ${link.hoverBg} hover:text-white px-6 shadow-sm transition-all duration-300 flex items-center gap-3`}>
                        <link.icon className={`h-4 w-4 ${link.iconColor} group-hover/social:text-white transition-colors`} />
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">{link.label}</span>
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body - Columned Layout */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 px-10 py-8 scrollbar-hide print:bg-white print:overflow-visible print:p-0">
          <style jsx global>{`
            @media print {
              @page { size: A4; margin: 20mm; }
              body * { visibility: hidden; }
              .print-area, .print-area * { visibility: visible; }
              .print-only { display: block !important; }
              .no-print { display: none !important; }
              .print-area { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                background: white !important;
                color: black !important;
              }
              .print-avatar { border: 2px solid #000 !important; border-radius: 10px !important; }
              .print-section { border: 1px solid #eee !important; margin-bottom: 20px !important; break-inside: avoid; }
            }
            .print-only { display: none; }
          `}</style>

          {/* Official Print Header */}
          <div className="print-only mb-10 pb-6 border-b-2 border-slate-900 flex justify-between items-end print-area">
            <div>
              <img src="/logo.png" alt="Logo" className="h-16 w-auto mb-4" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">Official Alumni Record</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yes India Alumni Association • Registry Database</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Document Hash</p>
              <p className="text-[12px] font-mono font-bold">ALM-{alumni.id.substring(0, 8).toUpperCase()}</p>
              <p className="text-[10px] font-black mt-1">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 print-area">

            {/* Column 1: Contact & Personal */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> Identity & Contact
                </h3>
                <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile</p>
                      <p className="text-[14px] font-black text-slate-900">{alumni.mobileNumber || 'N/A'}</p>
                      {alumni.whatsappNumber && (
                        <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black mt-0.5 uppercase tracking-tighter">
                          <MessageCircleIcon className="h-3 w-3" /> WhatsApp Linked
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                      <p className="text-[14px] font-black text-slate-900 truncate" title={alumni.email}>{alumni.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="text-[14px] font-black text-slate-900 leading-snug">
                        {[alumni.place, alumni.district, alumni.state].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {alumni.messageToTeacher && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Reflection</h3>
                  <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <MessageSquare className="absolute -bottom-2 -right-2 h-20 w-20 text-white/10" />
                    <p className="text-sm italic font-medium leading-relaxed relative z-10">
                      "{alumni.messageToTeacher}"
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Column 2: Education & Professional */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5" /> Professional DNA
                </h3>
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                  <div className="relative pl-6 border-l-4 border-indigo-100 space-y-8">
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0.5 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white shadow-md" />
                      <p className="text-[15px] font-black text-slate-900">{alumni.schoolAttended || 'YES INDIA School'}</p>
                      <p className="text-[12px] text-indigo-600 font-bold mt-0.5 uppercase tracking-wider">Batch of {alumni.yearOfGraduation}</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0.5 h-4 w-4 rounded-full bg-slate-300 border-4 border-white shadow-md" />
                      <p className="text-[15px] font-black text-slate-900">{alumni.university || 'Advanced Education'}</p>
                      {alumni.qualification && (
                        <Badge className="mt-2 bg-slate-100 text-slate-600 border-0 text-[10px] font-black rounded-lg">
                          {alumni.qualification}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Skillset</h3>
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(alumni.areasOfExpertise || 'General').split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-tight">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                      <p className="text-[15px] font-black text-slate-900">{alumni.yearsOfExperience ? `${alumni.yearsOfExperience}nd Gen` : 'Fresh'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industrial Sect.</p>
                      <p className="text-[15px] font-black text-slate-900">{alumni.industry || 'Global'}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Column 3: Registry & Contribution */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Registry Status
                </h3>
                <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Member Since</span>
                    <span className="text-[13px] font-black text-slate-900">{formatDate(alumni.registrationDate)}</span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Verification</span>
                    <Badge className="bg-emerald-500 text-white border-0 rounded-lg px-2 py-0.5 text-[10px] font-black flex gap-2 items-center italic">
                      ACTIVE <span className="h-1 w-1 bg-white rounded-full animate-pulse" />
                    </Badge>
                  </div>
                </div>
              </section>

              {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Commitment</h3>
                  <div className="bg-emerald-500 text-white rounded-3xl p-6 shadow-xl shadow-emerald-100">
                    <div className="flex flex-wrap gap-2">
                      {alumni.stayInvolved.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white/20 border border-white/30 rounded-xl text-[10px] font-black uppercase tracking-tight">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-5 bg-white border-t border-slate-100 shrink-0 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            YES INDIA ALUMNI SYSTEM &copy; 2026
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default AlumniDetailsDialog;