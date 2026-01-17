'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, User, GraduationCap, Briefcase, Camera, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { registerAlumni } from '@/lib/firebaseService';
import PersonalInfoForm from './PInfoForm';
import EducationalInfoForm from './EducationalInfoForm';
import ProfessionalInfoForm from './ProfessionalInfoForm';
import PhotoUploadForm from './PhotoUploadForm';
import InvolvementForm from './InvolvementForm';
import PreviewPDF from './PreviewPDF';
import SuccessMessage from './SuccessMessage';
import { AlumniData } from '@/lib/types';

const MultiStepRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  // Ref for scrolling to top
  const topRef = useRef<HTMLDivElement>(null);

  // Update formData to match AlumniData interface
  const [formData, setFormData] = useState<Partial<AlumniData>>({
    fullName: '',
    address: '',
    place: '',
    state: '',
    district: '',
    pinCode: '',
    mobileNumber: '',
    whatsappNumber: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    linkedinLink: '',
    otherSocialLink: '',
    schoolAttended: '',
    yearOfGraduation: '',
    lastClassAttended: '',
    otherClass: '',
    currentJobTitle: '',
    companyName: '',
    qualification: '',
    additionalQualification: '',
    professionalInterests: '',
    yearsOfExperience: '',
    areasOfExpertise: '',
    industry: '',
    stayInvolved: [],
    messageToTeacher: '',
    status: 'pending',
    registrationDate: new Date().toISOString().split('T')[0],
    photoURL: '',
    createdAt: Date.now(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top helper function
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormDataChange = (data: Partial<AlumniData>) => {
    console.log('Form data changed:', data);
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleImageChange = (file: File | null, preview: string) => {
    console.log('Image changed:', file ? file.name : 'No file', preview ? 'Preview available' : 'No preview');
    setImageFile(file);
    setImagePreview(preview);
  };

  const steps = [
    {
      number: 1,
      title: 'Personal Details',
      description: 'Basic details & address',
      icon: <User className="w-5 h-5" />
    },
    {
      number: 2,
      title: 'Education',
      description: 'Educational background',
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      number: 3,
      title: 'Professional',
      description: 'Career details',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      number: 4,
      title: 'Photo',
      description: 'Upload photo',
      icon: <Camera className="w-5 h-5" />
    },
    {
      number: 5,
      title: 'Involvement',
      description: 'Stay connected options',
      icon: <Users className="w-5 h-5" />
    },
    {
      number: 6,
      title: 'Preview',
      description: 'Review & submit',
      icon: <Eye className="w-5 h-5" />
    },
  ];

  const validateCurrentStep = (): boolean => {
    console.log('Validating step:', currentStep);
    console.log('Form data:', formData);

    switch (currentStep) {
      case 1: // Personal Info - MANDATORY
        if (!formData.fullName?.trim()) {
          toast.error('Please enter your full name');
          return false;
        }

        if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
          toast.error('Please enter a valid 10-digit mobile number');
          return false;
        }

        if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) {
          toast.error('Please enter a valid 10-digit WhatsApp number');
          return false;
        }

        if (!formData.address?.trim()) {
          toast.error('Please enter your address');
          return false;
        }


        if (!formData.state) {
          toast.error('Please select your state');
          return false;
        }

        if (formData.state === 'Jammu and Kashmir') {
          if (!formData.district || formData.district.trim() === '') {
            toast.error('Please select your district (required for Jammu & Kashmir)');
            return false;
          }
        }

        console.log('Step 1 validation passed!');
        return true;

      case 2: // Educational Info - ALL OPTIONAL
        console.log('Step 2 validation passed (all optional)');
        return true;

      case 3: // Professional Info - ALL OPTIONAL
        console.log('Step 3 validation passed (all optional)');
        return true;

      case 4: // Photo Upload - OPTIONAL
        console.log('Step 4 validation passed (photo optional)');
        return true;

      case 5: // Involvement - ALL OPTIONAL
        console.log('Step 5 validation passed (all optional)');
        return true;

      case 6: // Preview - No validation needed
        console.log('Step 6 - Preview page');
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    console.log('Next button clicked for step:', currentStep);

    if (!validateCurrentStep()) {
      console.log('Validation failed for step:', currentStep);
      return;
    }

    console.log('Validation passed, moving to step:', currentStep + 1);
    setCurrentStep(currentStep + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    scrollToTop();
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      scrollToTop();
    }
  };

  const handleFinalSubmit = async () => {
    console.log('=== FINAL SUBMIT STARTED ===');
    console.log('Current form data:', formData);
    console.log('Image file:', imageFile);

    setLoading(true);

    try {
      // Create complete alumni data object with all required fields
      const completeAlumniData: AlumniData = {
        id: '', // Will be generated by Firebase
        fullName: formData.fullName || '',
        address: formData.address || '',
        place: formData.place || '',
        state: formData.state || '',
        district: formData.district || '',
        pinCode: formData.pinCode || '',
        mobileNumber: formData.mobileNumber || '',
        whatsappNumber: formData.whatsappNumber || '',
        facebookLink: formData.facebookLink || '',
        instagramLink: formData.instagramLink || '',
        twitterLink: formData.twitterLink || '',
        linkedinLink: formData.linkedinLink || '',
        otherSocialLink: formData.otherSocialLink || '',
        schoolAttended: formData.schoolAttended || '',
        yearOfGraduation: formData.yearOfGraduation || '',
        lastClassAttended: formData.lastClassAttended || '',
        otherClass: formData.otherClass || '',
        currentJobTitle: formData.currentJobTitle || '',
        companyName: formData.companyName || '',
        qualification: formData.qualification || '',
        additionalQualification: formData.additionalQualification || '',
        professionalInterests: formData.professionalInterests || '',
        yearsOfExperience: formData.yearsOfExperience || '',
        areasOfExpertise: formData.areasOfExpertise || '',
        industry: formData.industry || '',
        stayInvolved: formData.stayInvolved || [],
        messageToTeacher: formData.messageToTeacher || '',
        status: 'pending',
        registrationDate: new Date().toISOString().split('T')[0],
        socialMediaLink: '', // Legacy field
        photoURL: '', // Will be set by Firebase
        createdAt: Date.now(),
      };

      console.log('Complete alumni data prepared:', completeAlumniData);
      console.log('Calling registerAlumni function...');

      // Register alumni with Firebase (imageFile is optional)
      const result = await registerAlumni(completeAlumniData, imageFile);

      console.log('Registration result:', result);

      if (result.success) {
        console.log('Registration successful!');
        setRegistrationId(result.alumniId);
        setShowSuccess(true);
        scrollToTop();
        toast.success(result.message || 'Registration submitted successfully!');
      } else {
        console.error('Registration failed:', result.message);
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
      console.log('=== FINAL SUBMIT ENDED ===');
    }
  };

  const handleGoHome = () => {
    // Reset form and state
    setFormData({
      fullName: '',
      address: '',
      place: '',
      state: '',
      district: '',
      pinCode: '',
      mobileNumber: '',
      whatsappNumber: '',
      facebookLink: '',
      instagramLink: '',
      twitterLink: '',
      linkedinLink: '',
      otherSocialLink: '',
      schoolAttended: '',
      yearOfGraduation: '',
      lastClassAttended: '',
      otherClass: '',
      currentJobTitle: '',
      companyName: '',
      qualification: '',
      additionalQualification: '',
      professionalInterests: '',
      yearsOfExperience: '',
      areasOfExpertise: '',
      industry: '',
      stayInvolved: [],
      messageToTeacher: '',
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
      photoURL: '',
      createdAt: Date.now(),
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentStep(1);
    setShowSuccess(false);
    setRegistrationId('');

    // Navigate to home
    window.location.href = '/';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 2:
        return (
          <EducationalInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 3:
        return (
          <ProfessionalInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 4:
        return (
          <PhotoUploadForm
            imageFile={imageFile}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
          />
        );
      case 5:
        return (
          <InvolvementForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 6:
        return (
          <PreviewPDF
            formData={formData}
            imagePreview={imagePreview}
          />
        );
      default:
        return null;
    }
  };

  // Show success screen if registration is complete
  if (showSuccess) {
    return (
      <SuccessMessage
        alumniId={registrationId}
        fullName={formData.fullName || ''}
        onGoHome={handleGoHome}
      />
    );
  }

  return (
    <div ref={topRef} className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-100/40 blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 lg:py-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* Sidebar / Stepper Section */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Header Title for Desktop */}
              <div className="hidden lg:block space-y-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Alumni <br />
                    <span className="text-blue-600">Registration</span>
                  </h1>
                  <p className="text-gray-500 mt-4 text-lg">
                    Join our vibrant community and stay connected with your alma mater.
                  </p>
                </motion.div>

                {/* Progress Bar for Desktop */}
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-6">
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Step {currentStep} of {steps.length}
                </p>
              </div>

              {/* Mobile Header */}
              <div className="lg:hidden mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Registration</h1>
                <p className="text-gray-500 mb-6">Join our community.</p>

                {/* Mobile Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Step {currentStep}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round((currentStep / steps.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    />
                  </div>
                </div>
              </div>


              {/* Stepper Navigation (Vertical for Desktop) */}
              <div className="hidden lg:space-y-4 lg:block">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => handleStepClick(step.number)}
                    disabled={currentStep < step.number}
                    className={`w-full group flex items-center p-4 rounded-2xl transition-all duration-300 text-left border relative overflow-hidden ${currentStep === step.number
                        ? 'bg-white border-blue-500 shadow-xl ring-1 ring-blue-500' // Current
                        : currentStep > step.number
                          ? 'bg-blue-50 border-blue-200 text-blue-800' // Completed
                          : 'bg-white/50 border-transparent text-gray-400 opacity-60' // Future
                      }`}
                  >
                    {currentStep === step.number && (
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500" />
                    )}

                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${currentStep === step.number ? 'bg-blue-100 text-blue-600' :
                        currentStep > step.number ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.icon}
                    </div>

                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${currentStep === step.number ? 'text-blue-500' : 'text-gray-400'
                        }`}>Step {step.number}</p>
                      <h3 className={`font-bold text-base ${currentStep === step.number ? 'text-gray-900' :
                          currentStep > step.number ? 'text-blue-900' : 'text-gray-500'
                        }`}>
                        {step.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden min-h-[600px] flex flex-col"
            >
              {/* Form Content Header */}
              <div className="px-8 py-6 border-b border-gray-100 bg-white/50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1]?.title}</h2>
                  <p className="text-gray-500">{steps[currentStep - 1]?.description}</p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    {steps[currentStep - 1]?.icon}
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 lg:p-10 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Form Footer / Navigation */}
              <div className="p-6 lg:p-10 border-t border-gray-100 bg-gray-50/50">
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                  <Button
                    onClick={handleBack}
                    disabled={currentStep === 1 || loading}
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                    style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {currentStep === 5 && (
                      <Button
                        onClick={() => {
                          setCurrentStep(6);
                          scrollToTop();
                        }}
                        variant="outline"
                        className="flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    )}

                    {currentStep < 6 ? (
                      <Button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 px-8"
                      >
                        {currentStep === 5 ? 'Continue' : 'Next Step'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300 px-8"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Submit Application
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Help / Support Text */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Having trouble? <a href="mailto:support@yesindia.com" className="text-blue-600 hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegistration;