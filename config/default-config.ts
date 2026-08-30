import type { AppConfig, TourItem } from '@/types/app-config';

/**
 * Default wildlife safari and tour packages for Safari Tours Kenya.
 */
export const defaultTourItems: TourItem[] = [
  {
    id: 'safari-maasai-mara-big-five-3day',
    enabled: true,
    deleted: false,
    slug: 'maasai-mara-big-five-3day-wildlife-safari',
    href: '/tours/maasai-mara-big-five-3day-wildlife-safari',
    badge: 'Most Popular',
    showBadge: true,
    title: '3-Day Maasai Mara Big Five Wildlife Safari',
    showTitle: true,
    price: 'From $650 / person',
    priceLabel: 'From $650 / person',
    showPrice: true,
    rating: 5.0,
    showRating: true,
    duration: '3 Days / 2 Nights',
    showDuration: true,
    imageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
    heroImageUrl:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
    heroBackgroundColor: '#1b4332',
    indicatorColor: '#d97706',
    location: 'Maasai Mara National Reserve',
    showLocation: true,
    schedule: 'Daily Departures (Year-Round)',
    showSchedule: true,
    groupType: 'Small Groups · Private 4x4 · Families',
    showGroupType: true,
    description:
      'Experience the pinnacle of African wildlife safaris in the world-famous Maasai Mara. Track lions, leopards, elephants, buffalos, and rhinos across golden savannah plains.',
    overview:
      'Embark on an extraordinary 3-day wildlife safari into the iconic Maasai Mara National Reserve. Famous for its unmatched predator populations and the annual Great Wildebeest Migration, the Mara offers premier game viewing throughout the year.\n\nTravel in a customized 4x4 Safari Land Cruiser with pop-up viewing roofs, guided by seasoned professional naturalists who know every animal territory. Enjoy thrilling sunrise and evening game drives, relax in luxury tented camps surrounded by the sounds of the African bush, and experience authentic Maasai cultural encounters.',
    included: [
      'Customized 4x4 Safari Land Cruiser with pop-up roof',
      'Professional certified safari guide & wildlife tracker',
      'All Maasai Mara National Reserve conservation entry fees',
      '2 nights full-board accommodation at luxury tented camp',
      'Unlimited bottled mineral water during all game drives',
      'Morning and late afternoon extended game drives',
      'Round-trip transfers from Nairobi (hotel or airport)',
    ],
    showIncluded: true,
    whyChoose: [
      'Guaranteed window seats for every traveler in custom 4x4 vehicles',
      'Silver and gold-level certified KPSGA safari guides',
      'Handpicked luxury eco-camps inside prime wildlife sectors',
      'High success rate for Big Five predator sightings',
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      'Pack lightweight, neutral/earth-toned clothing (khaki, green, beige).',
      'Bring a warm fleece or jacket for early morning game drives.',
      'Carry binoculars, wide-brim hat, sunscreen, and insect repellent.',
      'Camera gear with extra batteries and memory cards is highly recommended.',
      'Optional hot air balloon safari with champagne breakfast available on Day 2.',
      'Passport required for reserve entry registration.',
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      'Driver-guide and camp staff gratuities (optional)',
      'Hot air balloon safari excursion (available as add-on)',
      'Personal travel, medical, and baggage insurance',
      'Alcoholic spirits and premium bottled beverages',
      'Optional visit to a traditional Maasai cultural village ($30 pp)',
    ],
    showNotIncluded: true,
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    ],
  },
  {
    id: 'safari-amboseli-kilimanjaro-elephants-2day',
    enabled: true,
    deleted: false,
    slug: 'amboseli-kilimanjaro-elephant-safari',
    href: '/tours/amboseli-kilimanjaro-elephant-safari',
    badge: 'Spectacular Views',
    showBadge: true,
    title: '2-Day Amboseli Kilimanjaro & Elephant Safari',
    showTitle: true,
    price: 'From $420 / person',
    priceLabel: 'From $420 / person',
    showPrice: true,
    rating: 4.9,
    showRating: true,
    duration: '2 Days / 1 Night',
    showDuration: true,
    imageUrl:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop',
    heroImageUrl:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop',
    heroBackgroundColor: '#1b4332',
    indicatorColor: '#d97706',
    location: 'Amboseli National Park',
    showLocation: true,
    schedule: 'Daily Departures',
    showSchedule: true,
    groupType: 'Families · Couples · Photography Groups',
    showGroupType: true,
    description:
      'Witness legendary herds of free-ranging African elephants against the majestic backdrop of snow-capped Mount Kilimanjaro in Amboseli National Park.',
    overview:
      'Amboseli National Park is world-renowned for having some of the largest elephant tusker herds in Africa and offering awe-inspiring panoramas of Mount Kilimanjaro, Africa’s tallest peak.\n\nOn this 2-day expedition, traverse Amboseli’s diverse habitats — from dried-up lakebeds and sulfur springs to lush emerald swamps teeming with hippos, pelicans, lions, cheetahs, and zebras. Perfect for photographers, nature lovers, and families seeking an immersive, scenic safari getaway.',
    included: [
      'Custom 4x4 Safari Land Cruiser with pop-up roof',
      'Professional certified driver-guide',
      'All Amboseli National Park conservation entry fees',
      '1 night full-board accommodation at safari lodge / tented camp',
      'Unlimited bottled drinking water in safari vehicle',
      'Observation Hill panoramic viewpoint visit',
      'Hotel / Airport pickup and drop-off',
    ],
    showIncluded: true,
    whyChoose: [
      'Unobstructed postcard views of Mount Kilimanjaro at sunrise & sunset',
      'Close-up ethical encounters with legendary elephant matriarch herds',
      'Observation Hill walk overlooking Amboseli’s thriving marshlands',
      'Expert photography guidance for iconic wildlife portraits',
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      'Best mountain visibility is typically in the early morning and late afternoon.',
      'Bring dust protection (bandana or camera cover) for dry lakebed drives.',
      'Sunscreen, polarized sunglasses, and safari hat are recommended.',
      'Comfortable walking shoes for Observation Hill trail.',
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      'Driver-guide gratuities and tips',
      'Personal travel & medical insurance',
      'Alcoholic drinks and personal lodge extras',
      'Souvenirs and optional Maasai cultural village visit',
    ],
    showNotIncluded: true,
    gallery: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    ],
  },
  {
    id: 'safari-lake-nakuru-tsavo-wilderness',
    enabled: true,
    deleted: false,
    slug: 'lake-nakuru-tsavo-rhino-wildlife-safari',
    href: '/tours/lake-nakuru-tsavo-rhino-wildlife-safari',
    badge: 'Rhino Sanctuary',
    showBadge: true,
    title: 'Lake Nakuru & Tsavo Wilderness Expedition',
    showTitle: true,
    price: 'From $380 / person',
    priceLabel: 'From $380 / person',
    showPrice: true,
    rating: 4.8,
    showRating: true,
    duration: 'Full Day / Multi-Day Option',
    showDuration: true,
    imageUrl:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop',
    heroImageUrl:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop',
    heroBackgroundColor: '#1b4332',
    indicatorColor: '#d97706',
    location: 'Great Rift Valley & National Reserves',
    showLocation: true,
    schedule: 'Scheduled Weekly Departures',
    showSchedule: true,
    groupType: 'Day Trippers · Wildlife Enthusiasts · Birders',
    showGroupType: true,
    description:
      'Track endangered black and white rhinos in the Lake Nakuru sanctuary, marvel at flocks of flamingos, and encounter the famous red-dust elephants of Tsavo.',
    overview:
      'Journey through the dramatic landscapes of the Great Rift Valley to Lake Nakuru National Park and the expansive savannahs of Tsavo. Lake Nakuru serves as an internationally renowned sanctuary for critically endangered black and white rhinos and rare Rothschild’s giraffes.\n\nEnjoy game drives along the lake’s scenic shoreline, climb to Baboon Cliff for panoramic valley vistas, and witness hundreds of bird species including pelicans and flamingos. An essential expedition for wildlife conservationists and enthusiastic safari adventurers.',
    included: [
      '4x4 Safari vehicle with pop-up roof',
      'Professional safari naturalist & tracker',
      'National park entrance & conservation fees',
      'Buffet lunch at a panoramic safari lodge',
      'Unlimited bottled mineral water on game drives',
      'Baboon Cliff viewpoint excursion',
      'Hotel pickup and return transfers',
    ],
    showIncluded: true,
    whyChoose: [
      'Guaranteed sightings of black and white rhinos in a protected haven',
      'Spectacular birding with over 450 recorded avian species',
      'Dramatic Rift Valley escarpment viewpoints and waterfall stops',
      'Small intimate groups with dedicated naturalist commentary',
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      'Departure is early morning at 6:00 AM to maximize morning animal activity.',
      'Bring binoculars for exceptional birdwatching and predator spotting.',
      'Camera zoom lens recommended for shoreline bird and rhino photography.',
      'Wear comfortable safari attire with layers for temperature shifts.',
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      'Driver-guide gratuities and tips',
      'Personal travel and medical insurance',
      'Alcoholic beverages and personal purchases',
    ],
    showNotIncluded: true,
    gallery: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
    ],
  },
];

