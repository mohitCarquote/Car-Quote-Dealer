import React from "react";
export default function CarImage({ src, alt, className = "" }) {
  return <div className={`car-image ${className}`}>
    <img src={src} alt={alt} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} />
  </div>;
}
