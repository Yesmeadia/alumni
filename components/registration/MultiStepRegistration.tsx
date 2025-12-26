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
        
        if (!formData.place?.trim()) {
          toast.error('Please enter your city/town');
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
        
        if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode)) {
          toast.error('Please enter a valid 6-digit pin code');
          return false;
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
    <div ref={topRef} className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-b-3xl shadow-2xl bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>

        <div className="relative z-10 px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-3"
            >
              Complete Your{' '}
              <span className="bg-[#ffd700] bg-clip-text text-transparent">
                Registration
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-blue-100 max-w-3xl"
            >
              Join our alumni network and stay connected with your peers
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Steps for Desktop */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8 space-y-3">
                {steps.map((step) => (
                  <motion.button
                    key={step.number}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStepClick(step.number)}
                    disabled={currentStep < step.number}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 text-left ${
                      currentStep === step.number
                        ? 'bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white shadow-lg shadow-blue-200'
                        : currentStep > step.number
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                        currentStep === step.number
                          ? 'bg-white/20'
                          : currentStep > step.number
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold opacity-75">Step {step.number}</div>
                        <h3 className="font-bold text-sm">{step.title}</h3>
                      </div>
                      {currentStep > step.number && (
                        <CheckCircle className="w-5 h-5 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Form Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Mobile Progress */}
              {isMobile && (
                <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-[#1a237e] to-[#3949ab]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">
                      Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-blue-100">
                      {steps[currentStep - 1]?.title}
                    </span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-2">
                    <motion.div
                      className="bg-[#ffd700] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Step Header */}
              <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-white px-6 lg:px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {steps[currentStep - 1]?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {steps[currentStep - 1]?.title}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {steps[currentStep - 1]?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                    <div>
                      {currentStep > 1 && (
                        <Button
                          onClick={handleBack}
                          variant="outline"
                          disabled={loading}
                          className="w-full sm:w-auto border-2 rounded-xl px-6 py-2"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {currentStep < 6 ? (
                        <>
                          {currentStep === 5 && (
                            <Button
                              onClick={() => {
                                setCurrentStep(6);
                                scrollToTop();
                              }}
                              variant="outline"
                              className="w-full sm:w-auto border-2 rounded-xl px-6 py-2"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          )}
                          <Button
                            onClick={handleNext}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#283593] hover:to-[#3949ab] text-white rounded-xl px-6 py-2 font-semibold"
                            disabled={loading}
                          >
                            {currentStep === 5 ? 'Preview & Continue' : 'Continue'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleFinalSubmit}
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-8 py-2 font-semibold shadow-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Submit Registration
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Dots Mobile */}
                {isMobile && (
                  <div className="flex justify-center gap-2 mt-8">
                    {steps.map((step) => (
                      <motion.div
                        key={step.number}
                        className={`rounded-full transition-all duration-300 ${
                          currentStep === step.number
                            ? 'bg-[#1a237e] w-8 h-2'
                            : currentStep > step.number
                            ? 'bg-blue-300 w-2 h-2'
                            : 'bg-gray-300 w-2 h-2'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Need Help?</h4>
                  <p className="text-gray-600 text-sm">
                    If you encounter any issues during registration, please contact our alumni support team at 
                    <a href="mailto:hello@cyberduce.com" className="font-semibold text-blue-600 underline ml-1">
                      hello@cyberduce.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegistration;