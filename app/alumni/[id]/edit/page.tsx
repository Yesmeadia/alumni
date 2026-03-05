// app/alumni/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ref, onValue, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, GraduationCap, Briefcase, Share2, Save, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditAlumniPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [formData, setFormData] = useState<Partial<AlumniData>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        if (!id) return;
        const alumniRef = ref(database, `alumni/${id}`);
        const unsubscribe = onValue(alumniRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setFormData(data);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const handleChange = (field: keyof AlumniData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: keyof AlumniData, value: string) => {
        const arrayValue = value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, [field]: arrayValue }));
    };

    const inputValue = (val: any) => {
        if (Array.isArray(val)) return val.join(', ');
        return val || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(ref(database, `alumni/${id}`), {
                ...formData,
                updatedAt: Date.now()
            });
            router.back();
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update record');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8FAFC]">
                <DashboardHeader />

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="rounded-xl h-12 w-12 p-0 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <ArrowLeft className="h-6 w-6" />
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 leading-none">Edit Alumni</h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                                        Member Registry ID: <span className="text-indigo-600">{id.substring(0, 8).toUpperCase()}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
                                <div className="px-10 pt-8 bg-slate-50/50 border-b border-slate-100">
                                    <TabsList className="bg-slate-200/50 p-1.5 rounded-2xl w-full grid grid-cols-4 h-14 mb-8">
                                        <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <User className="h-4 w-4" /> Personal
                                        </TabsTrigger>
                                        <TabsTrigger value="education" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" /> Education
                                        </TabsTrigger>
                                        <TabsTrigger value="professional" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" /> Professional
                                        </TabsTrigger>
                                        <TabsTrigger value="social" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <Share2 className="h-4 w-4" /> Social
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="p-10">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <TabsContent value="personal" className="space-y-8 mt-0 outline-none">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-950">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.fullName)} onChange={(e) => handleChange('fullName', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</Label>
                                                        <Input type="email" className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.email)} onChange={(e) => handleChange('email', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Number</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.mobileNumber)} onChange={(e) => handleChange('mobileNumber', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">WhatsApp Number</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.whatsappNumber)} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
                                                    </div>
                                                    <div className="col-span-2 space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Address</Label>
                                                        <Textarea className="min-h-[120px] rounded-[2rem] bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 p-6" value={inputValue(formData.address)} onChange={(e) => handleChange('address', e.target.value)} />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="education" className="space-y-8 mt-0 outline-none">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-950">
                                                    <div className="col-span-2 space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">School Attended</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.schoolAttended)} onChange={(e) => handleChange('schoolAttended', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Batch Year</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.yearOfGraduation)} onChange={(e) => handleChange('yearOfGraduation', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Highest Qualification</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.qualification)} onChange={(e) => handleChange('qualification', e.target.value)} />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="professional" className="space-y-8 mt-0 outline-none">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-950">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Job Title</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.currentJobTitle)} onChange={(e) => handleChange('currentJobTitle', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company Name</Label>
                                                        <Input className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900" value={inputValue(formData.companyName)} onChange={(e) => handleChange('companyName', e.target.value)} />
                                                    </div>
                                                    <div className="col-span-2 space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Areas of Expertise</Label>
                                                        <Textarea className="min-h-[120px] rounded-[2rem] bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 p-6" value={inputValue(formData.areasOfExpertise)} onChange={(e) => handleChange('areasOfExpertise', e.target.value)} />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="social" className="space-y-8 mt-0 outline-none">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-indigo-950">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Verification Status</Label>
                                                        <Select
                                                            value={formData.status || 'pending'}
                                                            onValueChange={(val) => handleChange('status', val as any)}
                                                        >
                                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-black uppercase text-[10px] tracking-widest">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                                <SelectItem value="approved" className="font-bold py-3">Approved</SelectItem>
                                                                <SelectItem value="pending" className="font-bold py-3 text-amber-500">Pending</SelectItem>
                                                                <SelectItem value="rejected" className="font-bold py-3 text-rose-500">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => router.back()}
                                        className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 transition-all"
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 px-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                    >
                                        {saving ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Update Registry
                                    </Button>
                                </div>
                            </Tabs>
                        </form>
                    </motion.div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
