export interface HeroSlide {
  src: string;
  title: string;
}

export interface UpdateItem {
  badge: string;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface BenefitPillar {
  title: string;
  description: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/images/1.jpg',
    title: 'Empowering the Next Generation Through Alumni Connections',
  },
  {
    src: '/images/2.jpg',
    title: 'A Lifelong Community Built on Values and Excellence',
  },
  {
    src: '/images/3.jpg',
    title: 'Connecting Graduates Across Batches and Continents',
  },
  {
    src: '/images/4.jpg',
    title: 'Mentoring Future Leaders of YES INDIA Foundation',
  },
  {
    src: '/images/5.jpg',
    title: 'Together for Education, Service, and Progress',
  },
  {
    src: '/images/6.jpg',
    title: 'Celebrating the Legacy of YES INDIA Alumni',
  },
];

export const LATEST_UPDATES: UpdateItem[] = [
  {
    badge: '2026',
    title: 'ALUMNI REGISTRY OPEN',
    text: 'Register online to receive your verified digital YES INDIA Alumni ID card.',
  },
  {
    badge: 'GLOBAL',
    title: 'CHAPTER NETWORKS',
    text: 'Connect with regional chapters and fellow graduates across India and abroad.',
  },
  {
    badge: 'MENTOR',
    title: 'STUDENT GUIDANCE',
    text: 'Volunteer to mentor current YES INDIA students in academics and careers.',
  },
];

export const ALUMNI_STATS: StatItem[] = [
  { value: '5,000+', label: 'Registered Alumni' },
  { value: '25+', label: 'Graduating Batches' },
  { value: '15+', label: 'Regional Chapters' },
];

export const VISION_MISSION = {
  vision: {
    title: 'Vision',
    body: 'To build a vibrant, connected, and value-driven global community of YES INDIA graduates who uphold human values, excel in their professions, and contribute meaningfully to society and nation-building.',
  },
  mission: {
    title: 'Mission',
    body: 'To unite alumni across batches and regions through an official registry, lifelong mentorship, career collaboration, and active participation in the educational mission of YES INDIA Foundation.',
  },
} as const;

export const COMMUNITY_PILLARS: BenefitPillar[] = [
  {
    title: 'Network & Connect',
    description:
      'Build lasting relationships with graduates across industries, regional chapters, and annual reunions.',
  },
  {
    title: 'Career Growth',
    description:
      'Access mentorship programs, professional workshops, and career opportunities shared within the network.',
  },
  {
    title: 'Give Back',
    description:
      'Support current YES INDIA students through mentorship, scholarships, and community initiatives.',
  },
  {
    title: 'Recognition',
    description:
      'Celebrate outstanding alumni contributions through annual awards and featured member spotlights.',
  },
  {
    title: 'Global Reach',
    description:
      'Stay engaged with YES INDIA graduates worldwide through international meets and collaborations.',
  },
  {
    title: 'Lifetime Access',
    description:
      'Receive a verified digital alumni identity card and ongoing access to foundation programs.',
  },
];

export const COMMUNITY_COPY = {
  heading: 'The Alumni Community',
  leftParagraph:
    'Across India and around the world, YES INDIA alumni function as a single cohesive family—serving as educators, civil servants, physicians, engineers, entrepreneurs, and community leaders. Our shared foundation binds us together across every batch.',
  rightParagraph:
    'Registering on the official alumni portal connects you to your graduating batch, regional chapters, and verified digital identity card—making it effortless to reconnect, mentor students, and participate in upcoming reunions.',
} as const;
