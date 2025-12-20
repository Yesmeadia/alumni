// app/components/registration/PreviewPDF.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PreviewPDFProps {
  formData: any;
  imagePreview: string;
}

const PreviewPDF: React.FC<PreviewPDFProps> = ({ formData, imagePreview }) => {
  const generatePDF = async () => {
    const element = document.getElementById('registration-preview');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 290;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${formData.fullName || 'alumni'}-registration.pdf`);
  };

  const printPreview = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Review Your Registration</h2>
          <p className="text-gray-600">Please verify all information before submitting</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            onClick={generatePDF} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 font-semibold flex items-center justify-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={printPreview} 
            variant="outline" 
            className="border-2 border-gray-300 rounded-xl px-6 py-2 font-semibold hover:bg-gray-50"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </motion.div>

      {/* Warning Alert */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-xl"
      >
        <p className="text-amber-800 font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Important: Once submitted, you cannot edit your registration. Please review carefully.
        </p>
      </motion.div>

      {/* Preview Content */}
      <motion.div
        variants={itemVariants}
        id="registration-preview" 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white p-6 lg:p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">YES INDIA Foundation</h1>
            <p className="text-blue-100 text-lg">Alumni Registration Record</p>
          </div>
          <div className="h-1 bg-[#ffd700] w-32 mx-auto rounded-full"></div>
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Photo & Personal Info */}
            <div className="space-y-6">
              {/* Photo */}
              {imagePreview && (
                <motion.div variants={itemVariants} className="flex justify-center">
                  <div className="w-56 h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Personal Information Card */}
              <motion.div variants={itemVariants}>
                <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Personal Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Full Name</p>
                      <p className="text-lg font-bold text-gray-800">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Mobile Number</p>
                      <p className="text-gray-800">{formData.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">WhatsApp Number</p>
                      <p className="text-gray-800">{formData.whatsappNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600"><Facebook className="h-4 w-4 text-blue-600" /></p>
                        <p className="text-gray-800">{formData.facebookLink}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600"><Instagram className="h-4 w-4 text-ink-600" /></p>
                        <p className="text-gray-800">{formData.instagramLink}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600"><Twitter className="h-4 w-4 text-blue-400" /></p>
                        <p className="text-gray-800">{formData.twitterLink}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600"><Linkedin className="h-4 w-4 text-blue-700" /></p>
                        <p className="text-gray-800">{formData.linkedinLink}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Message to Teacher */}
              {formData.messageToTeacher && (
                <motion.div variants={itemVariants}>
                  <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">Message to Teacher/Mentor</h3>
                    <p className="text-gray-800 italic leading-relaxed text-sm">{formData.messageToTeacher}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Columns - Rest of Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Information */}
              <motion.div variants={itemVariants}>
                <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Address Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Address</p>
                      <p className="text-gray-800">{formData.address}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">City</p>
                        <p className="text-gray-800 font-medium">{formData.place}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">State</p>
                        <p className="text-gray-800 font-medium">{formData.state}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Pin Code</p>
                        <p className="text-gray-800 font-medium">{formData.pinCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Educational Background */}
              <motion.div variants={itemVariants}>
                <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Educational Background</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">School Attended</p>
                      <p className="text-gray-800 font-medium">{formData.schoolAttended}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Graduation Year</p>
                      <p className="text-gray-800 font-medium">{formData.yearOfGraduation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Last Class Attended</p>
                      <p className="text-gray-800 font-medium">
                        {formData.lastClassAttended === 'Other' 
                          ? formData.otherClass 
                          : formData.lastClassAttended}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Qualification</p>
                      <p className="text-gray-800 font-medium">{formData.qualification}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Professional Details */}
              <motion.div variants={itemVariants}>
                <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Professional Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Job Title</p>
                      <p className="text-gray-800 font-medium">{formData.currentJobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Company Name</p>
                      <p className="text-gray-800 font-medium">{formData.companyName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Involvement Options */}
              {formData.stayInvolved && formData.stayInvolved.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-transparent p-6 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-bold text-lg text-gray-800">Ways to Stay Involved</h3>
                    </div>
                    <div className="space-y-2">
                      {formData.stayInvolved.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-800 font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-800">Registration Date:</span> {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-semibold">Ready to Submit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Final Confirmation Alert */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-xl"
      >
        <p className="text-green-800 text-sm leading-relaxed">
          <span className="font-bold">✓ All information verified:</span> Your registration form is complete and ready to be submitted. 
          Click the &quot;Submit Registration&quot; button below to finalize your registration with YES INDIA Foundation.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PreviewPDF;