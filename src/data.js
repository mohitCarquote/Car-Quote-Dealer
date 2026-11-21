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

