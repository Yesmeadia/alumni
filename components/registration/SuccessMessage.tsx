import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessMessageProps {
  alumniId: string;
  fullName: string;
  onGoHome?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  alumniId,
  fullName,
  onGoHome,
}) => {
  return (
    <div className="min-h-[80vh] bg-[#faf9f6] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Card className="border border-gray-200 rounded-[24px] shadow-sm overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-[#2a1b63] px-8 py-10 text-center text-white">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#a5874c] text-white text-xs font-bold uppercase tracking-[0.16em] mb-4">
              Registration Complete
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Welcome to YES INDIA Alumni
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Your registration has been submitted successfully.
            </p>
          </div>

          <CardContent className="p-7 sm:p-9">
            <div className="bg-[#faf9f6] rounded-xl p-6 border-l-4 border-[#a5874c] mb-7">
              <h3 className="font-display text-base font-bold text-[#2a1b63] mb-4">
                Registration Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Full Name</span>
                  <span className="font-semibold text-[#212529]">{fullName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Alumni ID</span>
                  <span className="font-mono font-bold text-[#2a1b63]">{alumniId}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Registration Date</span>
                  <span className="font-semibold text-[#212529]">
                    {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={onGoHome}
              className="w-full bg-[#2a1b63] hover:bg-[#1f134c] text-white rounded-lg py-6 font-semibold text-sm"
            >
              Return to Home
            </Button>

            <p className="mt-6 text-center text-xs text-gray-500">
              Need help? Contact{' '}
              <a
                href="mailto:info@yesindiafoundation.com"
                className="text-[#2a1b63] font-semibold hover:underline"
              >
                info@yesindiafoundation.com
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessMessage;
