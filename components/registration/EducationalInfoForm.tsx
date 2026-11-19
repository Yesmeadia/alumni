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
import {
  AlumniData,
  YES_INDIA_SCHOOLS_BY_STATE,
  JK_SCHOOLS_BY_DISTRICT,
  JK_DISTRICTS,
  ALL_YES_INDIA_SCHOOLS,
  GRADUATION_YEARS,
  LAST_CLASS_OPTIONS,
  INDIAN_STATES,
} from '@/lib/types';

interface EducationalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const inputClass =
  'bg-white border-gray-300 rounded-lg focus:border-[#2a1b63] focus:ring-[#2a1b63]/15';

const EducationalInfoForm: React.FC<EducationalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [showOtherClass, setShowOtherClass] = useState(
    formData.lastClassAttended === 'Other'
  );

  const isJammuKashmir = formData.state === 'Jammu and Kashmir';

  const availableSchools = useMemo(() => {
    if (formData.state === 'Jammu and Kashmir') {
      if (
        formData.district &&
        JK_SCHOOLS_BY_DISTRICT[formData.district as keyof typeof JK_SCHOOLS_BY_DISTRICT]
      ) {
        return JK_SCHOOLS_BY_DISTRICT[formData.district as keyof typeof JK_SCHOOLS_BY_DISTRICT];
      }
      return [];
    } else if (
      formData.state &&
      YES_INDIA_SCHOOLS_BY_STATE[formData.state as keyof typeof YES_INDIA_SCHOOLS_BY_STATE]
    ) {
      return YES_INDIA_SCHOOLS_BY_STATE[
        formData.state as keyof typeof YES_INDIA_SCHOOLS_BY_STATE
      ];
    }
    return ALL_YES_INDIA_SCHOOLS;
  }, [formData.state, formData.district]);

  useEffect(() => {
    if (formData.schoolAttended && availableSchools.length > 0) {
      if (!availableSchools.includes(formData.schoolAttended)) {
        onFormDataChange({ schoolAttended: '' });
      }
    }
  }, [formData.state, formData.district, formData.schoolAttended, availableSchools, onFormDataChange]);

  useEffect(() => {
    if (formData.state && formData.state !== 'Jammu and Kashmir' && formData.district) {
      onFormDataChange({ district: '' });
    }
  }, [formData.state, formData.district, onFormDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'lastClassAttended') {
      const isOther = value === 'Other';
      setShowOtherClass(isOther);
      if (!isOther) {
        onFormDataChange({ [name]: value, otherClass: '' });
      } else {
        onFormDataChange({ [name]: value });
      }
    } else if (name === 'state') {
      onFormDataChange({ state: value, district: '', schoolAttended: '' });
    } else if (name === 'district') {
      onFormDataChange({ district: value, schoolAttended: '' });
    } else {
      onFormDataChange({ [name]: value });
    }
  };

  const getSchoolPlaceholder = () => {
    if (!formData.state) return 'Please select state first';
    if (isJammuKashmir && !formData.district) return 'Please select district first';
    return 'Select your school';
  };

  const isSchoolSelectDisabled = !formData.state || (isJammuKashmir && !formData.district);

  return (
    <div className="space-y-10">
      {/* School Information */}
      <section>
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            YES INDIA School Information
          </h3>
          <p className="text-gray-500 text-sm">Your educational journey with YES INDIA</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="cursor-pointer">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isJammuKashmir && (
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-semibold text-[#212529]">
                  District <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.district || ''}
                  onValueChange={(value) => handleSelectChange('district', value)}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select your district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {JK_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district} className="cursor-pointer">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="schoolAttended" className="text-sm font-semibold text-[#212529]">
                School Attended <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.schoolAttended || ''}
                onValueChange={(value) => handleSelectChange('schoolAttended', value)}
                disabled={isSchoolSelectDisabled}
              >
                <SelectTrigger
                  className={`${inputClass} h-auto min-h-[52px] py-2.5 [&>span]:block [&>span]:whitespace-normal [&>span]:w-full [&>span]:text-left [&>span]:leading-relaxed`}
                >
                  <SelectValue placeholder={getSchoolPlaceholder()} />
                </SelectTrigger>
                <SelectContent className="max-w-[90vw] md:max-w-[600px] max-h-[360px] overflow-y-auto">
                  {availableSchools.map((school) => (
                    <SelectItem
                      key={school}
                      value={school}
                      className="whitespace-normal py-3 leading-relaxed cursor-pointer"
                    >
                      <span className="block break-words">{school}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSchoolSelectDisabled && (
                <p className="text-xs text-gray-500">
                  {!formData.state
                    ? 'Please select a state to see available schools.'
                    : 'Please select a district to see available schools.'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfGraduation" className="text-sm font-semibold text-[#212529]">
                Pass-out Year <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.yearOfGraduation || ''}
                onValueChange={(value) => handleSelectChange('yearOfGraduation', value)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {GRADUATION_YEARS.map((year) => (
                    <SelectItem key={year} value={year} className="cursor-pointer">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastClassAttended" className="text-sm font-semibold text-[#212529]">
                Last Class Attended <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.lastClassAttended || ''}
                onValueChange={(value) => handleSelectChange('lastClassAttended', value)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {LAST_CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option} className="cursor-pointer">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showOtherClass && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="otherClass" className="text-sm font-semibold text-[#212529]">
                  Specify Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherClass"
                  name="otherClass"
                  value={formData.otherClass || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 11th Science, Diploma, Certificate Course"
                  required={showOtherClass}
                  className={inputClass}
                />
              </div>
            )}
        </div>
      </section>

      {/* Current Qualifications */}
      <section className="pt-8 border-t border-gray-200">
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Current Qualifications
          </h3>
          <p className="text-gray-500 text-sm">Your highest educational achievement</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="qualification" className="text-sm font-semibold text-[#212529]">
                Highest Qualification
              </Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification || ''}
                onChange={handleInputChange}
                placeholder="e.g., B.Tech, MBA, M.Sc, BA, 12th Pass"
                required
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="additionalQualification"
                className="text-sm font-semibold text-[#212529]"
              >
                Additional Qualifications
              </Label>
              <Input
                id="additionalQualification"
                name="additionalQualification"
                value={formData.additionalQualification || ''}
                onChange={handleInputChange}
                placeholder="e.g., Certifications, Diplomas"
                className={inputClass}
              />
            </div>
        </div>
      </section>

      {/* Note */}
      <div className="bg-[#f7f4ed] p-4 rounded-xl border-l-4 border-[#a5874c]">
        <p className="text-sm text-[#212529]">
          <strong className="text-[#2a1b63]">Note:</strong> Accurate educational information helps
          us maintain our alumni directory and connect you with batchmates and mentors.
        </p>
      </div>
    </div>
  );
};

export default EducationalInfoForm;
