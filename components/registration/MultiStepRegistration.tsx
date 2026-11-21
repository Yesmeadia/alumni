'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';
import { registerAlumni, checkDuplicateAlumni, submitJobApplication } from '@/lib/firebaseService';
import { AlumniData } from '@/lib/types';
import { REGISTRATION_STEPS } from '@/data/registration';
import { SITE_CONFIG } from '@/data/site';
import PersonalInfoForm from './PInfoForm';
import EducationalInfoForm from './EducationalInfoForm';
import ProfessionalInfoForm from './ProfessionalInfoForm';
import PhotoUploadForm from './PhotoUploadForm';
import JobApplicationStep, { RegistrationJobFormData } from './JobApplicationStep';
import InvolvementForm from './InvolvementForm';
import PreviewPDF from './PreviewPDF';
import SuccessMessage from './SuccessMessage';

const INITIAL_FORM_DATA: Partial<AlumniData> = {
  fullName: '',
  gender: '',
  email: '',
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validatingStep, setValidatingStep] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [applyForJob, setApplyForJob] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFormData, setJobFormData] = useState<RegistrationJobFormData>({
    positionApplied: '',
    jobType: 'Full-time',
    preferredLocation: '',
    willingForAbroad: 'No',
    experienceYears: '',
    expectedSalary: '',
    noticePeriod: 'Immediate',
    skills: '',
    coverNote: '',
  });
  const [formData, setFormData] = useState<Partial<AlumniData>>(() => ({
    ...INITIAL_FORM_DATA,
    registrationDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  }));

  const topRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const lenis = useLenis();

  const scrollToTop = useCallback(() => {
    const run = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    run();
    requestAnimationFrame(run);
    setTimeout(run, 250);
  }, [lenis]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToTop();
  }, [currentStep, showSuccess, scrollToTop]);

  const handleFormDataChange = (data: Partial<AlumniData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleImageChange = (file: File | null, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    if (currentStep === 1) {
      if (!formData.fullName?.trim() || formData.fullName.trim().length < 2) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber.trim())) {
        toast.error('Please enter a valid 10-digit mobile number');
        return false;
      }
      if (
        formData.email?.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber.trim())) {
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
      if (formData.pinCode?.trim() && !/^\d{6}$/.test(formData.pinCode.trim())) {
        toast.error('Pin Code must be 6 digits');
        return false;
      }

      // Check for duplicate mobile number or email against existing registrations
      setValidatingStep(true);
      try {
        const { duplicateMobile, duplicateEmail } = await checkDuplicateAlumni(
          formData.mobileNumber,
          formData.email
        );
        if (duplicateMobile && duplicateEmail) {
          toast.error('This mobile number and email address are already registered.');
          return false;
        }
        if (duplicateMobile) {
          toast.error('This mobile number is already registered on the alumni portal.');
          return false;
        }
        if (duplicateEmail) {
          toast.error('This email address is already registered on the alumni portal.');
          return false;
        }
      } catch {
        // Proceed if lookup fails transiently; final submit checks again
      } finally {
        setValidatingStep(false);
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.state) {
        toast.error('Please select your state');
        return false;
      }
      if (formData.state === 'Jammu and Kashmir' && !formData.district?.trim()) {
        toast.error('Please select your district');
        return false;
      }
      if (!formData.schoolAttended?.trim()) {
        toast.error('Please select the school you attended');
        return false;
      }
      if (!formData.yearOfGraduation?.trim()) {
        toast.error('Please select your pass-out year');
        return false;
      }
      if (!formData.lastClassAttended?.trim()) {
        toast.error('Please select your last class attended');
        return false;
      }
      if (formData.lastClassAttended === 'Other' && !formData.otherClass?.trim()) {
        toast.error('Please specify your class name');
        return false;
      }
      return true;
    }

    if (currentStep === 5 && applyForJob) {
      if (!jobFormData.positionApplied.trim()) {
        toast.error('Please enter the position / role you are applying for');
        return false;
      }
      if (!jobFormData.preferredLocation.trim()) {
        toast.error('Please enter your preferred work location');
        return false;
      }
      if (!jobFormData.skills.trim()) {
        toast.error('Please enter your key skills');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
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
      const completeAlumniData: Omit<AlumniData, 'id'> = {
        fullName: formData.fullName || '',
        gender: formData.gender || '',
        email: formData.email || '',
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
        if (applyForJob && result.alumniId) {
          const jobResult = await submitJobApplication(
            {
              alumniId: result.alumniId,
              fullName: completeAlumniData.fullName,
              mobileNumber: completeAlumniData.mobileNumber,
              whatsappNumber: completeAlumniData.whatsappNumber || '',
              email: completeAlumniData.email || '',
              schoolAttended: completeAlumniData.schoolAttended || '',
              yearOfGraduation: completeAlumniData.yearOfGraduation || '',
              qualification: completeAlumniData.qualification || '',
              photoURL: result.photoURL || '',
              positionApplied: jobFormData.positionApplied.trim(),
              preferredLocation: jobFormData.preferredLocation.trim(),
              willingForAbroad: jobFormData.willingForAbroad,
              jobType: jobFormData.jobType,
              experienceYears: jobFormData.experienceYears.trim() || 'Fresher',
              expectedSalary: jobFormData.expectedSalary.trim(),
              noticePeriod: jobFormData.noticePeriod,
              skills: jobFormData.skills.trim(),
              coverNote: jobFormData.coverNote.trim(),
            },
            resumeFile
          );
          if (!jobResult.success) {
            toast.warning(
              `Registration saved, but job application failed: ${jobResult.message}`
            );
          }
        }

        toast.success(result.message || 'Registration submitted successfully!');
        const query = new URLSearchParams();
        if (result.alumniId) query.set('id', result.alumniId);
        if (completeAlumniData.fullName) query.set('name', completeAlumniData.fullName);
        if (completeAlumniData.schoolAttended) query.set('school', completeAlumniData.schoolAttended);
        if (completeAlumniData.yearOfGraduation) query.set('batch', completeAlumniData.yearOfGraduation);
        router.push(`/register/success?${query.toString()}`);
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
        return (
          <JobApplicationStep
            enabled={applyForJob}
            onToggleEnabled={setApplyForJob}
            jobData={jobFormData}
            onJobDataChange={(data) =>
              setJobFormData((prev) => ({ ...prev, ...data }))
            }
            resumeFile={resumeFile}
            onResumeChange={setResumeFile}
          />
        );
      case 6:
        return <InvolvementForm formData={formData} onFormDataChange={handleFormDataChange} />;
      case 7:
        return (
          <PreviewPDF
            formData={formData}
            imagePreview={imagePreview}
            applyForJob={applyForJob}
            jobData={jobFormData}
            resumeFile={resumeFile}
          />
        );
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
          <div className="hidden md:grid grid-cols-7 gap-2">
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
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
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
        <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handleBack}
              disabled={loading}
              variant="outline"
              className="w-full sm:w-auto h-11 border-gray-300 text-[#212529] hover:bg-gray-100 rounded-lg px-6"
            >
              Previous
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <div className="flex gap-3 w-full sm:w-auto">
            {currentStep < REGISTRATION_STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading || validatingStep}
                className="w-full sm:w-auto h-11 bg-[#2a1b63] hover:bg-[#1f134c] text-white rounded-lg px-8"
              >
                {validatingStep
                  ? 'Checking...'
                  : currentStep === REGISTRATION_STEPS.length - 1
                    ? 'Review Application'
                    : 'Continue'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full sm:w-auto h-11 bg-[#a5874c] hover:bg-[#93763e] text-white rounded-lg px-8 font-semibold"
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
