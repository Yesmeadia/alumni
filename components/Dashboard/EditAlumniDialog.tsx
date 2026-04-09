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
            <DialogContent className="sm:max-w-[800px] w-[95vw] p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white rounded-xl max-h-[90vh] flex flex-col">
                <DialogHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Save className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Edit Alumni Profile</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Updating database records for {alumni.fullName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-8 py-4 bg-white border-b border-slate-100">
                            <TabsList className="bg-slate-100 p-1 rounded-lg w-full grid grid-cols-4 h-11">
                                <TabsTrigger value="personal" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-xs flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Personal</span>
                                </TabsTrigger>
                                <TabsTrigger value="education" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-xs flex items-center gap-2">
                                    <GraduationCap className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Education</span>
                                </TabsTrigger>
                                <TabsTrigger value="professional" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-xs flex items-center gap-2">
                                    <Briefcase className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Career</span>
                                </TabsTrigger>
                                <TabsTrigger value="social" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-xs flex items-center gap-2">
                                    <Share2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Social</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div data-lenis-prevent className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TabsContent value="personal" className="space-y-6 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Full Name</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.fullName)} onChange={(e) => handleChange('fullName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Email</Label>
                                                <Input type="email" className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.email)} onChange={(e) => handleChange('email', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Mobile</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.mobileNumber)} onChange={(e) => handleChange('mobileNumber', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">WhatsApp</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.whatsappNumber)} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Place / City</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.place)} onChange={(e) => handleChange('place', e.target.value)} />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="education" className="space-y-6 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">School Attended</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.schoolAttended)} onChange={(e) => handleChange('schoolAttended', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Batch Year</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.yearOfGraduation)} onChange={(e) => handleChange('yearOfGraduation', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Highest Qualification</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.qualification)} onChange={(e) => handleChange('qualification', e.target.value)} />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="professional" className="space-y-6 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Job Title</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.currentJobTitle)} onChange={(e) => handleChange('currentJobTitle', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Company</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.companyName)} onChange={(e) => handleChange('companyName', e.target.value)} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Expertise</Label>
                                                <Textarea className="min-h-[100px] rounded-lg bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 font-medium text-sm" value={inputValue(formData.areasOfExpertise)} onChange={(e) => handleChange('areasOfExpertise', e.target.value)} />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="social" className="space-y-6 mt-0 border-none">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">LinkedIn Profile</Label>
                                                <Input className="h-10 rounded-lg bg-slate-50 border-slate-200 font-medium text-sm" value={inputValue(formData.linkedinLink)} onChange={(e) => handleChange('linkedinLink', e.target.value)} placeholder="username" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-500 pl-0.5 uppercase tracking-wide">Status</Label>
                                                <Select
                                                    value={formData.status || 'pending'}
                                                    onValueChange={(val) => handleChange('status', val as 'pending' | 'approved' | 'rejected')}
                                                >
                                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border-slate-200 font-bold text-xs uppercase">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg shadow-xl">
                                                        <SelectItem value="approved" className="font-bold py-2 text-xs">Approved</SelectItem>
                                                        <SelectItem value="pending" className="font-bold py-2 text-xs text-amber-500">Pending</SelectItem>
                                                        <SelectItem value="rejected" className="font-bold py-2 text-xs text-rose-500">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Tabs>

                    <DialogFooter className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="rounded-lg h-10 px-6 font-bold text-slate-400 hover:text-slate-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-8 font-bold shadow-sm transition-all"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Update Record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAlumniDialog;
