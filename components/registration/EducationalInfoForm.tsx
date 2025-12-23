// app/components/registration/EducationalInfoForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlumniData } from '@/lib/types';
import {
  YES_INDIA_SCHOOLS_BY_STATE,
  JK_SCHOOLS_BY_DISTRICT,
  JK_DISTRICTS,
  ALL_YES_INDIA_SCHOOLS,
  GRADUATION_YEARS,
  LAST_CLASS_OPTIONS,
  INDIAN_STATES,
} from '@/lib/types';
import { GraduationCap, School, Calendar, BookOpen, Award } from 'lucide-react';

interface EducationalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const EducationalInfoForm: React.FC<EducationalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [showOtherClass, setShowOtherClass] = useState(
    formData.lastClassAttended === 'Other'
  );

  const isJammuKashmir = formData.state === 'Jammu and Kashmir';

  // Derive available schools based on state and district
  const availableSchools = useMemo(() => {
    if (formData.state === 'Jammu and Kashmir') {
      // For J&K, show schools based on district
      if (formData.district && JK_SCHOOLS_BY_DISTRICT[formData.district as keyof typeof JK_SCHOOLS_BY_DISTRICT]) {
        return JK_SCHOOLS_BY_DISTRICT[formData.district as keyof typeof JK_SCHOOLS_BY_DISTRICT];
      }
      // If district not selected, return empty array
      return [];
    } else if (formData.state && YES_INDIA_SCHOOLS_BY_STATE[formData.state as keyof typeof YES_INDIA_SCHOOLS_BY_STATE]) {
      // For other states, show schools based on state
      return YES_INDIA_SCHOOLS_BY_STATE[formData.state as keyof typeof YES_INDIA_SCHOOLS_BY_STATE];
    }
    return ALL_YES_INDIA_SCHOOLS;
  }, [formData.state, formData.district]);

  // Clear school if state or district changes and school is not available
  useEffect(() => {
    if (formData.schoolAttended && availableSchools.length > 0) {
      if (!availableSchools.includes(formData.schoolAttended)) {
        onFormDataChange({ schoolAttended: '' });
      }
    }
  }, [formData.state, formData.district, formData.schoolAttended, availableSchools, onFormDataChange]);

  // Clear district if state changes from J&K to another state
  useEffect(() => {
    if (formData.state && formData.state !== 'Jammu and Kashmir' && formData.district) {
      onFormDataChange({ district: '' });
    }
  }, [formData.state, formData.district, onFormDataChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Select change - ${name}: ${value}`);
    
    if (name === 'lastClassAttended') {
      const isOther = value === 'Other';
      setShowOtherClass(isOther);
      if (!isOther) {
        onFormDataChange({ 
          [name]: value,
          otherClass: '' 
        });
      } else {
        onFormDataChange({ [name]: value });
      }
    } else if (name === 'state') {
      // Clear district and school when state changes
      onFormDataChange({ 
        state: value,
        district: '',
        schoolAttended: ''
      });
    } else if (name === 'district') {
      // Clear school when district changes
      onFormDataChange({ 
        district: value,
        schoolAttended: ''
      });
    } else {
      onFormDataChange({ [name]: value });
    }
  };

  const getSchoolPlaceholder = () => {
    if (!formData.state) {
      return "Please select state first";
    }
    if (isJammuKashmir && !formData.district) {
      return "Please select district first";
    }
    return "Select your school";
  };

  const isSchoolSelectDisabled = !formData.state || (isJammuKashmir && !formData.district);

  return (
    <div className="space-y-8">
      {/* School Information Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">YES INDIA School Information</h3>
              <p className="text-gray-600 text-sm">Your educational journey with us</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <School className="w-4 h-4 text-gray-500" />
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => handleSelectChange('state', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="focus:bg-blue-50">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isJammuKashmir && (
              <div className="space-y-2">
                <Label htmlFor="district" className="flex items-center gap-2">
                  <School className="w-4 h-4 text-gray-500" />
                  District <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.district || ''}
                  onValueChange={(value) => handleSelectChange('district', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {JK_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district} className="focus:bg-blue-50">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="schoolAttended" className="flex items-center gap-2">
                <School className="w-4 h-4 text-gray-500" />
                School Attended <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.schoolAttended || ''}
                onValueChange={(value) => handleSelectChange('schoolAttended', value)}
                disabled={isSchoolSelectDisabled}
              >
                <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-auto min-h-[40px] md:h-10 [&>span]:block [&>span]:whitespace-normal [&>span]:md:whitespace-nowrap [&>span]:md:truncate [&>span]:w-full [&>span]:text-left [&>span]:py-1 [&>span]:leading-tight">
                  <SelectValue placeholder={getSchoolPlaceholder()} />
                </SelectTrigger>
                <SelectContent className="max-w-[90vw]">
                  {availableSchools.map((school) => (
                    <SelectItem 
                      key={school} 
                      value={school} 
                      className="focus:bg-blue-50 whitespace-normal py-3 leading-snug"
                    >
                      <span className="block break-words">{school}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSchoolSelectDisabled && (
                <p className="text-sm text-gray-500 mt-1">
                  {!formData.state 
                    ? "Please select a state to see available schools"
                    : "Please select a district to see available schools"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfGraduation" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Graduation Year <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.yearOfGraduation || ''}
                onValueChange={(value) => handleSelectChange('yearOfGraduation', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {GRADUATION_YEARS.map((year) => (
                    <SelectItem key={year} value={year} className="focus:bg-blue-50">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastClassAttended" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-500" />
                Last Class Attended <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.lastClassAttended || ''}
                onValueChange={(value) => handleSelectChange('lastClassAttended', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {LAST_CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option} className="focus:bg-blue-50">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showOtherClass && (
              <div className="space-y-2">
                <Label htmlFor="otherClass">
                  Specify Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherClass"
                  name="otherClass"
                  value={formData.otherClass || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 11th Science, Diploma, Certificate Course"
                  required={showOtherClass}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Qualification Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Current Qualifications</h3>
              <p className="text-gray-600 text-sm">Your highest educational achievement</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="qualification" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                Highest Qualification
              </Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification || ''}
                onChange={handleInputChange}
                placeholder="e.g., B.Tech, MBA, M.Sc, BA, 12th Pass"
                className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalQualification" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                Additional Qualifications
              </Label>
              <Input
                id="additionalQualification"
                name="additionalQualification"
                value={formData.additionalQualification || ''}
                onChange={handleInputChange}
                placeholder="e.g., Certifications, Diplomas"
                className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-purple-700 text-sm">
              <strong>Note:</strong> Accurate educational information helps us maintain our alumni database 
              and connect you with your batchmates and mentors from similar educational backgrounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalInfoForm;