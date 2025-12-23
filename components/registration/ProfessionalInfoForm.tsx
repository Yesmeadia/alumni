// app/components/registration/ProfessionalInfoForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlumniData } from '@/lib/types';
import { Briefcase, Building, Target, Award } from 'lucide-react';

interface ProfessionalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-8">
      {/* Current Role Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Current Professional Role</h3>
              <p className="text-gray-600 text-sm">Your current occupation details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentJobTitle" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                Job Title/Occupation
              </Label>
              <Input
                id="currentJobTitle"
                name="currentJobTitle"
                value={formData.currentJobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Teacher, Doctor, Student"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                If you&apos;re a student, mention your field of study (e.g., Engineering Student)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                Company/Organization
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Google, ABC University, Self-employed"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mention &apos;Student&apos; if currently studying, &apos;Self-employed&apos; if running your own business
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Professional Info Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Additional Professional Information</h3>
              <p className="text-gray-600 text-sm">Share more about your professional journey</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry/Sector
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry || ''}
                onChange={handleInputChange}
                placeholder="e.g., Information Technology, Education, Healthcare"
                className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">
                Years of Experience
              </Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience || ''}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="professionalInterests">
                Professional Interests/Skills
              </Label>
              <Input
                id="professionalInterests"
                name="professionalInterests"
                value={formData.professionalInterests || ''}
                onChange={handleInputChange}
                placeholder="e.g., Web Development, Data Science, Teaching, Entrepreneurship"
                className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl border border-emerald-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700">Networking Opportunities</h4>
            <p className="text-emerald-600 text-sm mt-1">
              Your professional information helps us create relevant networking opportunities, 
              mentorship programs, and career guidance sessions for our alumni community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoForm;