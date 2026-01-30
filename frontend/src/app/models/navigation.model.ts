// Navigation Models for Header & Footer

export interface NavigationLink {
  label: string;
  route: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: NavigationLink[];
}

// Static Data: Header Navigation Links
export const HEADER_NAV_LINKS: NavigationLink[] = [
  { label: 'Flights', route: '/flights' },
  { label: 'Hotels', route: '/hotels' },
  { label: 'Packages', route: '/packages' }
];

// Static Data: Footer Columns
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'About',
    links: [
      { label: 'About Tripma', route: '/about' },
      { label: 'How it works', route: '/how-it-works' },
      { label: 'Careers', route: '/careers' },
      { label: 'Press', route: '/press' },
      { label: 'Blog', route: '/blog' },
      { label: 'Forum', route: '/forum' }
    ]
  },
  {
    title: 'Partner with us',
    links: [
      { label: 'Partnership programs', route: '/partnership' },
      { label: 'Affiliate program', route: '/affiliate' },
      { label: 'Connectivity partners', route: '/connectivity' },
      { label: 'Promotions and events', route: '/promotions' },
      { label: 'Integrations', route: '/integrations' },
      { label: 'Community', route: '/community' },
      { label: 'Loyalty program', route: '/loyalty' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', route: '/help' },
      { label: 'Contact us', route: '/contact' },
      { label: 'FAQ', route: '/faq' },
      { label: 'Accessibility', route: '/accessibility' }
    ]
  },
  {
    title: 'Get the app',
    links: [
      { label: 'Tripma for Android', route: '/android', external: true },
      { label: 'Tripma for iOS', route: '/ios', external: true }
    ]
  }
];
