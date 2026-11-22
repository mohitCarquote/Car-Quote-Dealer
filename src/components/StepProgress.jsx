import React from "react";
import { Check } from "lucide-react";

// Numbered stepper: circles joined by a line; finished steps show a tick, the line fills up to the current step.
export default function StepProgress({ step, labels }) {
  const fill = labels.length > 1 ? ((step - 1) / (labels.length - 1)) * 100 : 0;
  return <div className="stepper" role="progressbar" aria-valuemin={1} aria-valuemax={labels.length} aria-valuenow={step}>
    <span className="stepper-line" aria-hidden="true"><span style={{ width: `${fill}%` }}/></span>
    {labels.map((label, i) => {
      const state = i + 1 < step ? "done" : i + 1 === step ? "current" : "";
      return <div key={i} className={`stepper-item ${state}`} aria-current={state === "current" ? "step" : undefined}>
        <span className="stepper-dot">{state === "done" ? <Check size={13} strokeWidth={3}/> : i + 1}</span>
        <span className="stepper-label">{label}</span>
      </div>;
    })}
  </div>;
}
