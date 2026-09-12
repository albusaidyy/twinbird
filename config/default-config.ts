import type {
  AppConfig,
  TourItem,
  ExcursionItem,
  ExperienceItem,
  ExcursionScheduleItem,
} from "@/types/app-config";

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
    ctaLabel: "Explore Tours",
    ctaHref: "/tours",
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
 * Default wildlife safari and tour packages for Safari Tours Kenya.
 */
export const defaultTourItems: TourItem[] = [
  {
    id: "safari-maasai-mara-big-five-3day",
    enabled: true,
    deleted: false,
    slug: "maasai-mara-big-five-3day-wildlife-safari",
    href: "/tours/maasai-mara-big-five-3day-wildlife-safari",
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
    href: "/tours/amboseli-kilimanjaro-elephant-safari",
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
    href: "/tours/lake-nakuru-tsavo-rhino-wildlife-safari",
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
    appName: "Safari Tours Kenya",
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
      key: "home",
      href: "/",
      icon: "Home",
      label: "Home",
      enabled: true,
    },
    {
      key: "tours",
      href: "/tours",
      icon: "Compass",
      label: "Safari Tours",
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
      primaryCtaHref: "/tours",
      showPrimaryCta: true,
      primaryCtaLabel: "Explore Safari Packages",
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
      ctaHref: "/tours",
      enabled: true,
      ctaLabel: "Book Your Safari Now",
      headline: "Ready for the Adventure of a Lifetime?",
      subtitle:
        "Reserve your private 4x4 safari or customize a bespoke wildlife itinerary with our expert safari specialists today.",
      backgroundColor: "#1b4332",
    },
    footer: {
      contact: {
        email: "info@safaritourskenya.com",
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
            href: "/tours",
            label: "Safari Packages",
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
            href: "/tours/maasai-mara-big-five-3day-wildlife-safari",
            label: "Maasai Mara Big Five Safari",
            enabled: true,
          },
          {
            href: "/tours/amboseli-kilimanjaro-elephant-safari",
            label: "Amboseli Kilimanjaro Safari",
            enabled: true,
          },
          {
            href: "/tours/lake-nakuru-tsavo-rhino-wildlife-safari",
            label: "Lake Nakuru Rhino Sanctuary",
            enabled: true,
          },
          {
            href: "/tours",
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
          text: "Founded by dedicated Kenyan naturalists and bush trackers, Safari Tours Kenya was born from a singular passion: to deliver unforgettable wildlife encounters while championing ecosystem conservation and community empowerment. For our travelers, a game drive is more than sightseeing — it is an intimate connection with nature in its purest form.",
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
        href: "/tours",
        label: "Explore Safari Packages",
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
      email: "info@safaritourskenya.com",
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
    metaTitle: "Airport & Coast Transfer Services | Safari Tours Kenya",
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
        "Hello Safari Tours Kenya! I would like to inquire about booking a transfer.",
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
};
