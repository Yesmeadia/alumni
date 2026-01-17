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
import { Loader2 } from 'lucide-react';

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

    useEffect(() => {
        if (alumni) {
            setFormData(alumni);
        }
    }, [alumni, isOpen]); // Reset when opening

    const handleChange = (field: keyof AlumniData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: keyof AlumniData, value: string) => {
        // Handle comma-separated strings for array fields
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl">
                <DialogHeader className="px-6 py-4 border-b bg-gray-50/50">
                    <DialogTitle>Edit Profile: {alumni.fullName}</DialogTitle>
                    <DialogDescription>
                        Edit all alumni details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="personal" className="w-full">
                        <div className="px-6 pt-4 bg-white sticky top-0 z-10 border-b shadow-sm">
                            <TabsList className="grid w-full grid-cols-4 mb-2">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="professional">Professional</TabsTrigger>
                                <TabsTrigger value="social">Social & Other</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6 pb-20">
                            {/* PERSONAL DETAILS */}
                            <TabsContent value="personal" className="space-y-4 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={inputValue(formData.fullName)} onChange={(e) => handleChange('fullName', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={inputValue(formData.email)} onChange={(e) => handleChange('email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mobile Number</Label>
                                        <Input value={inputValue(formData.mobileNumber)} onChange={(e) => handleChange('mobileNumber', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>WhatsApp Number</Label>
                                        <Input value={inputValue(formData.whatsappNumber)} onChange={(e) => handleChange('whatsappNumber', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Current Address</Label>
                                        <Textarea value={inputValue(formData.address)} onChange={(e) => handleChange('address', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Place/City</Label>
                                        <Input value={inputValue(formData.place)} onChange={(e) => handleChange('place', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input value={inputValue(formData.state)} onChange={(e) => handleChange('state', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>District</Label>
                                        <Input value={inputValue(formData.district)} onChange={(e) => handleChange('district', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pin Code</Label>
                                        <Input value={inputValue(formData.pinCode)} onChange={(e) => handleChange('pinCode', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Photo URL</Label>
                                        <Input value={inputValue(formData.photoURL)} onChange={(e) => handleChange('photoURL', e.target.value)} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* EDUCATION DETAILS */}
                            <TabsContent value="education" className="space-y-4 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>School Attended</Label>
                                        <Input value={inputValue(formData.schoolAttended)} onChange={(e) => handleChange('schoolAttended', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Batch (Year of Graduation)</Label>
                                        <Input value={inputValue(formData.yearOfGraduation)} onChange={(e) => handleChange('yearOfGraduation', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Class Attended</Label>
                                        <Input value={inputValue(formData.lastClassAttended)} onChange={(e) => handleChange('lastClassAttended', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Highest Qualification</Label>
                                        <Input value={inputValue(formData.qualification)} onChange={(e) => handleChange('qualification', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Additional Qualification</Label>
                                        <Input value={inputValue(formData.additionalQualification)} onChange={(e) => handleChange('additionalQualification', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>University / College</Label>
                                        <Input value={inputValue(formData.university)} onChange={(e) => handleChange('university', e.target.value)} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* PROFESSIONAL DETAILS */}
                            <TabsContent value="professional" className="space-y-4 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Current Job Title</Label>
                                        <Input value={inputValue(formData.currentJobTitle)} onChange={(e) => handleChange('currentJobTitle', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company Name</Label>
                                        <Input value={inputValue(formData.companyName)} onChange={(e) => handleChange('companyName', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Industry</Label>
                                        <Input value={inputValue(formData.industry)} onChange={(e) => handleChange('industry', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years of Experience</Label>
                                        <Input value={inputValue(formData.yearsOfExperience)} onChange={(e) => handleChange('yearsOfExperience', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Areas of Expertise (Description)</Label>
                                        <Textarea value={inputValue(formData.areasOfExpertise)} onChange={(e) => handleChange('areasOfExpertise', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Professional Interests</Label>
                                        <Textarea value={inputValue(formData.professionalInterests)} onChange={(e) => handleChange('professionalInterests', e.target.value)} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SOCIAL & OTHER */}
                            <TabsContent value="social" className="space-y-4 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>LinkedIn Profile</Label>
                                        <Input value={inputValue(formData.linkedinLink)} onChange={(e) => handleChange('linkedinLink', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Facebook Profile</Label>
                                        <Input value={inputValue(formData.facebookLink)} onChange={(e) => handleChange('facebookLink', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Instagram Profile</Label>
                                        <Input value={inputValue(formData.instagramLink)} onChange={(e) => handleChange('instagramLink', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Twitter/X Profile</Label>
                                        <Input value={inputValue(formData.twitterLink)} onChange={(e) => handleChange('twitterLink', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Message to Teachers / School</Label>
                                        <Textarea className="min-h-[100px]" value={inputValue(formData.messageToTeacher)} onChange={(e) => handleChange('messageToTeacher', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label>Willing to Contribute (comma separated)</Label>
                                        <Textarea
                                            value={Array.isArray(formData.stayInvolved) ? formData.stayInvolved.join(', ') : (formData.stayInvolved || '')}
                                            onChange={(e) => handleArrayChange('stayInvolved', e.target.value)}
                                            placeholder="Mentoring, Guest Lectures, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status (Admin)</Label>
                                        <Select
                                            value={formData.status || 'pending'}
                                            onValueChange={(val) => handleChange('status', val)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Sticky Footer */}
                    <DialogFooter className="px-6 py-4 border-t bg-gray-50 sticky bottom-0 z-20">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAlumniDialog;
