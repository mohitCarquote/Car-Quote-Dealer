import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cars, lakh } from "../data";
import { useLang } from "../i18n";
import CarImage from "./CarImage";

// Arrows smoothly slide the row by one card; at either end they glide back round to the other end.
export default function PopularCars({ onSelect }) {
  const { t } = useLang();
  const track = useRef(null);

  const slide = dir => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector(".popular-card");
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0) : el.clientWidth;
    const atStart = el.scrollLeft <= 8; // the row rests a few px in because of its padding
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return <div className="popular-carousel">
    <button className="carousel-btn prev" onClick={() => slide(-1)} aria-label="Previous cars"><ChevronLeft size={26}/></button>
    <div className="car-grid" ref={track}>
      {cars.map(car => <button className="popular-card" key={car.name} onClick={() => onSelect(car)}>
        <CarImage src={car.image} alt={car.name}/>
        <div className="popular-info"><strong>{car.name}</strong><span>{car.from ? t("from", { p: lakh(car.from) }) : ""}</span></div>
      </button>)}
    </div>
    <button className="carousel-btn next" onClick={() => slide(1)} aria-label="Next cars"><ChevronRight size={26}/></button>
  </div>;
}
