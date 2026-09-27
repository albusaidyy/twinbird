// ─── Branding ──────────────────────────────────────────────────────────────────
export interface Branding {
  appName: string;
  metaDescription?: string;
  primaryColor: string;
  accentColor: string;
  font: string;
  logoUrl: string | null;
  logoDarkUrl?: string | null;
  logoNavUrl?: string | null;
  logoNavDarkUrl?: string | null;
  faviconUrl: string | null;
  ogImageUrl?: string | null;
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

export interface SafariItineraryItem {
  day?: string;
  title: string;
  description: string;
}

export interface TourItem {
  id?: string;
  slug?: string;
  enabled: boolean;
  deleted?: boolean;
  deletedAt?: string;
  title: string;
  showTitle?: boolean;
  badge: string;
  showBadge?: boolean;
  description: string;
  duration: string;
  showDuration?: boolean;
  rating: number;
  showRating?: boolean;
  price?: string;
  showPrice?: boolean;
  priceLabel?: string;
  imageUrl: string;
  heroImageUrl?: string;
  heroBackgroundColor?: string;
  indicatorColor?: string;
  gallery?: string[];
  location?: string;
  showLocation?: boolean;
  schedule?: string;
  showSchedule?: boolean;
  itinerary?: SafariItineraryItem[];
  showItinerary?: boolean;
  groupType?: string;
  showGroupType?: boolean;
  overview?: string;
  included?: string[];
  showIncluded?: boolean;
  notIncluded?: string[];
  showNotIncluded?: boolean;
  whyChoose?: string[];
  showWhyChoose?: boolean;
  knowBeforeYouGo?: string[];
  showKnowBeforeYouGo?: boolean;
  metaTitle?: string;
  metaDescription?: string;
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

export interface ExperienceItem {
  id?: string;
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  enabled: boolean;
}

export interface HomepageConfig {
  sectionOrder: string[];
  hero: HeroSection;
  stats: SectionList<StatItem>;
  experiences?: SectionList<ExperienceItem>;
  tours: SectionList<TourItem>;
  excursions?: SectionList<ExcursionItem>;
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
  fields?: DynamicFormField[];
}

export interface ToursPageConfig {
  metaTitle?: string;
  metaDescription?: string;
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
  fields?: DynamicFormField[];
}

export interface ContactPageConfig {
  metaTitle?: string;
  metaDescription?: string;
  hero: HeroSection;
  contact: ContactInfo;
  form: ContactFormConfig;
  faq: SectionList<FAQItem>;
}

// ─── About Page ───────────────────────────────────────────────────────────────
export interface StoryParagraphItem {
  enabled: boolean;
  text: string;
}

export interface AboutStorySection {
  enabled: boolean;
  backgroundColor?: string;
  eyebrow?: string;
  title: string;
  paragraphs: (string | StoryParagraphItem)[];
  paragraph1?: string;
  paragraph2?: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface AboutValueItem {
  enabled: boolean;
  icon: string;
  title: string;
  description: string;
}

export interface AboutTeamMember {
  enabled: boolean;
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

export interface AboutImpactPartnerCard {
  title: string;
  icon?: string;
  partners: string[];
}

export interface AboutImpactSection {
  enabled: boolean;
  backgroundColor?: string;
  title: string;
  subtitle: string;
  stats: StatItem[];
  partnersCard: AboutImpactPartnerCard;
}

export interface AboutCTASection {
  enabled: boolean;
  backgroundColor?: string;
  title: string;
  subtitle: string;
  primaryCta: {
    enabled: boolean;
    label: string;
    href: string;
  };
  secondaryCta: {
    enabled: boolean;
    label: string;
    href: string;
  };
}

export interface AboutPageConfig {
  metaTitle?: string;
  metaDescription?: string;
  hero: HeroSection;
  story: AboutStorySection;
  values: SectionList<AboutValueItem>;
  team: SectionList<AboutTeamMember>;
  impact: AboutImpactSection;
  cta: AboutCTASection;
}

// ─── Transfers Page ───────────────────────────────────────────────────────────
export interface TransferRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  price?: string;
  priceLabel?: string;
  popular?: boolean;
  enabled: boolean;
}

export interface TransferFeature {
  icon: string;
  title: string;
  description: string;
}

export interface TransferVehicle {
  id: string;
  name: string;
  category: string;
  passengers: string;
  luggage: string;
  description: string;
  imageUrl?: string;
  featured?: boolean;
  enabled?: boolean;
}

export interface TransferBookingFormConfig {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  buttonText?: string;
  whatsappNumber?: string;
  whatsappText?: string;
  noticeText?: string;
  fields?: DynamicFormField[];
}

export interface TransfersPageConfig {
  metaTitle?: string;
  metaDescription?: string;
  hero: HeroSection;
  features: TransferFeature[];
  routesSection: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    note?: string;
    routes: TransferRoute[];
  };
  vehiclesSection?: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    vehicles: TransferVehicle[];
  };
  bookingForm: TransferBookingFormConfig;
  faq?: SectionList<FAQItem>;
}

// ─── Excursions Page ─────────────────────────────────────────────────────────
export interface ExcursionScheduleItem {
  time?: string;
  title: string;
  description: string;
}

export interface ExcursionItem {
  id?: string;
  slug?: string;
  enabled: boolean;
  deleted?: boolean;
  deletedAt?: string;
  title: string;
  showTitle?: boolean;
  badge: string;
  showBadge?: boolean;
  description: string;
  duration: string;
  showDuration?: boolean;
  rating: number;
  showRating?: boolean;
  price?: string;
  showPrice?: boolean;
  priceLabel?: string;
  imageUrl: string;
  heroImageUrl?: string;
  heroBackgroundColor?: string;
  indicatorColor?: string;
  gallery?: string[];
  location?: string;
  showLocation?: boolean;
  schedule?: string;
  showSchedule?: boolean;
  scheduleItems?: ExcursionScheduleItem[];
  showScheduleItems?: boolean;
  groupType?: string;
  showGroupType?: boolean;
  overview?: string;
  included?: string[];
  showIncluded?: boolean;
  notIncluded?: string[];
  showNotIncluded?: boolean;
  whyChoose?: string[];
  showWhyChoose?: boolean;
  knowBeforeYouGo?: string[];
  showKnowBeforeYouGo?: boolean;
  whatToCarry?: string[];
  showWhatToCarry?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  href?: string;
}

export interface ExcursionBookingFormConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  accessKey?: string;
  fields?: DynamicFormField[];
}

