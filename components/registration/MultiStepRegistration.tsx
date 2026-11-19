'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';
import { registerAlumni } from '@/lib/firebaseService';
import { AlumniData } from '@/lib/types';
import { REGISTRATION_STEPS } from '@/data/registration';
import { SITE_CONFIG } from '@/data/site';
import PersonalInfoForm from './PInfoForm';
import EducationalInfoForm from './EducationalInfoForm';
import ProfessionalInfoForm from './ProfessionalInfoForm';
import PhotoUploadForm from './PhotoUploadForm';
import InvolvementForm from './InvolvementForm';
import PreviewPDF from './PreviewPDF';
import SuccessMessage from './SuccessMessage';

const INITIAL_FORM_DATA: Partial<AlumniData> = {
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
  photoURL: '',
};

const MultiStepRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<Partial<AlumniData>>(() => ({
    ...INITIAL_FORM_DATA,
    registrationDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  }));

  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormDataChange = (data: Partial<AlumniData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleImageChange = (file: File | null, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep !== 1) return true;

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
    if (formData.state === 'Jammu and Kashmir' && !formData.district?.trim()) {
      toast.error('Please select your district (required for Jammu & Kashmir)');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, REGISTRATION_STEPS.length));
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      scrollToTop();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const completeAlumniData: AlumniData = {
        id: '',
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
        socialMediaLink: '',
        photoURL: '',
        createdAt: Date.now(),
      };

      const result = await registerAlumni(completeAlumniData, imageFile);

      if (result.success) {
        setRegistrationId(result.alumniId);
        setShowSuccess(true);
        scrollToTop();
        toast.success(result.message || 'Registration submitted successfully!');
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      registrationDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentStep(1);
    setShowSuccess(false);
    setRegistrationId('');
    window.location.href = '/';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm formData={formData} onFormDataChange={handleFormDataChange} />;
      case 2:
        return (
          <EducationalInfoForm formData={formData} onFormDataChange={handleFormDataChange} />
        );
      case 3:
        return (
          <ProfessionalInfoForm formData={formData} onFormDataChange={handleFormDataChange} />
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
        return <InvolvementForm formData={formData} onFormDataChange={handleFormDataChange} />;
      case 6:
        return <PreviewPDF formData={formData} imagePreview={imagePreview} />;
      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <SuccessMessage
        alumniId={registrationId}
        fullName={formData.fullName || ''}
        onGoHome={handleGoHome}
      />
    );
  }

  const activeStep = REGISTRATION_STEPS[currentStep - 1];
  const progressPercent = Math.round((currentStep / REGISTRATION_STEPS.length) * 100);

  return (
    <div ref={topRef} className="bg-white pb-16 sm:pb-24">
      {/* Compact Indigo Page Banner */}
      <section className="bg-[#2a1b63] text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Alumni Registration
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 max-w-xl">
            Register your profile with YES INDIA Foundation to receive your digital Alumni ID
            and join regional chapters.
          </p>
        </div>
      </section>

      {/* Borderless Horizontal Step Navigation */}
      <div className="border-b border-gray-200 bg-[#faf9f6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Underline Tabs */}
          <div className="hidden md:grid grid-cols-6 gap-2">
            {REGISTRATION_STEPS.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={currentStep < step.number}
                  className={`py-4 px-2 border-b-2 text-left transition-colors ${isActive
                      ? 'border-[#2a1b63] text-[#2a1b63]'
                      : isCompleted
                        ? 'border-[#a5874c] text-[#212529] hover:text-[#2a1b63]'
                        : 'border-transparent text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-0.5">
                    <span className={isActive ? 'text-[#2a1b63]' : isCompleted ? 'text-[#a5874c]' : 'text-gray-400'}>
                      {String(step.number).padStart(2, '0')}
                    </span>
                    {isCompleted && <span className="text-[#a5874c]">✓</span>}
                  </div>
                  <span className="text-xs font-semibold tracking-tight block truncate">
                    {step.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Compact Step Bar */}
          <div className="md:hidden py-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#2a1b63]">
                {String(currentStep).padStart(2, '0')}. {activeStep.shortTitle}
              </span>
              <span className="text-[#a5874c]">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#a5874c]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Open Borderless Form Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Active Step Header */}
        <div className="pb-6 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#a5874c]">
              STEP {String(currentStep).padStart(2, '0')}
            </span>
            {activeStep.optional && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#f7f4ed] text-[#a5874c]">
                Optional
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1b63] mt-1">
            {activeStep.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{activeStep.description}</p>
        </div>

        {/* Active Step Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Clean Bottom Navigation */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-[#212529] hover:bg-gray-100 rounded-lg px-6"
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            &larr; Previous
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-auto bg-[#2a1b63] hover:bg-[#1f134c] text-white rounded-lg px-8"
              >
                {currentStep === 5 ? 'Review Application' : 'Continue'} &rarr;
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-[#a5874c] hover:bg-[#93763e] text-white rounded-lg px-8 font-semibold"
              >
                {loading && (
                  <Icon name="progress_activity" className="mr-2 text-[18px] animate-spin" />
                )}
                Submit Registration
              </Button>
            )}
          </div>
        </div>

        {/* Support Footer Note */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Need assistance with registration? Contact{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-[#2a1b63] font-semibold hover:underline"
          >
            {SITE_CONFIG.email}
          </a>
        </p>
      </div>
    </div>
  );
};

export default MultiStepRegistration;
