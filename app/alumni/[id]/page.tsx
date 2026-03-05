// app/alumni/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Download, Pencil, Trash2,
    Phone, Mail, MapPin, GraduationCap,
    Linkedin, Facebook, Instagram, Twitter, Globe,
    MessageSquare, MessageCircle, ShieldCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AlumniDetailsPage() {
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
            if (data) {
                setAlumni({ ...data, id });
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return 'N/A'; }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!alumni) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Alumni Not Found</h1>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const socialLinks = [
        { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: Linkedin, iconColor: 'text-[#0077b5]', hoverBg: 'hover:bg-[#0077b5]', border: 'border-blue-100' },
        { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: Facebook, iconColor: 'text-[#1877F2]', hoverBg: 'hover:bg-[#1877F2]', border: 'border-blue-100' },
        { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: Instagram, iconColor: 'text-[#E4405F]', hoverBg: 'hover:bg-[#E4405F]', border: 'border-pink-100' },
        { id: 'twitter', label: 'Twitter / X', value: alumni.twitterLink, icon: Twitter, iconColor: 'text-slate-600', hoverBg: 'hover:bg-slate-900', border: 'border-slate-200' },
        { id: 'email', label: 'Direct Email', value: alumni.email, icon: Mail, iconColor: 'text-indigo-500', hoverBg: 'hover:bg-indigo-600', border: 'border-indigo-100' },
        { id: 'website', label: 'Portfolio', value: alumni.socialMediaLink, icon: Globe, iconColor: 'text-emerald-500', hoverBg: 'hover:bg-emerald-600', border: 'border-emerald-100' },
    ].filter(l => !!l.value);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFC]">
                <DashboardHeader />

                <main className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Main Action Bar */}
                    <div className="mb-8 flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="rounded-xl h-12 gap-2 font-bold px-4">
                            <ArrowLeft className="h-4 w-4" /> Dashboard
                        </Button>
                        <div className="flex gap-3">
                            <Link href={`/alumni/${id}/edit`}>
                                <Button variant="outline" className="rounded-xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6 border-slate-200">
                                    <Pencil className="h-4 w-4" /> Edit Record
                                </Button>
                            </Link>
                            <Link href={`/alumni/${id}/id-card`}>
                                <Button variant="outline" className="rounded-xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6 border-slate-200 hover:bg-slate-50">
                                    <ShieldCheck className="h-4 w-4" /> Get Alumni ID Card
                                </Button>
                            </Link>
                            <Link href={`/alumni/${id}/pdf`}>
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6">
                                    <Download className="h-4 w-4" /> Download Official Doc
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col min-h-[70vh]">

                        {/* Design elements from Dialog */}
                        <div className="relative shrink-0">
                            <div className="h-64 w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                {/* Batch Info */}
                                <div className="absolute bottom-10 right-16 text-right opacity-80">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Administrative Registry</p>
                                    <h4 className="text-white text-3xl font-black italic tracking-widest uppercase">
                                        CLASS OF {alumni.yearOfGraduation}
                                    </h4>
                                </div>
                            </div>

                            <div className="px-16 -mt-32 pb-12 relative z-10">
                                <div className="flex flex-col md:flex-row items-end gap-16">
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-[4rem] blur-3xl opacity-30" />
                                        <Avatar className="h-64 w-64 ring-[20px] ring-white shadow-4xl bg-white rounded-[4rem] relative overflow-hidden transition-transform duration-700 hover:scale-105 border-4 border-slate-50">
                                            <AvatarImage src={alumni.photoURL} className="object-cover" />
                                            <AvatarFallback className="text-7xl font-black bg-slate-50 text-indigo-200">
                                                {alumni.fullName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 h-16 w-16 bg-emerald-500 border-[12px] border-white rounded-[2rem] shadow-2xl flex items-center justify-center">
                                            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="flex-1 pb-6">
                                        <div className="space-y-4 mb-12 text-center md:text-left">
                                            <h1 className="text-7xl font-black text-indigo-950 tracking-tighter leading-none">
                                                {alumni.fullName}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-3 w-3 rounded-full bg-indigo-600" />
                                                    <p className="text-lg font-black text-indigo-600 uppercase tracking-[0.2em]">
                                                        {alumni.currentJobTitle || 'Alumni Member'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                                                    <p className="text-lg font-black text-slate-400 uppercase tracking-[0.15em]">
                                                        {alumni.companyName || 'Verified Professional'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                            {socialLinks.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.id === 'email' ? `mailto:${link.value}` : formatSocialLink(link.value as string, link.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group/social"
                                                >
                                                    <Button className={`rounded-2xl h-14 bg-white border ${link.border} text-slate-600 ${link.hoverBg} hover:text-white px-8 shadow-sm transition-all duration-300 flex items-center gap-4`}>
                                                        <link.icon className={`h-5 w-5 ${link.iconColor} group-hover/social:text-white transition-colors`} />
                                                        <span className="text-xs font-black uppercase tracking-[0.15em]">{link.label}</span>
                                                    </Button>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 bg-slate-50/50 px-16 py-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Same content sections as Dialog but scaled up */}
                                {/* Column 1: Contact & Personal */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <Phone className="h-4 w-4" /> Identity & Contact
                                        </h3>
                                        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden divide-y divide-slate-100 shadow-sm">
                                            <div className="flex items-center gap-5 px-8 py-6">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Phone className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile</p>
                                                    <p className="text-lg font-black text-slate-900">{alumni.mobileNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 px-8 py-6">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                    <Mail className="h-5 w-5 text-indigo-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                                    <p className="text-lg font-black text-slate-900 truncate" title={alumni.email}>{alumni.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 px-8 py-6">
                                                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                                                    <MapPin className="h-5 w-5 text-rose-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                                                    <p className="text-lg font-black text-slate-900 leading-snug">
                                                        {[alumni.place, alumni.district, alumni.state].filter(Boolean).join(', ') || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {alumni.messageToTeacher && (
                                        <section>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Reflection</h3>
                                            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                                                <MessageSquare className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10" />
                                                <p className="text-lg italic font-medium leading-relaxed relative z-10">
                                                    "{alumni.messageToTeacher}"
                                                </p>
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Column 2: Education & Professional */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <GraduationCap className="h-5 w-5" /> Professional DNA
                                        </h3>
                                        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 shadow-sm">
                                            <div className="relative pl-8 border-l-4 border-indigo-100 space-y-12">
                                                <div className="relative">
                                                    <span className="absolute -left-[42px] top-1.5 h-6 w-6 rounded-full bg-indigo-600 border-[6px] border-white shadow-xl" />
                                                    <p className="text-xl font-black text-slate-900">{alumni.schoolAttended || 'YES INDIA School'}</p>
                                                    <p className="text-sm text-indigo-600 font-black mt-1 uppercase tracking-wider">Class of {alumni.yearOfGraduation}</p>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[42px] top-1.5 h-6 w-6 rounded-full bg-slate-300 border-[6px] border-white shadow-xl" />
                                                    <p className="text-xl font-black text-slate-900">{alumni.university || 'Higher Education'}</p>
                                                    {alumni.qualification && (
                                                        <Badge className="mt-3 bg-slate-100 text-slate-600 border-0 text-[11px] font-black rounded-xl px-4 py-1.5">
                                                            {alumni.qualification}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Mastery & Experience</h3>
                                        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 shadow-sm">
                                            <div className="flex flex-wrap gap-3 mb-10">
                                                {(alumni.areasOfExpertise || 'General').split(',').map((skill, i) => (
                                                    <span key={i} className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-tight">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Exp.</p>
                                                    <p className="text-xl font-black text-slate-900">{alumni.yearsOfExperience ? `${alumni.yearsOfExperience}nd Generation` : 'Fresh Talent'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industrial Sector</p>
                                                    <p className="text-xl font-black text-slate-900">{alumni.industry || 'Global Reach'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Column 3: Registry Status */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <ShieldCheck className="h-5 w-5" /> Registry Verification
                                        </h3>
                                        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-sm divide-y divide-slate-100">
                                            <div className="flex justify-between items-center px-10 py-6">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Enrolled On</span>
                                                <span className="text-lg font-black text-slate-900">{formatDate(alumni.registrationDate)}</span>
                                            </div>
                                            <div className="flex justify-between items-center px-10 py-6">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                                                <Badge className="bg-emerald-500 text-white border-0 rounded-2xl px-6 py-2 text-[11px] font-black flex gap-3 items-center italic tracking-widest shadow-xl shadow-emerald-100">
                                                    VERIFIED ACTIVE <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                                                </Badge>
                                            </div>
                                        </div>
                                    </section>

                                    {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Community Commitment</h3>
                                            <div className="bg-emerald-500 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-100">
                                                <div className="flex flex-wrap gap-4">
                                                    {alumni.stayInvolved.map((item, i) => (
                                                        <span key={i} className="px-5 py-2.5 bg-white/20 border border-white/30 rounded-2xl text-[11px] font-black uppercase tracking-widest">
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

                        {/* Global Footer */}
                        <div className="px-16 py-8 bg-white border-t border-slate-100 flex justify-between items-center">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                YES INDIA ALUMNI MANAGEMENT SYSTEM &copy; 2026
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Encrypted Document Link</span>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
