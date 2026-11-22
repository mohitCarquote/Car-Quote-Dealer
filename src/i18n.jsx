import React, { createContext, useContext, useEffect, useState } from "react";

// English and Hindi. Legal pages and the sample quotes page stay in English.
const en = {
  nav_how: "How it Works", nav_cars: "Popular Cars", nav_faq: "FAQs", cta: "Get Quotes", menu: "Menu",
  hero_eyebrow: "A BETTER WAY TO BUY YOUR NEXT CAR", h1_1: "You've chosen", h1_2: "your car.", h1_3: "Now let dealers", h1_4: "compete.",
  hero_p: "Get on-road price quotes from dealers near you. Compare them privately and choose the best deal.",
  hero_cta: "Get free dealer quotes", hero_free: "Free for buyers", float_t: "Compare. Save. Drive.", float_s: "Better offers start here",
  q_brand: "01 / BRAND", q_model: "02 / MODEL", q_city: "03 / CITY", q_go: "Get my quotes", q_foot: "Your number stays private until you choose a dealer",
  c_brand: "Choose a brand", c_model: "Choose a model", c_city: "Choose your city", c_other: "Other city",
  pop_t: "Popular Cars", pop_s: "Get quotes from dealers in Surat and Navsari", from: "From ₹{p} lakh*", pop_note: "*Approx. ex-showroom price.",
  how_t: "How CarQuote Works", how_s: "A simple 4-step process",
  s1t: "Select your car", s1d: "Choose your exact brand, model and variant.",
  s2t: "Get dealer quotes", s2d: "We ask dealers near you and send you their quotes on WhatsApp.",
  s3t: "Compare privately", s3d: "Get every quote with a full price breakdown on WhatsApp, easy to compare.",
  s4t: "Choose your dealer", s4d: "Only your selected dealer gets your contact.",
  cmp_eyebrow: "MAKE EVERY RUPEE COUNT", cmp_h1: "One car. Multiple offers.", cmp_h2: "One smarter decision.",
  cmp_p: "See exactly what goes into your on-road price, line by line.", 
  ex_t: "Example Quote Comparison", ex_s: "Hyundai Creta · Surat", ex_n: "Sample numbers for illustration only.", lower: "Lower!",
  qt_head: "Price component", qt_d1: "Dealer 1", qt_d2: "Dealer 2", qt_total: "Total",
  qt_ex: "Ex-showroom", qt_rto: "RTO", qt_ins: "Insurance", qt_acc: "Accessories", qt_disc: "Discount",
  pv_t: "Your Privacy. Our Priority.", pv_s: "Your contact details are shared only with the dealer you choose.",
  pv1: "Shared only with your chosen dealer", pv2: "No spam calls", pv3: "Free for buyers",
  faq_eyebrow: "GOOD QUESTIONS", faq_t: "Before you take the wheel", faq_s: "A few things you might want to know.",
  fq1: "Is CarQuote free for buyers?", fa1: "Yes. CarQuote is completely free for buyers. You never pay us anything.",
  fq2: "Will all dealers call me?", fa2: "No. Dealers don't see your number. Only the dealer you choose gets your contact details.",
  fq3: "Do dealers see my number before I choose?", fa3: "No. We need your WhatsApp number to send you the quotes, but dealers see only the car you want and your city until you pick one of them.",
  fq4: "How soon will I get quotes?", fa4: "Usually within 24 to 48 hours, on WhatsApp.",
  fq5: "Which cities do you cover?", fa5: "Surat and Navsari for now. If you live elsewhere, leave your details and we'll tell you when we reach your city.",
  fq6: "What are ex-showroom and on-road prices?", fa6: "Ex-showroom is the price of the car at the showroom before anything is added. On-road is what you actually pay to drive it home: ex-showroom plus road tax, registration and insurance, plus any accessories, minus any discount. Dealers send you their on-road price.",
  cta_eyebrow: "YOUR NEXT CAR IS CLOSER", cta_t1: "Ready to get your", cta_t2: "best car deal?", cta_p: "Let nearby dealers compete for your business.", cta_b: "Get free quotes",
  back: "Back", w_eyebrow: "A BETTER WAY TO BUY YOUR NEXT CAR", w_h1: "Get your best deal.", w_h1a: "Get your", w_h1b: "best", w_h1c: "deal.", w_p: "Tell us a little about the car you want. We'll bring nearby dealers to you.",
  step: "Step {n}", of3: "of 3", lab1: "Choose Car", lab2: "Car Details", lab3: "Your Details", step_of: "STEP {n} / 3", next: "Next: {label}", change: "Change",
  st1a: "100% Free", st1b: "No charges", st2a: "Compare", st2b: "Top dealers", st3a: "Buy with", st3b: "confidence",
  s1_eyebrow: "STEP 01 / VEHICLE", s1_h: "Which car have you decided to buy?", s1_p: "Select your preferred brand and model.", sel_model: "Select model",
  s2_eyebrow: "STEP 02 / PREFERENCES", s2_h: "Make it the right fit.", s2_p: "A few details help dealers prepare an accurate quote.",
  fuel: "Fuel type", variant: "Variant (with ex-showroom price)", c_variant: "Choose a variant", approx: "Approx. ex-showroom price: ",
  sum: "What are ex-showroom and on-road prices?",
  exp: "Ex-showroom is the price of the car at the showroom before anything is added. On-road is what you actually pay to drive it home: ex-showroom plus road tax, registration and insurance, plus any accessories, minus any discount. Dealers will send you their on-road price.",
  asof: "Features as published by the manufacturer on {d}. Please confirm with the dealer.", seeoff: "For the full feature list, see the manufacturer's website.", offsite: "Official website",
  city: "Select city", other: "Your city", soon: "We're starting with Surat and Navsari. Leave your details and we'll let you know when we reach your city.",
  when: "When do you plan to buy?", c_when: "Choose a time",
  w_within_1_week: "Within 1 week", w_within_2_weeks: "Within 2 weeks", w_within_1_month: "Within 1 month", w_one_to_3_months: "In 1 to 3 months", w_not_sure: "Not sure yet",
  s3_eyebrow: "STEP 03 / CONTACT", s3_h: "Where should we send your quotes?", s3_p: "Your number is shared only with the dealer you choose.",
  ph_name: "Your full name", ph_phone: "10-digit WhatsApp number", ph_email: "Email address (optional)",
  notes: "Anything dealers should know? (optional)", ph_notes: "Exchange car, government employee, farmer, colour, finance or anything else",
  consent_a: "I agree to be contacted on WhatsApp about this request, and to the", terms: "Terms & Conditions", and: "and", privacy: "Privacy Policy",
  e_step1: "Please choose a brand and model.", e_step2: "Please choose the fuel, variant, city and when you plan to buy.",
  e_name: "Please enter your name.", e_phone: "Enter a valid 10-digit WhatsApp number.", e_email: "Enter a valid email address.", e_terms: "Please tick the box to continue.",
  sending: "Sending…", fail: "Could not send your request. Please check your internet and try again.",
  pnote: "Your information is safe with us", cont: "Continue", go: "Get my free quotes",
  tr1: "No buyer fees", tr2: "Private comparison", tr3: "No obligation to buy",
  lakh: "lakh", f_Auto: "Automatic", f_Manual: "Manual", f_Petrol: "Petrol", f_Diesel: "Diesel", f_CNG: "CNG", f_Electric: "Electric", f_Hybrid: "Hybrid",
  rs_eyebrow: "REQUEST RECEIVED", rs_h1: "You're one step closer", rs_h2: "to your new car.", rs_p: "We've received your request for a {car} in {city}.",
  next_t: "What happens next?", n1: "We ask dealers near you for their best on-road price.", n2: "We send you the quotes on WhatsApp within 24 to 48 hours.", n3: "Compare the prices and choose the dealer that works best for you.",
  wa_t: "Keep an eye on WhatsApp", wa_s: "Your quotes will arrive within 24 to 48 hours.", home: "Back to home",
  rs_priv: "Your details stay private until you choose a dealer.",
  f_about: "About", f_privacy: "Privacy Policy", f_terms: "Terms & Conditions", f_contact: "Contact", f_dealer: "Dealer Registration", f_tag: "Drive Smarter. Buy Better.", f_copy: "© 2026 CarQuote. All rights reserved.",
  city_Surat: "Surat", city_Navsari: "Navsari"
};

