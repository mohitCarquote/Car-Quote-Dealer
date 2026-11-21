import React from "react";
import { Check, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { useLang } from "../i18n";

export default function Submitted({ navigate, form }) {
  const { t } = useLang();
  const city = form.city === "other" ? (form.otherCity || "") : t("city_" + ((form.city || "").split("|")[1] || ""));
  const car = `${form.brand} ${form.model}`;
  const [before, after] = t("rs_p").split("{car}");
  const withCity = s => s.split("{city}").flatMap((x, i) => i ? [<strong key={i}>{city}</strong>, x] : [x]);
  return <main className="status-page"><div className="status-card"><div className="success-orbit"><Check size={38}/></div><span className="eyebrow">{t("rs_eyebrow")}</span><h1>{t("rs_h1")}<br/>{t("rs_h2")}</h1><p>{withCity(before)}<strong>{car}</strong>{withCity(after)}</p><div className="status-next"><h3>{t("next_t")}</h3><div><span><Check/></span><p>{t("n1")}</p></div><div><span><Check/></span><p>{t("n2")}</p></div><div><span><Check/></span><p>{t("n3")}</p></div></div><div className="status-whatsapp"><WhatsAppIcon/><div><strong>{t("wa_t")}</strong><span>{t("wa_s")}</span></div></div><button className="text-link centered" onClick={() => navigate("home")}>{t("home")}</button><div className="status-privacy"><ShieldCheck size={15}/> {t("rs_priv")}</div></div></main>;
}