export interface ExcursionsPageConfig {
  metaTitle?: string;
  metaDescription?: string;
  hero: HeroSection;
  tours: SectionList<ExcursionItem>;
  bookingForm?: ExcursionBookingFormConfig;
}

// ─── Air Ticketing Page ───────────────────────────────────────────────────────
export interface AirTicketingRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  price?: string;
  priceLabel?: string;
  airline?: string;
  category?: 'local' | 'international';
  popular?: boolean;
  enabled: boolean;
}

export interface AirTicketingFeature {
  icon: string;
  title: string;
  description: string;
}

export interface AirTicketingServiceItem {
  id: string;
  name: string;
  category: string;
  capacity?: string;
  baggage?: string;
  description: string;
  imageUrl?: string;
  featured?: boolean;
  enabled?: boolean;
}

export interface AirlinePartnerItem {
  id: string;
  name: string;
  category?: string;
  logoUrl?: string;
  imageUrl?: string;
  badge?: string;
  hub?: string;
  fleet?: string;
  routesCount?: string;
  description?: string;
  enabled?: boolean;
}

export interface AirTicketingBookingFormConfig {
  enabled?: boolean;
  title: string;
  subtitle?: string;
  buttonText?: string;
  whatsappNumber?: string;
  whatsappText?: string;
  noticeText?: string;
  fields?: DynamicFormField[];
}

export interface AirTicketingServicesSectionConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  services?: AirTicketingServiceItem[];
  airlinesTitle?: string;
  airlinesSubtitle?: string;
  airlines?: AirlinePartnerItem[];
}

export interface AirTicketingPageConfig {
  metaTitle?: string;
  metaDescription?: string;
  hero: HeroSection;
  features: AirTicketingFeature[];
  routesSection: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    note?: string;
    localTitle?: string;
    localSubtitle?: string;
    internationalTitle?: string;
    internationalSubtitle?: string;
    routes: AirTicketingRoute[];
  };
  servicesSection?: AirTicketingServicesSectionConfig;
  bookingForm: AirTicketingBookingFormConfig;
  faq?: SectionList<FAQItem>;
}

// ─── Root config ───────────────────────────────────────────────────────────────
export interface AppConfig {
  branding: Branding;
  navigation: NavItem[];
  features: FeatureFlags;
  homepage: HomepageConfig;
  toursPage?: ToursPageConfig;
  excursionsPage?: ExcursionsPageConfig;
  transfersPage?: TransfersPageConfig;
  airTicketingPage?: AirTicketingPageConfig;
  aboutPage?: AboutPageConfig;
  contactPage: ContactPageConfig;
}


