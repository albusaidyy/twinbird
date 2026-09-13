import type {
  AppConfig,
  TourItem,
  SafariItineraryItem,
  ExcursionItem,
  ExperienceItem,
  ExcursionScheduleItem,
} from "@/types/app-config";

/**
 * Default day-by-day itinerary timeline steps for safari tours.
 */
export const defaultSafariItinerary: SafariItineraryItem[] = [
  {
    day: "Day 1",
    title: "Scenic Great Rift Valley Drive & Sunset Game Safari",
    description:
      "Depart Nairobi early morning in a custom 4x4 Safari Land Cruiser. Descend into the breathtaking Great Rift Valley with photographic viewpoints along the escarpment. Arrive at the reserve lodge/camp for lunch, check-in, and embark on a thrilling late-afternoon game drive tracking Big Five predators as the sun sets over the savannah.",
  },
  {
    day: "Day 2",
    title: "Full-Day Wilderness Exploration & Bush Picnic Lunch",
    description:
      "Spend a full day immersed in the African bush with extended morning and afternoon game drives. Enjoy an authentic bush picnic lunch under a canopy of acacia trees. Track lion prides, cheetahs, leopards, and massive elephant herds across diverse wilderness habitats.",
  },
  {
    day: "Day 3",
    title: "Dawn Predator Game Drive & Return Journey",
    description:
      "Rise with the dawn for a morning game drive when big cats are most active on the prowl. Return to camp for a full breakfast, check out, and take a scenic return drive back with unforgettable wildlife memories and photography collections.",
  },
];

/**
 * Default schedule timeline steps for excursions.
 */
export const defaultExcursionSchedule: ExcursionScheduleItem[] = [
  {
    time: "08:00 - 09:30",
    title: "Morning Hotel Departure & Scenic Route",
    description:
      "Pickup from your hotel or resort lobby in comfortable air-conditioned transport with scenic coastal views along the route.",
  },
  {
    time: "10:30 - 14:00",
    title: "Guided Excursion, Marine Activities & Lunch",
    description:
      "Arrive at the destination for guided activities, local sightseeing or snorkeling, followed by a delicious regional lunch with fresh local delicacies.",
  },
  {
    time: "14:30 - 17:30",
    title: "Cultural Highlights & Sunset Views",
    description:
      "Explore nearby natural landscapes and viewpoints as the afternoon light softens, capturing memorable photos before the return journey.",
  },
];

/**
 * Default mosaic gallery images for excursion single page.
 */
export const defaultExcursionGallery: string[] = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
];

/**
 * Default core offerings / experiences for homepage.
 */
export const defaultExperienceItems: ExperienceItem[] = [
  {
    id: "exp-tailored-safaris",
    icon: "Trees",
    title: "Tailored Safaris",
    description:
      "Private and group expeditions through Kenya's most legendary parks and hidden conservancies.",
    ctaLabel: "Explore Safaris",
    ctaHref: "/safaris",
    enabled: true,
  },
  {
    id: "exp-daily-excursions",
    icon: "Compass",
    title: "Daily Excursions",
    description:
      "Short, high-impact trips including cultural village visits, hiking trails, and boat journeys.",
    ctaLabel: "View Excursions",
    ctaHref: "/excursions",
    enabled: true,
  },
  {
    id: "exp-transfer-services",
    icon: "Car",
    title: "Transfer Services",
    description:
      "Reliable, professional airport and inter-destination transport in modern, comfortable vehicles.",
    ctaLabel: "Book Transfer",
    ctaHref: "/transfers",
    enabled: true,
  },
];

/**
 * Default coastal and day-trip excursion packages.
 */
