// GENERATED from src/lib/gems.ts by scripts/sync-shared.js. Do not edit here.
// Hidden gems and famous spots, each with a "feel" profile used by the Feel It experience.
// cost: 0 free · 1 under $5 · 2 under $25 · 3 more. crowd: 1 quiet · 2 some people · 3 busy.
import type { Vibe } from "./site";

export type Sound = "ocean" | "forest" | "city" | "market" | "waterfall" | "wind";
export interface Gem {
  id: string;
  c: string; // country ISO2
  name: string;
  area: string;
  kind: "hidden" | "popular";
  alt?: string; // the busier place this is a quieter alternative to
  vibes: Vibe[];
  cost: 0 | 1 | 2 | 3;
  desc: string;
  feel: { sound: Sound; crowd: 1 | 2 | 3; words: [string, string, string] };
}

const g = (id: string, c: string, name: string, area: string, kind: Gem["kind"], vibes: Vibe[], cost: Gem["cost"], desc: string, sound: Sound, crowd: 1 | 2 | 3, words: [string, string, string], alt?: string): Gem =>
  ({ id, c, name, area, kind, vibes, cost, desc, feel: { sound, crowd, words }, ...(alt ? { alt } : {}) });

export const GEMS: Gem[] = [
  // ---------- KENYA ----------
  g("ke-karura", "KE", "Karura Forest", "Nairobi", "hidden", ["nature", "reset"], 1, "A city forest with waterfalls, caves and bike trails, minutes from Westlands. Locals jog here; visitors rarely know it exists.", "forest", 1, ["green", "cool", "calm"]),
  g("ke-watamu", "KE", "Watamu", "Kilifi coast", "hidden", ["reset", "romance", "nature"], 0, "White sand, a marine park and turtles, without Diani's crowds. Go snorkelling at low tide.", "ocean", 1, ["turquoise", "slow", "salty"], "Diani Beach"),
  g("ke-crescent", "KE", "Crescent Island walking safari", "Lake Naivasha", "hidden", ["nature", "adventure"], 3, "Walk on foot among giraffes, zebras and wildebeest on a peninsula with no big predators.", "wind", 1, ["open", "quiet", "wild"]),
  // ---------- TANZANIA ----------
  g("tz-materuni", "TZ", "Materuni Waterfalls", "Near Moshi", "hidden", ["nature", "adventure"], 2, "A tall waterfall in Chagga coffee country. Pair it with a coffee farm visit where you roast your own beans.", "waterfall", 1, ["misty", "lush", "fresh"]),
  g("tz-chemka", "TZ", "Chemka Hot Springs", "Kikuletwa", "hidden", ["reset", "romance"], 2, "Warm, crystal-clear spring water under fig trees. Go on a weekday morning.", "forest", 2, ["clear", "warm", "dreamy"]),
  g("tz-forodhani", "TZ", "Forodhani night market", "Stone Town, Zanzibar", "popular", ["food", "culture"], 1, "Seafood skewers, Zanzibar pizza and sugarcane juice by the water at sunset.", "market", 3, ["smoky", "lively", "spicy"]),
  // ---------- RWANDA ----------
  g("rw-twin-lakes", "RW", "Twin lakes Burera and Ruhondo", "Musanze", "hidden", ["nature", "reset", "romance"], 1, "Two blue lakes framed by volcanoes. Few visitors make it past the gorilla trek, so you'll often have it to yourself.", "wind", 1, ["still", "blue", "vast"]),
  g("rw-nyungwe", "RW", "Nyungwe canopy walk", "Nyungwe Forest", "popular", ["nature", "adventure"], 3, "A suspension bridge high above ancient rainforest, with chimpanzees and colobus monkeys nearby.", "forest", 2, ["high", "green", "thrilling"]),
  // ---------- UGANDA ----------
  g("ug-sipi", "UG", "Sipi Falls", "Mount Elgon", "hidden", ["nature", "adventure"], 2, "Three waterfalls on the slopes of Mount Elgon, with abseiling and coffee tours.", "waterfall", 1, ["roaring", "green", "cool"]),
  g("ug-bunyonyi", "UG", "Lake Bunyonyi", "Kabale", "hidden", ["reset", "romance"], 1, "29 islands on a lake shaped by terraced hills. Canoe between them and swim; there are no crocodiles or hippos.", "wind", 1, ["misty", "peaceful", "soft"]),
  // ---------- ETHIOPIA ----------
  g("et-entoto", "ET", "Entoto Park", "Addis Ababa", "hidden", ["nature", "adventure"], 1, "Eucalyptus hills above the city with trails, zip lines and the best view of Addis.", "forest", 2, ["crisp", "high", "fresh"]),
  g("et-tana", "ET", "Lake Tana monasteries", "Bahir Dar", "popular", ["culture", "reset"], 2, "Boat to centuries-old island monasteries painted with vivid murals.", "wind", 1, ["ancient", "quiet", "golden"]),
  // ---------- EGYPT ----------
  g("eg-siwa", "EG", "Siwa Oasis", "Western Desert", "hidden", ["reset", "nature", "romance"], 1, "Palm groves, salt lakes you can float in, and desert hot springs near the Libyan border.", "wind", 1, ["silent", "salty", "starry"]),
  g("eg-dahab", "EG", "Dahab", "South Sinai", "hidden", ["adventure", "reset"], 1, "A laid-back Red Sea town for snorkelling, freediving and seaside cafés.", "ocean", 2, ["breezy", "easy", "blue"], "Sharm El Sheikh"),
  // ---------- MOROCCO ----------
  g("ma-essaouira", "MA", "Essaouira", "Atlantic coast", "hidden", ["reset", "food", "culture"], 1, "A whitewashed port town with sea breezes, fresh grilled fish and a calm, walkable medina.", "ocean", 2, ["windy", "white", "relaxed"], "Marrakech"),
  g("ma-akchour", "MA", "Akchour waterfalls", "Near Chefchaouen", "hidden", ["nature", "adventure"], 0, "Turquoise pools and a natural rock bridge on a riverside hike.", "waterfall", 2, ["cool", "wild", "bright"]),
  g("ma-jemaa", "MA", "Jemaa el-Fnaa", "Marrakech", "popular", ["food", "culture", "party"], 1, "The famous square fills with food stalls, musicians and storytellers at dusk.", "market", 3, ["electric", "smoky", "loud"]),
  // ---------- SENEGAL ----------
  g("sn-ngor", "SN", "Île de Ngor", "Dakar", "hidden", ["reset", "adventure"], 1, "A five-minute pirogue ride from Dakar to a tiny island with surf breaks and beach shacks.", "ocean", 2, ["sunny", "easy", "salty"]),
  g("sn-saloum", "SN", "Sine-Saloum Delta", "Fatick", "hidden", ["nature", "reset"], 2, "Mangroves, shell islands and fishing villages by pirogue.", "wind", 1, ["calm", "green", "endless"]),
  // ---------- GHANA ----------
  g("gh-wli", "GH", "Wli Waterfalls", "Volta Region", "hidden", ["nature", "adventure"], 1, "One of West Africa's tallest waterfalls, at the end of a forest hike with fruit bats overhead.", "waterfall", 1, ["roaring", "lush", "misty"]),
  g("gh-busua", "GH", "Busua Beach", "Western Region", "hidden", ["reset", "adventure"], 1, "A surf village with beginner waves, lobster dinners and a slow pace.", "ocean", 1, ["warm", "slow", "golden"], "Labadi Beach"),
  g("gh-jamestown", "GH", "Jamestown", "Accra", "popular", ["culture", "food"], 0, "Lighthouse views, boxing gyms, street art and Accra's oldest neighborhood.", "city", 3, ["gritty", "vibrant", "real"]),
  // ---------- NIGERIA ----------
  g("ng-erin-ijesha", "NG", "Erin Ijesha (Olumirin) Waterfalls", "Osun State", "hidden", ["nature", "adventure"], 1, "A seven-level waterfall you can climb, deep in the forest.", "waterfall", 2, ["wet", "wild", "green"]),
  g("ng-lekki-canopy", "NG", "Lekki Conservation Centre", "Lagos", "popular", ["nature", "adventure"], 2, "Africa's longest canopy walkway, with monkeys and peacocks, right in Lagos.", "forest", 2, ["high", "green", "buzzy"]),
  g("ng-obudu", "NG", "Obudu Mountain Resort", "Cross River", "hidden", ["romance", "reset", "nature"], 3, "Cool mountain air, a cable car and rolling grasslands on the Cameroon border.", "wind", 1, ["cool", "misty", "remote"]),
  // ---------- SOUTH AFRICA ----------
  g("za-kalk-bay", "ZA", "Kalk Bay", "Cape Peninsula", "hidden", ["food", "romance", "reset"], 1, "A fishing village with tidal pools, vintage shops and fish and chips on the harbor wall.", "ocean", 2, ["salty", "artsy", "cozy"], "V&A Waterfront"),
  g("za-coffee-bay", "ZA", "Coffee Bay and Hole in the Wall", "Wild Coast", "hidden", ["nature", "adventure"], 1, "Rolling green hills, Xhosa villages and a dramatic sea arch on the remote Wild Coast.", "ocean", 1, ["wild", "green", "free"]),
  g("za-table-mountain", "ZA", "Table Mountain", "Cape Town", "popular", ["nature", "adventure", "romance"], 2, "Hike up Platteklip Gorge or take the cable car for the view over Cape Town.", "wind", 3, ["epic", "breezy", "golden"]),
  // ---------- NAMIBIA ----------
  g("na-spitzkoppe", "NA", "Spitzkoppe", "Erongo", "hidden", ["nature", "adventure", "romance"], 1, "Granite peaks rising from the desert, rock arches and some of the darkest skies on Earth.", "wind", 1, ["silent", "red", "starry"]),
  g("na-kolmanskop", "NA", "Kolmanskop ghost town", "Lüderitz", "hidden", ["culture", "adventure"], 2, "A diamond-mining town slowly swallowed by sand dunes.", "wind", 1, ["eerie", "dusty", "golden"]),
  // ---------- MAURITIUS ----------
  g("mu-gris-gris", "MU", "Gris Gris Beach", "South coast", "hidden", ["nature", "romance"], 0, "Black cliffs and crashing waves on the wild south coast. A walk, not a swim.", "ocean", 1, ["wild", "windy", "dramatic"], "Flic en Flac"),
  g("mu-chamarel", "MU", "Chamarel Seven Coloured Earth", "Chamarel", "popular", ["nature", "culture"], 2, "Rolling dunes in seven colors, plus a waterfall and a rum distillery nearby.", "forest", 2, ["colorful", "soft", "warm"]),
  // ---------- CAPE VERDE ----------
  g("cv-paul", "CV", "Paul Valley", "Santo Antão", "hidden", ["nature", "adventure"], 0, "A deep green valley of sugarcane, mango trees and stone villages, best on foot.", "forest", 1, ["green", "steep", "peaceful"]),
  g("cv-tarrafal", "CV", "Tarrafal", "Santiago", "hidden", ["reset", "romance"], 0, "A calm, palm-lined bay with fishing boats, on the island most visitors skip.", "ocean", 1, ["calm", "sunny", "local"], "Santa Maria, Sal"),
  // ---------- INDONESIA (Bali) ----------
  g("id-tegallalang", "ID", "Tegallalang Rice Terraces", "Ubud", "popular", ["nature"], 1, "Bali's most photographed rice terraces. Go before 8am to beat the tour buses.", "forest", 3, ["green", "busy", "iconic"]),
  g("id-jatiluwih", "ID", "Jatiluwih Rice Terraces", "Tabanan", "hidden", ["nature", "reset"], 1, "UNESCO-listed terraces that stretch for kilometers in the cool hills, with far fewer people.", "forest", 1, ["vast", "cool", "calm"], "Tegallalang"),
  g("id-sidemen", "ID", "Sidemen Valley", "Karangasem", "hidden", ["nature", "reset"], 2, "Rice paddies and weaving villages with Mount Agung behind. Bali before the crowds.", "forest", 1, ["quiet", "green", "slow"], "Ubud"),
  g("id-tukad-cepung", "ID", "Tukad Cepung Waterfall", "Bangli", "hidden", ["nature"], 1, "A waterfall inside a narrow canyon where morning light comes through in beams.", "waterfall", 2, ["magical", "cool", "misty"]),
  g("id-nyang-nyang", "ID", "Nyang Nyang Beach", "Uluwatu", "hidden", ["reset", "romance"], 1, "A long, wild beach at the bottom of a steep path. Bring water; there's almost nothing there.", "ocean", 1, ["wild", "empty", "golden"], "Padang Padang"),
  g("id-atuh", "ID", "Atuh Beach", "Nusa Penida", "hidden", ["reset", "nature"], 1, "A sheltered bay with clear water, quieter than the famous Kelingking viewpoint.", "ocean", 2, ["clear", "sheltered", "blue"], "Kelingking"),
  g("id-canggu", "ID", "Batu Bolong", "Canggu", "popular", ["party"], 3, "Beginner surf, beanbag bars at sunset and Bali's busiest café strip.", "ocean", 3, ["social", "buzzy", "sunny"]),
  g("id-gianyar", "ID", "Gianyar Night Market", "Gianyar", "hidden", ["food", "party"], 1, "Babi guling, sate lilit and martabak for a few dollars. Go hungry.", "market", 3, ["smoky", "local", "tasty"], "Ubud restaurants"),
  // ---------- THAILAND ----------
  g("th-taladnoi", "TH", "Talad Noi street art lanes", "Bangkok", "hidden", ["culture", "party"], 0, "Old riverside lanes with shrines, workshops, murals and tiny cafés.", "city", 2, ["artsy", "old", "surprising"], "Khao San Road"),
  g("th-ortorkor", "TH", "Or Tor Kor Market", "Bangkok", "hidden", ["food"], 1, "A spotless fresh market with the best fruit in the city and a food court of curries.", "market", 2, ["fresh", "fragrant", "local"], "Chatuchak"),
  g("th-bangkrachao", "TH", "Bang Krachao bike ride", "Bangkok", "hidden", ["nature", "reset"], 1, "A green island in the river loop with raised bike paths through mangroves.", "forest", 1, ["green", "breezy", "calm"]),
  g("th-watphalat", "TH", "Wat Pha Lat jungle temple", "Chiang Mai", "hidden", ["reset", "culture"], 0, "A quiet temple by a waterfall on the old monk's trail up the mountain.", "waterfall", 1, ["peaceful", "mossy", "sacred"], "Doi Suthep"),
  g("th-stickyfalls", "TH", "Bua Thong Sticky Waterfall", "Chiang Mai", "hidden", ["nature", "adventure"], 0, "Limestone so grippy you can walk straight up the waterfall barefoot.", "waterfall", 2, ["playful", "wet", "sunny"]),
  g("th-lanta", "TH", "Koh Lanta Old Town", "Koh Lanta", "hidden", ["reset", "food"], 0, "Wooden stilt houses over the water and slow seafood lunches.", "ocean", 1, ["slow", "wooden", "salty"], "Koh Phi Phi"),
  g("th-railay", "TH", "Railay West Beach", "Krabi", "popular", ["romance", "nature"], 0, "White sand between limestone cliffs, reached only by longtail boat.", "ocean", 3, ["dramatic", "white", "warm"]),
  // ---------- PORTUGAL ----------
  g("pt-vitoria", "PT", "Miradouro da Vitória", "Porto", "hidden", ["romance"], 0, "A free viewpoint over Porto's rooftops and river, a few minutes from the busy center.", "city", 1, ["golden", "quiet", "pretty"], "Clérigos Tower"),
  g("pt-foz", "PT", "Foz do Douro coastal walk", "Porto", "hidden", ["reset", "romance"], 0, "Where the river meets the ocean: a long promenade, lighthouses and beach bars.", "ocean", 2, ["breezy", "open", "salty"]),
  g("pt-torel", "PT", "Jardim do Torel", "Lisbon", "hidden", ["reset", "romance"], 0, "A small hilltop garden with a city view and a summer pool. Mostly locals.", "city", 1, ["leafy", "sunny", "local"], "Santa Luzia viewpoint"),
  g("pt-cacilhas", "PT", "Cacilhas ferry sunset", "Lisbon", "hidden", ["romance", "food"], 1, "A 10-minute ferry across the river for seafood with a view back at Lisbon.", "ocean", 2, ["golden", "breezy", "tasty"], "Senhora do Monte viewpoint"),
  g("pt-capuchos", "PT", "Convento dos Capuchos", "Sintra", "hidden", ["reset", "culture"], 2, "A tiny 16th-century monastery lined with cork, hidden in the forest.", "forest", 1, ["mossy", "silent", "ancient"], "Pena Palace"),
  g("pt-belem", "PT", "Pastéis de Belém", "Lisbon", "popular", ["food"], 1, "The original custard tart bakery since 1837. The line moves fast.", "market", 3, ["sweet", "warm", "busy"]),
];

export const gemsFor = (country: string) => GEMS.filter((x) => x.c === country.toUpperCase());
export const gemById = (id: string) => GEMS.find((x) => x.id === id);
export const COST_LABEL = ["Free", "Under $5", "Under $25", "$25+"] as const;
export const CROWD_LABEL = ["", "Quiet", "Some people", "Busy"] as const;
