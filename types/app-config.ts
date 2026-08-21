// ─── Branding ──────────────────────────────────────────────────────────────────
export interface Branding {
  appName: string;
  primaryColor: string;
  accentColor: string;
  font: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  darkMode: boolean;
}

// ─── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
  key: string;
  label: string;
  href: string;
  /** Lucide icon name — resolved dynamically */
  icon: string;
  enabled: boolean;
}

export type FeatureFlags = Record<string, boolean>;

// ─── Homepage sections ─────────────────────────────────────────────────────────
export interface HeroSection {
  enabled: boolean;
  backgroundColor?: string;
  
  showEyebrow: boolean;
  eyebrow: string;
  
  headline: string;
  /** The italic/highlighted portion of the headline */
  italicText: string;
  
  showSubtitle: boolean;
  subtitle: string;
  
  showPrimaryCta: boolean;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  
  showSecondaryCta: boolean;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  
  imageUrl: string;
  /** Controls the height of the hero section */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export interface StatItem {
  enabled: boolean;
  value: string;
  label: string;
}

export interface TourItem {
  id?: string;
  slug?: string;
  enabled: boolean;
  badge: string;
  title: string;
  description: string;
  duration: string;
  rating: number;
  imageUrl: string;
  heroImageUrl?: string;
  heroBackgroundColor?: string;
  indicatorColor?: string;
  gallery?: string[];
  location?: string;
  schedule?: string;
  groupType?: string;
  overview?: string;
  included?: string[];
  whyChoose?: string[];
  knowBeforeYouGo?: string[];
  price?: string;
  priceLabel?: string;
  href?: string;
}

export interface ReviewItem {
  enabled: boolean;
  quote: string;
  name: string;
  location: string;
}

export interface WhyUsItem {
  enabled: boolean;
  /** Lucide icon name */
  icon: string;
  title: string;
  body: string;
}

export interface WhyUsSection extends SectionList<WhyUsItem> {
  imageUrl: string;
}

export interface GalleryItem {
  enabled: boolean;
  imageUrl: string;
  caption: string;
}

export interface CTABannerSection {
  enabled: boolean;
  backgroundColor?: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FooterLink {
  enabled: boolean;
  label: string;
  href: string;
}

export interface SocialLink {
  enabled: boolean;
  icon: string; // e.g. Facebook, Instagram, MessageCircle
  url: string;
}

export interface FooterSection {
  enabled: boolean;
  backgroundColor?: string;
  description: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    workingHours: string;
    workingDays: string;
  };
  socials: SectionList<SocialLink>;
  quickLinks: SectionList<FooterLink>;
  topPackages: SectionList<FooterLink>;
  bottomLinks: SectionList<FooterLink>;
}

export interface SectionList<T> {
  enabled: boolean;
  backgroundColor?: string;
  indicatorColor?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  items: T[];
}

export interface HomepageConfig {
  sectionOrder: string[];
  hero: HeroSection;
  stats: SectionList<StatItem>;
  tours: SectionList<TourItem>;
  reviews: SectionList<ReviewItem>;
  whyUs: WhyUsSection;
  gallery: SectionList<GalleryItem>;
  ctaBanner: CTABannerSection;
  footer: FooterSection;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'select'
  | 'checkbox'
  | 'textarea';

export interface DynamicFormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For 'select' dropdown
  halfWidth?: boolean; // 2-column layout
  enabled?: boolean;
}

export interface TourBookingFormConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  accessKey?: string;
  fields?: DynamicFormField[];
}

export interface ToursPageConfig {
  hero: HeroSection;
  tours: SectionList<TourItem>;
  bookingForm?: TourBookingFormConfig;
}

export interface FAQItem {
  enabled: boolean;
  question: string;
  answer: string;
}

export interface ContactInfo {
  enabled?: boolean;
  backgroundColor?: string;
  location: string;
  locationLink: string;
  phone: string;
  tripAdvisorLink: string;
  email: string;
  whatsapp: string;
}

export interface ContactFormConfig {
  enabled?: boolean;
  backgroundColor?: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  accessKey: string;
  fields?: DynamicFormField[];
}

export interface ContactPageConfig {
  hero: HeroSection;
  contact: ContactInfo;
  form: ContactFormConfig;
  faq: SectionList<FAQItem>;
}

// ─── Root config ───────────────────────────────────────────────────────────────
export interface AppConfig {
  branding: Branding;
  navigation: NavItem[];
  features: FeatureFlags;
  homepage: HomepageConfig;
  toursPage?: ToursPageConfig;
  contactPage: ContactPageConfig;
}
