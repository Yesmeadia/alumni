export interface AlumniData {
  id?: string;
  fullName: string;
  address: string;
  place: string;
  state: string;
  district?: string;
  pinCode: string;
  mobileNumber: string;
  whatsappNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  updatedAt?: number;
  socialMediaLink: string;
  schoolAttended: string;
  yearOfGraduation: string;
  lastClassAttended: string; 
  otherClass?: string;
  currentJobTitle: string;
  companyName: string;
  qualification: string;
  additionalQualification?: string;
  professionalInterests: string;
  yearsOfExperience: string;
  areasOfExpertise: string;
  industry: string;
  stayInvolved: string[];
  messageToTeacher: string;
  photoURL: string;
  createdAt: number;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  otherSocialLink?: string;
}

export const LAST_CLASS_OPTIONS = [
  '10th Class',
  '12th Class',
  'Other',
];

export const GRADUATION_YEARS = Array.from(
  { length: 19 },
  (_, i) => (new Date().getFullYear() - i).toString()
);

// Jammu and Kashmir districts
export const JK_DISTRICTS = [
  'Anantnag', 'Budgam', 'Jammu', 'Poonch',
  'Rajouri', 'Srinagar',
];

// Schools organized by district in Jammu and Kashmir
export const JK_SCHOOLS_BY_DISTRICT = {
  'Srinagar': [
    'Yaseen English School - Maloora',

  ],
  'Jammu': [
    'New Taj Public High School - Bathindi',
    'Yaseen College of Integrated Studies - Sujuma'

  ],
  'Anantnag': [
    'Darul Uloom Jamia Zainul Islam - Pahalgham',
  ],
  'Budgam': [
    'Solah Idarathul Aloom School - Narbal',
  ],
  'Rajouri': [
    'DS Educational Institute  - Rajouri',
    'New Yaseen English School - Rajouri',
    'Yaseen English School - Shahdara Shareif',
  ],
  'Poonch': [
    'Raza Ul Uloom Islamia Higher Secondary - Poonch',
    'Yaseen English School - Terwan',
    'Yaseen English School - Maldiyalan ',
    'Jameel Public Academy - Daradullian',
    'Yaseen English School - Chandak',
  ],
};

// Get all JK schools
export const ALL_JK_SCHOOLS = Object.values(JK_SCHOOLS_BY_DISTRICT).flat();

// Group schools by state (for non-JK states)
export const YES_INDIA_SCHOOLS_BY_STATE = {
  'Delhi': [
    'YES INDIA School - Delhi Main Campus',
    'YES INDIA School - Delhi West',
    'YES INDIA School - Delhi South',
  ],
  'Rajasthan': [
    'YES INDIA School - Jaipur',
    'YES INDIA School - Jodhpur',
    'YES INDIA School - Udaipur',
  ],
  'Bihar': [
    'YES INDIA School - Patna',
    'YES INDIA School - Gaya',
    'YES INDIA School - Muzaffarpur',
  ],
  'West Bengal': [
    'YES INDIA School - Kolkata Main',
    'YES INDIA School - Kolkata South',
    'YES INDIA School - Howrah',
  ],
  'Maharashtra': [
    'YES INDIA School - Mumbai Main',
    'YES INDIA School - Mumbai West',
    'YES INDIA School - Pune',
    'YES INDIA School - Nagpur',
  ],
  'Andhra Pradesh': [
    'YES INDIA School - Visakhapatnam',
    'YES INDIA School - Vijayawada',
    'YES INDIA School - Tirupati',
  ],
  'Karnataka': [
    'YES INDIA School - Bangalore Main',
    'YES INDIA School - Bangalore North',
    'YES INDIA School - Mysore',
  ],
  'Kerala': [
    'YES INDIA School - Kochi',
    'YES INDIA School - Thiruvananthapuram',
    'YES INDIA School - Kozhikode',
  ],
};

export const ALL_YES_INDIA_SCHOOLS = [
  ...Object.values(YES_INDIA_SCHOOLS_BY_STATE).flat(),
  ...ALL_JK_SCHOOLS
];

export const INDIAN_STATES = [
  'Jammu and Kashmir',
  'Delhi',
  'Rajasthan',
  'Bihar',
  'West Bengal',
  'Maharashtra',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
];

export const INVOLVEMENT_OPTIONS = [
  'Mentoring Current Students',
  'Guest Lectures & Workshops',
  'Fundraising & Donations',
  'Alumni Network Events',
];

export interface FormComponentProps {
  formData: AlumniData;
  onFormDataChange: (data: Partial<AlumniData>) => void;
}

export interface PhotoUploadProps {
  imageFile: File | null;
  imagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

export interface PreviewPDFProps {
  formData: AlumniData;
  imagePreview: string;
}

export interface SuccessMessageProps {
  alumniId: string;
  fullName: string;
  onGoHome: () => void;
}