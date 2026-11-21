import React from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { CONTACT_EMAIL, LAST_UPDATED } from "../pages";

export default function InfoPage({ page, onBack }) {
  const mailto = `mailto:${CONTACT_EMAIL}${page.cta ? `?subject=${encodeURIComponent(page.cta.subject)}` : ""}`;
  return <main className="info-page">
    <article className="info-card">
      <button className="back-link" onClick={onBack}><ArrowLeft size={17}/> Back</button>
      <span className="eyebrow">{page.eyebrow}</span>
      <h1>{page.title}</h1>
      {page.eyebrow === "LEGAL" && <span className="info-updated">Last updated: {LAST_UPDATED}</span>}
      <p className="info-intro">{page.intro}</p>
      {page.sections.map(s => <section key={s.heading}><h2>{s.heading}</h2>{s.body.map(p => <p key={p}>{p}</p>)}</section>)}
      {page.cta && <a className="btn btn-primary btn-large" href={mailto}><Mail size={18}/> {page.cta.label}</a>}
      <div className="info-contact">Questions? Write to us at <a href={mailto}>{CONTACT_EMAIL}</a></div>
    </article>
  </main>;
}
