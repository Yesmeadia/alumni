import { ref, push, set, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from './firebase';
import { sanitizeFilename } from './security';
import { AlumniData, JobApplicationData } from './types';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

interface AlumniRegistrationData {
  fullName: string;
  address: string;
  place: string;
  state: string;
  pinCode: string;
  mobileNumber: string;
  whatsappNumber: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  schoolAttended: string;
  yearOfGraduation: string;
  lastClassAttended: string;
  otherClass?: string;
  qualification: string;
  additionalQualification?: string;
  currentJobTitle: string;
  companyName: string;
  stayInvolved: string[];
  messageToTeacher?: string;
  photoURL: string;
  registrationDate: string;
}

export const uploadImageToStorage = async (
  file: File | null,
  userId: string
): Promise<string> => {
  try {
    // If no file is provided, return empty string
    if (!file) {
      console.log('No image file provided, skipping upload');
      return '';
    }

    console.log('Uploading image:', file.name);
    
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error('Only PNG, JPG, and WebP images are allowed.');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Image size must not exceed 5MB.');
    }

    // Create a unique sanitized filename
    const timestamp = Date.now();
    const safeName = sanitizeFilename(file.name, 'photo.jpg');
    const fileName = `alumni-photos/${userId}_${timestamp}_${safeName}`;
    
    // Create storage reference
    const imageRef = storageRef(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
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
    console.log('Saving alumni data to database...');
    
    // Create reference to alumni collection
    const alumniRef = ref(database, 'alumni');
    
    // Create new alumni entry with auto-generated key
    const newAlumniRef = push(alumniRef);
    
    // Prepare data with photo URL and registration date
    const alumniData: AlumniRegistrationData = {
      ...data,
      photoURL,
      registrationDate: new Date().toISOString(),
    };
    
    console.log('Alumni data to save:', alumniData);
    
    // Save to database
    await set(newAlumniRef, alumniData);
    
    console.log('Alumni data saved successfully with ID:', newAlumniRef.key);
    
    // Return the generated key
    return newAlumniRef.key || '';
  } catch (error) {
    console.error('Error saving alumni data:', error);
    throw new Error('Failed to save registration data. Please try again.');
  }
};

export const registerAlumni = async (
  formData: Omit<AlumniRegistrationData, 'photoURL' | 'registrationDate'>,
  imageFile: File | null
): Promise<{ success: boolean; alumniId: string; message: string }> => {
  try {
    console.log('=== registerAlumni function started ===');
    console.log('Form data received:', formData);
    console.log('Image file received:', imageFile ? imageFile.name : 'No image');
    
    // Generate a unique ID for this registration
    const tempUserId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated temp user ID:', tempUserId);
    
    // Step 1: Upload image to Firebase Storage (optional)
    let photoURL = '';
    if (imageFile) {
      console.log('Uploading image to storage...');
      photoURL = await uploadImageToStorage(imageFile, tempUserId);
      console.log('Image uploaded, URL:', photoURL);
    } else {
      console.log('No image to upload, proceeding without photo');
    }
    
    // Step 2: Save alumni data with photo URL to Realtime Database
    console.log('Saving alumni data to database...');
    const alumniId = await saveAlumniData(formData, photoURL);
    console.log('Alumni data saved with ID:', alumniId);
    
    console.log('=== registerAlumni function completed successfully ===');
    
    return {
      success: true,
      alumniId,
      message: 'Registration completed successfully!',
    };
  } catch (error) {
    console.error('=== Error during registration ===');
    console.error('Error details:', error);
    
    // Return error response instead of throwing
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
  const cleanedName = (nameQuery || '').trim().toLowerCase();

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
  if (!ALLOWED_RESUME_TYPES.has(file.type)) {
    throw new Error('Only PDF, DOC, and DOCX resume files are allowed.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Resume file size must not exceed 5MB.');
  }

  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name, 'resume.pdf');
  const path = `job-resumes/${alumniId}_${timestamp}_${safeName}`;
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName: safeName };
};

export const submitJobApplication = async (
  application: Omit<JobApplicationData, 'id' | 'appliedAt' | 'createdAt' | 'status' | 'resumeURL' | 'resumeFileName'>,
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
      ...application,
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