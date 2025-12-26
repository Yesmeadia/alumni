import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Download, Share2 } from 'lucide-react';
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
  const handleDownloadConfirmation = () => {
    // Logic to download confirmation PDF
    console.log('Download confirmation for:', alumniId);
  };

  const handleShare = () => {
    // Logic to share success
    if (navigator.share) {
      navigator.share({
        title: 'YES INDIA Alumni Registration',
        text: `I've successfully registered as an alumni of YES INDIA!`,
      }).catch((error) => console.log('Error sharing:', error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-2"
            >
              Registration Successful!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-50 text-lg"
            >
              Welcome to the YES INDIA Alumni Network
            </motion.p>
          </div>

          <CardContent className="p-8">
            {/* Success Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6"
            >
              <h3 className="font-bold text-gray-800 mb-4 text-center">
                Registration Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{fullName}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Alumni ID:</span>
                  <span className="font-mono font-semibold text-blue-600">{alumniId}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Registration Date:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Button
                onClick={onGoHome}
                className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#283593] hover:to-[#3949ab] text-white rounded-xl py-6 font-semibold text-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Home
              </Button>
            </motion.div>

            {/* Support Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a
                  href="mailto:support@yesindia.com"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  support@yesindia.com
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessMessage;