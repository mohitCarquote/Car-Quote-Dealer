// Static content for footer pages. Rendered by screens/InfoPage.jsx.
export const CONTACT_EMAIL = "partners.carquote@gmail.com";
export const LAST_UPDATED = "21 November 2026";

export const pages = {
  about: {
    eyebrow: "ABOUT CARQUOTE",
    title: "Car buying, on your terms.",
    intro: "CarQuote helps buyers who have already chosen their car get competing on-road price quotes from nearby dealers, and compare them privately before sharing their contact details with anyone.",
    sections: [
      { heading: "Why we built CarQuote", body: ["Buying a car usually means visiting showroom after showroom, negotiating one dealer at a time and handing your phone number to everyone along the way. We think dealers should compete for your business, not the other way round."] },
      { heading: "How it works", body: ["Tell us the car, fuel type and city. Nearby dealers send their best on-road offers, which we share with you on WhatsApp. You compare each quote's full price breakdown and choose the dealer you prefer. Only that dealer receives your contact details."] },
      { heading: "Free for buyers", body: ["CarQuote is free for buyers. We work with dealers who want to reach buyers who have already chosen their car and asked for quotes."] }
    ]
  },
  privacy: {
    eyebrow: "LEGAL",
    title: "Privacy Policy",
    intro: "This Privacy Policy explains what personal data CarQuote collects, how we use it, and the choices you have. It is written with the Digital Personal Data Protection Act, 2023 (India) in mind.",
    sections: [
      { heading: "1. Data we collect", body: ["When you request quotes: your name, WhatsApp number, optional email address, and your car preferences (brand, model, fuel type, city and buying timeline).", "Automatically: basic technical data such as device type, browser and pages visited, used to keep the service working and secure."] },
      { heading: "2. How we use your data", body: ["To request and collect quotes from dealers near you for the car you selected.", "To send those quotes and service updates to you on WhatsApp or email.", "To share your contact details with the one dealer you choose, so they can take your purchase forward.", "To improve CarQuote and prevent fraud or misuse."] },
      { heading: "3. What dealers see", body: ["While dealers prepare quotes they see only your car preferences and city, never your name, number or email. Your contact details are shared only with the dealer you select."] },
      { heading: "4. Consent and your rights", body: ["We process your data based on the consent you give when you submit a quote request. You may withdraw consent, ask for a copy of your data, request correction, or ask us to delete it at any time by emailing us. Withdrawing consent does not affect processing that happened before."] },
      { heading: "5. Retention", body: ["We keep quote requests only as long as needed to provide the service and meet legal obligations, after which they are deleted or anonymised."] },
      { heading: "6. Security", body: ["We use reasonable technical and organisational safeguards to protect your data. No online service can be completely secure, so please contact us if you suspect any misuse."] },
      { heading: "7. Marketing", body: ["We do not sell your personal data and we do not pass your number to multiple dealers. We will not send you marketing messages without your consent."] },
      { heading: "8. Changes and contact", body: ["We may update this policy and will change the date above when we do. For privacy questions or requests, write to us at the email below."] }
    ]
  },
  terms: {
    eyebrow: "LEGAL",
    title: "Terms & Conditions",
    intro: "These terms govern your use of the CarQuote website and services. By submitting a quote request you agree to them.",
    sections: [
      { heading: "1. The service", body: ["CarQuote is a platform that collects on-road price quotes from independent car dealers and presents them to buyers for comparison. CarQuote is not a dealer and does not sell vehicles."] },
      { heading: "2. Quotes are from dealers", body: ["Prices, discounts, availability, delivery timelines and offers are provided by dealers and may change. Any purchase agreement is solely between you and the dealer you choose. Please verify all details with the dealer before making a payment."] },
      { heading: "3. Your responsibilities", body: ["Provide accurate information, use the service only for genuine car purchase enquiries, and do not misuse the platform or attempt to access it in unauthorised ways."] },
      { heading: "4. Fees", body: ["CarQuote is free for buyers. We may receive fees from registered dealers."] },
      { heading: "5. Liability", body: ["We work to keep the service accurate and available but provide it on an \"as is\" basis. To the extent permitted by law, CarQuote is not liable for the acts, omissions, products or services of any dealer, or for indirect or consequential losses."] },
      { heading: "6. Privacy", body: ["Your use of CarQuote is also governed by our Privacy Policy."] },
      { heading: "7. Changes and governing law", body: ["We may update these terms from time to time. These terms are governed by the laws of India."] }
    ]
  },
  dealer: {
    eyebrow: "FOR DEALERS",
    title: "Dealer Registration",
    intro: "Reach buyers who have already chosen their car and asked for quotes. Register your dealership to receive quote requests from customers in your city.",
    sections: [
      { heading: "Why partner with CarQuote", body: ["Buyers who have chosen the exact brand, model and variant they want.", "Requests filtered by brand and city, so you only quote where you can deliver.", "A fair, transparent comparison where your best offer wins."] },
      { heading: "How to register", body: ["Email us with your dealership name, brands you sell, city and showroom address, and a contact person with phone number. Our partnerships team will get back to you with the next steps."] }
    ],
    cta: { label: "Email partnerships team", subject: "Dealer registration" }
  }
};
