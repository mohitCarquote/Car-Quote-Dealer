import React from "react";
import { CarFront } from "lucide-react";
import { CONTACT_EMAIL } from "../pages";
import { useLang } from "../i18n";

export default function Footer({ navigate }) {
  const { t } = useLang();
  return <footer className="footer">
    <div className="footer-top">
      <button className="brand-lockup footer-brand" onClick={() => navigate("home")}><span className="brand-mark"><CarFront size={25}/></span><span>Car<span>Quote</span></span></button>
      <div className="footer-links"><button type="button" onClick={() => navigate("about")}>{t("f_about")}</button><button type="button" onClick={() => navigate("privacy")}>{t("f_privacy")}</button><button type="button" onClick={() => navigate("terms")}>{t("f_terms")}</button><a href={`mailto:${CONTACT_EMAIL}`}>{t("f_contact")}</a><button type="button" onClick={() => navigate("dealer")}>{t("f_dealer")}</button></div>
      <strong>{t("f_tag")}</strong>
    </div>
    <div className="footer-bottom">{t("f_copy")}</div>
  </footer>;
}
