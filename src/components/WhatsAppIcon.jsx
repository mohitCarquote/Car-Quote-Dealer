import React from "react";
import whatsappIcon from "../assets/whatsapp.svg";

export default function WhatsAppIcon({ size = 24 }) {
  return <img src={whatsappIcon} width={size} height={size} alt="" aria-hidden="true" style={{ flexShrink: 0 }} />;
}
