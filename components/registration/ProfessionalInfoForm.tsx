import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlumniData } from '@/lib/types';

interface ProfessionalInfoFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const inputClass =
  'bg-white border-gray-300 rounded-lg focus:border-[#2a1b63] focus:ring-[#2a1b63]/15';

const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-10">
      {/* Current Professional Role */}
      <section>
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Current Professional Role
          </h3>
          <p className="text-gray-500 text-sm">Your current occupation details</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="currentJobTitle" className="text-sm font-semibold text-[#212529]">
                Job Title / Occupation
              </Label>
              <Input
                id="currentJobTitle"
                name="currentJobTitle"
                value={formData.currentJobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer, Teacher, Doctor, Student"
                className={inputClass}
              />
              <p className="text-xs text-gray-500">
                If you&apos;re a student, mention your field of study (e.g., Engineering Student).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-semibold text-[#212529]">
                Company / Organization
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Organization Name, University, Self-employed"
                className={inputClass}
              />
              <p className="text-xs text-gray-500">
                Mention &apos;Student&apos; if currently studying or &apos;Self-employed&apos; if
                running your own business.
              </p>
            </div>
        </div>
      </section>

      {/* Additional Professional Info */}
      <section className="pt-8 border-t border-gray-200">
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Additional Professional Information
          </h3>
          <p className="text-gray-500 text-sm">Share more about your professional journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-semibold text-[#212529]">
                Industry / Sector
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry || ''}
                onChange={handleInputChange}
                placeholder="e.g., Information Technology, Education, Healthcare"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience" className="text-sm font-semibold text-[#212529]">
                Years of Experience
              </Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience || ''}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className={inputClass}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="professionalInterests"
                className="text-sm font-semibold text-[#212529]"
              >
                Professional Interests / Skills
              </Label>
              <Input
                id="professionalInterests"
                name="professionalInterests"
                value={formData.professionalInterests || ''}
                onChange={handleInputChange}
                placeholder="e.g., Web Development, Data Science, Teaching, Entrepreneurship"
                className={inputClass}
              />
            </div>
        </div>
      </section>

      <div className="bg-[#f7f4ed] p-4 rounded-xl border-l-4 border-[#a5874c]">
        <p className="text-sm text-[#212529]">
          <strong className="text-[#2a1b63]">Networking Opportunities:</strong> Your professional
          information helps us create relevant networking events, mentorship programs, and career
          guidance sessions.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalInfoForm;
