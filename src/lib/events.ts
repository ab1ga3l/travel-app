// Festivals and events worth travelling for. Months are the usual timing; exact dates change
// every year, so the app links to a search for the current edition rather than promising dates.
export type EventTag = "music" | "culture" | "tech" | "sports" | "faith" | "food" | "nature";
export interface TravelEvent { name: string; country: string; city: string; months: number[]; tags: EventTag[]; blurb: string }

export const EVENTS: TravelEvent[] = [
  { name: "Detty December", country: "GH", city: "Accra", months: [12], tags: ["music", "culture"], blurb: "Concerts, beach parties and homecoming energy all month." },
  { name: "Detty December", country: "NG", city: "Lagos", months: [12], tags: ["music", "culture"], blurb: "Lagos goes all night: concerts, festivals and owambe season." },
  { name: "AfroFuture", country: "GH", city: "Accra", months: [12], tags: ["music", "culture"], blurb: "Music, art and fashion festival in late December." },
  { name: "Calabar Carnival", country: "NG", city: "Calabar", months: [12], tags: ["culture", "music"], blurb: "Africa's biggest street party, through December." },
  { name: "Chale Wote Street Art Festival", country: "GH", city: "Accra (Jamestown)", months: [8], tags: ["culture", "music"], blurb: "Street art, performance and music in Jamestown." },
  { name: "Felabration", country: "NG", city: "Lagos", months: [10], tags: ["music"], blurb: "A week of Afrobeat celebrating Fela Kuti." },
  { name: "Sauti za Busara", country: "TZ", city: "Stone Town, Zanzibar", months: [2], tags: ["music", "culture"], blurb: "East African music under the stars in Stone Town." },
  { name: "Lamu Cultural Festival", country: "KE", city: "Lamu", months: [11], tags: ["culture"], blurb: "Dhow races, Swahili poetry and donkey races." },
  { name: "Kwita Izina (gorilla naming)", country: "RW", city: "Musanze", months: [9], tags: ["nature", "culture"], blurb: "Rwanda names its baby gorillas in a national celebration." },
  { name: "Timkat (Epiphany)", country: "ET", city: "Gondar & Lalibela", months: [1], tags: ["faith", "culture"], blurb: "Processions and blessings around 19 January." },
  { name: "Meskel", country: "ET", city: "Addis Ababa", months: [9], tags: ["faith", "culture"], blurb: "Huge bonfire celebration around 27 September." },
  { name: "Fès Festival of World Sacred Music", country: "MA", city: "Fès", months: [5, 6], tags: ["music", "faith"], blurb: "Sacred music from around the world in the medina." },
  { name: "Mawazine", country: "MA", city: "Rabat", months: [6], tags: ["music"], blurb: "One of Africa's biggest music festivals." },
  { name: "Cape Town International Jazz Festival", country: "ZA", city: "Cape Town", months: [3, 4], tags: ["music"], blurb: "Africa's grandest jazz gathering." },
  { name: "Durban July", country: "ZA", city: "Durban", months: [7], tags: ["sports", "culture"], blurb: "Horse racing meets high fashion." },
  { name: "Two Oceans Marathon", country: "ZA", city: "Cape Town", months: [3, 4], tags: ["sports", "nature"], blurb: "Called the world's most beautiful marathon." },
  { name: "Kigali International Peace Marathon", country: "RW", city: "Kigali", months: [5, 6], tags: ["sports"], blurb: "Run Kigali's green hills." },
  { name: "Nyege Nyege Festival", country: "UG", city: "Jinja", months: [9, 11], tags: ["music"], blurb: "Four days of electronic and African underground music by the Nile." },
  { name: "Afro Nation Portugal", country: "PT", city: "Portimão", months: [7], tags: ["music"], blurb: "The world's biggest Afrobeats festival on the Algarve." },
  { name: "Africa Tech Summit", country: "KE", city: "Nairobi", months: [2], tags: ["tech"], blurb: "Founders, investors and operators from across African tech." },
  { name: "GITEX Africa", country: "MA", city: "Marrakech", months: [4, 5], tags: ["tech"], blurb: "Africa's largest tech and startup show." },
  { name: "Web Summit", country: "PT", city: "Lisbon", months: [11], tags: ["tech"], blurb: "Europe's giant tech conference." },
  { name: "Songkran", country: "TH", city: "Bangkok & Chiang Mai", months: [4], tags: ["culture", "music"], blurb: "Thai New Year water festival, 13–15 April." },
  { name: "Cherry blossom season", country: "JP", city: "Tokyo & Kyoto", months: [3, 4], tags: ["nature", "culture"], blurb: "Hanami picnics under the sakura." },
  { name: "Holi", country: "IN", city: "Across India", months: [3], tags: ["culture", "faith"], blurb: "The festival of colours." },
  { name: "Oktoberfest", country: "DE", city: "Munich", months: [9, 10], tags: ["food", "culture"], blurb: "Beer tents, Bavarian food and huge crowds." },
  { name: "Notting Hill Carnival", country: "GB", city: "London", months: [8], tags: ["music", "culture"], blurb: "Caribbean carnival on the August bank holiday weekend." },
  { name: "Dubai Shopping Festival", country: "AE", city: "Dubai", months: [12, 1], tags: ["culture", "food"], blurb: "Deals, fireworks and concerts over the new year." },
  { name: "Christmas markets", country: "DE", city: "Across Germany", months: [11, 12], tags: ["food", "culture"], blurb: "Mulled wine, lights and gifts from late November." },
];

export const eventSearchUrl = (e: TravelEvent) => `https://www.google.com/search?q=${encodeURIComponent(`${e.name} ${e.city} ${new Date().getFullYear()} dates tickets`)}`;
