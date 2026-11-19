import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlumniData, INVOLVEMENT_OPTIONS } from '@/lib/types';

interface InvolvementFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const InvolvementForm: React.FC<InvolvementFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentInvolved = formData.stayInvolved || [];
    if (checked) {
      onFormDataChange({ stayInvolved: [...currentInvolved, option] });
    } else {
      onFormDataChange({
        stayInvolved: currentInvolved.filter((item) => item !== option),
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Involvement Options */}
      <section>
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">Stay Connected</h3>
          <p className="text-gray-500 text-sm">
            How would you like to stay involved with YES INDIA Foundation?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3.5">
            {INVOLVEMENT_OPTIONS.map((option) => {
              const isSelected = formData.stayInvolved?.includes(option) || false;
              return (
                <div
                  key={option}
                  className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f7f4ed] border-[#a5874c]'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Checkbox
                    id={option}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option, checked as boolean)
                    }
                    className="mt-0.5 border-gray-400 data-[state=checked]:border-[#2a1b63] data-[state=checked]:bg-[#2a1b63]"
                  />
                  <Label
                    htmlFor={option}
                    className="font-medium cursor-pointer flex-1 text-sm text-[#212529]"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
        </div>
      </section>

      {/* Message */}
      <section className="pt-8 border-t border-gray-200">
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">Share Your Message</h3>
          <p className="text-gray-500 text-sm">
            Optional &mdash; express your gratitude or memories
          </p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="messageToTeacher" className="text-sm font-semibold text-[#212529]">
              Message to Your Teacher / Mentor / School
            </Label>
            <Textarea
              id="messageToTeacher"
              name="messageToTeacher"
              value={formData.messageToTeacher || ''}
              onChange={handleTextareaChange}
              placeholder="Share your thoughts, memories, gratitude, or any message you'd like to convey to your teachers or school..."
              rows={5}
              className="resize-none bg-white border-gray-300 rounded-lg focus:border-[#2a1b63] focus:ring-[#2a1b63]/15"
            />
        </div>
      </section>

      <div className="bg-[#f7f4ed] p-4 rounded-xl border-l-4 border-[#a5874c]">
        <p className="text-sm text-[#212529]">
          <strong className="text-[#2a1b63]">Note:</strong> Your involvement choices help us tailor
          alumni programs and activities to match your interests. You may select multiple options.
        </p>
      </div>
    </div>
  );
};

export default InvolvementForm;
