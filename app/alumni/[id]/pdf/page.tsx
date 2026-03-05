// app/alumni/[id]/pdf/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AlumniPDFPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [alumni, setAlumni] = useState<(AlumniData & { id: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const alumniRef = ref(database, `alumni/${id}`);
        const unsubscribe = onValue(alumniRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setAlumni({ ...data, id });
            setLoading(false);
        });
        const originalTitle = document.title;
        document.title = ' ';
        return () => { unsubscribe(); document.title = originalTitle; };
    }, [id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return 'N/A';
            return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return 'N/A'; }
    };

    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
    );

    if (!alumni) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
            <h1 className="text-lg font-semibold text-gray-700">Profile Not Found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    );

    const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
        <div className="grid items-baseline py-[6.5px] border-b border-gray-100/60"
            style={{ gridTemplateColumns: '170px 15px 1fr' }}>
            <span style={{ fontSize: '7.5px', letterSpacing: '0.12em' }}
                className="font-black text-gray-400 uppercase font-sans">
                {label}
            </span>
            <span style={{ fontSize: '9px' }} className="text-gray-300 ml-1">:</span>
            <span style={{ fontSize: '11px', fontFamily: 'serif' }}
                className="font-medium text-gray-800 leading-snug tracking-tight">
                {value || '—'}
            </span>
        </div>
    );

    const SectionHeading = ({ number, title }: { number: string; title: string }) => (
        <div className="flex items-center gap-2 mb-3 mt-6">
            <span style={{ fontSize: '7px' }}
                className="font-black text-gray-300 tracking-widest uppercase tabular-nums">
                {number}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
            <span style={{ fontSize: '7px' }}
                className="font-black text-gray-400 tracking-widest uppercase">
                {title}
            </span>
            <div className="w-4 h-px bg-gray-200" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white p-6 sm:p-10">

            {/* Control Bar */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print">
                <Button variant="ghost" onClick={() => router.back()}
                    className="gap-2 font-semibold text-gray-500 hover:text-gray-900 rounded-xl text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex gap-3">
                    <Button onClick={() => router.push(`/alumni/${id}/id-card`)} variant="outline"
                        className="rounded-xl gap-2 font-semibold px-6 text-sm border-gray-200">
                        <ShieldCheck className="h-3.5 w-3.5" /> View ID Card
                    </Button>
                    <Button onClick={() => window.print()}
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl gap-2 font-semibold px-6 text-sm">
                        <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                    </Button>
                </div>
            </div>

            {/* ── Document Container ── */}
            <div className="mx-auto flex flex-col gap-6 print-container" style={{ width: '210mm' }}>

                {/* ── PAGE 1 ── */}
                <div className="bg-white shadow-sm print:shadow-none flex flex-col print-page"
                    style={{ width: '210mm', minHeight: '296mm', position: 'relative' }}>

                    {/* Top rule */}
                    <div style={{ height: '5px', background: '#000' }} />
                    <div style={{ height: '1.5px', background: '#e5e7eb', marginTop: '2px' }} />

                    <div className="flex-1 flex flex-col" style={{ padding: '12mm 18mm' }}>
                        {/* ── HEADER ── */}
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-6">
                                <img src="/logo.png" alt="YES INDIA" style={{ height: '42px', width: 'auto' }} />
                                <div className="h-10 w-px bg-gray-200" />
                                <div>
                                    <h1 style={{ fontSize: '18px', letterSpacing: '0.1em' }}
                                        className="font-black text-gray-900 uppercase font-sans leading-none mb-1">
                                        Alumni Profile
                                    </h1>
                                    <p style={{ fontSize: '7.5px' }} className="text-gray-400 tracking-[0.3em] uppercase font-bold">
                                        Official Registry Record
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div style={{
                                    border: '1px solid #d1d5db',
                                    padding: '1px',
                                    background: '#fff',
                                    boxShadow: '0 0 0 1px #f3f4f6'
                                }}>
                                    <Avatar style={{ height: '32mm', width: '25mm', borderRadius: 0 }}>
                                        <AvatarImage src={alumni.photoURL} className="object-cover" style={{ borderRadius: 0, objectPosition: 'center 15%' }} />
                                        <AvatarFallback style={{ borderRadius: 0, background: '#f9fafb', color: '#e5e7eb', fontSize: '24px', fontWeight: '900' }}>
                                            {alumni.fullName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>

                        {/* ── IDENTITY BANNER ── */}
                        <div className="flex items-center justify-between mb-10 px-6 py-5 bg-gray-900 text-white rounded-[2px]">
                            <div>
                                <p style={{ fontSize: '7.5px' }} className="font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">
                                    Alumni Identity
                                </p>
                                <h2 style={{ fontSize: '24px', letterSpacing: '0.02em', fontFamily: 'serif' }}
                                    className="font-medium uppercase leading-none">
                                    {alumni.fullName}
                                </h2>
                            </div>
                            <div className="text-right border-l border-gray-800 pl-8 ml-6">
                                <p style={{ fontSize: '7.5px' }} className="font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">
                                    Batch
                                </p>
                                <p style={{ fontSize: '24px', fontFamily: 'serif' }}
                                    className="font-medium">{alumni.yearOfGraduation}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mb-8 px-2">
                            <div>
                                <p style={{ fontSize: '7px' }} className="font-black uppercase tracking-[0.3em] text-gray-300">
                                    Registration Date
                                </p>
                                <p style={{ fontSize: '10px', fontFamily: 'serif' }} className="font-bold text-gray-600 mt-1">
                                    {formatDate(alumni.registrationDate)}
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gray-100" />
                            <div className="text-right border border-gray-200 px-4 py-1">
                                <p style={{ fontSize: '6px' }} className="font-black uppercase tracking-[0.5em] text-gray-400">
                                    Status: Verified Record
                                </p>
                            </div>
                        </div>

                        <SectionHeading number="01" title="Personal & Contact Information" />
                        <div className="grid grid-cols-1 gap-0 mb-6 px-1">
                            <Field label="Full Name" value={alumni.fullName} />
                            <Field label="Email Address" value={alumni.email} />
                            <Field label="Mobile Number" value={alumni.mobileNumber} />
                            <Field label="WhatsApp Number" value={alumni.whatsappNumber} />
                            <Field label="Residential Address" value={alumni.address} />
                            <Field label="City / Place" value={alumni.place} />
                            <Field label="District" value={alumni.district} />
                            <Field label="State" value={alumni.state} />
                            <Field label="Pin Code" value={alumni.pinCode} />
                        </div>

                        <SectionHeading number="02" title="Academic Record" />
                        <div className="grid grid-cols-1 gap-0 mb-6 px-1">
                            <Field label="School Attended" value={alumni.schoolAttended} />
                            <Field label="Year of Graduation" value={alumni.yearOfGraduation} />
                            <Field label="Last Class Attended" value={alumni.lastClassAttended} />
                            <Field label="University / College" value={alumni.university} />
                            <Field label="Primary Qualification" value={alumni.qualification} />
                            <Field label="Additional Qualification" value={alumni.additionalQualification} />
                        </div>

                        <div className="mt-auto pt-10 text-center">
                            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '8px' }} />
                            <p style={{ fontSize: '7px', letterSpacing: '0.4em' }}
                                className="font-bold text-gray-300 uppercase font-sans">
                                YES INDIA FOUNDATION · Alumni Record · Page 01
                            </p>
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div style={{ height: '1.5px', background: '#e5e7eb' }} />
                    <div style={{ height: '5px', background: '#000', marginTop: '2px' }} />
                </div>

                {/* ── PAGE BREAK INDICATOR (WEB) ── */}
                <div className="no-print h-12 flex items-center justify-center">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="px-6 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] whitespace-nowrap">Page 02 Below</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* ── PAGE 2 ── */}
                <div className="bg-white shadow-sm print:shadow-none flex flex-col print-page"
                    style={{ width: '210mm', minHeight: '296mm' }}>

                    {/* Top rule */}
                    <div style={{ height: '5px', background: '#000' }} />
                    <div style={{ height: '1.5px', background: '#e5e7eb', marginTop: '2px' }} />

                    <div className="flex-1 flex flex-col" style={{ padding: '12mm 18mm' }}>

                        <SectionHeading number="03" title="Professional Profile" />
                        <div className="grid grid-cols-1 gap-0 mb-6 px-1">
                            <Field label="Current Designation" value={alumni.currentJobTitle} />
                            <Field label="Organisation / Company" value={alumni.companyName} />
                            <Field label="Industry / Sector" value={alumni.industry} />
                            <Field label="Years of Experience" value={alumni.yearsOfExperience ? `${alumni.yearsOfExperience} Years` : undefined} />
                            <Field label="Areas of Expertise" value={alumni.areasOfExpertise} />
                            <Field label="Professional Interests" value={alumni.professionalInterests} />
                        </div>

                        {[alumni.linkedinLink, alumni.facebookLink, alumni.instagramLink, alumni.twitterLink, alumni.socialMediaLink].some(Boolean) && (
                            <>
                                <SectionHeading number="04" title="Digital Presence" />
                                <div className="grid grid-cols-1 gap-0 mb-6 px-1">
                                    {alumni.linkedinLink && <Field label="LinkedIn" value={alumni.linkedinLink} />}
                                    {alumni.facebookLink && <Field label="Facebook" value={alumni.facebookLink} />}
                                    {alumni.instagramLink && <Field label="Instagram" value={alumni.instagramLink} />}
                                    {alumni.twitterLink && <Field label="Twitter / X" value={alumni.twitterLink} />}
                                    {alumni.socialMediaLink && <Field label="Website / Portfolio" value={alumni.socialMediaLink} />}
                                </div>
                            </>
                        )}

                        <SectionHeading number="05" title="Involvement & Reflections" />
                        <div className="grid grid-cols-1 gap-0 mb-6 px-1">
                            <Field label="Areas of Involvement" value={alumni.stayInvolved?.join(', ')} />
                        </div>

                        {alumni.messageToTeacher && (
                            <div style={{ marginTop: '20px', border: '1px solid #f3f4f6', padding: '16px 20px', background: '#fcfcfc' }}>
                                <p style={{ fontSize: '7.5px' }} className="font-black uppercase tracking-[0.4em] text-gray-400 mb-3">
                                    Personal Message to Teachers
                                </p>
                                <p style={{ fontSize: '11px', fontFamily: 'serif', fontStyle: 'italic', letterSpacing: '-0.01em' }}
                                    className="text-gray-700 leading-relaxed font-medium">
                                    "{alumni.messageToTeacher}"
                                </p>
                            </div>
                        )}

                        <div className="mt-auto pt-10 text-center">
                            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '8px' }} />
                            <p style={{ fontSize: '7px', letterSpacing: '0.4em' }}
                                className="font-bold text-gray-300 uppercase font-sans">
                                YES INDIA Alumni Registry · Official Record · Page 02
                            </p>
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div style={{ height: '1.5px', background: '#e5e7eb' }} />
                    <div style={{ height: '5px', background: '#000', marginTop: '2px' }} />
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0 !important;
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print { display: none !important; }
                    .print-page {
                        page-break-after: always !important;
                        page-break-inside: avoid !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-page:last-child {
                        page-break-after: auto !important;
                    }
                    .print-container {
                        width: 210mm !important;
                        max-width: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}