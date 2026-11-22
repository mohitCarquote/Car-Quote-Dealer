import React, { useEffect, useState } from "react";
import { CarFront, Menu, X } from "lucide-react";
import { useLang, HINDI_ENABLED } from "../i18n";

function LangToggle() {
  const { lang, setLang } = useLang();
  return <div className="lang-toggle" role="group" aria-label="Language">
    {[["en", "EN"], ["hi", "हिं"]].map(([k, l]) => <button key={k} type="button" aria-pressed={lang === k} onClick={() => setLang(k)}>{l}</button>)}
  </div>;
}

export default function Navbar({ navigate, route, compact = false }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]); // close the mobile menu whenever the screen changes
  const links = [["popular-cars", t("nav_cars")], ["how-it-works", t("nav_how")], ["faqs", t("nav_faq")]];
  const go = id => e => { e.preventDefault(); setOpen(false); navigate("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60); };
  return <header className={`site-nav ${route === "home" ? "over-hero" : ""} ${["brand", "details", "contact"].includes(route) ? "over-wizard" : ""}`}>
    <button className="brand-lockup" onClick={() => navigate("home")} aria-label="CarQuote home">
      <span className="brand-mark"><CarFront size={25}/></span><span>Car<span>Quote</span></span>
    </button>
    {!compact && <nav className="nav-links">{links.map(([id, label]) => <a key={id} href="/" onClick={go(id)}>{label}</a>)}</nav>}
    {HINDI_ENABLED && <LangToggle/>}
    <button className="btn btn-primary nav-cta" onClick={() => navigate("brand")}>{t("cta")} <span>→</span></button>
    <button className="mobile-menu" aria-label={t("menu")} aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? <X/> : <Menu/>}</button>
    {open && <nav className="mobile-nav">
      {links.map(([id, label]) => <a key={id} href="/" onClick={go(id)}>{label}</a>)}
      <button className="btn btn-primary full" onClick={() => { setOpen(false); navigate("brand"); }}>{t("cta")} →</button>
    </nav>}
  </header>;
}
