export interface AlumniData {
  id?: string;
  fullName: string;
  address: string;
  place: string;
  state: string;
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
  { length: 30 },
  (_, i) => (new Date().getFullYear() - i).toString()
);

// Group schools by state
export const YES_INDIA_SCHOOLS_BY_STATE = {
  'Jammu and Kashmir': [
    'YES INDIA School - Srinagar',
    'YES INDIA School - Jammu',
  ],
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

export const ALL_YES_INDIA_SCHOOLS = Object.values(YES_INDIA_SCHOOLS_BY_STATE).flat();

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