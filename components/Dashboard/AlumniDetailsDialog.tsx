// components/dashboard/AlumniDetailsDialog.tsx
'use client';

import React from 'react';
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
  Linkedin, Mail, Pencil, Trash2,
  MessageSquare, MessageCircle, MessageCircle as MessageCircleIcon,
  Globe, ShieldCheck, Facebook, Instagram, Twitter, X,
  ChevronRight, User, Heart, TrendingUp, Download, Printer, Share2, Award
} from 'lucide-react';
import { AlumniData } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

// Import modular components
import PrintProfileHeader from './PrintProfileHeader';
import AlumniIdCard from './AlumniIdCard';
import AlumniProfilePrintView from './AlumniProfilePrintView';

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
  const { logout } = useAuth();

  if (!alumni) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPhoto = async () => {
    if (!alumni.photoURL) return;
    const filename = `${alumni.fullName?.replace(/\s+/g, '_')}_Photo.jpg`;
    const downloadUrl = `/api/download-photo?url=${encodeURIComponent(alumni.photoURL)}&filename=${encodeURIComponent(filename)}`;
    
    // Trigger download using the secure API route
    const link = document.createElement('a');
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: Linkedin, color: 'text-blue-600' },
    { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: Facebook, color: 'text-blue-700' },
    { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: Instagram, color: 'text-pink-600' },
    { id: 'twitter', label: 'Twitter', value: alumni.twitterLink, icon: Twitter, color: 'text-slate-900' },
    { id: 'website', label: 'Website', value: alumni.socialMediaLink, icon: Globe, color: 'text-slate-600' },
  ].filter(l => !!l.value);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[1000px] w-[95vw] p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white rounded-xl max-h-[90vh] flex flex-col print:absolute print:inset-0 print:m-0 print:border-0 print:bg-white print:max-h-none print:shadow-none print:w-full">
        
        {/* 100% RELIABLE DESTRUCTIVE PRINT OVERRIDES */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4 portrait; margin: 0; }
              
              /* 1. HIDE ALL DIRECT BODY CHILDREN */
              body > * { display: none !important; }
              
              /* 2. SHOW ONLY THE DIALOG PORTAL */
              body > [data-radix-portal] { 
                display: block !important;
                visibility: visible !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                overflow: visible !important;
              }

              /* 3. RESET DIALOG CONSTRAINTS */
              [role="dialog"], [data-state="open"] {
                display: block !important;
                visibility: visible !important;
                background: white !important;
                transform: none !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-height: none !important;
                box-shadow: none !important;
                border: 0 !important;
                overflow: visible !important;
              }

              /* 4. TARGET THE PRINT VIEW SPECIFICALLY */
              .print-only-container { 
                display: block !important;
                visibility: visible !important;
                width: 210mm !important;
                min-height: 297mm !important;
                background: white !important;
                padding: 10mm !important;
              }
              
              .print-only-container * {
                visibility: visible !important;
                opacity: 1 !important;
              }

              /* 5. KILL MODAL LAYERS & JUNK */
              .no-print, .bg-black\\/80, [data-radix-collection] { 
                display: none !important; 
              }
              
              /* 6. RESET SCROLLING */
              html, body, [data-lenis-prevent], .overflow-y-auto {
                overflow: visible !important;
                height: auto !important;
              }
            }
        `}} />

        <div className="flex-1 flex flex-col min-h-0">
          <DialogTitle className="sr-only">Alumni Profile</DialogTitle>
          <DialogDescription className="sr-only text-xs">Profile details for {alumni.fullName}</DialogDescription>

          {/* STANDALONE PRINT VIEW (HIDDEN ON SCREEN) */}
          <AlumniProfilePrintView alumni={alumni} />

          {/* 1. Modal Header (HIDDEN ON PRINT) */}
          <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between shrink-0 no-print">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                <AvatarImage src={alumni.photoURL || undefined} className="object-cover" />
                <AvatarFallback className="bg-white text-slate-300 font-bold text-2xl uppercase">
                  {alumni.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{alumni.fullName}</h2>
                <p className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Academic Batch of {alumni.yearOfGraduation}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPhoto} title="Download Photo" className="h-10 w-10 p-0 rounded-lg border-slate-200 text-slate-600 hover:text-indigo-600">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="h-10 rounded-lg font-bold text-xs border-slate-200 flex items-center gap-2">
                <Printer className="h-4 w-4" /> Save as PDF
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(alumni.id)} className="h-10 w-10 p-0 rounded-lg border-slate-200">
                  <Pencil className="h-4 w-4 text-slate-600" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-10 w-10 p-0 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 2. Scrollable Modal Content (HIDDEN ON PRINT) */}
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12 bg-white no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="col-span-1 border-r border-slate-100 pr-0 lg:pr-10 shrink-0">
                <div className="sticky top-0 space-y-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Award className="h-3.5 w-3.5" /> Virtual Identity
                  </div>
                  <AlumniIdCard alumni={alumni} />
                  <div className="pt-6 space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Connect</p>
                    <div className="flex flex-col gap-2">
                      {socialLinks.map(link => (
                        <a key={link.id} href={formatSocialLink(link.value as string, link.id)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
                          <link.icon className={`h-4 w-4 ${link.color}`} />
                          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest">
                      <User className="h-4 w-4 text-indigo-500" /> Bio Information
                    </div>
                    <div className="space-y-3">
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Primary Contact</p><p className="text-sm font-semibold">{alumni.mobileNumber || 'N/A'}</p></div>
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Email Index</p><p className="text-sm font-semibold truncate">{alumni.email || 'N/A'}</p></div>
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Location Basis</p><p className="text-sm font-semibold">{alumni.place || 'N/A'}, {alumni.district || 'N/A'}</p></div>
                    </div>
                  </section>
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest">
                      <Briefcase className="h-4 w-4 text-indigo-500" /> Career Trajectory
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Organization</p>
                        <p className="text-xs font-bold text-slate-900">{alumni.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Current Designation</p>
                        <p className="text-xs font-semibold text-slate-700">{alumni.currentJobTitle || 'N/A'}</p>
                      </div>
                      {alumni.areasOfExpertise && (<div><p className="text-[9px] font-bold text-slate-400 uppercase">Domain Expertise</p><p className="text-sm font-semibold text-slate-600 leading-relaxed">{alumni.areasOfExpertise}</p></div>)}
                    </div>
                  </section>
                </div>
                <div className="h-[1.5px] bg-slate-100" />
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest"><Heart className="h-4 w-4 text-rose-500" /> Personal Reflection</div>
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl relative">
                    <div className="absolute top-4 left-6 text-slate-200 text-6xl font-serif">"</div>
                    <p className="text-base italic font-medium text-slate-600 leading-relaxed relative z-10 pl-6">{alumni.messageToTeacher || 'No reflection provided for current registry update.'}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-300 uppercase tracking-widest shrink-0 no-print">
            <p>Yes India Alumni Management System &copy; 2026</p>
            <div className="flex gap-6 items-center">
              <button className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Direct Link</button>
              {onDelete && (<button onClick={() => onDelete(alumni.id)} className="text-rose-300 hover:text-rose-500 transition-colors">Erase Record</button>)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniDetailsDialog;