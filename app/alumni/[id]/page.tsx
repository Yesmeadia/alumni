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
            <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
                <DashboardHeader />

                <main className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl relative">
                    {/* Ambient Background UI */}
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                    {/* Main Action Bar */}
                    <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
                        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="rounded-2xl h-12 gap-2 font-bold px-5 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <ArrowLeft className="h-5 w-5" /> Dashboard
                        </Button>
                        <div className="flex flex-wrap gap-3">
                            <Link href={`/alumni/${id}/edit`}>
                                <Button className="bg-slate-800/50 hover:bg-slate-800 text-white rounded-2xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6 border border-white/10 backdrop-blur-md transition-all shadow-lg hover:shadow-indigo-500/10">
                                    <Pencil className="h-4 w-4" /> Edit Record
                                </Button>
                            </Link>
                            <Link href={`/alumni/${id}/id-card`}>
                                <Button className="bg-slate-800/50 hover:bg-slate-800 text-white rounded-2xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6 border border-white/10 backdrop-blur-md transition-all shadow-lg hover:shadow-indigo-500/10">
                                    <ShieldCheck className="h-4 w-4" /> Alumni ID Card
                                </Button>
                            </Link>
                            <Link href={`/alumni/${id}/pdf`}>
                                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-indigo-600/20 transition-all border border-indigo-500/50">
                                    <Download className="h-4 w-4" /> Download Official Doc
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col min-h-[70vh] backdrop-blur-2xl relative">

                        {/* Top Banner section */}
                        <div className="relative shrink-0 border-b border-white/5">
                            <div className="h-72 w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent" />

                                {/* Batch Info positioned aesthetically */}
                                <div className="absolute bottom-12 right-12 text-right opacity-90 hidden md:block">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Administrative Registry</p>
                                    <h4 className="text-white/90 text-4xl font-black italic tracking-widest uppercase filter drop-shadow-lg">
                                        CLASS OF {alumni.yearOfGraduation}
                                    </h4>
                                </div>
                            </div>

                            <div className="px-8 md:px-16 -mt-32 pb-12 relative z-10">
                                <div className="flex flex-col md:flex-row items-end gap-10 md:gap-16">
                                    <div className="relative shrink-0 group">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-[3.5rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                                        <div className="relative rounded-[3.5rem] p-1.5 bg-gradient-to-b from-white/20 to-white/5 shadow-2xl backdrop-blur-sm">
                                            <Avatar className="h-48 w-48 md:h-64 md:w-64 bg-slate-950 rounded-[3.1rem] overflow-hidden">
                                                <AvatarImage src={alumni.photoURL} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <AvatarFallback className="text-6xl md:text-8xl font-black bg-slate-900 text-indigo-400">
                                                    {alumni.fullName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 h-14 w-14 bg-[#020617] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-xl">
                                            <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 pb-6 w-full text-center md:text-left">
                                        <div className="space-y-4 mb-10 w-full">
                                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none filter drop-shadow-sm">
                                                {alumni.fullName}
                                            </h1>
                                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center md:justify-start">
                                                <div className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                                    <p className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em]">
                                                        {alumni.currentJobTitle || 'Alumni Member'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5">
                                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                    <p className="text-sm font-black text-slate-300 uppercase tracking-[0.15em]">
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
                                                    <Button className={`rounded-xl h-12 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white px-6 shadow-sm transition-all duration-300 flex items-center gap-3`}>
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

                        {/* Content Body */}
                        <div className="flex-1 p-8 md:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                                
                                {/* Column 1: Contact & Personal */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-indigo-400" /> Identity & Contact
                                        </h3>
                                        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-sm backdrop-blur-md">
                                            <div className="flex items-center gap-5 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                                    <Phone className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile</p>
                                                    <p className="text-base font-black text-slate-200">{alumni.mobileNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                                    <Mail className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                                                    <p className="text-base font-black text-slate-200 truncate" title={alumni.email}>{alumni.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.02] transition-colors">
                                                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                                    <MapPin className="h-5 w-5 text-rose-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                                                    <p className="text-base font-black text-slate-200 leading-snug">
                                                        {[alumni.place, alumni.district, alumni.state].filter(Boolean).join(', ') || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {alumni.messageToTeacher && (
                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                                <MessageSquare className="h-4 w-4 text-indigo-400" /> Reflection
                                            </h3>
                                            <div className="bg-gradient-to-br from-indigo-900/60 to-indigo-950/60 border border-indigo-500/20 rounded-[2rem] p-8 text-indigo-100 shadow-xl relative overflow-hidden backdrop-blur-md">
                                                <MessageCircle className="absolute -bottom-6 -right-6 h-32 w-32 text-indigo-500/10" />
                                                <p className="text-base italic font-medium leading-relaxed relative z-10">
                                                    "{alumni.messageToTeacher}"
                                                </p>
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Column 2: Education & Professional */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <GraduationCap className="h-4 w-4 text-emerald-400" /> Professional DNA
                                        </h3>
                                        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 shadow-sm backdrop-blur-md">
                                            <div className="relative pl-8 border-l-2 border-slate-700 space-y-10">
                                                <div className="relative">
                                                    <span className="absolute -left-[37px] top-1 h-4 w-4 rounded-full bg-emerald-500 border-[4px] border-[#0f172a] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    <p className="text-lg font-black text-slate-200">{alumni.schoolAttended || 'YES INDIA School'}</p>
                                                    <p className="text-xs text-emerald-400 font-bold mt-1.5 uppercase tracking-widest">Class of {alumni.yearOfGraduation}</p>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-[37px] top-1 h-4 w-4 rounded-full bg-indigo-500 border-[4px] border-[#0f172a]" />
                                                    <p className="text-lg font-black text-slate-200">{alumni.university || 'Higher Education'}</p>
                                                    {alumni.qualification && (
                                                        <Badge className="mt-3 bg-white/5 text-slate-300 border border-white/10 text-[10px] font-black rounded-lg px-3 py-1">
                                                            {alumni.qualification}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Mastery & Experience</h3>
                                        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 shadow-sm backdrop-blur-md">
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {(alumni.areasOfExpertise || 'General').split(',').map((skill, i) => (
                                                    <span key={i} className="px-4 py-2 bg-[#020617] border border-white/10 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Exp.</p>
                                                    <p className="text-base font-black text-slate-200">{alumni.yearsOfExperience ? `${alumni.yearsOfExperience} yrs` : 'Fresh Talent'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industrial Sector</p>
                                                    <p className="text-base font-black text-slate-200">{alumni.industry || 'Global Reach'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Column 3: Registry Status */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <ShieldCheck className="h-4 w-4 text-blue-400" /> Registry Verification
                                        </h3>
                                        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-sm backdrop-blur-md">
                                            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrolled On</span>
                                                <span className="text-sm font-black text-slate-300">{formatDate(alumni.registrationDate)}</span>
                                            </div>
                                            <div className="flex justify-between items-center px-6 py-5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</span>
                                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-1.5 text-[10px] font-black flex gap-2 items-center italic tracking-widest">
                                                    VERIFIED <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                                </Badge>
                                            </div>
                                        </div>
                                    </section>

                                    {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Community Commitment</h3>
                                            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-[2rem] p-8 backdrop-blur-md">
                                                <div className="flex flex-wrap gap-3">
                                                    {alumni.stayInvolved.map((item, i) => (
                                                        <span key={i} className="px-4 py-2 bg-[#020617]/50 border border-white/10 text-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
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
                        <div className="px-8 md:px-16 py-6 bg-slate-950/80 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center md:text-left">
                                YES INDIA ALUMNI MANAGEMENT SYSTEM &copy; {new Date().getFullYear()}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Encrypted Data Link</span>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
