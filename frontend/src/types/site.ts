export interface SiteTheme {
  primaryColor: string;
  font: string;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
  logoIcon?: string;
}

export type SectionType = 
  | 'hero' 
  | 'products' 
  | 'about' 
  | 'gallery' 
  | 'logos' 
  | 'stats' 
  | 'features-grid' 
  | 'features-cards' 
  | 'cta' 
  | 'faq'
  | 'contact'
  | 'footer'
  | 'blog';

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  content: any;
}

export interface Site {
  id: string;
  businessId: string;
  title: string;
  slug: string;
  theme: SiteTheme;
  sections: Section[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  business?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    Product?: any[];
  };
}
