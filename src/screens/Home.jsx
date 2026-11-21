import React from "react";
import { ArrowRight, ArrowUpRight, Check, LockKeyhole, ShieldCheck, MessageCircle, BadgeCheck, CircleDollarSign, PhoneOff } from "lucide-react";
import { brands, cars, cities, modelsFor } from "../data";
import { useLang } from "../i18n";
import CarImage from "../components/CarImage";
import WhatsAppIcon from "../components/WhatsAppIcon";
import ShieldBadge from "../components/ShieldBadge";
import PopularCars from "../components/PopularCars";
import QuoteTable from "../components/QuoteTable";

export default function Home({ navigate, form, setForm }) {
  const { t } = useLang();
  const start = () => navigate(form.brand && form.model ? "details" : "brand");
  return <>
    <section className="hero">
      <div className="hero-bg" aria-hidden="true"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=85" alt="" fetchPriority="high"/></div>
      <div className="hero-glow"></div>
      <div className="hero-copy"><span className="eyebrow hero-eyebrow">{t("hero_eyebrow")}</span><h1>{t("h1_1")}<br/>{t("h1_2")}<br/><em>{t("h1_3")}<br/>{t("h1_4")}</em></h1><p>{t("hero_p")}</p><div className="hero-actions"><button className="btn btn-primary btn-large" onClick={() => navigate("brand")}>{t("hero_cta")} <ArrowRight size={18}/></button><span className="hero-assurance"><ShieldCheck size={16}/> {t("hero_free")}</span></div></div>
      <div className="hero-visual"><div className="hero-float"><span className="float-icon"><CircleDollarSign/></span><div><strong>{t("float_t")}</strong><span>{t("float_s")}</span></div></div></div>
      <div className="quick-search"><div className="quick-field"><span>{t("q_brand")}</span><select aria-label={t("q_brand")} value={form.brand} onChange={e => setForm(p => ({...p, brand:e.target.value, model:"", fuel:"", variant:""}))}><option value="">{t("c_brand")}</option>{brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</select></div><div className="quick-field"><span>{t("q_model")}</span><select aria-label={t("q_model")} value={form.model} onChange={e => setForm(p => ({...p, model:e.target.value, fuel:"", variant:""}))}><option value="">{t("c_model")}</option>{modelsFor(form.brand).map(m => <option key={m} value={m}>{m}</option>)}</select></div><div className="quick-field"><span>{t("q_city")}</span><select aria-label={t("q_city")} value={form.city} onChange={e => setForm(p => ({...p, city:e.target.value}))}><option value="">{t("c_city")}</option>{cities.map(([st, c]) => <option key={c} value={`${st}|${c}`}>{t("city_" + c)}</option>)}<option value="other">{t("c_other")}</option></select></div><button className="btn btn-primary quick-submit" onClick={start}>{t("q_go")} <ArrowRight size={17}/></button><div className="quick-foot"><LockKeyhole size={13}/> {t("q_foot")}</div></div>
    </section>
    <section className="section popular-section" id="popular-cars"><div className="section-heading lined-heading"><h2>{t("pop_t")}</h2><p>{t("pop_s")}</p></div><PopularCars onSelect={car => {setForm(p=>({...p,brand:car.brand,model:car.model,fuel:"",variant:""}));navigate("details");}}/><p className="pop-note">{t("pop_note")}</p></section>
    <section className="section process-section" id="how-it-works">
      <div className="section-heading lined-heading"><h2>{t("how_t")}</h2><p>{t("how_s")}</p></div>
      <div className="process-grid">{[
        {visual:<img className="process-car" src={cars[2].image} alt=""/>,title:t("s1t"),desc:t("s1d")},
        {visual:<WhatsAppIcon size={92}/>,title:t("s2t"),desc:t("s2d")},
        {visual:<div className="process-table" aria-hidden="true">{[0,1,2,3].map(r=><div key={r}><i/><b/><b/><b/></div>)}</div>,title:t("s3t"),desc:t("s3d")},
        {visual:<span className="process-check"><Check size={46} strokeWidth={3.2}/></span>,title:t("s4t"),desc:t("s4d")}
      ].map((item,i,all)=><div className="process-card" key={item.title}>
        <span className="process-number">{i+1}</span>
        <div className="process-visual">{item.visual}</div>
        <h3>{item.title}</h3><p>{item.desc}</p>
        {i < all.length-1 && <ArrowRight className="process-arrow" size={22} aria-hidden="true"/>}
      </div>)}</div>
    </section>
    <section className="section comparison-section"><div className="comparison-intro"><span className="eyebrow">{t("cmp_eyebrow")}</span><h2>{t("cmp_h1")}<br/><em>{t("cmp_h2")}</em></h2><p>{t("cmp_p")}</p></div><div className="compare-banner">
      <div className="compare-banner-copy"><h3>{t("ex_t")}</h3><span>{t("ex_s")}</span><small>{t("ex_n")}</small></div>
      <div className="compare-banner-car"><CarImage src={cars[2].image} alt="Hyundai Creta"/></div>
      <QuoteTable/>
    </div></section>
    <section className="privacy-band"><div className="privacy-lead"><ShieldBadge size={56}/><div><strong>{t("pv_t")}</strong><span>{t("pv_s")}</span></div></div><div className="privacy-points"><span><ShieldBadge size={26}/> {t("pv1")}</span><span><PhoneOff size={22} className="privacy-phone"/> {t("pv2")}</span><span><ShieldBadge size={26}/> {t("pv3")}</span></div></section>
    <section className="section faq-section" id="faqs"><div className="section-heading"><span className="eyebrow">{t("faq_eyebrow")}</span><h2>{t("faq_t")}</h2><p>{t("faq_s")}</p></div><div className="faq-list">{[1,2,3,4,5,6].map(i=>[t("fq"+i),t("fa"+i)]).map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div><div className="bottom-cta"><div><span className="eyebrow">{t("cta_eyebrow")}</span><h2>{t("cta_t1")} {t("cta_t2")}</h2><p>{t("cta_p")}</p></div><button className="btn btn-primary btn-large" onClick={() => navigate("brand")}>{t("cta_b")} <ArrowRight/></button></div></section>
  </>;
}
