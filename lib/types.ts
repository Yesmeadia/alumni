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
    'Yaseen English School - Maldiyalan',
    'Jameel Public Academy - Daradullian',
    'Yaseen English School - Chandak',
    'Yaseen English School - Galhuta Harni',
    'Yaseen English School - Mendhar',
    'Yaseen English school - Serikhawaja',
    'Yaseen English School - Dhundak',
    'Yaseen English School - Surankote',
    'Yaseen English School - Trananwali',
    'YES Model Institute of Education - Drogian',
    'YCIS - Dhundak',
    'YCIS - Sangiote',


  ],
};

// Get all JK schools
export const ALL_JK_SCHOOLS = Object.values(JK_SCHOOLS_BY_DISTRICT).flat();

// Group schools by state (for non-JK states)
export const YES_INDIA_SCHOOLS_BY_STATE = {
  'Delhi': [
  ],
  'Rajasthan': [
    'YESSARWAR SHIKSHAN SANSTHAN SR.SEC SCHOOL - SERWA',
    'YES DESERT BLOOM SCHOOL - PHALODI',
    'YES PUBLIC ENGLISH MEDIUM SCHOOL - BALOTRA',
    'YES EDU HOME BOYS HOSTEL - SERWA',
    'YES ENGLISH SCHOOL SUJON KA NIVAN - SUJA SHARIF',
    'YES FAIZ-E-SIDDIQUIA SR.SEC SCHOOL - SUJA SHARIF',
  ],
  'Bihar': [
    'YES HASAN FATIMA ENGLISH SCHOOL - BISFI',
  ],
  'West Bengal': [
    'YASEEN ENGLISH SCHOOL - KARISHAL',
    'YES INDIA PUBLIC SCHOOL - Mathabhanga',
  ],
  'Maharashtra': [
    'YES PA INAMDAR ENGLISH MEDIUM SCHOOL - AHMAD NAGAR',
    'YES INDIA PUBLIC SCHOOL - CHALISGAON',
    'RAZA ENGLISH MEDIUM SCHOOL  - KHAIRGAON',
  ],
  'Andhra Pradesh': [
    'YASEEN ENGLISH MEDIUM SCHOOL - ANANTAPUR',
    'YASEEN COLLEGE OF INTEGRATED STUDIES - TADIPATRI'
  ],
  'Karnataka': [
    'YES IPS MALEBENNURE - MALEBENNUR',
    'YES SOOFI ENGLISH SCHOOL - LAXMESHWAR',
    'YES SIR HIND ENGLISH MEDIUM SCHOOL  - UDUPI',
  ],
  'Kerala': [
    'YESUQ HS SCHOOL  - MONGAM',
    'YESUQ DAWA - MONGAM'
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