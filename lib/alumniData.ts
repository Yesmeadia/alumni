// lib/alumniData.ts

export interface Alumni {
  id: string;
  name: string;
  position: string;
  department: string;
  image: string;
  initials?: string;
  backgroundColor?: string;
}

export const alumniData: Alumni[] = [
  {
    id: "akeel-shah",
    name: "Akeel Shah KAS",
    position: "DYSP",
    department: "J & K Police",
    image: "/images/alumni/akeel_shah.jpeg",
    initials: "AS",
    backgroundColor: "from-blue-500 to-cyan-500"
  },
  {
    id: "mohammad-shabaz",
    name: "Dr. Mohammad Shabaz",
    position: "Scientist, Senior Asst. Professor",
    department: "Model Institute of Engineering and Technology, Jammu",
    image: "/images/alumni/mohammad_shabaz.jpg",
    initials: "MS",
    backgroundColor: "from-purple-500 to-pink-500"
  },
  {
    id: "manazer-hussain",
    name: "Manazer Hussain KAS",
    position: "DYSP",
    department: "J & K Police",
    image: "/images/alumni/manazer_hussain.jpg",
    initials: "MH",
    backgroundColor: "from-indigo-500 to-blue-500"
  },
  {
    id: "ishrat-sultana",
    name: "Ishrat Sultana KAS",
    position: "DYSP",
    department: "J & K Police",
    image: "/images/alumni/Israt_sultana.jpg",
    initials: "IS",
    backgroundColor: "from-pink-500 to-red-500"
  },
  {
    id: "mohammad-owais",
    name: "Dr. Mohammad Owais",
    position: "General Physician",
    department: "BUMS (KU) MD",
    image: "/images/alumni/mohammad-owais.jpg",
    initials: "MO",
    backgroundColor: "from-green-500 to-emerald-500"
  },
  {
    id: "mohammad-shaban",
    name: "Dr. Mohammad Shaban Sohrabi",
    position: "Senior Asst. Professor",
    department: "Model Institute of Engineering and Technology, Jammu",
    image: "/images/alumni/mohammad_shaban.jpg",
    initials: "MSS",
    backgroundColor: "from-orange-500 to-red-500"
  },
  {
    id: "manzoor-hussain",
    name: "Manzoor Hussain IAS",
    position: "DIGP, J & K Police",
    department: "J & K Police",
    image: "/images/alumni/manzoor_hussain.jpg",
    initials: "MH",
    backgroundColor: "from-teal-500 to-green-500"
  },
  {
    id: "javid-salroo",
    name: "Javid Salroo IAS",
    position: "DIGP, J & K Police",
    department: "J & K Police",
    image: "/images/alumni/javid_salroo.jpg",
    initials: "JS",
    backgroundColor: "from-violet-500 to-purple-500"
  },
  {
    id: "javed-shah",
    name: "Javed Shah IAS",
    position: "DIGP, J & K Police",
    department: "J & K Police",
    image: "/images/alumni/javed_shah.jpg",
    initials: "JS",
    backgroundColor: "from-cyan-500 to-blue-500"
  }
];