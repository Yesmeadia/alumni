// components/dashboard/EditAlumniDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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
import { AlumniData } from '@/lib/types';
import { Loader2, User, GraduationCap, Briefcase, Share2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditAlumniDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    alumni: (AlumniData & { id: string }) | null;
    onSave: (id: string, data: Partial<AlumniData>) => Promise<void>;
}

const EditAlumniDialog: React.FC<EditAlumniDialogProps> = ({
    isOpen,
    onOpenChange,
    alumni,
    onSave,
}) => {
    const [formData, setFormData] = useState<Partial<AlumniData>>({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        if (alumni) {
            setFormData(alumni);
        }
    }, [alumni, isOpen]);

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
        if (!alumni?.id) return;
        setLoading(true);
        try {
            await onSave(alumni.id, formData);
            onOpenChange(false);
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setLoading(false);
        }
    };

    if (!alumni) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] w-[95vw] p-0 overflow-hidden border-0 shadow-3xl bg-white rounded-[2.5rem] max-h-[90vh] flex flex-col">
                <DialogHeader className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 relative">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Save className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-slate-900">Edit Profile</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Updating records for <span className="text-indigo-600 font-bold">{alumni.fullName}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-10 pt-6 bg-white border-b border-slate-100 italic">
                            <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl ring-1 ring-slate-200/50 w-full grid grid-cols-4 h-14">
                                <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Personal</span>
                                </TabsTrigger>
                                <TabsTrigger value="education" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    <span className="hidden sm:inline">Education</span>
                                </TabsTrigger>
                                <TabsTrigger value="professional" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="hidden sm:inline">Professional</span>
                                </TabsTrigger>
                                <TabsTrigger value="social" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <Share2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Social</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TabsContent value="personal" className="space-y-8 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.fullName)} onChange={(e) => handleChange('fullName', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</Label>
                                                <Input type="email" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.email)} onChange={(e) => handleChange('email', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Number</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.mobileNumber)} onChange={(e) => handleChange('mobileNumber', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">WhatsApp Number</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.whatsappNumber)} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Current Address</Label>
                                                <Textarea className="min-h-[100px] rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.address)} onChange={(e) => handleChange('address', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Place/City</Label>
                                                    <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.place)} onChange={(e) => handleChange('place', e.target.value)} />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">State</Label>
                                                    <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.state)} onChange={(e) => handleChange('state', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="education" className="space-y-8 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">School Attended</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.schoolAttended)} onChange={(e) => handleChange('schoolAttended', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Batch Year</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.yearOfGraduation)} onChange={(e) => handleChange('yearOfGraduation', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Highest Qualification</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.qualification)} onChange={(e) => handleChange('qualification', e.target.value)} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">University / Institute</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.university)} onChange={(e) => handleChange('university', e.target.value)} />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="professional" className="space-y-8 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Current Job Title</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.currentJobTitle)} onChange={(e) => handleChange('currentJobTitle', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Company Name</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.companyName)} onChange={(e) => handleChange('companyName', e.target.value)} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Areas of Expertise</Label>
                                                <Textarea className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.areasOfExpertise)} onChange={(e) => handleChange('areasOfExpertise', e.target.value)} />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="social" className="space-y-8 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">LinkedIn URL</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.linkedinLink)} onChange={(e) => handleChange('linkedinLink', e.target.value)} placeholder="linkedin.com/in/username" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Facebook URL</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.facebookLink)} onChange={(e) => handleChange('facebookLink', e.target.value)} placeholder="facebook.com/username" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Instagram URL</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.instagramLink)} onChange={(e) => handleChange('instagramLink', e.target.value)} placeholder="instagram.com/username" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Twitter URL</Label>
                                                <Input className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium" value={inputValue(formData.twitterLink)} onChange={(e) => handleChange('twitterLink', e.target.value)} placeholder="twitter.com/username" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Status</Label>
                                                <Select
                                                    value={formData.status || 'pending'}
                                                    onValueChange={(val) => handleChange('status', val as 'pending' | 'approved' | 'rejected')}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                        <SelectItem value="approved" className="font-bold py-3">Approved</SelectItem>
                                                        <SelectItem value="pending" className="font-bold py-3 text-amber-500">Pending</SelectItem>
                                                        <SelectItem value="rejected" className="font-bold py-3 text-rose-500">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Stay Involved (Willing to Contribute)</Label>
                                                <Textarea
                                                    className="min-h-[100px] rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 font-medium"
                                                    value={Array.isArray(formData.stayInvolved) ? formData.stayInvolved.join(', ') : (formData.stayInvolved || '')}
                                                    onChange={(e) => handleArrayChange('stayInvolved', e.target.value)}
                                                    placeholder="Mentoring, Guest Lectures, etc."
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Tabs>

                    <DialogFooter className="px-10 py-8 border-t border-slate-100 bg-white gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="rounded-2xl h-14 px-8 font-black text-slate-400 hover:text-slate-900 transition-all"
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-5 w-5" />
                            )}
                            Save Updates
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAlumniDialog;

