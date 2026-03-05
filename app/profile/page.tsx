// app/profile/page.tsx
'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, ShieldCheck, MapPin, Calendar, Clock, Edit2, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin User');

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFC]">
                <DashboardHeader />

                <main className="container mx-auto px-4 py-12 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Profile Overview Card */}
                        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white mb-8">
                            <div className="h-40 bg-gradient-to-r from-indigo-600 to-blue-700 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            </div>

                            <CardContent className="px-10 pb-10">
                                <div className="relative flex flex-col md:flex-row items-end gap-8 -mt-16">
                                    <div className="relative">
                                        <Avatar className="h-40 w-40 ring-[12px] ring-white shadow-2xl rounded-[2.5rem] bg-white">
                                            <AvatarImage src={user?.photoURL || ''} />
                                            <AvatarFallback className="text-5xl font-black bg-slate-50 text-indigo-200 uppercase">
                                                {displayName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 border-8 border-white rounded-2xl shadow-xl flex items-center justify-center">
                                            <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left pb-4">
                                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-2">
                                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                                                {displayName}
                                            </h1>
                                            <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                                <ShieldCheck className="h-3 w-3" /> System Administrator
                                            </div>
                                        </div>
                                        <p className="text-slate-500 font-bold text-lg uppercase tracking-wide">
                                            Yes India Alumni Network
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pb-4">
                                        <Button className="rounded-2xl h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl transition-all">
                                            <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Details */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-200/50 bg-white">
                                    <CardHeader className="p-6 pb-2">
                                        <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="h-4 w-4" /> Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2 space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                                <p className="text-slate-900 font-black truncate">{user?.email || 'admin@yesindia.org'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Role</p>
                                                <p className="text-slate-900 font-black">Super Admin</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Hub</p>
                                                <p className="text-slate-900 font-black">Malappuram, Kerala</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-200/50 bg-white">
                                    <CardHeader className="p-6 pb-2">
                                        <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> System Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2 space-y-5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Last Login</span>
                                            <span className="text-slate-900 font-black">Today, 09:45 AM</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Session Status</span>
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-0 flex gap-1.5 items-center px-3 font-black text-[10px]">
                                                ACTIVE
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Activity/Settings */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-200/50 bg-white h-full">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-2xl font-black text-slate-900">Control Panel Settings</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium font-bold uppercase tracking-widest text-[11px]">
                                            Manage your administrative preferences
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Button variant="outline" className="h-20 rounded-2xl border-slate-100 hover:bg-slate-50 hover:border-indigo-100 flex flex-col items-center justify-center p-4 transition-all group">
                                                <SettingsIcon className="h-6 w-6 text-slate-400 mb-2 group-hover:text-indigo-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Settings</span>
                                            </Button>
                                            <Button variant="outline" className="h-20 rounded-2xl border-slate-100 hover:bg-slate-50 hover:border-indigo-100 flex flex-col items-center justify-center p-4 transition-all group">
                                                <Calendar className="h-6 w-6 text-slate-400 mb-2 group-hover:text-emerald-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity Logs</span>
                                            </Button>
                                            <Button variant="outline" className="h-20 rounded-2xl border-slate-100 hover:bg-slate-50 hover:border-indigo-100 flex flex-col items-center justify-center p-4 transition-all group">
                                                <Mail className="h-6 w-6 text-slate-400 mb-2 group-hover:text-blue-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notification Hub</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => logout()}
                                                className="h-20 rounded-2xl border-slate-100 hover:bg-rose-50 hover:border-rose-100 flex flex-col items-center justify-center p-4 transition-all group"
                                            >
                                                <LogOut className="h-6 w-6 text-slate-400 mb-2 group-hover:text-rose-600" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Terminate Session</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`px-2 py-0.5 rounded-full ${className}`}>
            {children}
        </span>
    );
}
