export interface RegistrationStep {
  number: number;
  shortTitle: string;
  title: string;
  description: string;
  optional?: boolean;
}

export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    number: 1,
    shortTitle: 'Personal',
    title: 'Personal & Contact Details',
    description: 'Enter your name, contact numbers, social profiles, and residential address.',
  },
  {
    number: 2,
    shortTitle: 'Education',
    title: 'Educational Background',
    description: 'Share your YES INDIA school, graduation year, and academic qualifications.',
    optional: true,
  },
  {
    number: 3,
    shortTitle: 'Career',
    title: 'Professional Details',
    description: 'Tell us about your current role, organization, and areas of interest.',
    optional: true,
  },
  {
    number: 4,
    shortTitle: 'Photo',
    title: 'Passport Photograph',
    description: 'Upload a recent passport-size photo for your digital Alumni ID card.',
    optional: true,
  },
  {
    number: 5,
    shortTitle: 'Job Apply',
    title: 'Job Application',
    description: 'Optionally submit a job application along with your alumni registration.',
    optional: true,
  },
  {
    number: 6,
    shortTitle: 'Connect',
    title: 'Community Involvement',
    description: 'Choose how you would like to participate and leave a note for your teachers.',
    optional: true,
  },
  {
    number: 7,
    shortTitle: 'Review',
    title: 'Review & Submit',
    description: 'Verify your registration summary before submitting your application.',
  },
];
