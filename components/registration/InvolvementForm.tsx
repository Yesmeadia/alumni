// app/components/registration/InvolvementForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlumniData } from '@/lib/types';
import { INVOLVEMENT_OPTIONS } from '@/lib/types';

interface InvolvementFormProps {
  formData: Partial<AlumniData>;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

const InvolvementForm: React.FC<InvolvementFormProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Stay Connected</h3>
        <p className="text-gray-600 mb-6">
          Let us know how you&apos;d like to stay involved with the YES INDIA Foundation community.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg">
              How Would You Like To Stay Involved With YES INDIA Foundation?
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              {INVOLVEMENT_OPTIONS.map((option) => (
                <div key={option} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id={option}
                    checked={formData.stayInvolved?.includes(option)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <Label htmlFor={option} className="font-normal cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageToTeacher" className="text-lg">
              Message to Your Teacher/Mentor/School (Optional)
            </Label>
            <Textarea
              id="messageToTeacher"
              name="messageToTeacher"
              value={formData.messageToTeacher}
              onChange={handleTextareaChange}
              placeholder="Share your thoughts, memories, gratitude, or any message you'd like to convey..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Your message may be shared with teachers and mentors
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700 text-sm">
          <strong>Note:</strong> Your involvement choices help us tailor our alumni programs 
          and activities to match your interests. Feel free to select multiple options.
        </p>
      </div>
    </div>
  );
};

export default InvolvementForm;