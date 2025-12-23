// app/components/registration/InvolvementForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { AlumniData } from '@/lib/types';
import { INVOLVEMENT_OPTIONS } from '@/lib/types';
import { Users, MessageSquare, Heart } from 'lucide-react';

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
      {/* Involvement Options Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Stay Connected</h3>
              <p className="text-gray-600 text-sm">Choose how you&apos;d like to stay involved</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-800">
              How Would You Like To Stay Involved With YES INDIA Foundation?
            </Label>
            
            <div className="grid md:grid-cols-2 gap-4">
              {INVOLVEMENT_OPTIONS.map((option) => (
                <div
                  key={option}
                  className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.stayInvolved?.includes(option)
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Checkbox
                    id={option}
                    checked={formData.stayInvolved?.includes(option) || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor={option}
                    className="font-normal cursor-pointer flex-1 text-gray-700"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Share Your Message</h3>
              <p className="text-gray-600 text-sm">Optional - Express your gratitude or memories</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageToTeacher" className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-500" />
              Message to Your Teacher/Mentor/School
            </Label>
            <Textarea
              id="messageToTeacher"
              name="messageToTeacher"
              value={formData.messageToTeacher || ''}
              onChange={handleTextareaChange}
              placeholder="Share your thoughts, memories, gratitude, or any message you'd like to convey to your teachers or the school..."
              rows={6}
              className="resize-none bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Information Box */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> Your involvement choices help us tailor our alumni programs 
              and activities to match your interests and expertise. Feel free to select one or more options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvolvementForm;