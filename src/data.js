import catalog from "./catalog.json";

// Full catalogue: brands -> models -> variants [name, fuel, gearbox, ex-showroom price, notes].
export { catalog };

const META = {
  "Maruti Suzuki": { mark: "MS", color: "#1d2939" },
  "Hyundai": { mark: "H", color: "#0755a5" },
  "Tata": { mark: "T", color: "#1454a2" },
  "Kia": { mark: "K", color: "#111827" },
  "Mahindra": { mark: "M", color: "#e43d30" },
  "Toyota": { mark: "TY", color: "#d62d32" }
};
export const brands = catalog.map(b => ({ name: b.n, models: b.m.map(m => m.n), ...(META[b.n] || { mark: b.n[0], color: "#1d2939" }) }));
export const modelsFor = brand => brands.find(b => b.name === brand)?.models || [];
export const modelInfo = (brand, model) => catalog.find(b => b.n === brand)?.m.find(m => m.n === model);
export const fromPrice = (brand, model) => { const m = modelInfo(brand, model); return m ? Math.min(...m.v.map(v => v[3])) : null; };
export const lakh = n => (n / 1e5).toFixed(2);
export const inr = n => "₹" + new Intl.NumberFormat("en-IN").format(n);

export const OFFICIAL = { "Maruti Suzuki": "https://www.marutisuzuki.com", "Hyundai": "https://www.hyundai.com/in", "Tata": "https://cars.tatamotors.com", "Mahindra": "https://auto.mahindra.com", "Kia": "https://www.kia.com/in", "Toyota": "https://www.toyotabharat.com" };

// Each model's own page on the manufacturer's site (checked Nov 2026). Models not listed fall back to OFFICIAL[brand].
export const MODEL_PAGES = {
  "Maruti Suzuki": { "S-Presso": "https://www.marutisuzuki.com/arena/s-presso", "Alto K10": "https://www.marutisuzuki.com/arena/alto-k10", "Celerio": "https://www.marutisuzuki.com/arena/celerio", "Wagon R": "https://www.marutisuzuki.com/arena/wagon-r", "Eeco": "https://www.marutisuzuki.com/arena/eeco", "Swift": "https://www.marutisuzuki.com/arena/swift", "Baleno": "https://www.nexaexperience.com/baleno", "Dzire": "https://www.marutisuzuki.com/arena/dzire", "Fronx": "https://www.nexaexperience.com/fronx", "Brezza": "https://www.marutisuzuki.com/arena/brezza", "Ertiga": "https://www.marutisuzuki.com/arena/ertiga", "Victoris": "https://www.marutisuzuki.com/arena/victoris", "Grand Vitara": "https://www.nexaexperience.com/grand-vitara", "XL6": "https://www.nexaexperience.com/xl6", "Jimny": "https://www.nexaexperience.com/jimny", "e Vitara": "https://www.nexaexperience.com/e-vitara", "Invicto": "https://www.nexaexperience.com/invicto" },
  "Hyundai": { "Grand i10 Nios": "https://www.hyundai.com/in/en/find-a-car/grand-i10-nios/highlights", "Exter": "https://www.hyundai.com/in/en/find-a-car/exter/highlights", "i20": "https://www.hyundai.com/in/en/find-a-car/i20/highlights", "Aura": "https://www.hyundai.com/in/en/find-a-car/aura/highlights", "Venue": "https://www.hyundai.com/in/en/find-a-car/venue/highlights", "i20 N Line": "https://www.hyundai.com/in/en/find-a-car/i20-n-line/highlights", "Bayon": "https://www.hyundai.com/in/en/find-a-car/bayon/highlights", "Venue N Line": "https://www.hyundai.com/in/en/find-a-car/venue-n-line/highlights", "Creta": "https://www.hyundai.com/in/en/find-a-car/creta/highlights", "Verna": "https://www.hyundai.com/in/en/find-a-car/verna/highlights", "Alcazar": "https://www.hyundai.com/in/en/find-a-car/alcazar/highlights", "Creta Electric": "https://www.hyundai.com/in/en/find-a-car/creta-electric/highlights", "Creta N Line": "https://www.hyundai.com/in/en/find-a-car/creta-n-line/highlights" },
  "Tata": { "Tiago": "https://tata.cars/tiago/ice.html", "Aeris": "https://tata.cars/aeris/ice.html", "Punch": "https://tata.cars/punch/ice.html", "Altroz": "https://tata.cars/altroz/ice.html", "Nexon": "https://tata.cars/nexon/ice.html", "Curvv": "https://tata.cars/curvv/ice.html", "Sierra": "https://tata.cars/sierra/ice.html", "Harrier": "https://tata.cars/harrier/ice.html", "Safari": "https://tata.cars/safari/ice.html", "Tiago EV": "https://tata.cars/tiago/ev.html", "Punch EV": "https://tata.cars/punch/ev.html", "Nexon EV": "https://tata.cars/nexon/ev.html", "Curvv EV": "https://tata.cars/curvv/ev.html", "Sierra EV": "https://tata.cars/sierra/ev.html", "Tigor EV": "https://tata.cars/tigor/ev.html", "Harrier EV": "https://ev.tata.cars/harrier/ev/overview.html" },
  "Mahindra": { "XUV 3XO": "https://auto.mahindra.com/suv/xuv3xo/X3XO.html", "Bolero": "https://auto.mahindra.com/suv/bolero/BOL.html", "Bolero Neo": "https://auto.mahindra.com/suv/bolero-neo/NEO.html", "Thar OG": "https://auto.mahindra.com/suv/thar/THRN.html", "Bolero Neo+": "https://auto.mahindra.com/suv/bolero-neo-plus/NEOP.html", "Thar ROXX": "https://auto.mahindra.com/suv/thar-roxx/TH5D.html", "Scorpio Classic": "https://auto.mahindra.com/suv/scorpio-classic/SCRC.html", "Scorpio-N": "https://auto.mahindra.com/suv/scorpio-n/SCN.html", "XUV 3XO EV": "https://auto.mahindra.com/suv/xuv3xo-ev.html", "XUV 7XO": "https://auto.mahindra.com/suv/xuv-7xo.html", "XUV400": "https://auto.mahindra.com/xuv400.html", "BE 6 SPORTEQ": "https://www.mahindraelectricsuv.com/esuv/be6sporteq.html", "XEV 9S": "https://www.mahindraelectricsuv.com/esuv/xev-9s.html", "XEV 9e": "https://www.mahindraelectricsuv.com/xev-9e" },
  "Kia": { "Sonet": "https://www.kia.com/in/our-vehicles/sonet/showroom.html", "Syros": "https://www.kia.com/in/our-vehicles/syros/showroom.html", "Carens": "https://www.kia.com/in/our-vehicles/carens/showroom.html", "Seltos": "https://www.kia.com/in/our-vehicles/seltos/showroom.html", "Carens Clavis": "https://www.kia.com/in/our-vehicles/carens-clavis/showroom.html", "Syros EV": "https://www.kia.com/in/our-vehicles/syros-ev/showroom.html", "Carens Clavis EV": "https://www.kia.com/in/our-vehicles/carens-clavis-ev/showroom.html", "Sorento": "https://www.kia.com/in/our-vehicles/sorento/showroom.html" },
  "Toyota": { "Glanza": "https://www.toyotabharat.com/showroom/glanza/", "Urban Cruiser Taisor": "https://www.toyotabharat.com/showroom/urbancruiser-taisor/", "Rumion": "https://www.toyotabharat.com/showroom/rumion/", "Urban Cruiser Hyryder": "https://www.toyotabharat.com/showroom/urbancruiser-hyryder/", "Innova Hycross": "https://www.toyotabharat.com/showroom/innova/", "Innova Crysta": "https://www.toyotabharat.com/showroom/innova-crysta/", "Urban Cruiser Ebella": "https://www.toyotabharat.com/showroom/urbancruiser-ebella/", "Hilux": "https://www.toyotabharat.com/showroom/hilux/", "Fortuner": "https://www.toyotabharat.com/showroom/fortuner/index-fortuner.html", "Fortuner Legender": "https://www.toyotabharat.com/showroom/fortuner/index-legender.html", "Camry": "https://www.toyotabharat.com/showroom/camry/" },
};
export const officialUrl = (brand, model) => MODEL_PAGES[brand]?.[model] || OFFICIAL[brand] || null;
export const FUEL_ORDER = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];

// We serve these cities for now. Anything else goes in as "other" with the city typed in.
export const cities = [["Gujarat", "Surat"], ["Gujarat", "Navsari"]];
export const TIMELINES = ["within_1_week", "within_2_weeks", "within_1_month", "one_to_3_months", "not_sure"];

// Car photos are placeholders for now (kept as they were); prices come from the catalogue.
export const cars = [
  { brand: "Maruti Suzuki", model: "Swift", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85" },
  { brand: "Tata", model: "Nexon", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=85" },
  { brand: "Hyundai", model: "Creta", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=85" },
  { brand: "Kia", model: "Sonet", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&q=85" },
  { brand: "Mahindra", model: "Scorpio-N", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=85" },
  { brand: "Toyota", model: "Innova Hycross", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=85" }
].map(c => ({ ...c, name: `${c.brand} ${c.model}`, from: fromPrice(c.brand, c.model) }));

export const quoteRows = [
  ["Ex-showroom", "₹12,00,000", "₹12,00,000"],
  ["RTO", "₹1,20,000", "₹1,20,000"],
  ["Insurance", "₹55,000", "₹48,000"],
  ["Accessories", "₹20,000", "₹10,000"],
  ["Discount", "−₹30,000", "−₹45,000"]
];

