import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, CalendarDays, UserRound, Mail, MessageSquareText, ShieldCheck, Zap, BadgeCheck, PencilLine, CarFront } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import StepProgress from "./StepProgress";
import { brands, cities, cars, modelsFor, modelInfo, lakh, officialUrl, FUEL_ORDER, TIMELINES } from "../data";
import { SUPABASE } from "../config";
import { variantFor, step2Ok } from "../quoteRules";
import { useLang } from "../i18n";

const T0 = Date.now(); // spam trap: real people take longer than 4 seconds to fill the form
const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIDE_CAR = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1100&q=80";


export default function QuoteWizard({ step, setStep, navigate, form, setForm }) {
  const { t } = useLang();
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ busy: false, msg: "" });
  const [trap, setTrap] = useState("");
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const model = modelInfo(form.brand, form.model);
  const fuels = model ? [...new Set(model.v.map(v => v[1]))].sort((a, b) => FUEL_ORDER.indexOf(a) - FUEL_ORDER.indexOf(b)) : [];
  const fuel = fuels.includes(form.fuel) ? form.fuel : (fuels.length === 1 ? fuels[0] : "");
  const variants = model && fuel ? model.v.filter(v => v[1] === fuel).sort((a, b) => a[3] - b[3]) : [];
  const variant = variantFor({ ...form, fuel });
  const gear = g => t(g === "Automatic" ? "f_Auto" : "f_" + g);

  const chooseBrand = name => setForm(p => ({ ...p, brand: name, model: "", fuel: "", variant: "" }));
  const chooseModel = name => setForm(p => ({ ...p, model: name, fuel: "", variant: "" }));
  const chooseFuel = f => setForm(p => ({ ...p, fuel: f, variant: "" }));

  const validateContact = () => {
    const next = {};
    if ((form.name || "").trim().length < 2) next.name = t("e_name");
    if (!PHONE.test(form.phone || "")) next.phone = t("e_phone");
    if (form.email && !EMAIL.test(form.email.trim())) next.email = t("e_email");
    if (!form.consent) next.terms = t("e_terms");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validateContact() || status.busy) return;
    if (trap || Date.now() - T0 < 4000) { navigate("submitted"); return; } // bots: pretend it worked
    const v = variantFor(form);
    if (!v) { setStep(2); return; }
    const other = form.city === "other";
    const row = {
      brand: form.brand, model: form.model, fuel: form.fuel, variant: v[0], transmission: v[2], price_national: v[3],
      consented_at: new Date().toISOString(), purchase_timeline: form.timeline, notes: (form.notes || "").trim() || null,
      state: other ? null : form.city.split("|")[0], city: other ? form.otherCity.trim() : form.city.split("|")[1],
      name: form.name.trim(), email: (form.email || "").trim() || null, phone: form.phone
    };
    setStatus({ busy: true, msg: t("sending") });
    try {
      const r = await fetch(`${SUPABASE.url}/rest/v1/${SUPABASE.table}`, { method: "POST", headers: { apikey: SUPABASE.key, Authorization: `Bearer ${SUPABASE.key}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) });
      if (!r.ok) throw new Error(String(r.status));
      setStatus({ busy: false, msg: "" });
      navigate("submitted");
    } catch (e) {
      setStatus({ busy: false, msg: t("fail") });
    }
  };

  const goNext = () => {
    if (step === 1) { if (form.brand && form.model) { setErrors({}); setStep(2); } else setErrors({ step: t("e_step1") }); }
    else if (step === 2) { if (fuel !== form.fuel) update("fuel", fuel); if (step2Ok({ ...form, fuel })) { setErrors({}); setStep(3); } else setErrors({ step: t("e_step2") }); }
    else submit();
  };

  // Always send buyers to the model's page on the manufacturer's site for features (no copied descriptions).
  const desc = model && <p className="model-note">{t("seeoff")} <a href={officialUrl(form.brand, form.model) || "#"} target="_blank" rel="noopener noreferrer">{t("offsite")}</a></p>;

  const labels = [t("lab1"), t("lab2"), t("lab3")];
  const photo = cars.find(c => c.brand === form.brand && c.model === form.model)?.image;
  const carCard = model && <div className="selected-car">
    <div className="mini-car">{photo ? <img src={photo} alt=""/> : <CarFront size={30}/>}</div>
    <div className="selected-car-text"><strong>{form.brand} {form.model}</strong>
      {variant && <span>{`${variant[0]} · ${gear(variant[2])} · ₹${lakh(variant[3])} ${t("lakh")}`}</span>}
      {desc}</div>
    <button type="button" className="change-btn" onClick={() => setStep(1)}>{t("change")} <PencilLine size={15}/></button>
  </div>;

  return <main className="wizard-page">
    <div className="wizard-bg" aria-hidden="true"><img src={SIDE_CAR} alt=""/></div>
    <div className="wizard-shell">
      <aside className="wizard-side">
        <span className="eyebrow">{t("w_eyebrow")}</span>
        <h1>{t("w_h1a")}<br/><em>{t("w_h1b")}</em> {t("w_h1c")}</h1>
        <p>{t("w_p")}</p>
        <span className="side-rule" aria-hidden="true"/>
        <ul className="side-trust">
          <li><ShieldCheck/><span><strong>{t("st1a")}</strong>{t("st1b")}</span></li>
          <li><Zap/><span><strong>{t("st2a")}</strong>{t("st2b")}</span></li>
          <li><BadgeCheck/><span><strong>{t("st3a")}</strong>{t("st3b")}</span></li>
        </ul>
      </aside>

      <div className="wizard-card">
        <StepProgress step={step} labels={labels}/>

        {step === 1 && <section className="wizard-content"><span className="eyebrow">{t("step_of", { n: step })}</span><h2>{t("s1_h")}</h2><p className="muted">{t("s1_p")}</p>
          <div className="brand-grid">{brands.map(b => <button key={b.name} className={`brand-option ${form.brand === b.name ? "selected" : ""}`} onClick={() => chooseBrand(b.name)} aria-pressed={form.brand === b.name}><span className="brand-symbol" style={{ color: b.color }}>{b.mark}</span><strong>{b.name}</strong>{form.brand === b.name && <span className="selected-tick"><Check size={12}/></span>}</button>)}</div>
          {form.brand && <><label className="field-label" htmlFor="wModel">{t("sel_model")}</label><select id="wModel" value={form.model} onChange={e => chooseModel(e.target.value)}><option value="">{t("c_model")}</option>{modelsFor(form.brand).map(m => <option key={m} value={m}>{m}</option>)}</select></>}
        </section>}

        {step === 2 && model && <section className="wizard-content"><span className="eyebrow">{t("step_of", { n: step })}</span><h2>{t("s2_h")}</h2><p className="muted">{t("s2_p")}</p>
          {carCard}
          <div className="field-grid">
            <div><span className="field-label">{t("fuel")}</span>
              <div className="choice-row">{fuels.map(f => <button key={f} className={`choice-pill ${fuel === f ? "active" : ""}`} aria-pressed={fuel === f} onClick={() => chooseFuel(f)}>{t("f_" + f)}</button>)}</div></div>
            <div><label className="field-label" htmlFor="wVariant">{t("variant")}</label>
              <select id="wVariant" value={variant ? form.variant : ""} disabled={!fuel} onChange={e => setForm(p => ({ ...p, fuel, variant: e.target.value }))}><option value="">{t("c_variant")}</option>{variants.map(v => <option key={v[0] + v[2]} value={`${v[0]}|${v[2]}`}>{`${v[0]} · ${gear(v[2])} · ₹${lakh(v[3])} ${t("lakh")}`}</option>)}</select></div>
            <div><label className="field-label" htmlFor="wCity"><MapPin size={15}/> {t("city")}</label>
              <select id="wCity" value={form.city || ""} onChange={e => update("city", e.target.value)}><option value="">{t("c_city")}</option>{cities.map(([s, c]) => <option key={c} value={`${s}|${c}`}>{t("city_" + c)}</option>)}<option value="other">{t("c_other")}</option></select>
              {form.city === "other" && <><label className="input-wrap"><MapPin/><input placeholder={t("other")} maxLength={60} autoComplete="address-level2" value={form.otherCity || ""} onChange={e => update("otherCity", e.target.value)}/></label><p className="soon-note">{t("soon")}</p></>}</div>
            <div><label className="field-label" htmlFor="wWhen"><CalendarDays size={15}/> {t("when")}</label>
              <select id="wWhen" value={form.timeline || ""} onChange={e => update("timeline", e.target.value)}><option value="">{t("c_when")}</option>{TIMELINES.map(k => <option key={k} value={k}>{t("w_" + k)}</option>)}</select></div>
          </div>
          <details className="price-help"><summary>{t("sum")}</summary><p>{t("exp")}</p></details>
        </section>}

        {step === 3 && <section className="wizard-content"><span className="eyebrow">{t("step_of", { n: step })}</span><h2>{t("s3_h")}</h2><p className="muted">{t("s3_p")}</p>
          {carCard}
          <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)}/></label></div>
          <div className="form-fields">
            <label className={`input-wrap ${errors.name ? "invalid" : ""}`}><UserRound/><input placeholder={t("ph_name")} autoComplete="name" maxLength={80} value={form.name || ""} onChange={e => update("name", e.target.value)}/></label>{errors.name && <span className="field-error">{errors.name}</span>}
            <label className={`input-wrap ${errors.phone ? "invalid" : ""}`}><WhatsAppIcon size={17}/><span className="cc">+91</span><input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={t("ph_phone")} value={form.phone || ""} onChange={e => { let d = e.target.value.replace(/\D/g, ""); if (d.length > 10 && d.startsWith("91")) d = d.slice(2); update("phone", d.slice(0, 10)); }}/></label>{errors.phone && <span className="field-error">{errors.phone}</span>}
            <label className={`input-wrap ${errors.email ? "invalid" : ""}`}><Mail/><input type="email" autoComplete="email" maxLength={120} placeholder={t("ph_email")} value={form.email || ""} onChange={e => update("email", e.target.value)}/></label>{errors.email && <span className="field-error">{errors.email}</span>}
            <label className="field-label" htmlFor="wNotes"><MessageSquareText size={15}/> {t("notes")}</label>
            <textarea id="wNotes" className="notes-box" rows={3} maxLength={500} placeholder={t("ph_notes")} value={form.notes || ""} onChange={e => update("notes", e.target.value)}/>
          </div>
          <label className="check-row"><input type="checkbox" checked={!!form.consent} onChange={e => update("consent", e.target.checked)}/> {t("consent_a")} <button type="button" className="link-btn" onClick={() => navigate("terms")}>{t("terms")}</button> {t("and")} <button type="button" className="link-btn" onClick={() => navigate("privacy")}>{t("privacy")}</button>.</label>{errors.terms && <span className="field-error">{errors.terms}</span>}
        </section>}

        {errors.step && !(step === 1 ? form.brand && form.model : step === 2 ? step2Ok({ ...form, fuel }) : true) && <p className="field-error step-error">{errors.step}</p>}
        {status.msg && <p className={`form-status ${status.busy ? "" : "err"}`} role="status">{status.msg}</p>}
        <div className="wizard-actions">
          <span className="privacy-note"><ShieldCheck size={18}/> {t("pnote")}</span>
          <div className="action-btns">
            {step > 1 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16}/> {t("back")}</button>}
            <button className="btn btn-primary" disabled={status.busy} onClick={goNext}>{step === 3 ? t("go") : t("next", { label: labels[step] })} <ArrowRight size={17}/></button>
          </div>
        </div>
      </div>
    </div>
  </main>;
}
