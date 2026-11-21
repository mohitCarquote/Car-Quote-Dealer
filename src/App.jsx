import React, { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./screens/Home";
import { pages } from "./pages";
import { LangProvider } from "./i18n";
import { step2Ok } from "./quoteRules";

// Screens other than Home are loaded on demand, each in its own file.
const QuoteWizard = lazy(() => import("./components/QuoteWizard"));
const Submitted = lazy(() => import("./screens/Submitted"));
const InfoPage = lazy(() => import("./screens/InfoPage"));

export default function App() {
  return <LangProvider><Site/></LangProvider>;
}

// Screens are kept in memory only: the URL never changes, so a refresh always starts on Home
// and nobody can open a later form step directly. Browser Back/Forward still work within a visit.
const VISIT = Math.random().toString(36).slice(2);
const cleanUrl = () => window.location.pathname + window.location.search;

function Site() {
  const [route, setRoute] = useState("home");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ brand:"Maruti Suzuki", model:"", city:"", otherCity:"", fuel:"", variant:"", timeline:"", name:"", phone:"", email:"", notes:"", consent:false });

  useEffect(() => {
    window.history.replaceState({ visit: VISIT, route: "home", depth: 0 }, "", cleanUrl()); // also drops any old #/… from the address
    const onPop = e => {
      // History entries from before a refresh belong to an earlier visit: send those to Home.
      setRoute(e.state?.visit === VISIT ? e.state.route : "home");
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (next) => {
    if (next === "brand") setStep(1);
    if (next !== route) window.history.pushState({ visit: VISIT, route: next, depth: (window.history.state?.depth || 0) + 1 }, "", cleanUrl());
    setRoute(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Return to the previous screen of this visit (e.g. from the Terms page back to the form), else Home.
  const goBack = () => (window.history.state?.visit === VISIT && window.history.state.depth > 0 ? window.history.back() : navigate("home"));

  let page;
  if (route === "home") page = <Home navigate={navigate} form={form} setForm={setForm}/>;
  else if (["brand","details","contact"].includes(route)) {
    // Never show a later step without the earlier answers (e.g. after a page refresh).
    let currentStep = route === "brand" ? 1 : route === "details" ? 2 : 3;
    if (currentStep >= 2 && !(form.brand && form.model)) currentStep = 1;
    if (currentStep === 3 && !step2Ok(form)) currentStep = 2;
    page = <QuoteWizard step={currentStep} setStep={s => navigate(s === 1 ? "brand" : s === 2 ? "details" : "contact")} navigate={navigate} form={form} setForm={setForm}/>;
  } else if (route === "submitted") page = <Submitted navigate={navigate} form={form}/>;
  else if (pages[route]) page = <InfoPage key={route} page={pages[route]} onBack={goBack}/>;
  else page = <Home navigate={navigate} form={form} setForm={setForm}/>;

  const isWizard = ["brand","details","contact"].includes(route);
  return <div className="app-shell"><Navbar navigate={navigate} route={route} compact={isWizard || route === "submitted" || !!pages[route]}/><Suspense fallback={<main className="page-loading" aria-busy="true"/>}>{page}</Suspense>{!isWizard && <Footer navigate={navigate}/>}</div>;
}
