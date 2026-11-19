export interface FeaturedAlumni {
  name: string;
  position: string;
  department: string;
  image: string;
}

export const FEATURED_ALUMNI: FeaturedAlumni[] = [
  {
    name: 'Akeel Shah KAS',
    position: 'DYSP',
    department: 'J & K Police',
    image: '/images/alumni/akeel_shah.jpeg',
  },
  {
    name: 'Dr. Mohammad Shabaz',
    position: 'Scientist, Senior Asst. Professor',
    department: 'Model Institute of Engineering and Technology, Jammu',
    image: '/images/alumni/mohammad_shabaz.jpg',
  },
  {
    name: 'Ishrat Sultana KAS',
    position: 'DYSP',
    department: 'J & K Police',
    image: '/images/alumni/Israt_sultana.jpg',
  },
  {
    name: 'Dr. Mohammad Owais',
    position: 'General Physician',
    department: 'BUMS (KU) MD',
    image: '/images/alumni/mohammad-owais.jpg',
  },
];
