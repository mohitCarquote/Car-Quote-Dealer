import React from "react";
import { quoteRows } from "../data";
import { useLang } from "../i18n";

const ROW_KEY = { "Ex-showroom": "qt_ex", "RTO": "qt_rto", "Insurance": "qt_ins", "Accessories": "qt_acc", "Discount": "qt_disc" };

export default function QuoteTable({ compact = false }) {
  const { t } = useLang();
  return <div className={`quote-table ${compact ? "compact" : ""}`}>
    <div className="quote-row quote-head"><span>{t("qt_head")}</span><span>{t("qt_d1")}</span><span>{t("qt_d2")}</span></div>
    {quoteRows.map(row => <div className="quote-row" key={row[0]}><span>{t(ROW_KEY[row[0]] || row[0])}</span>{row.slice(1).map((v, i) => <span key={i} className={row[0] === "Discount" ? "saving" : ""}>{v}</span>)}</div>)}
    <div className="quote-row quote-total"><strong>{t("qt_total")}</strong><strong>₹13,65,000</strong><strong>₹13,33,000</strong></div>
  </div>;
}
