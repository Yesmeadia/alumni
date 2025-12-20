import { ref, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from './firebase';

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
  file: File,
  userId: string
): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `alumni-photos/${userId}_${timestamp}_${file.name}`;
    
    // Create storage reference
    const imageRef = storageRef(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
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
    
    // Save to database
    await set(newAlumniRef, alumniData);
    
    // Return the generated key
    return newAlumniRef.key || '';
  } catch (error) {
    console.error('Error saving alumni data:', error);
    throw new Error('Failed to save registration data. Please try again.');
  }
};

export const registerAlumni = async (
  formData: Omit<AlumniRegistrationData, 'photoURL' | 'registrationDate'>,
  imageFile: File
): Promise<{ success: boolean; alumniId: string; message: string }> => {
  try {
    // Generate a unique ID for this registration
    const tempUserId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 1: Upload image to Firebase Storage
    const photoURL = await uploadImageToStorage(imageFile, tempUserId);
    
    // Step 2: Save alumni data with photo URL to Realtime Database
    const alumniId = await saveAlumniData(formData, photoURL);
    
    return {
      success: true,
      alumniId,
      message: 'Registration completed successfully!',
    };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};