import React, { useLayoutEffect, useRef, useState } from "react";

// Progress bar: empty on step 1, then the fill ends exactly under the current step's label
// (labels sit at the start, middle and end; widths differ per language, so measure them).
export default function StepProgress({ step, labels }) {
  const bar = useRef(null);
  const items = useRef([]);
  const [width, setWidth] = useState(step === 1 ? "0%" : `${(step / labels.length) * 100}%`);

  useLayoutEffect(() => {
    const measure = () => {
      if (step === 1) return setWidth("0%");
      const b = bar.current?.getBoundingClientRect();
      const label = items.current[step - 1];
      if (!b || !label) return;
      const range = document.createRange();
      range.selectNodeContents(label);
      const end = range.getBoundingClientRect().right - b.left;
      setWidth(step === labels.length ? "100%" : `${Math.min(100, (end / b.width) * 100)}%`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step, labels.join("|")]); // re-measure when the step or the label text (language) changes

  return <>
    <div className="progress" ref={bar} role="progressbar" aria-valuemin={1} aria-valuemax={labels.length} aria-valuenow={step}><span style={{ width }}/></div>
    <div className="step-labels">{labels.map((label, i) => <span key={i} ref={el => (items.current[i] = el)} className={i + 1 < step ? "done" : i + 1 === step ? "current" : ""}>{label}</span>)}</div>
  </>;
}
