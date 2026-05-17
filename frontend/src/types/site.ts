export interface SiteTheme {
  primaryColor: string;
  font: string;
  backgroundColor: string;
  textColor: string;
}

export interface Section {
  id: string;
  type: 'hero' | 'about' | 'products' | 'contact';
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
}
