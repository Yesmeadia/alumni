import { ref, push, set, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from './firebase';
import {
  sanitizeFilename,
  sanitizeText,
  sanitizeMultilineText,
  validateImageMagicBytes,
  validateResumeMagicBytes,
} from './security';
import { AlumniData, JobApplicationData } from './types';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_RESUME_EXTS = new Set(['pdf', 'doc', 'docx']);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

interface AlumniRegistrationData {
  fullName: string;
  gender?: string;
  address: string;
  place: string;
  state: string;
  district?: string;
  pinCode: string;
  mobileNumber: string;
  whatsappNumber: string;
  email?: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  otherSocialLink?: string;
  schoolAttended: string;
  yearOfGraduation: string;
  lastClassAttended: string;
  otherClass?: string;
  qualification: string;
  additionalQualification?: string;
  currentJobTitle: string;
  companyName: string;
  industry?: string;
  yearsOfExperience?: string;
  areasOfExpertise?: string;
  professionalInterests?: string;
  stayInvolved: string[];
  messageToTeacher?: string;
  status?: 'pending' | 'approved' | 'rejected';
  photoURL: string;
  registrationDate: string;
  createdAt?: number;
}

const getFileExt = (name: string): string => {
  const parts = name.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const uploadImageToStorage = async (
  file: File | null,
  userId: string
): Promise<string> => {
  if (!file) return '';

  const ext = getFileExt(file.name);
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTS.has(ext)) {
    throw new Error('Only PNG, JPG, and WebP images are allowed.');
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image size must be between 1 byte and 5MB.');
  }

  const validSignature = await validateImageMagicBytes(file);
  if (!validSignature) {
    throw new Error('Invalid image file content. Please upload a genuine PNG, JPG, or WebP photo.');
  }

  try {
    const timestamp = Date.now();
    const safeName = sanitizeFilename(file.name, 'photo.jpg');
    const fileName = `alumni-photos/${sanitizeFilename(userId, 'user')}_${timestamp}_${safeName}`;

    const imageRef = storageRef(storage, fileName);
    const snapshot = await uploadBytes(imageRef, file, {
      contentType: file.type,
      contentDisposition: `inline; filename="${safeName}"`,
    });

    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const saveAlumniData = async (
  data: Omit<AlumniRegistrationData, 'photoURL' | 'registrationDate'>,
  photoURL: string
): Promise<string> => {
  try {
    const alumniRef = ref(database, 'alumni');
    const newAlumniRef = push(alumniRef);

    const sanitizedData: AlumniRegistrationData = {
      fullName: sanitizeText(data.fullName, 120),
      gender: sanitizeText(data.gender, 20),
      address: sanitizeMultilineText(data.address, 400),
      place: sanitizeText(data.place, 100),
      state: sanitizeText(data.state, 80),
      district: sanitizeText(data.district, 80),
      pinCode: sanitizeText(data.pinCode, 12).replace(/[^0-9]/g, ''),
      mobileNumber: sanitizeText(data.mobileNumber, 20).replace(/[^0-9+\- ]/g, ''),
      whatsappNumber: sanitizeText(data.whatsappNumber, 20).replace(/[^0-9+\- ]/g, ''),
      email: sanitizeText(data.email, 160),
      facebookLink: sanitizeText(data.facebookLink, 250),
      instagramLink: sanitizeText(data.instagramLink, 250),
      twitterLink: sanitizeText(data.twitterLink, 250),
      linkedinLink: sanitizeText(data.linkedinLink, 250),
      otherSocialLink: sanitizeText(data.otherSocialLink, 250),
      schoolAttended: sanitizeText(data.schoolAttended, 180),
      yearOfGraduation: sanitizeText(data.yearOfGraduation, 10),
      lastClassAttended: sanitizeText(data.lastClassAttended, 40),
      otherClass: sanitizeText(data.otherClass, 80),
      qualification: sanitizeText(data.qualification, 120),
      additionalQualification: sanitizeText(data.additionalQualification, 160),
      currentJobTitle: sanitizeText(data.currentJobTitle, 120),
      companyName: sanitizeText(data.companyName, 140),
      industry: sanitizeText(data.industry, 100),
      yearsOfExperience: sanitizeText(data.yearsOfExperience, 30),
      areasOfExpertise: sanitizeText(data.areasOfExpertise, 300),
      professionalInterests: sanitizeMultilineText(data.professionalInterests, 500),
      stayInvolved: Array.isArray(data.stayInvolved)
        ? data.stayInvolved.map((v) => sanitizeText(v, 80)).filter(Boolean).slice(0, 10)
        : [],
      messageToTeacher: sanitizeMultilineText(data.messageToTeacher, 1500),
      status: 'pending',
      photoURL: sanitizeText(photoURL, 1000),
      registrationDate: new Date().toISOString(),
      createdAt: Date.now(),
    };

    await set(newAlumniRef, sanitizedData);
    return newAlumniRef.key || '';
  } catch (error) {
    console.error('Error saving alumni data:', error);
    throw new Error('Failed to save registration data. Please try again.');
  }
};

export const checkDuplicateAlumni = async (
  mobileNumber: string,
  email?: string
): Promise<{ duplicateMobile: boolean; duplicateEmail: boolean }> => {
  const targetPhone = normalizePhone(mobileNumber);
  const targetEmail = sanitizeText(email, 160).toLowerCase();

  if (targetPhone.length < 7 && !targetEmail) {
    return { duplicateMobile: false, duplicateEmail: false };
  }

  const snapshot = await get(ref(database, 'alumni'));
  const raw = snapshot.val();
  if (!raw || typeof raw !== 'object') {
    return { duplicateMobile: false, duplicateEmail: false };
  }

  let duplicateMobile = false;
  let duplicateEmail = false;

  Object.values(raw).forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    const alumni = entry as AlumniData;

    if (
      targetPhone.length >= 7 &&
      (normalizePhone(alumni.mobileNumber) === targetPhone ||
        normalizePhone(alumni.whatsappNumber) === targetPhone)
    ) {
      duplicateMobile = true;
    }

    if (
      targetEmail &&
      alumni.email &&
      alumni.email.trim().toLowerCase() === targetEmail
    ) {
      duplicateEmail = true;
    }
  });

  return { duplicateMobile, duplicateEmail };
};

export const registerAlumni = async (
  formData: Omit<AlumniRegistrationData, 'photoURL' | 'registrationDate'>,
  imageFile: File | null
): Promise<{ success: boolean; alumniId: string; photoURL?: string; message: string }> => {
  try {
    const { duplicateMobile, duplicateEmail } = await checkDuplicateAlumni(
      formData.mobileNumber,
      formData.email
    );
    if (duplicateMobile && duplicateEmail) {
      return {
        success: false,
        alumniId: '',
        message: 'This mobile number and email address are already registered.',
      };
    }
    if (duplicateMobile) {
      return {
        success: false,
        alumniId: '',
        message: 'This mobile number is already registered on the alumni portal.',
      };
    }
    if (duplicateEmail) {
      return {
        success: false,
        alumniId: '',
        message: 'This email address is already registered on the alumni portal.',
      };
    }

    const tempUserId = `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    let photoURL = '';
    if (imageFile) {
      photoURL = await uploadImageToStorage(imageFile, tempUserId);
    }

    const alumniId = await saveAlumniData(formData, photoURL);

    return {
      success: true,
      alumniId,
      photoURL,
      message: 'Registration completed successfully!',
    };
  } catch (error) {
    return {
      success: false,
      alumniId: '',
      message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
    };
  }
};

const normalizePhone = (value?: string): string => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export const lookupRegisteredAlumni = async (
  mobileNumber: string,
  nameQuery?: string
): Promise<Array<{ id: string; data: AlumniData }>> => {
  const normalizedTarget = normalizePhone(mobileNumber);
  const cleanedName = sanitizeText(nameQuery, 120).toLowerCase();

  if (normalizedTarget.length < 7 && !cleanedName) {
    return [];
  }

  const snapshot = await get(ref(database, 'alumni'));
  const raw = snapshot.val();
  if (!raw || typeof raw !== 'object') return [];

  const matches: Array<{ id: string; data: AlumniData }> = [];

  Object.entries(raw).forEach(([id, entry]) => {
    if (!entry || typeof entry !== 'object') return;
    const alumni = entry as AlumniData;

    const mobileMatch =
      normalizedTarget.length >= 7 &&
      (normalizePhone(alumni.mobileNumber) === normalizedTarget ||
        normalizePhone(alumni.whatsappNumber) === normalizedTarget);

    const nameMatch =
      cleanedName.length > 0 &&
      (alumni.fullName || '').toLowerCase().includes(cleanedName);

    if (normalizedTarget.length >= 7 && cleanedName.length > 0) {
      if (mobileMatch && nameMatch) matches.push({ id, data: alumni });
    } else if (normalizedTarget.length >= 7) {
      if (mobileMatch) matches.push({ id, data: alumni });
    } else if (nameMatch) {
      matches.push({ id, data: alumni });
    }
  });

  return matches;
};

export const uploadResumeToStorage = async (
  file: File,
  alumniId: string
): Promise<{ url: string; fileName: string }> => {
  const ext = getFileExt(file.name);
  if (!ALLOWED_RESUME_TYPES.has(file.type) || !ALLOWED_RESUME_EXTS.has(ext)) {
    throw new Error('Only PDF, DOC, and DOCX resume files are allowed.');
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Resume file size must be between 1 byte and 5MB.');
  }

  const validSignature = await validateResumeMagicBytes(file);
  if (!validSignature) {
    throw new Error('Invalid resume file content. Please upload a valid PDF, DOC, or DOCX file.');
  }

  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name, 'resume.pdf');
  const safeAlumniId = sanitizeFilename(alumniId, 'alumni');
  const path = `job-resumes/${safeAlumniId}_${timestamp}_${safeName}`;
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type,
    contentDisposition: `attachment; filename="${safeName}"`,
  });
  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName: safeName };
};

export const submitJobApplication = async (
  application: Omit<
    JobApplicationData,
    'id' | 'appliedAt' | 'createdAt' | 'status' | 'resumeURL' | 'resumeFileName'
  >,
  resumeFile?: File | null
): Promise<{ success: boolean; applicationId: string; message: string }> => {
  try {
    let resumeURL = '';
    let resumeFileName = '';

    if (resumeFile) {
      const uploaded = await uploadResumeToStorage(resumeFile, application.alumniId);
      resumeURL = uploaded.url;
      resumeFileName = uploaded.fileName;
    }

    const appsRef = ref(database, 'jobApplications');
    const newAppRef = push(appsRef);
    const now = Date.now();

    const payload: Omit<JobApplicationData, 'id'> = {
      alumniId: sanitizeText(application.alumniId, 100),
      fullName: sanitizeText(application.fullName, 120),
      mobileNumber: sanitizeText(application.mobileNumber, 20).replace(/[^0-9+\- ]/g, ''),
      whatsappNumber: sanitizeText(application.whatsappNumber, 20).replace(/[^0-9+\- ]/g, ''),
      email: sanitizeText(application.email, 160),
      schoolAttended: sanitizeText(application.schoolAttended, 180),
      yearOfGraduation: sanitizeText(application.yearOfGraduation, 10),
      qualification: sanitizeText(application.qualification, 120),
      photoURL: sanitizeText(application.photoURL, 1000),
      positionApplied: sanitizeText(application.positionApplied, 120),
      preferredLocation: sanitizeText(application.preferredLocation, 120),
      willingForAbroad: application.willingForAbroad === 'Yes' ? 'Yes' : 'No',
      jobType: application.jobType,
      experienceYears: sanitizeText(application.experienceYears, 40) || 'Fresher',
      expectedSalary: sanitizeText(application.expectedSalary, 60),
      noticePeriod: sanitizeText(application.noticePeriod, 40),
      skills: sanitizeText(application.skills, 400),
      coverNote: sanitizeMultilineText(application.coverNote, 2000),
      resumeURL,
      resumeFileName,
      status: 'pending',
      appliedAt: new Date(now).toISOString(),
      createdAt: now,
    };

    await set(newAppRef, payload);

    return {
      success: true,
      applicationId: newAppRef.key || '',
      message: 'Your job application has been submitted successfully.',
    };
  } catch (error) {
    return {
      success: false,
      applicationId: '',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to submit job application. Please try again.',
    };
  }
};
