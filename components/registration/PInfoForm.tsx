'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDIAN_STATES, JK_DISTRICTS, GENDER_OPTIONS, AlumniData } from '@/lib/types';

interface PersonalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const inputClass =
  'bg-white border-gray-300 rounded-lg focus:border-[#2a1b63] focus:ring-[#2a1b63]/15';

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [sameAsMobile, setSameAsMobile] = useState(() => {
    return formData.whatsappNumber === formData.mobileNumber && !!formData.mobileNumber;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value } as Partial<AlumniData>);

    if (name === 'mobileNumber' && sameAsMobile) {
      onFormDataChange({ mobileNumber: value, whatsappNumber: value } as Partial<AlumniData>);
    }
  };

  const handleSelectChange = (name: keyof AlumniData, value: string) => {
    const updateData: Partial<AlumniData> = { [name]: value };
    if (name === 'state' && value !== 'Jammu and Kashmir') {
      updateData.district = '';
    }
    onFormDataChange(updateData);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked && formData.mobileNumber) {
      onFormDataChange({ whatsappNumber: formData.mobileNumber } as Partial<AlumniData>);
    }
  };

  const showDistrictField = formData.state === 'Jammu and Kashmir';

  return (
    <div className="space-y-10">
      {/* Basic Information */}
      <section>
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">Basic Information</h3>
          <p className="text-gray-500 text-sm">Your personal identification details</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-[#212529]">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold text-[#212529]">
                Gender
              </Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-sm font-semibold text-[#212529]">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber || ''}
                onChange={handleInputChange}
                placeholder="10-digit Mobile Number"
                maxLength={10}
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#212529]">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="Email Address"
                maxLength={160}
                className={inputClass}
              />
            </div>

            <div className="flex items-center space-x-2.5 md:col-span-2">
              <Checkbox
                id="sameAsMobile"
                checked={sameAsMobile}
                onCheckedChange={handleCheckboxChange}
                className="border-gray-400 data-[state=checked]:border-[#2a1b63] data-[state=checked]:bg-[#2a1b63]"
              />
              <label
                htmlFor="sameAsMobile"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                WhatsApp number is the same as Mobile Number
              </label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsappNumber" className="text-sm font-semibold text-[#212529]">
                WhatsApp Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleInputChange}
                placeholder="10-digit WhatsApp Number"
                maxLength={10}
                required
                disabled={sameAsMobile}
                className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
              />
            </div>
        </div>
      </section>

      {/* Social Media Profiles */}
      <section className="pt-8 border-t border-gray-200">
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">Social Media Profiles</h3>
          <p className="text-gray-500 text-sm">Optional &mdash; enter only your profile username</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="facebookLink" className="text-sm font-semibold text-[#212529]">
                Facebook
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  facebook.com/
                </span>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={formData.facebookLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className={`${inputClass} pl-[110px]`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-sm font-semibold text-[#212529]">
                Instagram
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  instagram.com/
                </span>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className={`${inputClass} pl-[115px]`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterLink" className="text-sm font-semibold text-[#212529]">
                Twitter / X
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  x.com/
                </span>
                <Input
                  id="twitterLink"
                  name="twitterLink"
                  value={formData.twitterLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className={`${inputClass} pl-[62px]`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinLink" className="text-sm font-semibold text-[#212529]">
                LinkedIn
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  linkedin.com/in/
                </span>
                <Input
                  id="linkedinLink"
                  name="linkedinLink"
                  value={formData.linkedinLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className={`${inputClass} pl-[122px]`}
                />
              </div>
            </div>
        </div>
      </section>

      {/* Address Details */}
      <section className="pt-8 border-t border-gray-200">
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">Address Details</h3>
          <p className="text-gray-500 text-sm">Your current residential address</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-sm font-semibold text-[#212529]">
                Complete Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="House no., Street, Area, Landmark"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-semibold text-[#212529]">
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => handleSelectChange('state', value)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showDistrictField && (
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-semibold text-[#212529]">
                  District <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 font-normal ml-1">
                    (Required for Jammu &amp; Kashmir)
                  </span>
                </Label>
                <Select
                  value={formData.district || ''}
                  onValueChange={(value) => handleSelectChange('district', value)}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {JK_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="place" className="text-sm font-semibold text-[#212529]">
                City / Town
              </Label>
              <Input
                id="place"
                name="place"
                value={formData.place || ''}
                onChange={handleInputChange}
                placeholder="City or town"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinCode" className="text-sm font-semibold text-[#212529]">
                Pin Code
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                value={formData.pinCode || ''}
                onChange={handleInputChange}
                placeholder="6-digit Pin Code"
                maxLength={6}
                className={inputClass}
              />
            </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalInfoForm;
