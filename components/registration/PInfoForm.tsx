'use client';

import React, { useState} from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { INDIAN_STATES, JK_DISTRICTS, AlumniData } from '@/lib/types';
import { Facebook, Instagram, Twitter, Linkedin, Globe, User, Phone, MapPin, Hash } from 'lucide-react';

interface PersonalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [sameAsMobile, setSameAsMobile] = useState(() => {
    return formData.whatsappNumber === formData.mobileNumber && !!formData.mobileNumber;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value } as Partial<AlumniData>);

    if (name === 'mobileNumber' && sameAsMobile) {
      onFormDataChange({ mobileNumber: value, whatsappNumber: value } as Partial<AlumniData>);
    }
  };

  const handleSelectChange = (name: keyof AlumniData, value: string) => {
    const updateData: Partial<AlumniData> = { [name]: value };
    
    // Clear district if state changes and is not J&K
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
    <div className="space-y-8">
      {/* Personal Details Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
              <p className="text-gray-600 text-sm">Your personal identification details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber || ''}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                maxLength={10}
                required
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2 mt-2 ">
                <Checkbox
                  id="sameAsMobile"
                  checked={sameAsMobile}
                  onCheckedChange={handleCheckboxChange}
                  className=" border border-gray-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <label
                  htmlFor="sameAsMobile"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Same as Mobile Number
                </label>
              </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                WhatsApp Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleInputChange}
                placeholder="WhatsApp Numbers"
                maxLength={10}
                required
                disabled={sameAsMobile}
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Social Media Profiles</h3>
              <p className="text-gray-600 text-sm">Optional - Enter only your profile ID/username</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <Label htmlFor="facebookLink">Facebook</Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  facebook.com/
                </span>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={formData.facebookLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-[110px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                <Label htmlFor="instagramLink">Instagram</Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  instagram.com/
                </span>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className="bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500 pl-[115px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                <Label htmlFor="twitterLink">Twitter/X</Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  x.com/
                </span>
                <Input
                  id="twitterLink"
                  name="twitterLink"
                  value={formData.twitterLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className="bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400 pl-[65px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-700" />
                <Label htmlFor="linkedinLink">LinkedIn</Label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  linkedin.com/in/
                </span>
                <Input
                  id="linkedinLink"
                  name="linkedinLink"
                  value={formData.linkedinLink || ''}
                  onChange={handleInputChange}
                  placeholder="yourprofile"
                  className="bg-white border-gray-300 focus:border-blue-700 focus:ring-blue-700 pl-[125px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Address Details</h3>
              <p className="text-gray-600 text-sm">Your current residential address</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Complete Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="House no., Street, Area, Landmark"
                required
                className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => handleSelectChange('state', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="focus:bg-green-50">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showDistrictField && (
              <div className="space-y-2">
                <Label htmlFor="district">
                  District <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-1">(Required for Jammu & Kashmir)</span>
                </Label>
                <Select
                  value={formData.district || ''}
                  onValueChange={(value) => handleSelectChange('district', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {JK_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district} className="focus:bg-green-50">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="place">
                City/Town 
              </Label>
              <Input
                id="place"
                name="place"
                value={formData.place || ''}
                onChange={handleInputChange}
                placeholder="Place"
                className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinCode" className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                Pin Code 
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                value={formData.pinCode || ''}
                onChange={handleInputChange}
                placeholder="Pin code"
                maxLength={6}
                className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoForm;