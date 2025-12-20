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
      useCORS: true, 
      logging: false, 
      background: '#ffffff',
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
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 py-2 font-semibold flex items-center justify-center shadow-lg"
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
        className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-xl shadow-md"
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
        <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white p-8">
          <div className="text-center mb-6">
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
                  <div className="w-56 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-blue-100">
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
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Personal Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">Full Name</p>
                      <p className="text-lg font-bold text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700">Mobile Number</p>
                      <p className="text-gray-800">{formData.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700">WhatsApp Number</p>
                      <p className="text-gray-800">{formData.whatsappNumber}</p>
                    </div>
                    
                    {/* Social Media Links */}
                    {formData.facebookLink && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-semibold text-blue-700">Facebook</p>
                        </div>
                        <p className="text-gray-800 text-sm truncate">{formData.facebookLink}</p>
                      </div>
                    )}
                    {formData.instagramLink && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          <p className="text-sm font-semibold text-blue-700">Instagram</p>
                        </div>
                        <p className="text-gray-800 text-sm truncate">{formData.instagramLink}</p>
                      </div>
                    )}
                    {formData.twitterLink && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Twitter className="h-4 w-4 text-blue-400" />
                          <p className="text-sm font-semibold text-blue-700">Twitter/X</p>
                        </div>
                        <p className="text-gray-800 text-sm truncate">{formData.twitterLink}</p>
                      </div>
                    )}
                    {formData.linkedinLink && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          <p className="text-sm font-semibold text-blue-700">LinkedIn</p>
                        </div>
                        <p className="text-gray-800 text-sm truncate">{formData.linkedinLink}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Message to Teacher */}
              {formData.messageToTeacher && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">Message to Teacher</h3>
                    </div>
                    <p className="text-gray-800 italic leading-relaxed text-sm">&quot;{formData.messageToTeacher}&quot;</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Columns - Rest of Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Information */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Address Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-green-700">Address</p>
                      <p className="text-gray-800">{formData.address}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-green-700">City</p>
                        <p className="text-gray-800 font-medium">{formData.place}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-700">State</p>
                        <p className="text-gray-800 font-medium">{formData.state}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-700">Pin Code</p>
                        <p className="text-gray-800 font-medium">{formData.pinCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Educational Background */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Educational Background</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-orange-700">School Attended</p>
                      <p className="text-gray-800 font-medium">{formData.schoolAttended}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Graduation Year</p>
                      <p className="text-gray-800 font-medium">{formData.yearOfGraduation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Last Class Attended</p>
                      <p className="text-gray-800 font-medium">
                        {formData.lastClassAttended === 'Other' 
                          ? formData.otherClass 
                          : formData.lastClassAttended}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Qualification</p>
                      <p className="text-gray-800 font-medium">{formData.qualification}</p>
                    </div>
                    {formData.additionalQualification && (
                      <div className="col-span-2">
                        <p className="text-sm font-semibold text-orange-700">Additional Qualifications</p>
                        <p className="text-gray-800 font-medium">{formData.additionalQualification}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Professional Details */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-200 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Professional Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">Job Title</p>
                      <p className="text-gray-800 font-medium">{formData.currentJobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">Company Name</p>
                      <p className="text-gray-800 font-medium">{formData.companyName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Involvement Options */}
              {formData.stayInvolved && formData.stayInvolved.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl border-2 border-teal-200 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">Ways to Stay Involved</h3>
                    </div>
                    <div className="space-y-2">
                      {formData.stayInvolved.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                          <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
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
                  <span className="font-semibold text-gray-800">Registration Date:</span> {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-semibold">Ready to Submit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Final Confirmation Alert */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-xl shadow-md"
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