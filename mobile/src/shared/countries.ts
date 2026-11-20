// GENERATED from src/lib/countries.ts by scripts/sync-shared.js. Do not edit here.
// Country guides. Facts checked as of November 2026; always confirm with official sources before travel.
export type Region = "africa" | "asia" | "europe";
export interface Country {
  code: string; slug: string; name: string; region: Region; capital: string; currency: string;
  languages: string; plugs: string; bestMonths: number[]; okMonths: number[]; weather: string;
  moneyTip: string; dailyBudget: [number, number, number]; highlights: string[]; itinerary: string[] | null;
}
export const COUNTRIES: Country[] = [
 {
  "code": "KE",
  "slug": "kenya",
  "name": "Kenya",
  "region": "africa",
  "capital": "Nairobi",
  "currency": "KES · Kenyan shilling",
  "languages": "English, Swahili",
  "plugs": "G",
  "bestMonths": [
   1,
   2,
   7,
   8,
   9,
   10
  ],
  "okMonths": [
   6,
   12
  ],
  "weather": "Dry seasons Jan–Feb and Jun–Oct. Long rains Mar–May, short rains Nov. The Great Migration is usually in the Maasai Mara Jul–Oct.",
  "moneyTip": "M-Pesa mobile money is used almost everywhere. Visitors can get a tourist M-Pesa line at the airport.",
  "dailyBudget": [
   35,
   90,
   250
  ],
  "highlights": [
   "Maasai Mara safari",
   "Giraffe Centre and the elephant orphanage in Nairobi",
   "Diani Beach",
   "Lamu Old Town"
  ],
  "itinerary": [
   "Nairobi: Giraffe Centre and Sheldrick elephant orphanage",
   "Drive or fly to the Maasai Mara, afternoon game drive",
   "Full day in the Mara",
   "Morning game drive, visit a Maasai village",
   "Lake Naivasha boat ride and Hell's Gate cycling",
   "Fly to Ukunda for Diani Beach",
   "Beach day, snorkel at Kisite-Mpunguti"
  ]
 },
 {
  "code": "TZ",
  "slug": "tanzania",
  "name": "Tanzania",
  "region": "africa",
  "capital": "Dodoma",
  "currency": "TZS · Tanzanian shilling",
  "languages": "Swahili, English",
  "plugs": "D, G",
  "bestMonths": [
   1,
   2,
   6,
   7,
   8,
   9,
   10
  ],
  "okMonths": [
   12
  ],
  "weather": "Dry Jun–Oct is best for safari. Jan–Feb is calving season in the southern Serengeti. Long rains Mar–May.",
  "moneyTip": "US dollars (2009 or newer, clean notes) are widely accepted for safaris and park fees.",
  "dailyBudget": [
   35,
   90,
   300
  ],
  "highlights": [
   "Serengeti",
   "Ngorongoro Crater",
   "Zanzibar's Stone Town",
   "Kilimanjaro"
  ],
  "itinerary": [
   "Arrive Arusha, rest",
   "Tarangire National Park: elephants and baobabs",
   "Drive into the Serengeti",
   "Full day in the Serengeti",
   "Ngorongoro Crater",
   "Fly to Zanzibar, explore Stone Town",
   "Nungwi or Paje beach"
  ]
 },
 {
  "code": "RW",
  "slug": "rwanda",
  "name": "Rwanda",
  "region": "africa",
  "capital": "Kigali",
  "currency": "RWF · Rwandan franc",
  "languages": "Kinyarwanda, English, French",
  "plugs": "C, J",
  "bestMonths": [
   1,
   2,
   6,
   7,
   8,
   9
  ],
  "okMonths": [
   12
  ],
  "weather": "Dry seasons Jun–Sep and Dec–Feb. Rainy Mar–May and Oct–Nov. Trails are muddy in the rain.",
  "moneyTip": "Cards work in Kigali; carry cash in rural areas. Gorilla permits cost US$1,500 and sell out early.",
  "dailyBudget": [
   40,
   90,
   250
  ],
  "highlights": [
   "Gorilla trekking in Volcanoes National Park",
   "Kigali Genocide Memorial",
   "Lake Kivu",
   "Akagera safari"
  ],
  "itinerary": [
   "Kigali Genocide Memorial and Kimironko market",
   "Drive to Musanze (about 2 h)",
   "Gorilla trek in Volcanoes National Park",
   "Lake Kivu at Rubavu",
   "Boat trip around Kibuye's islands",
   "Akagera National Park safari",
   "Kigali cafés and Inema Arts Center"
  ]
 },
 {
  "code": "UG",
  "slug": "uganda",
  "name": "Uganda",
  "region": "africa",
  "capital": "Kampala",
  "currency": "UGX · Ugandan shilling",
  "languages": "English, Swahili, Luganda",
  "plugs": "G",
  "bestMonths": [
   1,
   2,
   6,
   7,
   8,
   12
  ],
  "okMonths": [
   9
  ],
  "weather": "Dry Jun–Aug and Dec–Feb. Rain is possible all year in the forests.",
  "moneyTip": "Gorilla permits are US$800. Mobile money (MTN, Airtel) is common.",
  "dailyBudget": [
   30,
   70,
   200
  ],
  "highlights": [
   "Gorilla trekking in Bwindi",
   "White-water rafting in Jinja",
   "Murchison Falls",
   "Lake Bunyonyi"
  ],
  "itinerary": [
   "Entebbe: botanical gardens and Lake Victoria",
   "Jinja: source of the Nile, rafting",
   "Kampala markets and food",
   "Long drive to Bwindi",
   "Gorilla trek",
   "Lake Bunyonyi canoe",
   "Queen Elizabeth NP: tree-climbing lions in Ishasha"
  ]
 },
 {
  "code": "ET",
  "slug": "ethiopia",
  "name": "Ethiopia",
  "region": "africa",
  "capital": "Addis Ababa",
  "currency": "ETB · Ethiopian birr",
  "languages": "Amharic, English widely in cities",
  "plugs": "C, E, F, L",
  "bestMonths": [
   1,
   2,
   3,
   10,
   11,
   12
  ],
  "okMonths": [
   4,
   5
  ],
  "weather": "Dry Oct–Mar. Big rainy season Jun–Sep. Timkat festival is on Jan 19 (Jan 20 in leap years).",
  "moneyTip": "Carry cash; cards work mainly in big hotels. Ethiopian Airlines often gives discounted domestic flights if you fly in with them.",
  "dailyBudget": [
   25,
   60,
   150
  ],
  "highlights": [
   "Rock churches of Lalibela",
   "Simien Mountains",
   "Gondar's castles",
   "Coffee ceremonies"
  ],
  "itinerary": [
   "Addis Ababa: National Museum (Lucy) and Merkato",
   "Fly to Lalibela, rock churches",
   "Lalibela, sunrise at Asheton Maryam",
   "Fly to Gondar, castles",
   "Day trip to the Simien Mountains",
   "Bahir Dar: Lake Tana monasteries and Blue Nile Falls",
   "Back to Addis, coffee ceremony"
  ]
 },
 {
  "code": "EG",
  "slug": "egypt",
  "name": "Egypt",
  "region": "africa",
  "capital": "Cairo",
  "currency": "EGP · Egyptian pound",
  "languages": "Arabic, English in tourist areas",
  "plugs": "C, F",
  "bestMonths": [
   1,
   2,
   3,
   10,
   11,
   12
  ],
  "okMonths": [
   4
  ],
  "weather": "Best Oct–Apr. Summer (Jun–Aug) is extremely hot, especially in Luxor and Aswan.",
  "moneyTip": "Carry small notes for tips (baksheesh). Agree on taxi prices or use Uber/Careem in Cairo.",
  "dailyBudget": [
   25,
   60,
   150
  ],
  "highlights": [
   "Pyramids of Giza and the Grand Egyptian Museum",
   "Luxor's Valley of the Kings",
   "Abu Simbel",
   "Red Sea diving"
  ],
  "itinerary": [
   "Giza pyramids and the Grand Egyptian Museum",
   "Islamic Cairo and Khan el-Khalili bazaar",
   "Fly to Aswan, Philae Temple",
   "Early trip to Abu Simbel",
   "Felucca on the Nile, Nubian village",
   "Luxor: Karnak and Luxor temples",
   "Valley of the Kings, sunrise balloon ride"
  ]
 },
 {
  "code": "MA",
  "slug": "morocco",
  "name": "Morocco",
  "region": "africa",
  "capital": "Rabat",
  "currency": "MAD · Moroccan dirham",
  "languages": "Arabic, Amazigh, French",
  "plugs": "C, E",
  "bestMonths": [
   3,
   4,
   5,
   9,
   10,
   11
  ],
  "okMonths": [
   2,
   12
  ],
  "weather": "Spring and autumn are best. Summer is very hot inland; desert nights are cold in winter.",
  "moneyTip": "Cash is king in medinas. Bargaining is normal in souks; start at about a third of the first price.",
  "dailyBudget": [
   30,
   70,
   180
  ],
  "highlights": [
   "Marrakech medina",
   "Sahara desert camp in Merzouga",
   "Fes medina",
   "Chefchaouen, the blue town"
  ],
  "itinerary": [
   "Marrakech: Jemaa el-Fnaa and souks",
   "Jardin Majorelle, hammam",
   "Start a desert tour over the Atlas Mountains",
   "Camel ride and night in a Sahara camp",
   "Drive to Fes",
   "Fes medina and tanneries",
   "Chefchaouen"
  ]
 },
 {
  "code": "SN",
  "slug": "senegal",
  "name": "Senegal",
  "region": "africa",
  "capital": "Dakar",
  "currency": "XOF · West African CFA franc",
  "languages": "French, Wolof",
  "plugs": "C, D, E, K",
  "bestMonths": [
   1,
   2,
   3,
   4,
   11,
   12
  ],
  "okMonths": [
   5
  ],
  "weather": "Dry Nov–May. Rainy season Jul–Oct is hot and humid.",
  "moneyTip": "Wave and Orange Money mobile wallets are everywhere. CFA franc is pegged to the euro.",
  "dailyBudget": [
   35,
   80,
   180
  ],
  "highlights": [
   "Gorée Island",
   "Saint-Louis",
   "Sine-Saloum Delta",
   "Dakar's surf and music scene"
  ],
  "itinerary": [
   "Dakar: Plateau, Corniche and African Renaissance Monument",
   "Ferry to Gorée Island",
   "Lac Rose (pink lake)",
   "Drive to Saint-Louis",
   "Langue de Barbarie park by boat",
   "Sine-Saloum Delta mangroves",
   "Ngor Island and a Dakar night out"
  ]
 },
 {
  "code": "GH",
  "slug": "ghana",
  "name": "Ghana",
  "region": "africa",
  "capital": "Accra",
  "currency": "GHS · Ghanaian cedi",
  "languages": "English, Twi and others",
  "plugs": "D, G",
  "bestMonths": [
   1,
   2,
   3,
   11,
   12
  ],
  "okMonths": [
   8
  ],
  "weather": "Dry Nov–Mar, with hazy Harmattan winds Dec–Feb. Rains Apr–Jun and Sep–Oct. December is festival season and prices go up.",
  "moneyTip": "Mobile money (MTN MoMo) is widely used. Book December flights and stays early.",
  "dailyBudget": [
   35,
   80,
   200
  ],
  "highlights": [
   "Cape Coast and Elmina castles",
   "Kakum canopy walk",
   "Accra nightlife and Jamestown",
   "Kumasi's Kejetia market"
  ],
  "itinerary": [
   "Accra: Jamestown and Osu",
   "Kwame Nkrumah Memorial and Makola market",
   "Cape Coast Castle",
   "Kakum National Park canopy walk",
   "Elmina Castle and beach",
   "Kumasi: Kejetia market and Manhyia Palace",
   "Back to Accra, Labadi beach"
  ]
 },
 {
  "code": "NG",
  "slug": "nigeria",
  "name": "Nigeria",
  "region": "africa",
  "capital": "Abuja",
  "currency": "NGN · Nigerian naira",
  "languages": "English, Yoruba, Igbo, Hausa",
  "plugs": "D, G",
  "bestMonths": [
   1,
   2,
   11,
   12
  ],
  "okMonths": [
   3
  ],
  "weather": "Dry Nov–Feb. Rainy season Apr–Oct. December in Lagos is packed with concerts and events.",
  "moneyTip": "Cards and bank transfers work in cities. Many visitors use local fintech apps; always carry some cash.",
  "dailyBudget": [
   40,
   90,
   220
  ],
  "highlights": [
   "Lekki Conservation Centre canopy walk",
   "Nike Art Gallery",
   "Olumo Rock",
   "Lagos food and music"
  ],
  "itinerary": [
   "Lekki Conservation Centre canopy walk",
   "Nike Art Gallery and Lekki Arts market",
   "Boat to Tarkwa Bay beach",
   "Night at the New Afrika Shrine",
   "Day trip to Olumo Rock, Abeokuta",
   "Badagry slave route history",
   "Lagos food tour: jollof, suya, amala"
  ]
 },
 {
  "code": "ZA",
  "slug": "south-africa",
  "name": "South Africa",
  "region": "africa",
  "capital": "Pretoria",
  "currency": "ZAR · South African rand",
  "languages": "11 official languages, English widely",
  "plugs": "C, D, M, N",
  "bestMonths": [
   3,
   4,
   5,
   9,
   10,
   11
  ],
  "okMonths": [
   1,
   2,
   6,
   7,
   8,
   12
  ],
  "weather": "Cape Town is best Nov–Mar (dry summer). Kruger is best May–Sep (dry winter). Shoulder months are good for both.",
  "moneyTip": "Cards work almost everywhere. Use Uber or Bolt instead of hailing cars at night.",
  "dailyBudget": [
   40,
   90,
   220
  ],
  "highlights": [
   "Table Mountain and Cape Point",
   "Kruger safari",
   "Winelands",
   "Garden Route"
  ],
  "itinerary": [
   "Cape Town: Table Mountain and Bo-Kaap",
   "Boulders Beach penguins and Cape Point",
   "V&A Waterfront and Robben Island",
   "Stellenbosch and Franschhoek wine",
   "Fly to Kruger area",
   "Kruger game drives",
   "Panorama Route: God's Window and Blyde River Canyon"
  ]
 },
 {
  "code": "NA",
  "slug": "namibia",
  "name": "Namibia",
  "region": "africa",
  "capital": "Windhoek",
  "currency": "NAD · Namibian dollar (rand also accepted)",
  "languages": "English, Afrikaans, Oshiwambo",
  "plugs": "D, M",
  "bestMonths": [
   5,
   6,
   7,
   8,
   9,
   10
  ],
  "okMonths": [
   4,
   11
  ],
  "weather": "Dry May–Oct, cool nights. Hot Nov–Feb with some rain Jan–Mar.",
  "moneyTip": "Rand is accepted at the same value as the Namibian dollar, but Namibian dollars don't work in South Africa.",
  "dailyBudget": [
   45,
   110,
   250
  ],
  "highlights": [
   "Sossusvlei dunes and Deadvlei",
   "Etosha National Park",
   "Swakopmund",
   "Skeleton Coast"
  ],
  "itinerary": [
   "Windhoek",
   "Drive to Sossusvlei",
   "Dune 45 at sunrise and Deadvlei",
   "Swakopmund",
   "Sandwich Harbour 4x4 tour",
   "Drive to Etosha",
   "Etosha waterholes"
  ]
 },
 {
  "code": "MU",
  "slug": "mauritius",
  "name": "Mauritius",
  "region": "africa",
  "capital": "Port Louis",
  "currency": "MUR · Mauritian rupee",
  "languages": "English, French, Kreol",
  "plugs": "C, G",
  "bestMonths": [
   5,
   6,
   9,
   10,
   11,
   12
  ],
  "okMonths": [
   4,
   7,
   8
  ],
  "weather": "Cooler and drier May–Dec. Cyclone risk Jan–Mar.",
  "moneyTip": "Cards are widely accepted. Many resorts price in euros.",
  "dailyBudget": [
   50,
   120,
   300
  ],
  "highlights": [
   "Le Morne beach",
   "Chamarel Seven Coloured Earth",
   "Île aux Cerfs",
   "Black River Gorges"
  ],
  "itinerary": [
   "Grand Baie",
   "Catamaran to Île aux Cerfs",
   "Chamarel and Black River Gorges",
   "Le Morne beach and kitesurfing",
   "Port Louis central market",
   "Swim with dolphins at Tamarin (go with ethical operators)",
   "Beach day"
  ]
 },
 {
  "code": "CV",
  "slug": "cape-verde",
  "name": "Cape Verde",
  "region": "africa",
  "capital": "Praia",
  "currency": "CVE · Cape Verdean escudo",
  "languages": "Portuguese, Kriolu",
  "plugs": "C, F",
  "bestMonths": [
   1,
   2,
   3,
   4,
   5,
   11,
   12
  ],
  "okMonths": [
   6
  ],
  "weather": "Warm and dry most of the year. Light rains Aug–Oct.",
  "moneyTip": "Euros are accepted in many places; the escudo is pegged to the euro.",
  "dailyBudget": [
   40,
   90,
   200
  ],
  "highlights": [
   "Sal's Santa Maria beach",
   "Mindelo's music scene",
   "Hiking Santo Antão",
   "Floating in Pedra de Lume salt lake"
  ],
  "itinerary": [
   "Sal: Santa Maria beach",
   "Pedra de Lume salt lake and Buracona",
   "Kitesurf lesson",
   "Fly to São Vicente, Mindelo",
   "Ferry to Santo Antão, hike",
   "Santo Antão valleys",
   "Mindelo live music night"
  ]
 },
 {
  "code": "TH",
  "slug": "thailand",
  "name": "Thailand",
  "region": "asia",
  "capital": "Bangkok",
  "currency": "THB · Thai baht",
  "languages": "Thai",
  "plugs": "A, B, C, F, O",
  "bestMonths": [
   1,
   2,
   11,
   12
  ],
  "okMonths": [
   3,
   10
  ],
  "weather": "Cool and dry Nov–Feb. Hot Mar–May. Rainy Jun–Oct; the Gulf islands (Koh Samui) get rain Oct–Dec.",
  "moneyTip": "Cash for street food and markets. ATMs charge about 220 THB per foreign withdrawal.",
  "dailyBudget": [
   25,
   45,
   110
  ],
  "highlights": [
   "Bangkok temples",
   "Chiang Mai",
   "Krabi and Railay",
   "Island hopping"
  ],
  "itinerary": null
 },
 {
  "code": "ID",
  "slug": "indonesia",
  "name": "Indonesia",
  "region": "asia",
  "capital": "Jakarta",
  "currency": "IDR · Indonesian rupiah",
  "languages": "Indonesian",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   6,
   7,
   8,
   9,
   10
  ],
  "okMonths": [
   3,
   11
  ],
  "weather": "Dry Apr–Oct, wet Nov–Mar in Bali and Java.",
  "moneyTip": "Bali charges a tourist levy (IDR 150,000) paid online. Count zeros carefully: 100,000 IDR is about US$6.",
  "dailyBudget": [
   25,
   50,
   110
  ],
  "highlights": [
   "Bali",
   "Komodo",
   "Yogyakarta temples",
   "Gili Islands"
  ],
  "itinerary": null
 },
 {
  "code": "VN",
  "slug": "vietnam",
  "name": "Vietnam",
  "region": "asia",
  "capital": "Hanoi",
  "currency": "VND · Vietnamese dong",
  "languages": "Vietnamese",
  "plugs": "A, C, F",
  "bestMonths": [
   2,
   3,
   4,
   10,
   11
  ],
  "okMonths": [
   5,
   9,
   12
  ],
  "weather": "Weather varies a lot north to south. North is cool Dec–Feb; central coast has storms Sep–Nov; south is dry Dec–Apr.",
  "moneyTip": "Grab works for rides and food. Cash is still common.",
  "dailyBudget": [
   25,
   45,
   100
  ],
  "highlights": [
   "Ha Long Bay",
   "Hoi An",
   "Ho Chi Minh City",
   "Ha Giang loop"
  ],
  "itinerary": null
 },
 {
  "code": "MY",
  "slug": "malaysia",
  "name": "Malaysia",
  "region": "asia",
  "capital": "Kuala Lumpur",
  "currency": "MYR · Malaysian ringgit",
  "languages": "Malay, English widely",
  "plugs": "G",
  "bestMonths": [
   3,
   4,
   5,
   6,
   7,
   8
  ],
  "okMonths": [
   1,
   2,
   9
  ],
  "weather": "Hot all year. The east coast and its islands get the monsoon Nov–Feb.",
  "moneyTip": "Cards and e-wallets are common in cities. Grab is the main ride app.",
  "dailyBudget": [
   30,
   55,
   120
  ],
  "highlights": [
   "Kuala Lumpur",
   "Penang street food",
   "Langkawi",
   "Borneo rainforest"
  ],
  "itinerary": null
 },
 {
  "code": "SG",
  "slug": "singapore",
  "name": "Singapore",
  "region": "asia",
  "capital": "Singapore",
  "currency": "SGD · Singapore dollar",
  "languages": "English, Mandarin, Malay, Tamil",
  "plugs": "G",
  "bestMonths": [
   2,
   3,
   4,
   7,
   8
  ],
  "okMonths": [
   1,
   5,
   6,
   9,
   10
  ],
  "weather": "Hot and humid all year, with short heavy showers. Feb–Apr is usually driest.",
  "moneyTip": "Pay transit with your contactless card. Hawker centres are the cheapest great food.",
  "dailyBudget": [
   60,
   120,
   250
  ],
  "highlights": [
   "Gardens by the Bay",
   "Hawker centres",
   "Sentosa",
   "Little India and Kampong Glam"
  ],
  "itinerary": null
 },
 {
  "code": "PH",
  "slug": "philippines",
  "name": "Philippines",
  "region": "asia",
  "capital": "Manila",
  "currency": "PHP · Philippine peso",
  "languages": "Filipino, English",
  "plugs": "A, B, C",
  "bestMonths": [
   1,
   2,
   3,
   4,
   5,
   12
  ],
  "okMonths": [
   11
  ],
  "weather": "Dry Dec–May. Typhoon season is roughly Jul–Oct.",
  "moneyTip": "GCash is widely used. Carry cash on smaller islands.",
  "dailyBudget": [
   30,
   55,
   120
  ],
  "highlights": [
   "El Nido and Coron",
   "Siargao",
   "Bohol",
   "Cebu waterfalls"
  ],
  "itinerary": null
 },
 {
  "code": "JP",
  "slug": "japan",
  "name": "Japan",
  "region": "asia",
  "capital": "Tokyo",
  "currency": "JPY · Japanese yen",
  "languages": "Japanese",
  "plugs": "A, B",
  "bestMonths": [
   3,
   4,
   5,
   10,
   11
  ],
  "okMonths": [
   12,
   1,
   2
  ],
  "weather": "Cherry blossoms late Mar–early Apr. Rainy season in June. Hot and humid Jul–Aug. Autumn colors Nov.",
  "moneyTip": "Cash is still common in small places. A Suica or Pasmo card covers trains and convenience stores.",
  "dailyBudget": [
   60,
   120,
   250
  ],
  "highlights": [
   "Tokyo",
   "Kyoto temples",
   "Osaka food",
   "Hakone and Mount Fuji views"
  ],
  "itinerary": null
 },
 {
  "code": "KR",
  "slug": "south-korea",
  "name": "South Korea",
  "region": "asia",
  "capital": "Seoul",
  "currency": "KRW · South Korean won",
  "languages": "Korean",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   9,
   10,
   11
  ],
  "okMonths": [
   6,
   3
  ],
  "weather": "Spring Apr–May and autumn Sep–Nov are best. Monsoon Jul–Aug. Very cold Dec–Feb.",
  "moneyTip": "Cards work almost everywhere. Use a T-money card for transport.",
  "dailyBudget": [
   50,
   100,
   220
  ],
  "highlights": [
   "Seoul palaces and cafés",
   "Busan beaches",
   "Jeju Island",
   "Gyeongju history"
  ],
  "itinerary": null
 },
 {
  "code": "IN",
  "slug": "india",
  "name": "India",
  "region": "asia",
  "capital": "New Delhi",
  "currency": "INR · Indian rupee",
  "languages": "Hindi, English, and many more",
  "plugs": "C, D, M",
  "bestMonths": [
   1,
   2,
   3,
   10,
   11,
   12
  ],
  "okMonths": [
   4
  ],
  "weather": "Cool and dry Oct–Mar for most of the country. Very hot Apr–Jun. Monsoon Jun–Sep.",
  "moneyTip": "UPI payments dominate; some apps now let foreign visitors use UPI. Carry cash for small shops.",
  "dailyBudget": [
   20,
   45,
   120
  ],
  "highlights": [
   "Taj Mahal",
   "Rajasthan",
   "Kerala backwaters",
   "Goa"
  ],
  "itinerary": null
 },
 {
  "code": "LK",
  "slug": "sri-lanka",
  "name": "Sri Lanka",
  "region": "asia",
  "capital": "Colombo (Sri Jayawardenepura Kotte)",
  "currency": "LKR · Sri Lankan rupee",
  "languages": "Sinhala, Tamil, English",
  "plugs": "D, G, M",
  "bestMonths": [
   1,
   2,
   3,
   4,
   12
  ],
  "okMonths": [
   7,
   8
  ],
  "weather": "South and west coasts and hill country are best Dec–Apr. The east coast is best May–Sep.",
  "moneyTip": "Tuk-tuk apps like PickMe avoid haggling.",
  "dailyBudget": [
   25,
   50,
   130
  ],
  "highlights": [
   "Sigiriya",
   "Ella train ride",
   "Galle Fort",
   "Yala safari"
  ],
  "itinerary": null
 },
 {
  "code": "AE",
  "slug": "united-arab-emirates",
  "name": "United Arab Emirates",
  "region": "asia",
  "capital": "Abu Dhabi",
  "currency": "AED · UAE dirham",
  "languages": "Arabic, English widely",
  "plugs": "C, D, G",
  "bestMonths": [
   1,
   2,
   3,
   11,
   12
  ],
  "okMonths": [
   4,
   10
  ],
  "weather": "Pleasant Nov–Mar. Summer often passes 40°C.",
  "moneyTip": "Cards work everywhere. Metro in Dubai uses the Nol card.",
  "dailyBudget": [
   60,
   130,
   300
  ],
  "highlights": [
   "Dubai",
   "Abu Dhabi's Sheikh Zayed Grand Mosque",
   "Desert safari",
   "Louvre Abu Dhabi"
  ],
  "itinerary": null
 },
 {
  "code": "CN",
  "slug": "china",
  "name": "China",
  "region": "asia",
  "capital": "Beijing",
  "currency": "CNY · Chinese yuan",
  "languages": "Mandarin",
  "plugs": "A, C, I",
  "bestMonths": [
   4,
   5,
   9,
   10
  ],
  "okMonths": [
   3,
   11
  ],
  "weather": "Spring and autumn are best. Avoid Golden Week (Oct 1–7) and Chinese New Year crowds.",
  "moneyTip": "Alipay and WeChat Pay run everything; both now let you link a foreign card. Many Google services are blocked.",
  "dailyBudget": [
   40,
   80,
   180
  ],
  "highlights": [
   "Great Wall",
   "Xi'an Terracotta Army",
   "Shanghai",
   "Guilin and Yangshuo"
  ],
  "itinerary": null
 },
 {
  "code": "PT",
  "slug": "portugal",
  "name": "Portugal",
  "region": "europe",
  "capital": "Lisbon",
  "currency": "EUR · Euro",
  "languages": "Portuguese",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   6,
   9,
   10
  ],
  "okMonths": [
   3,
   7,
   8
  ],
  "weather": "Mild spring and autumn. Hot and busy Jul–Aug, especially in the Algarve.",
  "moneyTip": "Cards work widely. Bread and olives on your table are charged if eaten.",
  "dailyBudget": [
   45,
   75,
   150
  ],
  "highlights": [
   "Lisbon",
   "Porto",
   "Sintra",
   "Algarve"
  ],
  "itinerary": null
 },
 {
  "code": "ES",
  "slug": "spain",
  "name": "Spain",
  "region": "europe",
  "capital": "Madrid",
  "currency": "EUR · Euro",
  "languages": "Spanish, Catalan, Basque, Galician",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   6,
   9,
   10
  ],
  "okMonths": [
   3,
   11
  ],
  "weather": "Spring and autumn are ideal. Inland cities are very hot in Jul–Aug.",
  "moneyTip": "Dinner starts late, around 9pm. Tipping is small and optional.",
  "dailyBudget": [
   50,
   90,
   180
  ],
  "highlights": [
   "Barcelona",
   "Seville",
   "Madrid",
   "Granada's Alhambra"
  ],
  "itinerary": null
 },
 {
  "code": "FR",
  "slug": "france",
  "name": "France",
  "region": "europe",
  "capital": "Paris",
  "currency": "EUR · Euro",
  "languages": "French",
  "plugs": "C, E",
  "bestMonths": [
   4,
   5,
   6,
   9,
   10
  ],
  "okMonths": [
   7,
   8,
   12
  ],
  "weather": "Spring and early autumn are best. Many locals holiday in August.",
  "moneyTip": "Service is included in restaurant prices. Book big museums online.",
  "dailyBudget": [
   70,
   130,
   250
  ],
  "highlights": [
   "Paris",
   "French Riviera",
   "Provence",
   "Loire Valley castles"
  ],
  "itinerary": null
 },
 {
  "code": "IT",
  "slug": "italy",
  "name": "Italy",
  "region": "europe",
  "capital": "Rome",
  "currency": "EUR · Euro",
  "languages": "Italian",
  "plugs": "C, F, L",
  "bestMonths": [
   4,
   5,
   6,
   9,
   10
  ],
  "okMonths": [
   3,
   11
  ],
  "weather": "Spring and autumn are best. Summer is hot and crowded in cities and on the coast.",
  "moneyTip": "Some places charge a cover (coperto). Validate train tickets before boarding regional trains.",
  "dailyBudget": [
   65,
   120,
   230
  ],
  "highlights": [
   "Rome",
   "Florence",
   "Amalfi Coast",
   "Venice"
  ],
  "itinerary": null
 },
 {
  "code": "GR",
  "slug": "greece",
  "name": "Greece",
  "region": "europe",
  "capital": "Athens",
  "currency": "EUR · Euro",
  "languages": "Greek",
  "plugs": "C, F",
  "bestMonths": [
   5,
   6,
   9,
   10
  ],
  "okMonths": [
   4,
   7,
   8
  ],
  "weather": "May–Jun and Sep–Oct are warm with fewer crowds. Many island services slow down Nov–Mar.",
  "moneyTip": "Ferries sell out in summer; book ahead. Many islands still prefer cash.",
  "dailyBudget": [
   50,
   90,
   180
  ],
  "highlights": [
   "Athens",
   "Santorini",
   "Milos",
   "Crete"
  ],
  "itinerary": null
 },
 {
  "code": "NL",
  "slug": "netherlands",
  "name": "Netherlands",
  "region": "europe",
  "capital": "Amsterdam",
  "currency": "EUR · Euro",
  "languages": "Dutch, English widely",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   6,
   7,
   8,
   9
  ],
  "okMonths": [
   10,
   12
  ],
  "weather": "Tulips mid-April. Mild summers. Expect rain any time.",
  "moneyTip": "Many places are card-only and some don't take foreign credit cards; a debit card helps.",
  "dailyBudget": [
   70,
   130,
   250
  ],
  "highlights": [
   "Amsterdam canals",
   "Keukenhof tulips",
   "Rotterdam",
   "Utrecht"
  ],
  "itinerary": null
 },
 {
  "code": "GB",
  "slug": "united-kingdom",
  "name": "United Kingdom",
  "region": "europe",
  "capital": "London",
  "currency": "GBP · Pound sterling",
  "languages": "English",
  "plugs": "G",
  "bestMonths": [
   5,
   6,
   7,
   8,
   9
  ],
  "okMonths": [
   4,
   10,
   12
  ],
  "weather": "Longest and warmest days May–Sep. Rain possible all year.",
  "moneyTip": "Tap your contactless card on London transport; it caps daily fares.",
  "dailyBudget": [
   75,
   140,
   280
  ],
  "highlights": [
   "London",
   "Edinburgh",
   "Scottish Highlands",
   "Cotswolds"
  ],
  "itinerary": null
 },
 {
  "code": "DE",
  "slug": "germany",
  "name": "Germany",
  "region": "europe",
  "capital": "Berlin",
  "currency": "EUR · Euro",
  "languages": "German",
  "plugs": "C, F",
  "bestMonths": [
   5,
   6,
   7,
   8,
   9,
   12
  ],
  "okMonths": [
   4,
   10
  ],
  "weather": "Warm May–Sep. Christmas markets run late Nov–Dec.",
  "moneyTip": "Cash is still used more than in nearby countries. Regional train passes can be good value.",
  "dailyBudget": [
   60,
   110,
   220
  ],
  "highlights": [
   "Berlin",
   "Munich and Bavaria",
   "Cologne",
   "Christmas markets"
  ],
  "itinerary": null
 },
 {
  "code": "TR",
  "slug": "turkiye",
  "name": "Türkiye",
  "region": "europe",
  "capital": "Ankara",
  "currency": "TRY · Turkish lira",
  "languages": "Turkish",
  "plugs": "C, F",
  "bestMonths": [
   4,
   5,
   9,
   10,
   11
  ],
  "okMonths": [
   3,
   6
  ],
  "weather": "Spring and autumn are best. Coasts are hot Jul–Aug.",
  "moneyTip": "Prices change fast due to inflation; check current rates before you go.",
  "dailyBudget": [
   35,
   70,
   150
  ],
  "highlights": [
   "Istanbul",
   "Cappadocia balloon flights",
   "Pamukkale",
   "Turquoise Coast"
  ],
  "itinerary": null
 },
 {
  "code": "CZ",
  "slug": "czechia",
  "name": "Czechia",
  "region": "europe",
  "capital": "Prague",
  "currency": "CZK · Czech koruna",
  "languages": "Czech",
  "plugs": "C, E",
  "bestMonths": [
   5,
   6,
   9,
   12
  ],
  "okMonths": [
   4,
   7,
   8,
   10
  ],
  "weather": "Pleasant May–Sep. Christmas markets in December.",
  "moneyTip": "Decline 'pay in your home currency' at card machines; it costs more.",
  "dailyBudget": [
   45,
   80,
   160
  ],
  "highlights": [
   "Prague",
   "Český Krumlov",
   "Kutná Hora",
   "Brno"
  ],
  "itinerary": null
 }
];
export const REGIONS: { id: Region; name: string; blurb: string }[] = [
  { id: "africa", name: "Africa", blurb: "Start close to home: safaris, beaches, old cities and the easiest visas for African passports." },
  { id: "asia", name: "Asia", blurb: "Islands, street food and big cities, with many visa-on-arrival and eVisa options." },
  { id: "europe", name: "Europe", blurb: "Schengen, the UK and Türkiye. Plan your visa first, then the fun part." },
];
export const countryBySlug = (s: string) => COUNTRIES.find((c) => c.slug === s);
export const countryByCode = (c: string) => COUNTRIES.find((x) => x.code === c.toUpperCase());
