// Quote form rules shared by the wizard and the app router (kept out of the wizard so the router stays light).
import { modelInfo } from "./data";

export const variantFor = form => {
  const m = modelInfo(form.brand, form.model);
  if (!m || !form.variant) return null;
  const [name, gear] = form.variant.split("|");
  return m.v.find(v => v[0] === name && v[2] === gear && v[1] === form.fuel) || null;
};
export const step2Ok = form => !!(variantFor(form) && form.city && (form.city !== "other" || (form.otherCity || "").trim().length > 1) && form.timeline);