/**
 * Default config for this deployment.
 */
export const defaultConfig: AppConfig = {
  branding: {
    font: 'inter',
    appName: 'Safari Tours Kenya',
    logoUrl: '/brand/logos/logo.png',
    darkMode: false,
    faviconUrl: '/brand/favicons/favicon.ico',
    accentColor: '#d97706',
    primaryColor: '#1b4332',
    metaDescription:
      'Premier African wildlife safaris, Big Five game drives, and luxury bush expeditions in Kenya.',
  },

  features: {
    tours: true,
    reports: true,
    bookings: true,
    clientPortal: false,
    notifications: true,
  },

  navigation: [
    {
      key: 'home',
      href: '/',
      icon: 'Home',
      label: 'Home',
      enabled: true,
    },
    {
      key: 'tours',
      href: '/tours',
      icon: 'Compass',
      label: 'Safari Tours',
      enabled: true,
    },
    {
      key: 'about',
      href: '/about',
      icon: 'Info',
      label: 'About Us',
      enabled: true,
    },
    {
      key: 'contact',
      href: '/contact',
      icon: 'Mail',
      label: 'Contact',
      enabled: true,
    },
  ],

  homepage: {
    sectionOrder: [
      'stats',
      'tours',
      'whyus',
      'reviews',
      'gallery',
      'cta',
    ],
    hero: {
      size: 'fullscreen',
      enabled: true,
      eyebrow: 'Unforgettable African Wildlife Safaris',
      headline: 'Experience the Wild Heart',
      imageUrl:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
      subtitle:
        'Embark on breathtaking 4x4 game drives, witness the iconic Big Five, and stay in world-class safari lodges with expert local naturalists across Kenya’s premier national parks.',
      italicText: 'of the African Savannah',
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: '/tours',
      showPrimaryCta: true,
      primaryCtaLabel: 'Explore Safari Packages',
      secondaryCtaHref: '/contact',
      showSecondaryCta: true,
      secondaryCtaLabel: 'Plan Custom Safari',
    },
    stats: {
      items: [
        {
          label: 'Years Guiding Safaris',
          value: '15+',
          enabled: true,
        },
        {
          label: 'Happy Travelers Guided',
          value: '12,000+',
          enabled: true,
        },
        {
          label: 'Big Five Sighting Rate',
          value: '98%',
          enabled: true,
        },
        {
          label: 'Traveler Satisfaction',
          value: '4.9/5',
          enabled: true,
        },
      ],
      title: '',
      enabled: true,
      eyebrow: '',
      subtitle: '',
      backgroundColor: '#ffffff',
    },
    tours: {
      items: defaultTourItems,
      title: 'Iconic Safari Packages',
      enabled: true,
      eyebrow: 'FEATURED SAFARIS',
      subtitle:
        'From thrilling 3-day Maasai Mara game drives to scenic Amboseli Kilimanjaro expeditions, explore our handcrafted African wildlife safaris.',
      backgroundColor: '#fafafa',
    },
    whyUs: {
      items: [
        {
          body: 'Our silver and gold-level certified guides possess decades of bushcraft experience and intimate knowledge of animal migration routes.',
          icon: 'Shield',
          title: 'Expert Wildlife Trackers',
          enabled: true,
        },
        {
          body: 'Travel in purpose-built 4x4 Safari Land Cruisers fitted with pop-up viewing roofs, individual charging sockets, and onboard coolers.',
          icon: 'Compass',
          title: 'Custom 4x4 Safari Vehicles',
          enabled: true,
        },
        {
          body: 'We practice responsible, low-impact eco-tourism that directly finances park anti-poaching units and supports local community schools.',
          icon: 'Leaf',
          title: 'Conservation & Community',
          enabled: true,
        },
      ],
      title: 'Guided by Passion, Rooted in the Wilderness',
      enabled: true,
      eyebrow: 'WHY SAFARI WITH US',
      imageUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
      subtitle: '',
      backgroundColor: '#ffffff',
    },
    gallery: {
      items: [
        {
          caption: 'Maasai Mara Lion Pride',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
        },
        {
          caption: 'Amboseli Elephant Herd',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop',
        },
        {
          caption: 'Savannah Sunset Game Drive',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
        },
        {
          caption: 'Cheetah on the Lookout',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop',
        },
        {
          caption: 'Custom 4x4 Safari Vehicle',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
        },
      ],
      title: 'Safari Moments & Wildlife Gallery',
      enabled: true,
      eyebrow: '',
      subtitle: '',
      indicatorColor: '#d97706',
      backgroundColor: '#ffffff',
    },
    reviews: {
      items: [
        {
          name: 'David & Claire Roberts',
          quote:
            '"Our 3-day Maasai Mara safari exceeded all expectations! Our guide spotted a leopard in an acacia tree within hours of arriving. The luxury tented camp was unforgettable."',
          enabled: true,
          location: 'United Kingdom',
        },
        {
          name: 'Marcus Vance',
          quote:
            '"Seeing hundreds of elephants walking right in front of Mount Kilimanjaro in Amboseli was a lifelong dream come true. Flawless logistics and incredible hospitality."',
          enabled: true,
          location: 'United States',
        },
        {
          name: 'Elena & Lucas',
          quote:
            '"The best travel experience of our lives. The 4x4 vehicle was extremely comfortable and our guide’s wildlife tracking skills were pure magic. 10/10 recommendation!"',
          enabled: true,
          location: 'Germany',
        },
      ],
      title: 'Guest Reviews & Safari Stories',
      enabled: true,
      eyebrow: 'EXCELLENT ON TRIPADVISOR',
      subtitle: '',
      backgroundColor: '#020617',
    },
    ctaBanner: {
      ctaHref: '/tours',
      enabled: true,
      ctaLabel: 'Book Your Safari Now',
      headline: 'Ready for the Adventure of a Lifetime?',
      subtitle:
        'Reserve your private 4x4 safari or customize a bespoke wildlife itinerary with our expert safari specialists today.',
      backgroundColor: '#1b4332',
    },
    footer: {
      contact: {
        email: 'info@safaritourskenya.com',
        phone: '+254 700 123 456',
        location: 'Wildlife Plaza, Langata Road, Nairobi, Kenya',
        workingDays: 'Mon - Sun: 7:00 AM - 9:00 PM EAT',
        workingHours: '24/7 Safari Support Desk',
      },
      enabled: true,
      socials: {
        items: [
          {
            url: '#',
            icon: 'Facebook',
            enabled: true,
          },
          {
            url: '#',
            icon: 'Instagram',
            enabled: true,
          },
          {
            url: '#',
            icon: 'Whatsapp',
            enabled: true,
          },
          {
            url: '#',
            icon: 'Tiktok',
            enabled: true,
          },
        ],
        enabled: true,
      },
      quickLinks: {
        items: [
          {
            href: '/',
            label: 'Home',
            enabled: true,
          },
          {
            href: '/tours',
            label: 'Safari Packages',
            enabled: true,
          },
          {
            href: '/about',
            label: 'About Us',
            enabled: true,
          },
          {
            href: '/contact',
            label: 'Contact & Reservations',
            enabled: true,
          },
        ],
        enabled: true,
      },
      bottomLinks: {
        items: [
          {
            href: '#',
            label: 'Privacy Policy',
            enabled: true,
          },
          {
            href: '#',
            label: 'Terms & Conditions',
            enabled: true,
          },
          {
            href: '#',
            label: 'Safari Travel Advisory',
            enabled: true,
          },
        ],
        enabled: true,
      },
      description:
        'Premier African wildlife safari operator delivering bespoke Big Five game drives, luxury tented camps, and ethical conservation safaris across Kenya.',
      topPackages: {
        items: [
          {
            href: '/tours/maasai-mara-big-five-3day-wildlife-safari',
            label: 'Maasai Mara Big Five Safari',
            enabled: true,
          },
          {
            href: '/tours/amboseli-kilimanjaro-elephant-safari',
            label: 'Amboseli Kilimanjaro Safari',
            enabled: true,
          },
          {
            href: '/tours/lake-nakuru-tsavo-rhino-wildlife-safari',
            label: 'Lake Nakuru Rhino Sanctuary',
            enabled: true,
          },
          {
            href: '/tours',
            label: 'Great Migration Safaris',
            enabled: true,
          },
          {
            href: '/contact',
            label: 'Custom Private Safari',
            enabled: true,
          },
        ],
        enabled: true,
      },
      backgroundColor: '#020617',
    },
  },

  aboutPage: {
    hero: {
      size: 'large',
      enabled: true,
      eyebrow: 'OUR WILDERNESS HERITAGE',
      headline: 'Born in the savannah,',
      imageUrl:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
      subtitle:
        'Pioneering authentic wildlife safaris, Big Five tracking expeditions, and ethical community conservation across Kenya.',
      italicText: 'dedicated to the wild',
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: '',
      showPrimaryCta: false,
      backgroundColor: '#000000',
      primaryCtaLabel: '',
      secondaryCtaHref: '',
      showSecondaryCta: false,
      secondaryCtaLabel: '',
    },
    story: {
      title: 'Preserving the spirit of Africa’s greatest wilderness sanctuaries.',
      enabled: true,
      eyebrow: 'OUR STORY',
      imageAlt: 'Safari guides in custom 4x4 vehicle',
      imageUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
      paragraphs: [
        {
          text: 'Founded by dedicated Kenyan naturalists and bush trackers, Safari Tours Kenya was born from a singular passion: to deliver unforgettable wildlife encounters while championing ecosystem conservation and community empowerment. For our travelers, a game drive is more than sightseeing — it is an intimate connection with nature in its purest form.',
          enabled: true,
        },
        {
          text: 'Over 15 years, we have guided thousands of adventurers across the Maasai Mara, Amboseli, and the Great Rift Valley. We work hand-in-hand with local conservancies and anti-poaching initiatives to ensure that Africa’s majestic wildlife thrives for generations to come.',
          enabled: true,
        },
      ],
      backgroundColor: '#ffffff',
    },
    team: {
      items: [
        {
          name: 'James Ole Kaelo',
          role: 'Head Safari Guide & Big Cat Specialist',
          quote: '"The savannah speaks to those who listen with patience and respect."',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
        },
        {
          name: 'Faith Wanjiku',
          role: 'Field Ornithologist & Eco-Naturalist',
          quote: '"Every bird song and animal track tells a story of the ecosystem’s health."',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop',
        },
        {
          name: 'Samuel Kiprop',
          role: 'Lead 4x4 Expedition Navigator',
          quote: '"We navigate every river crossing and savannah trail with safety and precision."',
          enabled: true,
          imageUrl:
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
        },
      ],
      title: 'Meet Our Expert Guides & Naturalists',
      enabled: true,
      eyebrow: 'THE EXPEDITION TEAM',
      subtitle:
        'Our certified safari guides carry decades of tracking instincts, bushcraft knowledge, and a deep dedication to wildlife conservation.',
      backgroundColor: '#ffffff',
    },
    values: {
      items: [
        {
          icon: 'Leaf',
          title: 'Wildlife Conservation',
          enabled: true,
          description:
            'Directly funding park conservation, anti-poaching ranger units, and wildlife corridor preservation.',
        },
        {
          icon: 'Compass',
          title: 'Master Bush Tracking',
          enabled: true,
          description:
            'Certified KPSGA professional guides with unmatched animal tracking and behavioral expertise.',
        },
        {
          icon: 'Users',
          title: 'Community Empowerment',
          enabled: true,
          description:
            'Supporting local Maasai and Samburu community conservancies through revenue-sharing and schooling.',
        },
        {
          icon: 'Star',
          title: 'Unrivaled Hospitality',
          enabled: true,
          description:
            'Premium 4x4 safari vehicles, handpicked luxury tented lodges, and bespoke guest care at every step.',
        },
      ],
      title: 'Guided by Conservation, Inspired by the Wild',
      enabled: true,
      eyebrow: 'OUR CORE VALUES',
      subtitle:
        'Our core principles guide every game drive we lead, every track we follow, and every relationship we build with local communities.',
      backgroundColor: '#fafafa',
    },
    impact: {
      stats: [
        {
          label: 'ACRES OF CONSERVANCY SUPPORTED',
          value: '75,000+',
          enabled: true,
        },
        {
          label: 'YEARS OF WILDLIFE GUIDING',
          value: '15+',
          enabled: true,
        },
        {
          label: 'ETHICAL WILDLIFE ENCOUNTERS',
          value: '100%',
          enabled: true,
        },
        {
          label: 'LOCAL COMMUNITY PROJECTS',
          value: '24+',
          enabled: true,
        },
      ],
      title: 'Our Conservation Impact by the Numbers',
      enabled: false,
      subtitle:
        'Eco-tourism is the cornerstone of African wildlife protection. Every safari booked directly protects natural habitats and empowers local communities.',
      partnersCard: {
        icon: 'ShieldCheck',
        title: 'Our Conservation & Tourism Partners',
        partners: [
          'Kenya Wildlife Service (KWS)',
          'Maasai Mara Wildlife Conservancies Association',
          'Kenya Professional Safari Guides Association (KPSGA)',
          'Eco-Tourism Kenya',
        ],
      },
      backgroundColor: '#0f172a',
    },
    cta: {
      title: 'Answer the Call of the African Wild',
      enabled: true,
      subtitle:
        'Whether witnessing the Great Migration in the Maasai Mara or marveling at elephant herds in Amboseli, your safari adventure starts here.',
      primaryCta: {
        href: '/tours',
        label: 'Explore Safari Packages',
        enabled: true,
      },
      secondaryCta: {
        href: '/contact',
        label: 'Plan a Custom Safari',
        enabled: true,
      },
      backgroundColor: '#fafafa',
    },
  },

  toursPage: {
    hero: {
      size: 'medium',
      enabled: true,
      eyebrow: 'WILDLIFE SAFARIS & EXPEDITIONS',
      headline: 'African Safari Packages',
      imageUrl:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
      subtitle:
        'Explore our curated collection of Big Five wildlife safaris, luxury tented camp expeditions, and custom game drives across Kenya’s iconic national parks.',
      italicText: '& Game Drives',
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: '',
      showPrimaryCta: false,
      backgroundColor: '#1b4332',
      primaryCtaLabel: '',
      secondaryCtaHref: '',
      showSecondaryCta: false,
      secondaryCtaLabel: '',
    },
    tours: {
      items: defaultTourItems,
      title: 'Explore Our Safari Collection',
      enabled: true,
      eyebrow: 'ALL SAFARI PACKAGES',
      subtitle:
        'From multi-day luxury fly-in safaris to overland 4x4 wildlife expeditions, find your dream African adventure.',
      backgroundColor: '#f5f5f0',
    },
    metaTitle: 'Safari Packages & Wildlife Game Drives',
    metaDescription:
      'Explore our luxury African wildlife safaris, Big Five game drives, and national park expeditions in Maasai Mara, Amboseli, and Tsavo.',
    bookingForm: {
      title: 'Reserve This Safari',
      enabled: true,
      subtitle: 'Secure your private 4x4 vehicle and luxury safari lodge reservation.',
      accessKey: '',
      buttonText: 'Submit Safari Reservation',
      fields: [
        {
          id: 'fullName',
          type: 'text',
          label: 'Full Name',
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: 'e.g. John Doe',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: 'name@example.com',
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number (WhatsApp)',
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: '+1 (555) 000-0000',
        },
        {
          id: 'date',
          type: 'date',
          label: 'Preferred Safari Start Date',
          enabled: true,
          required: false,
          halfWidth: true,
        },
        {
          id: 'guests',
          type: 'select',
          label: 'Number of Travelers',
          enabled: true,
          options: [
            '1 Solo Traveler',
            '2 Travelers (Couple)',
            '3 Travelers',
            '4 Travelers (Private 4x4)',
            '5-6 Travelers (Private 4x4)',
            '7+ Large Group / Family',
          ],
          required: false,
          halfWidth: false,
        },
        {
          id: 'transfer',
          type: 'checkbox',
          label: 'Include Airport / Hotel Pickup Transfer',
          enabled: true,
          required: false,
          halfWidth: false,
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Special Requests & Preferences',
          enabled: true,
          required: false,
          halfWidth: false,
          placeholder:
            'Dietary preferences, lodge room types, photography interests, special celebrations...',
        },
      ],
    },
  },

  contactPage: {
    hero: {
      size: 'medium',
      enabled: true,
      eyebrow: 'Get in Touch',
      headline: "Let's plan your",
      imageUrl:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
      subtitle:
        'Have a question about our safari packages or want to create a custom private itinerary? Our safari specialists are ready to help you plan your dream adventure.',
      italicText: 'dream safari',
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: '',
      showPrimaryCta: false,
      backgroundColor: '#000000',
      primaryCtaLabel: '',
      secondaryCtaHref: '',
      showSecondaryCta: false,
      secondaryCtaLabel: '',
    },
    contact: {
      email: 'info@safaritourskenya.com',
      phone: '+254 700 123 456',
      enabled: true,
      location: 'Nairobi & Maasai Mara, Kenya',
      whatsapp: '+254 700 123 456',
      locationLink: 'https://maps.google.com/?q=Nairobi+Kenya',
      backgroundColor: '#f5f5f0',
      tripAdvisorLink: 'https://tripadvisor.com',
    },
    form: {
      title: 'Send a Safari Inquiry',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: 'Jane Doe',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: 'jane@example.com',
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          enabled: true,
          required: false,
          halfWidth: true,
          placeholder: '+1 ...',
        },
        {
          id: 'subject',
          type: 'select',
          label: 'Inquiry Subject',
          enabled: true,
          options: [
            'General Inquiry',
            'Safari Package Booking',
            'Custom Private Itinerary',
            'Great Migration Safari',
            'Group / Family Safari',
            'Feedback & Questions',
          ],
          required: false,
          halfWidth: true,
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Your Message',
          enabled: true,
          required: true,
          halfWidth: false,
          placeholder:
            'Tell us about your travel dates, group size, preferred national parks, and budget...',
        },
      ],
      enabled: true,
      subtitle: 'Our safari team typically responds within 2-4 hours.',
      accessKey: '0d68a0e7-cd00-48c8-86f3-4fab7af13020',
      buttonText: 'Submit Safari Request',
      backgroundColor: '#ffffff',
    },
    faq: {
      items: [
        {
          question: 'When is the best time of year to see the Great Migration?',
          answer:
            'The Great Wildebeest Migration typically reaches Kenya’s Maasai Mara from July through October, when over 1.5 million wildebeest and zebras cross the Mara River.',
          enabled: true,
        },
        {
          question: 'What type of vehicles are used for game drives?',
          answer:
            'We use custom-built 4x4 Safari Land Cruisers equipped with pop-up roofs for 360-degree game viewing, high-clearance suspension, onboard charging ports, and coolers.',
          enabled: true,
        },
        {
          question: 'What should I pack for an African safari?',
          answer:
            'We recommend neutral-toned clothing (khaki, tan, olive), a warm jacket for chilly morning game drives, a wide-brim hat, sunscreen, binoculars, and insect repellent.',
          enabled: true,
        },
        {
          question: 'Are airport and hotel pickup transfers included?',
          answer:
            'Yes! All our multi-day safari packages include complimentary round-trip transfers from your hotel or Jomo Kenyatta International Airport (NBO) in Nairobi.',
          enabled: true,
        },
      ],
      title: 'Frequently Asked Safari Questions',
      enabled: true,
      eyebrow: 'QUICK ANSWERS',
      subtitle: '',
      backgroundColor: '#f5f5f0',
    },
    metaTitle: 'Contact & Safari Reservations',
    metaDescription:
      'Contact our safari planning specialists to reserve your custom wildlife game drives, luxury tented camps, and national park tours.',
  },
};
