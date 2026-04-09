// components/dashboard/AlumniProfilePrintView.tsx
'use client';

import React from 'react';
import { User, Briefcase, Heart } from 'lucide-react';
import { AlumniData } from '@/lib/types';
import PrintProfileHeader from './PrintProfileHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AlumniProfilePrintViewProps {
  alumni: AlumniData & { id: string };
}

const AlumniProfilePrintView: React.FC<AlumniProfilePrintViewProps> = ({ alumni }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="print-only-container hidden print:block bg-white p-[10mm] min-h-screen w-full">
      {/* 1. Centered Formal Header */}
      <PrintProfileHeader id={alumni.id} />

      <div className="space-y-4">
        {/* 2. Sided Identity Section */}
        <section className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">Batch of {alumni.yearOfGraduation}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-[-0.05em] leading-none mb-2">{alumni.fullName?.toUpperCase()}</h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span className="text-slate-900">{alumni.schoolAttended}</span>
              </div>
            </div>
            <div className="shrink-0">
               <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-slate-100 ring-4 ring-slate-50">
                  <img src={alumni.photoURL || undefined} alt={alumni.fullName} className="h-full w-full object-cover" />
               </div>
            </div>
        </section>

        {/* 3. Compact Data Grid */}
        <div className="grid grid-cols-2 gap-8 pt-4">
            {/* Column 1: Bio Info */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1.5">
                    <User className="h-3.5 w-3.5" /> Personal Profile
                </div>
                <div className="space-y-3 pt-1">
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Contact Number</p>
                        <p className="text-xs font-semibold text-slate-900">{alumni.mobileNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Email Address</p>
                        <p className="text-xs font-semibold text-slate-900">{alumni.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Residential Location</p>
                        <p className="text-xs font-semibold text-slate-900">{alumni.place || 'N/A'}, {alumni.district || 'N/A'}, {alumni.state || 'N/A'}</p>
                    </div>
                </div>
            </section>

            {/* Column 2: Career Info */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Professional Data
                </div>
                <div className="space-y-3 pt-1">
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Organization</p>
                        <p className="text-xs font-bold text-slate-900">{alumni.companyName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Current Designation</p>
                        <p className="text-xs font-semibold text-slate-700">{alumni.currentJobTitle || 'N/A'}</p>
                    </div>
                    {alumni.areasOfExpertise && (
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Key Expertise</p>
                            <p className="text-xs font-semibold text-slate-600 leading-tight">{alumni.areasOfExpertise}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>

        {/* 4. Reflection - Scaled for 1 Page */}
        <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1.5 w-full">
                <Heart className="h-3.5 w-3.5 text-rose-500" /> Student Reflection
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 italic font-medium text-slate-600 leading-relaxed text-sm relative">
                <div className="absolute top-2 left-4 text-slate-200 text-4xl font-serif">"</div>
                <div className="pl-6 relative z-10">
                   {alumni.messageToTeacher || 'No statement provided for this registry update.'}
                </div>
            </div>
        </section>

        {/* 5. Minimalist Footnote */}
        <div className="pt-12 mt-auto border-t border-slate-900">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-900 uppercase">Validation Signature</p>
                    <div className="h-10 w-48 border-b border-slate-300" />
                    <p className="text-[7px] font-bold text-slate-400 tracking-wide uppercase font-sans">YES INDIA ALUMNI REGISTRATION AUTHORITY</p>
                </div>
                <div className="text-right space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-900 tracking-tighter">REGISTRY ID: {alumni.id.substring(0, 16).toUpperCase()}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">OFFICIAL REGISTERED PROFILE RECORD</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">
                      GENERATED: {mounted ? new Date().toLocaleString() : 'LOADING...'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfilePrintView;