export const defaultExcursionItems: ExcursionItem[] = [
  {
    id: "excursion-wasini-island-dolphin-dhow-cruise",
    enabled: true,
    deleted: false,
    slug: "wasini-island-dolphin-dhow-cruise-snorkeling",
    href: "/excursions/wasini-island-dolphin-dhow-cruise-snorkeling",
    badge: "Top Coastal Excursion",
    showBadge: true,
    title: "Wasini Island Dolphin Dhow Cruise & Kisite Marine Snorkeling",
    showTitle: true,
    price: "From $95 / person",
    priceLabel: "From $95 / person",
    showPrice: true,
    rating: 5.0,
    showRating: true,
    duration: "Full Day (7:00 AM - 4:30 PM)",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    heroBackgroundColor: "#0f766e",
    indicatorColor: "#d97706",
    location: "Kisite-Mpunguti Marine National Park & Wasini Island",
    showLocation: true,
    schedule: "Daily Departures from Diani & Mombasa",
    showSchedule: true,
    groupType: "Couples · Families · Snorkelers & Swimmers",
    showGroupType: true,
    description:
      "Sail on a traditional Arabian dhow across the azure waters of the Indian Ocean. Spot playful wild dolphins, snorkel among vibrant coral reefs in Kisite Marine Park, and relish a mouthwatering Swahili seafood feast on Wasini Island.",
    overview:
      'Embark on an unforgettable coastal marine adventure starting with an early scenic drive to the historic fishing village of Shimoni. Board a motorized wooden Arabian dhow and glide across the protected marine channels where bottlenose and humpback dolphins frequently leap alongside the bow.\n\nDive into the crystal-clear waters of Kisite-Mpunguti Marine National Park, often hailed as the "Home of the Dolphin." Marvel at pristine coral gardens teeming with tropical reef fish, sea turtles, and stingrays. Afterward, sail to Wasini Island for a sumptuous Swahili seafood lunch (with fresh crab, fish, and coconut rice), followed by a guided boardwalk tour of the ancient coral garden and local village.',
    included: [
      "Round-trip air-conditioned hotel transfers (Mombasa / Diani)",
      "Traditional Arabian dhow cruise with onboard fruits & sodas",
      "All Kisite Marine National Park conservation & snorkeling fees",
      "Top-quality snorkeling mask, fins, and life jacket equipment",
      "Professional marine guide and dolphin spotting crew",
      "Lavish 3-course Swahili seafood lunch at Wasini Island restaurant",
      "Guided Shimoni slave caves & Wasini boardwalk excursion",
    ],
    showIncluded: true,
    whyChoose: [
      "Over 95% dolphin sighting probability in protected marine channels",
      "World-class shallow coral reef snorkeling with turtles and exotic marine life",
      "Authentic fresh Swahili seafood cuisine served in open-air oceanfront dining",
      "Full safety briefing and dedicated certified marine rescue staff",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Bring swimwear, beach towel, reef-safe sunscreen, sunglasses, and a sunhat.",
      "Waterproof camera or phone dry pouch is highly recommended.",
      "Vegetarian and chicken meal options are available upon request.",
      "Shimoni caves entrance fee ($5) supports the local community trust.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Driver and dhow crew gratuities (optional)",
      "Alcoholic beverages and personal bar drinks",
      "Shimoni historical slave caves community entry fee ($5 pp)",
      "Personal travel and medical insurance",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  {
    id: "excursion-watamu-marine-park-snorkeling-che-shale",
    enabled: true,
    deleted: false,
    slug: "watamu-marine-park-snorkeling-golden-sands",
    href: "/excursions/watamu-marine-park-snorkeling-golden-sands",
    badge: "Marine Reserve",
    showBadge: true,
    title: "Watamu Marine National Park Snorkeling & Golden Sands Expedition",
    showTitle: true,
    price: "From $75 / person",
    priceLabel: "From $75 / person",
    showPrice: true,
    rating: 4.9,
    showRating: true,
    duration: "Guided 6 Hours",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    heroBackgroundColor: "#0f766e",
    indicatorColor: "#d97706",
    location: "Watamu Marine National Park & Che Shale Golden Sands",
    showLocation: true,
    schedule: "Daily Departures (Watamu & Malindi)",
    showSchedule: true,
    groupType: "Couples · Families · Nature Enthusiasts",
    showGroupType: true,
    description:
      "Cruise in a glass-bottom boat across UNESCO-protected Watamu coral gardens. Snorkel with green sea turtles and colorful reef fish, then unwind on the idyllic golden sands of Che Shale.",
    overview:
      "Recognized as one of the finest coral reefs in East Africa, Watamu Marine National Park offers an enchanting underwater wonderland. Board our custom glass-bottom boat to observe brain corals, clownfish, and graceful green turtles through the viewing hull.\n\nPlunge into calm turquoise lagoons with certified snorkeling instructors. Following your aquatic exploration, take a scenic coastal drive to the untouched dunes and pristine golden sands of Che Shale for fresh tropical refreshments and panoramic Indian Ocean views.",
    included: [
      "Glass-bottom boat cruise across Watamu coral reef",
      "Professional certified snorkeling guide and spotter",
      "Snorkeling gear (mask, snorkel, life vest, flippers)",
      "Watamu Marine Park conservation entrance fees",
      "Chilled mineral water and seasonal tropical fruit platter",
      "Round-trip hotel pickup and drop-off in Watamu/Malindi",
    ],
    showIncluded: true,
    whyChoose: [
      "UNESCO Biosphere Reserve with over 500 species of marine fish",
      "Glass-bottom boat allows non-swimmers to observe coral life effortlessly",
      "Calm, sheltered coral lagoons ideal for families and beginner snorkelers",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Bring UV-protective rashguard, swimwear, and beach sandals.",
      "Tide timings determine the optimal departure hour for clear visibility.",
      "Sunscreen and hats recommended for boat deck relaxation.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Lunch (can be enjoyed at beachfront restaurant in Che Shale)",
      "Driver and boat captain gratuities",
      "Alcoholic beverages",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  {
    id: "excursion-mombasa-city-fort-jesus-heritage",
    enabled: true,
    deleted: false,
    slug: "mombasa-heritage-fort-jesus-old-town-tour",
    href: "/excursions/mombasa-heritage-fort-jesus-old-town-tour",
    badge: "Culture & History",
    showBadge: true,
    title: "Mombasa Heritage, Fort Jesus & Old Town Cultural Tour",
    showTitle: true,
    price: "From $55 / person",
    priceLabel: "From $55 / person",
    showPrice: true,
    rating: 4.8,
    showRating: true,
    duration: "Half Day (5 Hours)",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
    heroBackgroundColor: "#0f766e",
    indicatorColor: "#d97706",
    location: "Mombasa Island, Fort Jesus & Old Town",
    showLocation: true,
    schedule: "Daily Morning & Afternoon Departures",
    showSchedule: true,
    groupType: "History Buffs · Photographers · All Ages",
    showGroupType: true,
    description:
      "Step back in time through the narrow cobblestone alleyways of Mombasa Old Town. Explore the 16th-century Portuguese fortress of Fort Jesus, visit the bustling spice market, and marvel at the famous Elephant Tusks landmark.",
    overview:
      "Mombasa is a historic melting pot of African, Arabian, Portuguese, and British cultures spanning over eight centuries. On this guided cultural walking tour, wander through the atmospheric streets of Old Town lined with intricately carved Swahili doors and ornate wooden balconies.\n\nTour the UNESCO World Heritage Site Fort Jesus, built by the Portuguese in 1593 to guard the harbor. Visit the vibrant spice markets brimming with cardamom, cloves, and vanilla, stop by the Akamba woodcarving cooperative, and see the giant commemorative aluminum Elephant Tusks along Moi Avenue.",
    included: [
      "Air-conditioned private vehicle transport with hotel pickup",
      "Professional local historian and cultural licensed guide",
      "Fort Jesus UNESCO World Heritage Site entrance ticket & museum visit",
      "Mombasa Old Town walking tour and spice market tasting",
      "Photo stop at the iconic Mombasa Elephant Tusks landmark",
      "Bottled mineral water throughout the excursion",
    ],
    showIncluded: true,
    whyChoose: [
      "Comprehensive cultural insight into Kenya’s rich coastal trading history",
      "Personalized walking tour through authentic, living heritage neighborhoods",
      "Opportunity to purchase authentic coastal spices, tea, and handcrafted carvings",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Dress respectfully covering shoulders and knees when exploring historical quarters.",
      "Wear comfortable walking shoes for cobblestone streets and stairs.",
      "Camera fee may apply inside specific museum galleries.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Personal shopping and souvenir purchases",
      "Lunch and snacks",
      "Guide tips and gratuities",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    ],
  },
  {
    id: "excursion-diani-beach-quad-biking-village",
    enabled: true,
    deleted: false,
    slug: "diani-beach-quad-biking-kaya-forest-adventure",
    href: "/excursions/diani-beach-quad-biking-kaya-forest-adventure",
    badge: "Adventure & Thrills",
    showBadge: true,
    title: "Diani Beach Quad Biking & Sacred Kaya Forest Adventure",
    showTitle: true,
    price: "From $80 / person",
    priceLabel: "From $80 / person",
    showPrice: true,
    rating: 4.9,
    showRating: true,
    duration: "3 - 4 Hours",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
    heroBackgroundColor: "#0f766e",
    indicatorColor: "#d97706",
    location: "Diani Beach Outback & Kaya Sacred Forest",
    showLocation: true,
    schedule: "Morning (9:00 AM) & Afternoon (2:00 PM) Daily",
    showSchedule: true,
    groupType: "Thrill Seekers · Friends · Active Travelers",
    showGroupType: true,
    description:
      "Ride an all-terrain automatic quad bike through rural coastal dirt trails, coconut plantations, and vibrant local villages. Visit the sacred Kaya Kinondo indigenous forest with tribal elders.",
    overview:
      "Escape the resort strips and embark on an adrenaline-fueled off-road quad biking expedition across the lush hinterlands of the South Coast. Drive automatic 4-wheel ATVs through dusty savannah tracks, palm plantations, and picturesque rural settlements.\n\nTake a refreshing stop at a traditional village where local elders share ancient medicinal plant wisdom and coastal heritage. An exhilarating combination of off-road adventure, pristine coastal scenery, and authentic community engagement.",
    included: [
      "Automatic Yamaha / Polaris 250cc-400cc Quad Bike hire",
      "Safety helmet, protective goggles, and bandana",
      "Full safety briefing and professional lead & sweep guides",
      "Bottled drinking water and fresh coconut water tasting",
      "Hotel pickup and drop-off within Diani Beach / Galu",
    ],
    showIncluded: true,
    whyChoose: [
      "Easy-to-operate automatic ATVs suitable for beginners and experienced riders",
      "Off-the-beaten-path route showcasing genuine Kenyan village life",
      "Action-packed adventure with scenic photography stops along coastal trails",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Minimum driving age is 16 years. Passengers can ride tandem with an adult.",
      "Wear clothes you do not mind getting dusty or muddy.",
      "Closed-toe shoes (sneakers) are mandatory for all drivers.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Gratuities for trail guides",
      "Village handicraft purchases",
      "Personal insurance",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
    ],
  },
];

/**
 * Default wildlife safari and tour packages for Twinbird Travel Agency.
 */
export const defaultTourItems: TourItem[] = [
  {
    id: "safari-maasai-mara-big-five-3day",
    enabled: true,
    deleted: false,
    slug: "maasai-mara-big-five-3day-wildlife-safari",
    href: "/safaris/maasai-mara-big-five-3day-wildlife-safari",
    badge: "Most Popular",
    showBadge: true,
    title: "3-Day Maasai Mara Big Five Wildlife Safari",
    showTitle: true,
    price: "From $650 / person",
    priceLabel: "From $650 / person",
    showPrice: true,
    rating: 5.0,
    showRating: true,
    duration: "3 Days / 2 Nights",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    heroBackgroundColor: "#1b4332",
    indicatorColor: "#d97706",
    location: "Maasai Mara National Reserve",
    showLocation: true,
    schedule: "Daily Departures (Year-Round)",
    showSchedule: true,
    itinerary: [
      {
        day: "Day 1",
        title: "Nairobi to Maasai Mara & Afternoon Predator Drive",
        description:
          "Depart Nairobi in your private 4x4 Safari Land Cruiser, descending the Great Rift Valley escarpment with panoramic photo stops. Arrive at your luxury safari camp in time for lunch. In the afternoon, head out on your first thrilling game drive across the Maasai Mara savannah, searching for lions, cheetahs, and elephants against the golden African sunset.",
      },
      {
        day: "Day 2",
        title: "Full-Day Mara Plains Safari & Mara River Crossing Point",
        description:
          "Enjoy a full day of game viewing with a scenic picnic lunch in the wild. Traverse rolling grasslands to the famous Mara River, home to enormous Nile crocodiles and hippo pods. Witness boundless herds of wildebeest and zebras with high predator activity. Optional early morning Hot Air Balloon safari with champagne breakfast available.",
      },
      {
        day: "Day 3",
        title: "Sunrise Bush Safari, Maasai Village & Return to Nairobi",
        description:
          "Experience a dawn game drive capturing golden morning light and waking wildlife. Return to camp for a hearty breakfast and check-out. Optional visit to a traditional Maasai cultural village before embarking on the scenic drive back to Nairobi, arriving late afternoon.",
      },
    ],
    showItinerary: true,
    groupType: "Small Groups · Private 4x4 · Families",
    showGroupType: true,
    description:
      "Experience the pinnacle of African wildlife safaris in the world-famous Maasai Mara. Track lions, leopards, elephants, buffalos, and rhinos across golden savannah plains.",
    overview:
      "Embark on an extraordinary 3-day wildlife safari into the iconic Maasai Mara National Reserve. Famous for its unmatched predator populations and the annual Great Wildebeest Migration, the Mara offers premier game viewing throughout the year.\n\nTravel in a customized 4x4 Safari Land Cruiser with pop-up viewing roofs, guided by seasoned professional naturalists who know every animal territory. Enjoy thrilling sunrise and evening game drives, relax in luxury tented camps surrounded by the sounds of the African bush, and experience authentic Maasai cultural encounters.",
    included: [
      "Customized 4x4 Safari Land Cruiser with pop-up roof",
      "Professional certified safari guide & wildlife tracker",
      "All Maasai Mara National Reserve conservation entry fees",
      "2 nights full-board accommodation at luxury tented camp",
      "Unlimited bottled mineral water during all game drives",
      "Morning and late afternoon extended game drives",
      "Round-trip transfers from Nairobi (hotel or airport)",
    ],
    showIncluded: true,
    whyChoose: [
      "Guaranteed window seats for every traveler in custom 4x4 vehicles",
      "Silver and gold-level certified KPSGA safari guides",
      "Handpicked luxury eco-camps inside prime wildlife sectors",
      "High success rate for Big Five predator sightings",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Pack lightweight, neutral/earth-toned clothing (khaki, green, beige).",
      "Bring a warm fleece or jacket for early morning game drives.",
      "Carry binoculars, wide-brim hat, sunscreen, and insect repellent.",
      "Camera gear with extra batteries and memory cards is highly recommended.",
      "Optional hot air balloon safari with champagne breakfast available on Day 2.",
      "Passport required for reserve entry registration.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Driver-guide and camp staff gratuities (optional)",
      "Hot air balloon safari excursion (available as add-on)",
      "Personal travel, medical, and baggage insurance",
      "Alcoholic spirits and premium bottled beverages",
      "Optional visit to a traditional Maasai cultural village ($30 pp)",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
    ],
  },
  {
    id: "safari-amboseli-kilimanjaro-elephants-2day",
    enabled: true,
    deleted: false,
    slug: "amboseli-kilimanjaro-elephant-safari",
    href: "/safaris/amboseli-kilimanjaro-elephant-safari",
    badge: "Spectacular Views",
    showBadge: true,
    title: "2-Day Amboseli Kilimanjaro & Elephant Safari",
    showTitle: true,
    price: "From $420 / person",
    priceLabel: "From $420 / person",
    showPrice: true,
    rating: 4.9,
    showRating: true,
    duration: "2 Days / 1 Night",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop",
    heroBackgroundColor: "#1b4332",
    indicatorColor: "#d97706",
    location: "Amboseli National Park",
    showLocation: true,
    schedule: "Daily Departures",
    showSchedule: true,
    itinerary: [
      {
        day: "Day 1",
        title: "Journey to Amboseli & Afternoon Elephant Marsh Safari",
        description:
          "Depart early from Nairobi or the coast, driving through scenic savannah plains to Amboseli National Park. Arrive in time for lunch and settle into your luxury safari lodge with direct views of Mount Kilimanjaro. Embark on an afternoon game drive through the lush Enkongo Narok swamps to see massive elephant herds bathing and grazing alongside hippos and waterbirds.",
      },
      {
        day: "Day 2",
        title: "Sunrise Kilimanjaro Game Drive, Observation Hill & Return",
        description:
          "Rise early to witness the snow-capped peak of Mount Kilimanjaro crystal clear in the morning dawn. Head out on a sunrise game drive followed by a visit to Observation Hill for a 360-degree panorama of Amboseli's marshes and plains. Enjoy breakfast at the lodge before checking out and heading back to your destination.",
      },
    ],
    showItinerary: true,
    groupType: "Families · Couples · Photography Groups",
    showGroupType: true,
    description:
      "Witness legendary herds of free-ranging African elephants against the majestic backdrop of snow-capped Mount Kilimanjaro in Amboseli National Park.",
    overview:
      "Amboseli National Park is world-renowned for having some of the largest elephant tusker herds in Africa and offering awe-inspiring panoramas of Mount Kilimanjaro, Africa’s tallest peak.\n\nOn this 2-day expedition, traverse Amboseli’s diverse habitats — from dried-up lakebeds and sulfur springs to lush emerald swamps teeming with hippos, pelicans, lions, cheetahs, and zebras. Perfect for photographers, nature lovers, and families seeking an immersive, scenic safari getaway.",
    included: [
      "Custom 4x4 Safari Land Cruiser with pop-up roof",
      "Professional certified driver-guide",
      "All Amboseli National Park conservation entry fees",
      "1 night full-board accommodation at safari lodge / tented camp",
      "Unlimited bottled drinking water in safari vehicle",
      "Observation Hill panoramic viewpoint visit",
      "Hotel / Airport pickup and drop-off",
    ],
    showIncluded: true,
    whyChoose: [
      "Unobstructed postcard views of Mount Kilimanjaro at sunrise & sunset",
      "Close-up ethical encounters with legendary elephant matriarch herds",
      "Observation Hill walk overlooking Amboseli’s thriving marshlands",
      "Expert photography guidance for iconic wildlife portraits",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Best mountain visibility is typically in the early morning and late afternoon.",
      "Bring dust protection (bandana or camera cover) for dry lakebed drives.",
      "Sunscreen, polarized sunglasses, and safari hat are recommended.",
      "Comfortable walking shoes for Observation Hill trail.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Driver-guide gratuities and tips",
      "Personal travel & medical insurance",
      "Alcoholic drinks and personal lodge extras",
      "Souvenirs and optional Maasai cultural village visit",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
    ],
  },
  {
    id: "safari-lake-nakuru-tsavo-wilderness",
    enabled: true,
    deleted: false,
    slug: "lake-nakuru-tsavo-rhino-wildlife-safari",
    href: "/safaris/lake-nakuru-tsavo-rhino-wildlife-safari",
    badge: "Rhino Sanctuary",
    showBadge: true,
    title: "Lake Nakuru & Tsavo Wilderness Expedition",
    showTitle: true,
    price: "From $380 / person",
    priceLabel: "From $380 / person",
    showPrice: true,
    rating: 4.8,
    showRating: true,
    duration: "Full Day / Multi-Day Option",
    showDuration: true,
    imageUrl:
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop",
    heroImageUrl:
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop",
    heroBackgroundColor: "#1b4332",
    indicatorColor: "#d97706",
    location: "Great Rift Valley & National Reserves",
    showLocation: true,
    schedule: "Scheduled Weekly Departures",
    showSchedule: true,
    itinerary: [
      {
        day: "Day 1",
        title: "Nairobi to Lake Nakuru Sanctuary (Rhinos & Flamingos)",
        description:
          "Morning departure from Nairobi descending into the Great Rift Valley. Arrive at Lake Nakuru National Park, a world-famous sanctuary for endangered black and white rhinos and Rothschild's giraffes. Enjoy an extensive game drive along the alkaline lake shores dotted with flamingos and pelicans, and visit Baboon Cliff for panoramic views before dinner at the lodge.",
      },
      {
        day: "Day 2",
        title: "Tsavo Red-Elephant Plains & Scenic Return Journey",
        description:
          "Early morning departure heading towards Tsavo's sweeping savannah plains. Track the legendary red-dust elephants, lions, and diverse plains game. Savor a scenic safari lunch before beginning the return journey, concluding an unforgettable multi-reserve wilderness expedition.",
      },
    ],
    showItinerary: true,
    groupType: "Day Trippers · Wildlife Enthusiasts · Birders",
    showGroupType: true,
    description:
      "Track endangered black and white rhinos in the Lake Nakuru sanctuary, marvel at flocks of flamingos, and encounter the famous red-dust elephants of Tsavo.",
    overview:
      "Journey through the dramatic landscapes of the Great Rift Valley to Lake Nakuru National Park and the expansive savannahs of Tsavo. Lake Nakuru serves as an internationally renowned sanctuary for critically endangered black and white rhinos and rare Rothschild’s giraffes.\n\nEnjoy game drives along the lake’s scenic shoreline, climb to Baboon Cliff for panoramic valley vistas, and witness hundreds of bird species including pelicans and flamingos. An essential expedition for wildlife conservationists and enthusiastic safari adventurers.",
    included: [
      "4x4 Safari vehicle with pop-up roof",
      "Professional safari naturalist & tracker",
      "National park entrance & conservation fees",
      "Buffet lunch at a panoramic safari lodge",
      "Unlimited bottled mineral water on game drives",
      "Baboon Cliff viewpoint excursion",
      "Hotel pickup and return transfers",
    ],
    showIncluded: true,
    whyChoose: [
      "Guaranteed sightings of black and white rhinos in a protected haven",
      "Spectacular birding with over 450 recorded avian species",
      "Dramatic Rift Valley escarpment viewpoints and waterfall stops",
      "Small intimate groups with dedicated naturalist commentary",
    ],
    showWhyChoose: true,
    knowBeforeYouGo: [
      "Departure is early morning at 6:00 AM to maximize morning animal activity.",
      "Bring binoculars for exceptional birdwatching and predator spotting.",
      "Camera zoom lens recommended for shoreline bird and rhino photography.",
      "Wear comfortable safari attire with layers for temperature shifts.",
    ],
    showKnowBeforeYouGo: true,
    notIncluded: [
      "Driver-guide gratuities and tips",
      "Personal travel and medical insurance",
      "Alcoholic beverages and personal purchases",
    ],
    showNotIncluded: true,
    gallery: [
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
    ],
  },
];

/**
 * Default config for this deployment.
 */
export const defaultConfig: AppConfig = {
  branding: {
    font: "inter",
    appName: "Twinbird Travel Agency",
    logoUrl: "/brand/logos/logo.png",
    logoDarkUrl: "/brand/logos/logo-white.png",
    darkMode: false,
    faviconUrl: "/brand/favicons/favicon.ico",
    accentColor: "#d97706",
    primaryColor: "#1b4332",
    metaDescription:
      "Premier African wildlife safaris, Big Five game drives, and luxury bush expeditions in Kenya.",
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
      key: "air-ticketing",
      href: "/air-ticketing",
      icon: "Plane",
      label: "Air Ticketing",
      enabled: true,
    },
    {
      key: "safaris",
      href: "/safaris",
      icon: "Compass",
      label: "Safaris",
      enabled: true,
    },
    {
      key: "excursions",
      href: "/excursions",
      icon: "Compass",
      label: "Excursions",
      enabled: true,
    },
    {
      key: "transfers",
      href: "/transfers",
      icon: "Car",
      label: "Transfers",
      enabled: true,
    },
    {
      key: "about",
      href: "/about",
      icon: "Info",
      label: "About Us",
      enabled: true,
    },
    {
      key: "contact",
      href: "/contact",
      icon: "Mail",
      label: "Contact",
      enabled: true,
    },
  ],

  homepage: {
    sectionOrder: [
      "stats",
      "experiences",
      "tours",
      "excursions",
      "whyus",
      "reviews",
      "gallery",
      "cta",
    ],
    hero: {
      size: "fullscreen",
      enabled: true,
      eyebrow: "Unforgettable African Wildlife Safaris",
      headline: "Experience the Wild Heart",
      imageUrl:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
      subtitle:
        "Embark on breathtaking 4x4 game drives, witness the iconic Big Five, and stay in world-class safari lodges with expert local naturalists across Kenya’s premier national parks.",
      italicText: "of the African Savannah",
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: "/safaris",
      showPrimaryCta: true,
      primaryCtaLabel: "Explore Safaris",
      secondaryCtaHref: "/excursions",
      showSecondaryCta: true,
      secondaryCtaLabel: "Explore Excursions",
    },
    stats: {
      items: [
        {
          label: "Years Guiding Safaris",
          value: "15+",
          enabled: true,
        },
        {
          label: "Happy Travelers Guided",
          value: "12,000+",
          enabled: true,
        },
        {
          label: "Big Five Sighting Rate",
          value: "98%",
          enabled: true,
        },
        {
          label: "Traveler Satisfaction",
          value: "4.9/5",
          enabled: true,
        },
      ],
      title: "",
      enabled: true,
      eyebrow: "",
      subtitle: "",
      backgroundColor: "#ffffff",
    },
    experiences: {
      enabled: true,
      backgroundColor: "#fbf9f5",
      eyebrow: "WHAT WE OFFER",
      title: "Our experiences",
      subtitle:
        "Tailored journeys designed to connect you deeply with the spirit of the wild.",
      items: defaultExperienceItems,
    },
    tours: {
      items: defaultTourItems,
      title: "Iconic Safari Packages",
      enabled: true,
      eyebrow: "FEATURED SAFARIS",
      subtitle:
        "From thrilling 3-day Maasai Mara game drives to scenic Amboseli Kilimanjaro expeditions, explore our handcrafted African wildlife safaris.",
      backgroundColor: "#ffffff",
    },
    excursions: {
      items: defaultExcursionItems,
      title: "Handcrafted Day Excursions",
      enabled: true,
      eyebrow: "DAY EXPEDITIONS & EXCURSIONS",
      subtitle:
        "Immerse yourself in Kenya’s marine sanctuaries, coastal coral gardens, and ancient forests on guided day journeys back before evening.",
      backgroundColor: "#f8f7f4",
    },
    whyUs: {
      items: [
        {
          body: "Our silver and gold-level certified guides possess decades of bushcraft experience and intimate knowledge of animal migration routes.",
          icon: "Shield",
          title: "Expert Wildlife Trackers",
          enabled: true,
        },
        {
          body: "Travel in purpose-built 4x4 Safari Land Cruisers fitted with pop-up viewing roofs, individual charging sockets, and onboard coolers.",
          icon: "Compass",
          title: "Custom 4x4 Safari Vehicles",
          enabled: true,
        },
        {
          body: "We practice responsible, low-impact eco-tourism that directly finances park anti-poaching units and supports local community schools.",
          icon: "Leaf",
          title: "Conservation & Community",
          enabled: true,
        },
      ],
      title: "Guided by Passion, Rooted in the Wilderness",
      enabled: true,
      eyebrow: "WHY SAFARI WITH US",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
      subtitle: "",
      backgroundColor: "#ffffff",
    },
    gallery: {
      items: [
        {
          caption: "Maasai Mara Lion Pride",
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
        },
        {
          caption: "Amboseli Elephant Herd",
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop",
        },
        {
          caption: "Savannah Sunset Game Drive",
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
        },
        {
          caption: "Cheetah on the Lookout",
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2000&auto=format&fit=crop",
        },
        {
          caption: "Custom 4x4 Safari Vehicle",
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
        },
      ],
      title: "Safari Moments & Wildlife Gallery",
      enabled: true,
      eyebrow: "",
      subtitle: "",
      indicatorColor: "#d97706",
      backgroundColor: "#ffffff",
    },
    reviews: {
      items: [
        {
          name: "David & Claire Roberts",
          quote:
            '"Our 3-day Maasai Mara safari exceeded all expectations! Our guide spotted a leopard in an acacia tree within hours of arriving. The luxury tented camp was unforgettable."',
          enabled: true,
          location: "United Kingdom",
        },
        {
          name: "Marcus Vance",
          quote:
            '"Seeing hundreds of elephants walking right in front of Mount Kilimanjaro in Amboseli was a lifelong dream come true. Flawless logistics and incredible hospitality."',
          enabled: true,
          location: "United States",
        },
        {
          name: "Elena & Lucas",
          quote:
            '"The best travel experience of our lives. The 4x4 vehicle was extremely comfortable and our guide’s wildlife tracking skills were pure magic. 10/10 recommendation!"',
          enabled: true,
          location: "Germany",
        },
      ],
      title: "Guest Reviews & Safari Stories",
      enabled: true,
      eyebrow: "EXCELLENT ON TRIPADVISOR",
      subtitle: "",
      backgroundColor: "#020617",
    },
    ctaBanner: {
      ctaHref: "/safaris",
      enabled: true,
      ctaLabel: "Book Your Safari Now",
      headline: "Ready for the Adventure of a Lifetime?",
      subtitle:
        "Reserve your private 4x4 safari or customize a bespoke wildlife itinerary with our expert safari specialists today.",
      backgroundColor: "#1b4332",
    },
    footer: {
      contact: {
        email: "info@twinbirdtravel.com",
        phone: "+254 700 123 456",
        location: "Wildlife Plaza, Langata Road, Nairobi, Kenya",
        workingDays: "Mon - Sun: 7:00 AM - 9:00 PM EAT",
        workingHours: "24/7 Safari Support Desk",
      },
      enabled: true,
      socials: {
        items: [
          {
            url: "#",
            icon: "Facebook",
            enabled: true,
          },
          {
            url: "#",
            icon: "Instagram",
            enabled: true,
          },
          {
            url: "#",
            icon: "Whatsapp",
            enabled: true,
          },
          {
            url: "#",
            icon: "Tiktok",
            enabled: true,
          },
        ],
        enabled: true,
      },
      quickLinks: {
        items: [
          {
            href: "/",
            label: "Home",
            enabled: true,
          },
          {
            href: "/safaris",
            label: "Safaris",
            enabled: true,
          },
          {
            href: "/about",
            label: "About Us",
            enabled: true,
          },
          {
            href: "/contact",
            label: "Contact & Reservations",
            enabled: true,
          },
        ],
        enabled: true,
      },
      bottomLinks: {
        items: [
          {
            href: "#",
            label: "Privacy Policy",
            enabled: true,
          },
          {
            href: "#",
            label: "Terms & Conditions",
            enabled: true,
          },
          {
            href: "#",
            label: "Safari Travel Advisory",
            enabled: true,
          },
        ],
        enabled: true,
      },
      description:
        "Premier African wildlife safari operator delivering bespoke Big Five game drives, luxury tented camps, and ethical conservation safaris across Kenya.",
      topPackages: {
        items: [
          {
            href: "/safaris/maasai-mara-big-five-3day-wildlife-safari",
            label: "Maasai Mara Big Five Safari",
            enabled: true,
          },
          {
            href: "/safaris/amboseli-kilimanjaro-elephant-safari",
            label: "Amboseli Kilimanjaro Safari",
            enabled: true,
          },
          {
            href: "/safaris/lake-nakuru-tsavo-rhino-wildlife-safari",
            label: "Lake Nakuru Rhino Sanctuary",
            enabled: true,
          },
          {
            href: "/safaris",
            label: "Great Migration Safaris",
            enabled: true,
          },
          {
            href: "/contact",
            label: "Custom Private Safari",
            enabled: true,
          },
        ],
        enabled: true,
      },
      backgroundColor: "#020617",
    },
  },

  aboutPage: {
    hero: {
      size: "large",
      enabled: true,
      eyebrow: "OUR WILDERNESS HERITAGE",
      headline: "Born in the savannah,",
      imageUrl:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
      subtitle:
        "Pioneering authentic wildlife safaris, Big Five tracking expeditions, and ethical community conservation across Kenya.",
      italicText: "dedicated to the wild",
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: "",
      showPrimaryCta: false,
      backgroundColor: "#000000",
      primaryCtaLabel: "",
      secondaryCtaHref: "",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
    },
    story: {
      title:
        "Preserving the spirit of Africa’s greatest wilderness sanctuaries.",
      enabled: true,
      eyebrow: "OUR STORY",
      imageAlt: "Safari guides in custom 4x4 vehicle",
      imageUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
      paragraphs: [
        {
          text: "Founded by dedicated Kenyan naturalists and bush trackers, Twinbird Travel Agency was born from a singular passion: to deliver unforgettable wildlife encounters while championing ecosystem conservation and community empowerment. For our travelers, a game drive is more than sightseeing — it is an intimate connection with nature in its purest form.",
          enabled: true,
        },
        {
          text: "Over 15 years, we have guided thousands of adventurers across the Maasai Mara, Amboseli, and the Great Rift Valley. We work hand-in-hand with local conservancies and anti-poaching initiatives to ensure that Africa’s majestic wildlife thrives for generations to come.",
          enabled: true,
        },
      ],
      backgroundColor: "#ffffff",
    },
    team: {
      items: [
        {
          name: "James Ole Kaelo",
          role: "Head Safari Guide & Big Cat Specialist",
          quote:
            '"The savannah speaks to those who listen with patience and respect."',
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
        },
        {
          name: "Faith Wanjiku",
          role: "Field Ornithologist & Eco-Naturalist",
          quote:
            '"Every bird song and animal track tells a story of the ecosystem’s health."',
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2000&auto=format&fit=crop",
        },
        {
          name: "Samuel Kiprop",
          role: "Lead 4x4 Expedition Navigator",
          quote:
            '"We navigate every river crossing and savannah trail with safety and precision."',
          enabled: true,
          imageUrl:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
        },
      ],
      title: "Meet Our Expert Guides & Naturalists",
      enabled: true,
      eyebrow: "THE EXPEDITION TEAM",
      subtitle:
        "Our certified safari guides carry decades of tracking instincts, bushcraft knowledge, and a deep dedication to wildlife conservation.",
      backgroundColor: "#ffffff",
    },
    values: {
      items: [
        {
          icon: "Leaf",
          title: "Wildlife Conservation",
          enabled: true,
          description:
            "Directly funding park conservation, anti-poaching ranger units, and wildlife corridor preservation.",
        },
        {
          icon: "Compass",
          title: "Master Bush Tracking",
          enabled: true,
          description:
            "Certified KPSGA professional guides with unmatched animal tracking and behavioral expertise.",
        },
        {
          icon: "Users",
          title: "Community Empowerment",
          enabled: true,
          description:
            "Supporting local Maasai and Samburu community conservancies through revenue-sharing and schooling.",
        },
        {
          icon: "Star",
          title: "Unrivaled Hospitality",
          enabled: true,
          description:
            "Premium 4x4 safari vehicles, handpicked luxury tented lodges, and bespoke guest care at every step.",
        },
      ],
      title: "Guided by Conservation, Inspired by the Wild",
      enabled: true,
      eyebrow: "OUR CORE VALUES",
      subtitle:
        "Our core principles guide every game drive we lead, every track we follow, and every relationship we build with local communities.",
      backgroundColor: "#fafafa",
    },
    impact: {
      stats: [
        {
          label: "ACRES OF CONSERVANCY SUPPORTED",
          value: "75,000+",
          enabled: true,
        },
        {
          label: "YEARS OF WILDLIFE GUIDING",
          value: "15+",
          enabled: true,
        },
        {
          label: "ETHICAL WILDLIFE ENCOUNTERS",
          value: "100%",
          enabled: true,
        },
        {
          label: "LOCAL COMMUNITY PROJECTS",
          value: "24+",
          enabled: true,
        },
      ],
      title: "Our Conservation Impact by the Numbers",
      enabled: false,
      subtitle:
        "Eco-tourism is the cornerstone of African wildlife protection. Every safari booked directly protects natural habitats and empowers local communities.",
      partnersCard: {
        icon: "ShieldCheck",
        title: "Our Conservation & Tourism Partners",
        partners: [
          "Kenya Wildlife Service (KWS)",
          "Maasai Mara Wildlife Conservancies Association",
          "Kenya Professional Safari Guides Association (KPSGA)",
          "Eco-Tourism Kenya",
        ],
      },
      backgroundColor: "#0f172a",
    },
    cta: {
      title: "Answer the Call of the African Wild",
      enabled: true,
      subtitle:
        "Whether witnessing the Great Migration in the Maasai Mara or marveling at elephant herds in Amboseli, your safari adventure starts here.",
      primaryCta: {
        href: "/safaris",
        label: "Explore Safaris",
        enabled: true,
      },
      secondaryCta: {
        href: "/contact",
        label: "Plan a Custom Safari",
        enabled: true,
      },
      backgroundColor: "#fafafa",
    },
  },

  toursPage: {
    hero: {
      size: "medium",
      enabled: true,
      eyebrow: "WILDLIFE SAFARIS & EXPEDITIONS",
      headline: "African Safari Packages",
      imageUrl:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
      subtitle:
        "Explore our curated collection of Big Five wildlife safaris, luxury tented camp expeditions, and custom game drives across Kenya’s iconic national parks.",
      italicText: "& Game Drives",
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: "",
      showPrimaryCta: false,
      backgroundColor: "#1b4332",
      primaryCtaLabel: "",
      secondaryCtaHref: "",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
    },
    tours: {
      items: defaultTourItems,
      title: "Explore Our Safari Collection",
      enabled: true,
      eyebrow: "ALL SAFARI PACKAGES",
      subtitle:
        "From multi-day luxury fly-in safaris to overland 4x4 wildlife expeditions, find your dream African adventure.",
      backgroundColor: "#f5f5f0",
    },
    metaTitle: "Safari Packages & Wildlife Game Drives",
    metaDescription:
      "Explore our luxury African wildlife safaris, Big Five game drives, and national park expeditions in Maasai Mara, Amboseli, and Tsavo.",
    bookingForm: {
      title: "Reserve This Safari",
      enabled: true,
      subtitle:
        "Secure your private 4x4 vehicle and luxury safari lodge reservation.",
      accessKey: "",
      buttonText: "Submit Safari Reservation",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "e.g. John Doe",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "name@example.com",
        },
        {
          id: "phone",
          type: "tel",
          label: "Phone Number (WhatsApp)",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "+1 (555) 000-0000",
        },
        {
          id: "date",
          type: "date",
          label: "Preferred Safari Start Date",
          enabled: true,
          required: false,
          halfWidth: true,
        },
        {
          id: "guests",
          type: "select",
          label: "Number of Travelers",
          enabled: true,
          options: [
            "1 Solo Traveler",
            "2 Travelers (Couple)",
            "3 Travelers",
            "4 Travelers (Private 4x4)",
            "5-6 Travelers (Private 4x4)",
            "7+ Large Group / Family",
          ],
          required: false,
          halfWidth: false,
        },
        {
          id: "transfer",
          type: "checkbox",
          label: "Include Airport / Hotel Pickup Transfer",
          enabled: true,
          required: false,
          halfWidth: false,
        },
        {
          id: "notes",
          type: "textarea",
          label: "Special Requests & Preferences",
          enabled: true,
          required: false,
          halfWidth: false,
          placeholder:
            "Dietary preferences, lodge room types, photography interests, special celebrations...",
        },
      ],
    },
  },

  excursionsPage: {
    hero: {
      size: "medium",
      enabled: true,
      eyebrow: "COASTAL DAY TOURS & ACTIVITIES",
      headline: "Coastal Excursions",
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
      subtitle:
        "Discover unforgettable marine dhow safaris, coral reef snorkeling, historical city walks, and adrenaline beach adventures along the Kenya coast.",
      italicText: "& Marine Adventures",
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: "",
      showPrimaryCta: false,
      backgroundColor: "#0f766e",
      primaryCtaLabel: "",
      secondaryCtaHref: "",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
    },
    tours: {
      items: defaultExcursionItems,
      title: "Handcrafted Coastal Excursions",
      enabled: true,
      eyebrow: "DAY TOURS & EXPERIENCES",
      subtitle:
        "Immerse yourself in authentic Swahili culture, encounter marine wildlife, and explore Kenya's stunning coastline.",
      backgroundColor: "#f5f5f0",
    },
    metaTitle: "Excursions & Coastal Day Trips",
    metaDescription:
      "Discover unforgettable day tours, marine park snorkeling, cultural excursions, and coastal adventures across Kenya.",
    bookingForm: {
      title: "Reserve This Excursion",
      enabled: true,
      subtitle:
        "Book your spot for an incredible day trip and coastal experience.",
      accessKey: "",
      buttonText: "Submit Excursion Reservation",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "e.g. John Doe",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "name@example.com",
        },
        {
          id: "phone",
          type: "tel",
          label: "Phone Number (WhatsApp)",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "+1 (555) 000-0000",
        },
        {
          id: "date",
          type: "date",
          label: "Preferred Excursion Date",
          enabled: true,
          required: false,
          halfWidth: true,
        },
        {
          id: "guests",
          type: "select",
          label: "Number of Guests",
          enabled: true,
          options: [
            "1 Guest",
            "2 Guests (Couple)",
            "3-4 Guests",
            "5-8 Guests (Small Group)",
            "9+ Large Group",
          ],
          required: false,
          halfWidth: false,
        },
        {
          id: "transfer",
          type: "checkbox",
          label: "Include Hotel Pickup & Return Transfer",
          enabled: true,
          required: false,
          halfWidth: false,
        },
        {
          id: "notes",
          type: "textarea",
          label: "Special Requests or Hotel Name",
          enabled: true,
          required: false,
          halfWidth: false,
          placeholder:
            "Dietary preferences, hotel name for pickup, gear sizing, special requests...",
        },
      ],
    },
  },

  contactPage: {
    hero: {
      size: "medium",
      enabled: true,
      eyebrow: "Get in Touch",
      headline: "Let's plan your",
      imageUrl:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
      subtitle:
        "Have a question about our safari packages or want to create a custom private itinerary? Our safari specialists are ready to help you plan your dream adventure.",
      italicText: "dream safari",
      showEyebrow: true,
      showSubtitle: true,
      primaryCtaHref: "",
      showPrimaryCta: false,
      backgroundColor: "#000000",
      primaryCtaLabel: "",
      secondaryCtaHref: "",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
    },
    contact: {
      email: "info@twinbirdtravel.com",
      phone: "+254 700 123 456",
      enabled: true,
      location: "Nairobi & Maasai Mara, Kenya",
      whatsapp: "+254 700 123 456",
      locationLink: "https://maps.google.com/?q=Nairobi+Kenya",
      backgroundColor: "#f5f5f0",
      tripAdvisorLink: "https://tripadvisor.com",
    },
    form: {
      title: "Send a Safari Inquiry",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Full Name",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "Jane Doe",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          enabled: true,
          required: true,
          halfWidth: true,
          placeholder: "jane@example.com",
        },
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          enabled: true,
          required: false,
          halfWidth: true,
          placeholder: "+1 ...",
        },
        {
          id: "subject",
          type: "select",
          label: "Inquiry Subject",
          enabled: true,
          options: [
            "General Inquiry",
            "Safari Package Booking",
            "Custom Private Itinerary",
            "Great Migration Safari",
            "Group / Family Safari",
            "Feedback & Questions",
          ],
          required: false,
          halfWidth: true,
        },
        {
          id: "message",
          type: "textarea",
          label: "Your Message",
          enabled: true,
          required: true,
          halfWidth: false,
          placeholder:
            "Tell us about your travel dates, group size, preferred national parks, and budget...",
        },
      ],
      enabled: true,
      subtitle: "Our safari team typically responds within 2-4 hours.",
      accessKey: "",
      buttonText: "Submit Safari Request",
      backgroundColor: "#ffffff",
    },
    faq: {
      items: [
        {
          question: "When is the best time of year to see the Great Migration?",
          answer:
            "The Great Wildebeest Migration typically reaches Kenya’s Maasai Mara from July through October, when over 1.5 million wildebeest and zebras cross the Mara River.",
          enabled: true,
        },
        {
          question: "What type of vehicles are used for game drives?",
          answer:
            "We use custom-built 4x4 Safari Land Cruisers equipped with pop-up roofs for 360-degree game viewing, high-clearance suspension, onboard charging ports, and coolers.",
          enabled: true,
        },
        {
          question: "What should I pack for an African safari?",
          answer:
            "We recommend neutral-toned clothing (khaki, tan, olive), a warm jacket for chilly morning game drives, a wide-brim hat, sunscreen, binoculars, and insect repellent.",
          enabled: true,
        },
        {
          question: "Are airport and hotel pickup transfers included?",
          answer:
            "Yes! All our multi-day safari packages include complimentary round-trip transfers from your hotel or Jomo Kenyatta International Airport (NBO) in Nairobi.",
          enabled: true,
        },
      ],
      title: "Frequently Asked Safari Questions",
      enabled: true,
      eyebrow: "QUICK ANSWERS",
      subtitle: "",
      backgroundColor: "#f5f5f0",
    },
    metaTitle: "Contact & Safari Reservations",
    metaDescription:
      "Contact our safari planning specialists to reserve your custom wildlife game drives, luxury tented camps, and national park tours.",
  },
  transfersPage: {
    metaTitle: "Airport & Coast Transfer Services | Twinbird Travel Agency",
    metaDescription:
      "Reliable, comfortable transfers across the Kenya Coast — from airport pick-ups to full-day hire between Mombasa, Malindi, Watamu, Kilifi, and Diani Beach.",
    hero: {
      enabled: true,
      size: "medium",
      showEyebrow: true,
      eyebrow: "AIRPORT & COAST",
      headline: "Transfer Services",
      italicText: "",
      showSubtitle: true,
      subtitle:
        "Reliable, comfortable transfers across the Kenya Coast — from airport pick-ups to full-day hire.",
      showPrimaryCta: true,
      primaryCtaLabel: "View Available Routes",
      primaryCtaHref: "#booking-section",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      imageUrl: "",
      backgroundColor: "#161a18",
    },
    features: [
      {
        icon: "ShieldCheck",
        title: "Safe & Insured",
        description: "All vehicles are fully insured and regularly serviced.",
      },
      {
        icon: "Clock",
        title: "Punctual",
        description:
          "We track your flight and adjust for delays — no waiting fees.",
      },
      {
        icon: "Sparkles",
        title: "Comfortable",
        description:
          "Spacious, air-conditioned vehicles for individuals and groups.",
      },
      {
        icon: "MapPin",
        title: "Door to Door",
        description:
          "Pick-up and drop-off at any location along the Kenya Coast.",
      },
    ],
    routesSection: {
      enabled: true,
      title: "Available Routes",
      subtitle: "Popular transfers across coastal airports, resorts, and towns",
      note: "Don't see your route? Fill in your details in the form and we'll arrange it.",
      routes: [
        {
          id: "route-mba-watamu",
          from: "Mombasa Airport (MBA)",
          to: "Watamu",
          duration: "~2 hrs",
          price: "$65",
          priceLabel: "per vehicle",
          popular: true,
          enabled: true,
        },
        {
          id: "route-mydd-watamu",
          from: "Malindi Airport",
          to: "Watamu",
          duration: "~30 min",
          price: "$25",
          priceLabel: "per vehicle",
          popular: true,
          enabled: true,
        },
        {
          id: "route-watamu-malindi",
          from: "Watamu",
          to: "Malindi Town",
          duration: "~30 min",
          price: "$25",
          priceLabel: "per vehicle",
          popular: false,
          enabled: true,
        },
        {
          id: "route-watamu-kilifi",
          from: "Watamu",
          to: "Kilifi",
          duration: "~1 hr",
          price: "$40",
          priceLabel: "per vehicle",
          popular: false,
          enabled: true,
        },
        {
          id: "route-watamu-mombasa",
          from: "Watamu",
          to: "Mombasa",
          duration: "~2 hrs",
          price: "$65",
          priceLabel: "per vehicle",
          popular: true,
          enabled: true,
        },
        {
          id: "route-watamu-diani",
          from: "Watamu",
          to: "Diani Beach",
          duration: "~3 hrs",
          price: "$95",
          priceLabel: "per vehicle",
          popular: true,
          enabled: true,
        },
      ],
    },
    vehiclesSection: {
      enabled: true,
      title: "Our Modern Fleet",
      subtitle:
        "Well-maintained, clean, air-conditioned vehicles driven by professional local chauffeurs",
      vehicles: [
        {
          id: "sedan",
          name: "Executive Sedan",
          category: "Private Transfer",
          passengers: "1 - 3 Passengers",
          luggage: "2 Large + 2 Hand Luggage",
          description:
            "Comfortable air-conditioned saloon car perfect for solo travelers, couples, and small families.",
          featured: false,
          enabled: true,
        },
        {
          id: "minivan",
          name: "Luxury Safari Minivan / Alphard",
          category: "Family & Small Group",
          passengers: "4 - 7 Passengers",
          luggage: "5 Large + 4 Hand Luggage",
          description:
            "Spacious van with individual captain seats, ample luggage space, and dual zone AC.",
          featured: true,
          enabled: true,
        },
        {
          id: "cruiser",
          name: "Custom 4x4 Safari Land Cruiser",
          category: "All-Terrain Luxury",
          passengers: "5 - 7 Passengers",
          luggage: "6 Large Suitcases",
          description:
            "Heavy-duty 4x4 expedition vehicle with elevated clearance, pop-up safari roof, and panoramic views.",
          featured: true,
          enabled: true,
        },
        {
          id: "coaster",
          name: "Toyota Coaster Mini-Bus",
          category: "Large Groups & Events",
          passengers: "12 - 22 Passengers",
          luggage: "20+ Bags / Luggage Compartment",
          description:
            "Ideal for wedding parties, conference delegates, and tour groups traveling together.",
          featured: false,
          enabled: true,
        },
      ],
    },
    bookingForm: {
      enabled: true,
      title: "Book this transfer",
      subtitle: "Instant quote & quick confirmation",
      buttonText: "Request Transfer",
      whatsappNumber: "+254700000000",
      whatsappText:
        "Hello Twinbird Travel Agency! I would like to inquire about booking a transfer.",
      noticeText: "No commitment required. We reply within 24 hours.",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          halfWidth: false,
          placeholder: "Jane Doe",
          enabled: true,
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          required: false,
          halfWidth: false,
          placeholder: "jane@example.com",
          enabled: true,
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          halfWidth: false,
          placeholder: "+254 ...",
          enabled: true,
        },
        {
          id: "route",
          label: "Route",
          type: "text",
          required: true,
          halfWidth: false,
          placeholder: "e.g. Mombasa Airport → Watamu",
          enabled: true,
        },
        {
          id: "vehicleType",
          label: "Vehicle Type",
          type: "select",
          required: true,
          halfWidth: false,
          placeholder: "— Select vehicle —",
          options: [
            "— Select vehicle —",
            "3 Seater",
            "7 Seater",
            "9 Seater",
            "Minibus",
            "Bus",
          ],
          enabled: true,
        },
        {
          id: "luggage",
          label: "Travelling with luggage",
          type: "checkbox",
          required: false,
          halfWidth: false,
          placeholder: "Bags, suitcases, large items",
          enabled: true,
        },
        {
          id: "date",
          label: "Date",
          type: "date",
          required: false,
          halfWidth: true,
          placeholder: "dd - yyyy",
          enabled: true,
        },
        {
          id: "passengers",
          label: "Passengers",
          type: "number",
          required: false,
          halfWidth: true,
          placeholder: "2",
          enabled: true,
        },
        {
          id: "message",
          label: "Message",
          type: "textarea",
          required: false,
          halfWidth: false,
          placeholder: "Pick-up time, flight number, special requests...",
          enabled: true,
        },
      ],
    },
    faq: {
      enabled: true,
      eyebrow: "TRANSFERS FAQ",
      title: "Frequently Asked Transfer Questions",
      subtitle:
        "Everything you need to know about our airport and coastal transfer services.",
      items: [
        {
          question: "What happens if my flight is delayed?",
          answer:
            "We monitor all domestic and international flights in real-time. Your driver will adjust the pickup schedule automatically at no extra charge.",
          enabled: true,
        },
        {
          question: "Where will I meet my driver at the airport?",
          answer:
            "Your driver will be waiting outside the arrivals terminal holding a personalized welcome sign with your name.",
          enabled: true,
        },
        {
          question: "Are child safety seats available?",
          answer:
            "Yes! We provide complimentary infant, toddler, and booster car seats upon request. Simply mention it in the special requests field.",
          enabled: true,
        },
        {
          question: "Can we stop for groceries or sightseeing along the way?",
          answer:
            "Yes, reasonable stops along your route (for supermarkets, ATM, or scenic viewpoints) can be arranged with your chauffeur.",
          enabled: true,
        },
      ],
    },
  },
  airTicketingPage: {
    metaTitle: "Air Ticketing & Flight Reservations | Twinbird Travel Agency",
    metaDescription:
      "Book domestic flights, bush safari airstrip transfers, and international air tickets across Kenya and worldwide with best rates and personalized 24/7 service.",
    hero: {
      enabled: true,
      size: "medium",
      showEyebrow: true,
      eyebrow: "DOMESTIC & INTERNATIONAL",
      headline: "Air Ticketing Services",
      italicText: "",
      showSubtitle: true,
      subtitle:
        "Seamless flight bookings, safari bush airstrip transfers, and international ticketing with instant confirmation and dedicated travel support.",
      showPrimaryCta: true,
      primaryCtaLabel: "Book / Inquire Flights",
      primaryCtaHref: "#booking-section",
      showSecondaryCta: false,
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      imageUrl: "/images/hero/air-ticketing-hero.jpg",
      backgroundColor: "#111827",
    },
    features: [
      {
        icon: "ShieldCheck",
        title: "Best Fare Guarantee",
        description:
          "We compare leading scheduled carriers and safari airlines to guarantee the most competitive rates.",
      },
      {
        icon: "Clock",
        title: "Instant E-Tickets",
        description:
          "Quick reservations with electronic tickets delivered directly to your email and WhatsApp.",
      },
      {
        icon: "Plane",
        title: "Safari Bush Flights",
        description:
          "Direct scheduled and chartered flights connecting Wilson Airport to Mara, Amboseli, and coastal strips.",
      },
      {
        icon: "Sparkles",
        title: "24/7 Flight Support",
        description:
          "Dedicated assistance with schedule monitoring, date changes, extra baggage, and group reservations.",
      },
    ],
    routesSection: {
      enabled: true,
      title: "Flight Routes & Connections",
      subtitle: "Explore popular domestic hops, safari airstrip connections, and regional international flights",
      localTitle: "Local & Domestic Flights",
      localSubtitle: "Scenic safari bush flights and coastal shuttles across Kenya",
      internationalTitle: "International & Regional Flights",
      internationalSubtitle: "Seamless cross-border hops, regional hubs, and global connections",
      note: "Need a custom flight route, private bush charter, or international connection? Inquire now and our flight desk will arrange it.",
      routes: [
        // ── Local & Safari Domestic Routes ──
        {
          id: "flight-wil-mara",
          from: "Nairobi Wilson (WIL)",
          to: "Maasai Mara (MRE)",
          duration: "~45 min",
          price: "$180",
          priceLabel: "per person",
          airline: "Safarilink / AirKenya",
          category: "local",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-nbo-mba",
          from: "Nairobi (NBO)",
          to: "Mombasa (MBA)",
          duration: "~50 min",
          price: "$65",
          priceLabel: "per person",
          airline: "Jambojet / Kenya Airways",
          category: "local",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-wil-amboseli",
          from: "Nairobi Wilson (WIL)",
          to: "Amboseli (ASV)",
          duration: "~40 min",
          price: "$160",
          priceLabel: "per person",
          airline: "Safarilink / AirKenya",
          category: "local",
          popular: false,
          enabled: true,
        },
        {
          id: "flight-nbo-malindi",
          from: "Nairobi (NBO)",
          to: "Malindi / Watamu (MYD)",
          duration: "~1 hr 05 min",
          price: "$75",
          priceLabel: "per person",
          airline: "Fly540 / Jambojet",
          category: "local",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-wil-samburu",
          from: "Nairobi Wilson (WIL)",
          to: "Samburu (UAS)",
          duration: "~50 min",
          price: "$170",
          priceLabel: "per person",
          airline: "Safarilink / AirKenya",
          category: "local",
          popular: false,
          enabled: true,
        },
        {
          id: "flight-nbo-ukunda",
          from: "Nairobi (WIL/NBO)",
          to: "Ukunda / Diani Beach (UKA)",
          duration: "~1 hr 10 min",
          price: "$85",
          priceLabel: "per person",
          airline: "Safarilink / Jambojet",
          category: "local",
          popular: true,
          enabled: true,
        },

        // ── International & Regional Routes ──
        {
          id: "flight-mba-znz",
          from: "Mombasa (MBA)",
          to: "Zanzibar (ZNZ)",
          duration: "~35 min",
          price: "$120",
          priceLabel: "per person",
          airline: "Fly540 / Coastal Aviation",
          category: "international",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-nbo-jro",
          from: "Nairobi (NBO)",
          to: "Kilimanjaro / Arusha (JRO)",
          duration: "~50 min",
          price: "$195",
          priceLabel: "per person",
          airline: "Kenya Airways / Precision Air",
          category: "international",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-nbo-dxb",
          from: "Nairobi (NBO)",
          to: "Dubai (DXB)",
          duration: "~5 hrs 15 min",
          price: "$380",
          priceLabel: "per person",
          airline: "Emirates / Kenya Airways",
          category: "international",
          popular: true,
          enabled: true,
        },
        {
          id: "flight-nbo-kgl",
          from: "Nairobi (NBO)",
          to: "Kigali (KGL)",
          duration: "~1 hr 30 min",
          price: "$220",
          priceLabel: "per person",
          airline: "RwandAir / Kenya Airways",
          category: "international",
          popular: false,
          enabled: true,
        },
        {
          id: "flight-nbo-ebb",
          from: "Nairobi (NBO)",
          to: "Entebbe (EBB)",
          duration: "~1 hr 15 min",
          price: "$185",
          priceLabel: "per person",
          airline: "Uganda Airlines / Kenya Airways",
          category: "international",
          popular: false,
          enabled: true,
        },
        {
          id: "flight-nbo-lhr",
          from: "Nairobi (NBO)",
          to: "London Heathrow (LHR)",
          duration: "~8 hrs 40 min",
          price: "$650",
          priceLabel: "per person",
          airline: "British Airways / Kenya Airways",
          category: "international",
          popular: true,
          enabled: true,
        },
      ],
    },
    servicesSection: {
      enabled: true,
      airlinesTitle: "Partner Airlines & Flight Operators",
      airlinesSubtitle:
        "We coordinate seamlessly with Kenya's premier safari bush carriers, regional scheduled airlines, and global flag carriers",
      airlines: [
        {
          id: "airline-kenya-airways",
          name: "Kenya Airways",
          category: "National Flag Carrier",
          logoUrl: "/images/airlines/kenya-airways.svg",
          imageUrl: "/images/airlines/kenya-airways.svg",
          badge: "The Pride of Africa",
          enabled: true,
        },
        {
          id: "airline-safarilink",
          name: "Safarilink Aviation",
          category: "Premier Safari Bush Carrier",
          logoUrl: "/images/airlines/safarilink.svg",
          imageUrl: "/images/airlines/safarilink.svg",
          badge: "Safari Bush Partner",
          enabled: true,
        },
        {
          id: "airline-airkenya",
          name: "AirKenya Express",
          category: "Wilderness Aviation Specialist",
          logoUrl: "/images/airlines/airkenya.svg",
          imageUrl: "/images/airlines/airkenya.svg",
          badge: "Wilderness Pioneer",
          enabled: true,
        },
        {
          id: "airline-jambojet",
          name: "Jambojet",
          category: "Leading Regional Jet Service",
          logoUrl: "/images/airlines/jambojet.svg",
          imageUrl: "/images/airlines/jambojet.svg",
          badge: "Coastal & City Network",
          enabled: true,
        },
        {
          id: "airline-coastal-aviation",
          name: "Coastal Aviation",
          category: "The Flying Safari Company",
          logoUrl: "/images/airlines/coastal-aviation.svg",
          imageUrl: "/images/airlines/coastal-aviation.svg",
          badge: "Zanzibar & Island Specialist",
          enabled: true,
        },
        {
          id: "airline-emirates",
          name: "Emirates Airlines",
          category: "Premier Global Partner",
          logoUrl: "/images/airlines/emirates.svg",
          imageUrl: "/images/airlines/emirates.svg",
          badge: "Global Network",
          enabled: true,
        },
        {
          id: "airline-precision-air",
          name: "Precision Air",
          category: "East African Regional Carrier",
          logoUrl: "/images/airlines/precision-air.svg",
          imageUrl: "/images/airlines/precision-air.svg",
          badge: "Kilimanjaro & Serengeti",
          enabled: true,
        },
        {
          id: "airline-fly540",
          name: "Fly540",
          category: "Domestic & Regional Airline",
          logoUrl: "/images/airlines/fly540.svg",
          imageUrl: "/images/airlines/fly540.svg",
          badge: "Direct Connections",
          enabled: true,
        },
        {
          id: "airline-rwandair",
          name: "RwandAir",
          category: "Regional Partner",
          logoUrl: "/images/airlines/rwandair.svg",
          imageUrl: "/images/airlines/rwandair.svg",
          badge: "Connecting East Africa",
          enabled: true,
        },
      ],
    },
    bookingForm: {
      enabled: true,
      title: "Book / Inquire Flight Tickets",
      subtitle: "Instant quote & personalized flight coordination",
      buttonText: "Request Flight Quote",
      whatsappNumber: "+254700000000",
      whatsappText:
        "Hello Twinbird Travel Agency! I would like to inquire about booking a flight.",
      noticeText: "No instant commitment required. We check live seat availability and confirm within 2 hours.",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          halfWidth: false,
          placeholder: "Jane Doe",
          enabled: true,
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          required: false,
          halfWidth: true,
          placeholder: "jane@example.com",
          enabled: true,
        },
        {
          id: "phone",
          label: "Phone / WhatsApp",
          type: "tel",
          required: true,
          halfWidth: true,
          placeholder: "+254 ...",
          enabled: true,
        },
        {
          id: "tripType",
          label: "Trip Type",
          type: "select",
          required: true,
          halfWidth: true,
          placeholder: "— Select trip type —",
          options: [
            "— Select trip type —",
            "Round Trip",
            "One Way",
            "Multi-City / Safari Hop",
          ],
          enabled: true,
        },
        {
          id: "cabinClass",
          label: "Cabin / Service Class",
          type: "select",
          required: false,
          halfWidth: true,
          placeholder: "— Select class —",
          options: [
            "— Select class —",
            "Economy Class",
            "Business Class",
            "Safari Bush Plane",
            "Private Charter",
          ],
          enabled: true,
        },
        {
          id: "departureAirport",
          label: "Departure City / Airport",
          type: "text",
          required: true,
          halfWidth: true,
          placeholder: "e.g. Nairobi (NBO / Wilson)",
          enabled: true,
        },
        {
          id: "destinationAirport",
          label: "Destination City / Airstrip",
          type: "text",
          required: true,
          halfWidth: true,
          placeholder: "e.g. Maasai Mara / Mombasa / Zanzibar",
          enabled: true,
        },
        {
          id: "departureDate",
          label: "Departure Date",
          type: "date",
          required: true,
          halfWidth: true,
          placeholder: "dd - mm - yyyy",
          enabled: true,
        },
        {
          id: "returnDate",
          label: "Return Date (If Round Trip)",
          type: "date",
          required: false,
          halfWidth: true,
          placeholder: "dd - mm - yyyy",
          enabled: true,
        },
        {
          id: "adults",
          label: "Adults (12+ yrs)",
          type: "number",
          required: true,
          halfWidth: true,
          placeholder: "1",
          enabled: true,
        },
        {
          id: "children",
          label: "Children (2-11 yrs / Infants)",
          type: "number",
          required: false,
          halfWidth: true,
          placeholder: "0",
          enabled: true,
        },
        {
          id: "specialRequests",
          label: "Preferred Airline & Special Requests",
          type: "textarea",
          required: false,
          halfWidth: false,
          placeholder: "Preferred flight times, baggage requirements, safari lodge name...",
          enabled: true,
        },
      ],
    },
    faq: {
      enabled: true,
      eyebrow: "AIR TICKETING FAQ",
      title: "Frequently Asked Flight Questions",
      subtitle:
        "Key details about domestic, safari bush flights, baggage limits, and ticketing policies.",
      items: [
        {
          question: "What is the baggage allowance for safari bush flights?",
          answer:
            "Scheduled bush flights to Maasai Mara, Amboseli, Samburu, and other parks typically have a strict luggage limit of 15 kg (33 lbs) per passenger in soft-sided bags. We can arrange excess luggage space or secure luggage storage in Nairobi upon request.",
          enabled: true,
        },
        {
          question: "How do I receive my electronic flight tickets?",
          answer:
            "Once your reservation is confirmed and ticketed, official e-tickets containing your booking reference (PNR), e-ticket numbers, and flight schedule will be sent directly to your email and WhatsApp.",
          enabled: true,
        },
        {
          question: "Can you assist with transfers between JKIA (NBO) and Wilson Airport (WIL)?",
          answer:
            "Yes! We provide private vehicle transfers between Jomo Kenyatta International Airport (JKIA) and Wilson Airport (WIL) timed perfectly for your connecting domestic safari flight.",
          enabled: true,
        },
        {
          question: "Can flight dates or passenger names be changed after booking?",
          answer:
            "Changes depend on the airline's fare rules. Most domestic and safari flight operators permit date adjustments subject to fare differences and change fees. Our team handles all re-booking on your behalf.",
          enabled: true,
        },
      ],
    },
  },
};
