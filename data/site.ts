export interface NavLinkItem {
  label: string;
  href: string;
}

export const SITE_CONFIG = {
  name: 'YES INDIA',
  fullName: 'YES INDIA FOUNDATION',
  legalName: 'Yasin Education Services India Foundation',
  subtitle: 'Alumni Network',
  tagline: 'YES India Makes an Excellent India',
  mainWebsite: 'https://web.yesindiafoundation.com',
  email: 'yesalumni11@gmail.com',
  phone: '+91 60054 75312',
  offices: {
    registered: {
      title: 'Registered Office',
      address:
        'RKPV/720-A 12, Hanna Tower, Opp. BUS Stand Ramanattukara, Kozhikode - 673633, Kerala',
    },
    administrative: {
      title: 'Administrative Office',
      address:
        '5024, Plot no 7, Block-B, 4th Floor Netaji Subhash Marg, Daryaganj, Central Delhi, 110002',
    },
  },
} as const;

export const HEADER_NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'Community', href: '/community' },
  { label: 'Job Application', href: '/jobs' },
];

export const FOOTER_QUICK_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Alumni Registration', href: '/register' },
  { label: 'Job Application', href: '/jobs' },
  { label: 'About & Vision', href: '/about' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'Community', href: '/community' },
];
