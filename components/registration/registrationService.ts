// app/components/registration/registrationService.ts
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set } from 'firebase/database';
import { storage, database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';

export const submitRegistration = async (
  formData: Partial<AlumniData>,
  imageFile: File | null
): Promise<boolean> => {
  try {
    // Upload image to Firebase Storage
    let photoURL = '';
    if (imageFile) {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const imageRef = storageRef(storage, `alumni-photos/${fileName}`);
      
      await uploadBytes(imageRef, imageFile);
      photoURL = await getDownloadURL(imageRef);
    }

    // Prepare alumni data
    const alumniData: AlumniData = {
      ...formData as AlumniData,
      photoURL,
      createdAt: Date.now(),
      status: 'pending',
      registrationDate: new Date().toISOString(),
    };

    // Save to Firebase Realtime Database
    const alumniRef = dbRef(database, 'alumni');
    const newAlumniRef = push(alumniRef);
    await set(newAlumniRef, alumniData);

    return true;
  } catch (error) {
    console.error('Error submitting registration:', error);
    throw error;
  }
};