const hi = {
  nav_how: "यह कैसे काम करता है", nav_cars: "लोकप्रिय कारें", nav_faq: "सवाल-जवाब", cta: "कोटेशन पाएं", menu: "मेन्यू",
  hero_eyebrow: "अपनी अगली कार खरीदने का बेहतर तरीका", h1_1: "आपने अपनी", h1_2: "कार चुन ली है।", h1_3: "अब डीलरों को", h1_4: "मुकाबला करने दें।",
  hero_p: "अपने पास के डीलरों से ऑन-रोड कीमत के कोटेशन पाएं। उन्हें निजी तौर पर तुलना करें और सबसे अच्छी डील चुनें।",
  hero_cta: "मुफ्त डीलर कोटेशन पाएं", hero_free: "खरीदारों के लिए मुफ्त", float_t: "तुलना करें। बचाएं। चलाएं।", float_s: "बेहतर ऑफर यहीं से शुरू",
  q_brand: "01 / ब्रांड", q_model: "02 / मॉडल", q_city: "03 / शहर", q_go: "मेरे कोटेशन पाएं", q_foot: "डीलर चुनने तक आपका नंबर निजी रहता है",
  c_brand: "ब्रांड चुनें", c_model: "मॉडल चुनें", c_city: "अपना शहर चुनें", c_other: "दूसरा शहर",
  pop_t: "लोकप्रिय कारें", pop_s: "सूरत और नवसारी के डीलरों से कोटेशन पाएं", from: "₹{p} लाख से*", pop_note: "*लगभग एक्स-शोरूम कीमत।",
  how_t: "CarQuote कैसे काम करता है", how_s: "4 आसान कदम",
  s1t: "अपनी कार चुनें", s1d: "सही ब्रांड, मॉडल और वेरिएंट चुनें।",
  s2t: "डीलर कोटेशन पाएं", s2d: "हम आपके पास के डीलरों से पूछते हैं और उनके कोटेशन आपको WhatsApp पर भेजते हैं।",
  s3t: "निजी तौर पर तुलना करें", s3d: "हर कोटेशन पूरे कीमत ब्योरे के साथ WhatsApp पर पाएं, तुलना करना आसान।",
  s4t: "अपना डीलर चुनें", s4d: "सिर्फ आपके चुने हुए डीलर को आपका संपर्क मिलता है।",
  cmp_eyebrow: "हर रुपये का सही इस्तेमाल", cmp_h1: "एक कार। कई ऑफर।", cmp_h2: "एक समझदारी भरा फैसला।",
  cmp_p: "देखें कि आपकी ऑन-रोड कीमत में क्या-क्या शामिल है, हर हिस्सा अलग-अलग।", 
  ex_t: "कोटेशन तुलना का उदाहरण", ex_s: "Hyundai Creta · सूरत", ex_n: "ये आंकड़े सिर्फ उदाहरण के लिए हैं।", lower: "कम!",
  qt_head: "कीमत का हिस्सा", qt_d1: "डीलर 1", qt_d2: "डीलर 2", qt_total: "कुल",
  qt_ex: "एक्स-शोरूम", qt_rto: "RTO", qt_ins: "बीमा", qt_acc: "एक्सेसरीज़", qt_disc: "डिस्काउंट",
  pv_t: "आपकी निजता, हमारी प्राथमिकता।", pv_s: "आपकी संपर्क जानकारी सिर्फ उसी डीलर को दी जाती है जिसे आप चुनते हैं।",
  pv1: "सिर्फ आपके चुने डीलर के साथ साझा", pv2: "कोई स्पैम कॉल नहीं", pv3: "खरीदारों के लिए मुफ्त",
  faq_eyebrow: "आपके सवाल", faq_t: "गाड़ी चलाने से पहले", faq_s: "कुछ बातें जो आप जानना चाहेंगे।",
  fq1: "क्या CarQuote खरीदारों के लिए मुफ्त है?", fa1: "हाँ। CarQuote खरीदारों के लिए पूरी तरह मुफ्त है। आपको हमें कभी कुछ भी भुगतान नहीं करना पड़ता।",
  fq2: "क्या सभी डीलर मुझे कॉल करेंगे?", fa2: "नहीं। डीलरों को आपका नंबर नहीं दिखता। सिर्फ आपके चुने हुए डीलर को आपकी संपर्क जानकारी मिलती है।",
  fq3: "क्या चुनने से पहले डीलर मेरा नंबर देखते हैं?", fa3: "नहीं। कोटेशन भेजने के लिए हमें आपका WhatsApp नंबर चाहिए, लेकिन जब तक आप किसी डीलर को नहीं चुनते, डीलर सिर्फ आपकी पसंद की कार और शहर देखते हैं।",
  fq4: "कोटेशन कितनी जल्दी मिलेंगे?", fa4: "आमतौर पर 24 से 48 घंटे में, WhatsApp पर।",
  fq5: "आप किन शहरों में हैं?", fa5: "अभी सूरत और नवसारी में। अगर आप किसी और शहर में हैं, तो अपनी जानकारी छोड़ दें, हम आपके शहर में पहुंचने पर बताएंगे।",
  fq6: "एक्स-शोरूम और ऑन-रोड कीमत क्या होती है?", fa6: "एक्स-शोरूम शोरूम में कार की वह कीमत है जिसमें अभी कुछ नहीं जुड़ा होता। ऑन-रोड वह कीमत है जो आप कार घर ले जाने के लिए असल में चुकाते हैं: एक्स-शोरूम के साथ रोड टैक्स, रजिस्ट्रेशन और बीमा, एक्सेसरीज़ हों तो उनकी कीमत, और उसमें से डिस्काउंट घटाकर। डीलर आपको अपनी ऑन-रोड कीमत भेजते हैं।",
  cta_eyebrow: "आपकी अगली कार अब करीब है", cta_t1: "अपनी सबसे अच्छी", cta_t2: "कार डील के लिए तैयार?", cta_p: "पास के डीलरों को आपके लिए मुकाबला करने दें।", cta_b: "मुफ्त कोटेशन पाएं",
  back: "वापस", w_eyebrow: "अपनी अगली कार खरीदने का बेहतर तरीका", w_h1: "अपनी सबसे अच्छी डील पाएं।", w_h1a: "अपनी", w_h1b: "सबसे अच्छी", w_h1c: "डील पाएं।", w_p: "जो कार आप चाहते हैं उसके बारे में थोड़ा बताएं। हम पास के डीलरों को आप तक लाएंगे।",
  step: "कदम {n}", of3: "/ 3", lab1: "कार चुनें", lab2: "कार की जानकारी", lab3: "आपकी जानकारी", step_of: "कदम {n} / 3", next: "आगे: {label}", change: "बदलें",
  st1a: "100% मुफ्त", st1b: "कोई शुल्क नहीं", st2a: "तुलना करें", st2b: "बेहतरीन डीलर", st3a: "भरोसे के साथ", st3b: "खरीदें",
  s1_eyebrow: "कदम 01 / वाहन", s1_h: "आपने कौन सी कार खरीदने का फैसला किया है?", s1_p: "अपनी पसंद का ब्रांड और मॉडल चुनें।", sel_model: "मॉडल चुनें",
  s2_eyebrow: "कदम 02 / पसंद", s2_h: "सही विकल्प चुनें।", s2_p: "थोड़ी जानकारी से डीलर सही कोटेशन तैयार कर पाते हैं।",
  fuel: "ईंधन", variant: "वेरिएंट (एक्स-शोरूम कीमत के साथ)", c_variant: "वेरिएंट चुनें", approx: "लगभग एक्स-शोरूम कीमत: ",
  sum: "एक्स-शोरूम और ऑन-रोड कीमत क्या होती है?",
  exp: "एक्स-शोरूम शोरूम में कार की वह कीमत है जिसमें अभी कुछ नहीं जुड़ा होता। ऑन-रोड वह कीमत है जो आप कार घर ले जाने के लिए असल में चुकाते हैं: एक्स-शोरूम के साथ रोड टैक्स, रजिस्ट्रेशन और बीमा, एक्सेसरीज़ हों तो उनकी कीमत, और उसमें से डिस्काउंट घटाकर। डीलर आपको अपनी ऑन-रोड कीमत भेजेंगे।",
  asof: "सुविधाएँ निर्माता द्वारा {d} को प्रकाशित जानकारी के अनुसार हैं। कृपया डीलर से पुष्टि करें।", seeoff: "पूरी फ़ीचर सूची के लिए निर्माता की वेबसाइट देखें।", offsite: "आधिकारिक वेबसाइट",
  city: "शहर चुनें", other: "आपका शहर", soon: "हम सूरत और नवसारी से शुरू कर रहे हैं। अपनी जानकारी छोड़ दें, हम आपके शहर में पहुंचने पर आपको बताएंगे।",
  when: "आप कब खरीदना चाहते हैं?", c_when: "समय चुनें",
  w_within_1_week: "1 हफ्ते के अंदर", w_within_2_weeks: "2 हफ्तों के अंदर", w_within_1_month: "1 महीने के अंदर", w_one_to_3_months: "1 से 3 महीने में", w_not_sure: "अभी पक्का नहीं",
  s3_eyebrow: "कदम 03 / संपर्क", s3_h: "हम आपके कोटेशन कहाँ भेजें?", s3_p: "आपका नंबर सिर्फ उसी डीलर को दिया जाता है जिसे आप चुनते हैं।",
  ph_name: "आपका पूरा नाम", ph_phone: "10 अंकों का WhatsApp नंबर", ph_email: "ईमेल (वैकल्पिक)",
  notes: "डीलरों को कुछ और बताना है? (वैकल्पिक)", ph_notes: "एक्सचेंज कार, सरकारी कर्मचारी, किसान, रंग, फाइनेंस या कुछ और",
  consent_a: "मैं इस अनुरोध के बारे में WhatsApp पर संपर्क किए जाने के लिए सहमत हूँ, और", terms: "नियम और शर्तें", and: "तथा", privacy: "प्राइवेसी पॉलिसी",
  e_step1: "कृपया ब्रांड और मॉडल चुनें।", e_step2: "कृपया ईंधन, वेरिएंट, शहर और खरीदने का समय चुनें।",
  e_name: "कृपया अपना नाम लिखें।", e_phone: "सही 10 अंकों का WhatsApp नंबर डालें।", e_email: "सही ईमेल पता डालें।", e_terms: "आगे बढ़ने के लिए कृपया बॉक्स पर टिक करें।",
  sending: "भेजा जा रहा है…", fail: "आपका अनुरोध नहीं भेजा जा सका। कृपया इंटरनेट जांचें और फिर कोशिश करें।",
  pnote: "आपकी जानकारी सुरक्षित है", cont: "आगे बढ़ें", go: "मेरे मुफ्त कोटेशन पाएं",
  tr1: "खरीदारों से कोई फीस नहीं", tr2: "निजी तुलना", tr3: "खरीदने की कोई बाध्यता नहीं",
  lakh: "लाख", f_Auto: "ऑटोमैटिक", f_Manual: "मैनुअल", f_Petrol: "पेट्रोल", f_Diesel: "डीज़ल", f_CNG: "सीएनजी", f_Electric: "इलेक्ट्रिक", f_Hybrid: "हाइब्रिड",
  rs_eyebrow: "अनुरोध मिल गया", rs_h1: "आप अपनी नई कार से", rs_h2: "एक कदम और करीब हैं।", rs_p: "हमें {city} में {car} के लिए आपका अनुरोध मिल गया है।",
  next_t: "आगे क्या होगा?", n1: "हम आपके पास के डीलरों से उनकी सबसे अच्छी ऑन-रोड कीमत पूछते हैं।", n2: "हम 24 से 48 घंटे में WhatsApp पर आपको कोटेशन भेजते हैं।", n3: "कीमतों की तुलना करें और अपनी पसंद का डीलर चुनें।",
  wa_t: "WhatsApp पर नज़र रखें", wa_s: "आपके कोटेशन 24 से 48 घंटे में आएंगे।", home: "होम पर वापस जाएं",
  rs_priv: "डीलर चुनने तक आपकी जानकारी निजी रहती है।",
  f_about: "हमारे बारे में", f_privacy: "प्राइवेसी पॉलिसी", f_terms: "नियम और शर्तें", f_contact: "संपर्क", f_dealer: "डीलर रजिस्ट्रेशन", f_tag: "समझदारी से खरीदें, बेहतर चलाएं।", f_copy: "© 2026 CarQuote. सर्वाधिकार सुरक्षित।",
  city_Surat: "सूरत", city_Navsari: "नवसारी"
};

const DICT = { en, hi };
// Hindi is switched off for now: the site always shows English and the EN/हिं toggle is hidden.
// Set to true to bring Hindi back (translations below are kept).
export const HINDI_ENABLED = false;

const LangCtx = createContext({ lang: "en", setLang: () => {}, t: k => en[k] ?? k });

function initialLang() {
  if (!HINDI_ENABLED) return "en";
  try { const s = localStorage.getItem("lg"); if (s && DICT[s]) return s; } catch (e) { /* storage blocked */ }
  return (navigator.language || "").startsWith("hi") ? "hi" : "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const setLang = l => { setLangState(l); try { localStorage.setItem("lg", l); } catch (e) { /* storage blocked */ } };
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const t = (k, vars) => {
    let s = DICT[lang][k] ?? en[k] ?? k;
    if (vars) Object.entries(vars).forEach(([a, b]) => { s = s.replace(`{${a}}`, b); });
    return s;
  };
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
