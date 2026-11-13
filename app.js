/* Dealer Outreach Desk: talks to Supabase (tables: dealers, outreach_events, settings). */
const STATUSES = ["Not contacted", "Emailed", "Followed up", "Replied", "Meeting set", "Signed up", "Not interested"];
const BRAND_ORDER = ["Maruti Suzuki", "Hyundai", "Mahindra", "Kia", "Tata", "Toyota", "Honda", "Skoda", "Volkswagen", "MG", "Renault", "Nissan", "Jeep"];
const DIRECTORY_FIELDS = ["name", "legal_name", "brands", "cities", "showrooms", "emails", "phones", "website", "dealer_group", "gstin", "source", "notes"];
const ARRAY_FIELDS = ["brands", "cities", "emails", "phones"];
const ALIASES = { legalName: "legal_name", group: "dealer_group", contactName: "contact_name", lastContacted: "last_contacted" };
const TEMPLATES = {
  easy: { label: "Full version", subject: "Introducing {company}: new-car enquiries for {dealer}",
    body: "{greeting}\n\nI hope you are doing well. I'm {me}, **founder of {company}**. {company} connects people who are ready to buy a new car with dealers. Here is how it works:\n\n1. A buyer chooses the exact car they want: brand, model and variant, plus any notes such as colour or exchange.\n2. We send you that request on WhatsApp.\n3. You reply with your on-road price, discount, accessories included and delivery time.\n4. We pass your quote to the buyer. If they choose you, you get their contact details.\n\nEvery request is a chance for you to **win a new customer**.\n\nWe are starting with a few dealers for each brand, and I'd like to walk you through this properly and hear what you think.\n\nWould you be open to a 30-minute call this week or next? Please reply with a day and time that suits you.\n\nThank you,\n{me}\nFounder, {company}" },
  demand: { label: "Short version", subject: "Introducing {company}: new-car enquiries for {dealer}",
    body: "{greeting}\n\nI hope you are doing well. I'm {me}, **founder of {company}**. We send dealers requests from car buyers who have already chosen the exact car and variant. You reply with your on-road price on WhatsApp, and if the buyer chooses you, you get their contact details. Every request is a chance for you to **win a new customer**.\n\nI'd like to explain how it works and hear what you think. Would you be open to a 30-minute call this week or next? Please reply with a day and time that suits you.\n\nThank you,\n{me}\nFounder, {company}" },
  follow: { label: "Follow-up", subject: "Following up on my introduction, {company}",
    body: "{greeting}\n\nI'm following up on my earlier email introducing {company}. We send dealers requests from car buyers who have already chosen the exact car and variant.\n\nI'd be glad to explain how it works in a 30-minute call. If that suits you, please reply with a day and time.\n\nThank you,\n{me}\nFounder, {company}" }
};

const state = { dealers: [], settings: {}, city: "All", brand: "All", status: "All", emailOnly: false, q: "" };
let sb = null, user = null, current = null, editing = null, delArmed = false, importPlan = null;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const arr = v => Array.isArray(v) ? v : (v ? [v] : []);
const split = s => String(s || "").split(",").map(x => x.trim()).filter(Boolean);
const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2800); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Copied"); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copied"); } catch (_) { toast("Select the text and copy it"); } ta.remove(); }
}
function waLink(p) { const d = String(p).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""); return /^[6-9]\d{9}$/.test(d) ? "https://wa.me/91" + d : null; }
function fmtDate(iso) { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function brandRank(d) { const i = BRAND_ORDER.indexOf(arr(d.brands)[0] || ""); return i < 0 ? 99 : i; }
function show(view) { ["setupView", "signinView", "appView"].forEach(id => document.getElementById(id).hidden = id !== view); }
function errText(error) { return (error && (error.message || error.details)) || "Something went wrong"; }

/* ---------- Data ---------- */
async function loadDealers() {
  const { data, error } = await sb.from("dealers").select("*").order("name");
  if (error) { $("#list").innerHTML = `<div class="empty"><h3>Couldn’t load dealers</h3><p class="hint">${esc(errText(error))}</p></div>`; return; }
  state.dealers = data || []; render();
}
async function loadSettings() {
  const { data } = await sb.from("settings").select("*").maybeSingle();
  state.settings = data || {};
}
const senderEmail = () => (user && user.email) || "";
function patchLocal(id, fields) { const d = state.dealers.find(x => x.id === id); if (d) Object.assign(d, fields); render(); }

/* ---------- Rendering ---------- */
function visible() {
  const q = state.q.toLowerCase();
  return state.dealers.filter(d =>
    (state.city === "All" || arr(d.cities).includes(state.city)) &&
    (state.brand === "All" || arr(d.brands).includes(state.brand)) &&
    (state.status === "All" || d.status === state.status) &&
    (!state.emailOnly || arr(d.emails).length) &&
    (!q || [d.name, d.legal_name, d.showrooms, d.dealer_group, ...arr(d.emails)].join(" ").toLowerCase().includes(q))
  ).sort((a, b) => brandRank(a) - brandRank(b) || (arr(b.emails).length > 0) - (arr(a.emails).length > 0) || String(a.name).localeCompare(String(b.name)));
}
function renderFilters() {
  const cityCount = {};
  state.dealers.forEach(d => arr(d.cities).forEach(c => cityCount[c] = (cityCount[c] || 0) + 1));
  const main = ["Navsari", "Surat", "Valsad", "Vapi"];
  const cities = ["All", ...main.filter(c => cityCount[c]), ...Object.keys(cityCount).filter(c => !main.includes(c)).sort()];
  if (state.city !== "All" && !cityCount[state.city]) state.city = "All";
  $("#cities").innerHTML = cities.map(c => `<button class="city" data-city="${esc(c)}" aria-pressed="${state.city === c}">${esc(c)} <span class="n">${c === "All" ? state.dealers.length : cityCount[c]}</span></button>`).join("");
  const brands = [...new Set(state.dealers.flatMap(d => arr(d.brands)))].sort((a, b) => { const ia = BRAND_ORDER.indexOf(a), ib = BRAND_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b); });
  $("#fBrand").innerHTML = ["All", ...brands].map(b => `<option ${b === state.brand ? "selected" : ""}>${esc(b)}</option>`).join("");
  $("#fStatus").innerHTML = ["All", ...STATUSES].map(s => `<option ${s === state.status ? "selected" : ""}>${esc(s)}</option>`).join("");
}
function renderSummary(list) {
  const withEmail = list.filter(d => arr(d.emails).length).length;
  const contacted = list.filter(d => d.status !== "Not contacted").length;
  const replied = list.filter(d => ["Replied", "Meeting set", "Signed up"].includes(d.status)).length;
  $("#summary").innerHTML = [["Dealers shown", list.length], ["With email", withEmail], ["Contacted", contacted], ["Replied or further", replied]]
    .map(([l, n]) => `<div class="stat"><span class="label">${l}</span><b>${n}</b></div>`).join("");
}
function dealerHTML(d) {
  const emails = arr(d.emails), phones = arr(d.phones), si = STATUSES.indexOf(d.status);
  const srcOk = d.source === "Dealer website" || d.source === "Car maker website";
  return `<article class="dealer ${emails.length ? "" : "no-email"}" data-id="${esc(d.id)}">
    <div class="d-main">
      <h3>${esc(d.name)}</h3>
      ${d.legal_name || d.dealer_group ? `<div class="sub">${esc([d.legal_name, d.dealer_group ? "Group: " + d.dealer_group : ""].filter(Boolean).join(" · "))}</div>` : ""}
      <div class="chips">${arr(d.brands).map(b => `<span class="chip">${esc(b)}</span>`).join("")}${arr(d.cities).map(c => `<span class="chip city-chip">${esc(c)}</span>`).join("")}</div>
      ${d.showrooms ? `<div class="sub">${esc(d.showrooms)}</div>` : ""}
    </div>
    <div class="d-contact">
      ${emails.length ? emails.map(e => `<div class="contact-line"><span class="mono">${esc(e)}</span><button class="link-btn" data-copy="${esc(e)}">Copy</button></div>`).join("") : `<div class="none">No public email found. Call or WhatsApp instead.</div>`}
      ${phones.map(p => { const w = waLink(p); return `<div class="contact-line"><span class="mono">${esc(p)}</span><button class="link-btn" data-copy="${esc(p)}">Copy</button>${w ? `<a class="wa" href="${w}" target="_blank" rel="noopener">WhatsApp</a>` : ""}</div>`; }).join("")}
      ${emails.length && d.source ? `<span class="src ${srcOk ? "ok" : "check"}">${srcOk ? "From " + esc(d.source.toLowerCase()) : "Listing site: check before sending"}</span>` : ""}
    </div>
    <div class="d-act">
      <label class="field"><span class="label">Status</span><select class="status-sel st-${si}" data-status>${STATUSES.map(s => `<option ${s === d.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      ${d.last_contacted ? `<div class="last">Last emailed ${esc(fmtDate(d.last_contacted))}${d.contact_name ? " · " + esc(d.contact_name) : ""}</div>` : ""}
      <div class="btns"><button class="primary small" data-draft ${emails.length ? "" : "disabled"}>Draft email</button><button class="small" data-edit>Edit</button></div>
    </div>
    ${d.notes ? `<div class="notes">${esc(d.notes)}</div>` : ""}
  </article>`;
}
function render() {
  renderFilters();
  const list = visible();
  renderSummary(list);
  $("#list").innerHTML = list.length ? list.map(dealerHTML).join("")
    : state.dealers.length ? `<div class="empty"><h3>No dealers match these filters</h3><p class="hint">Try another city or brand, or clear the search.</p></div>`
    : `<div class="empty"><h3>No dealers yet</h3><p class="hint">Use “Import JSON” to load your dealer list, or add one with “Add dealer”.</p></div>`;
}

/* ---------- Drafting ---------- */
function fill(text, d, name) {
  const s = state.settings;
  const vars = { greeting: name ? `Dear ${name} ji,` : "Dear Sir/Madam,", dealer: d.name, brand: arr(d.brands).join(" / ") || "your", me: s.sender_name || "Mohit Shah",
    company: s.company || "CarQuote", phone: s.phone || "[Phone]", form: s.form_link || "[Form link]", day: s.follow_up_day || "[day]" };
  return text.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}
/* bold:start */
const BOLD = /\*\*(.+?)\*\*/g;
const hasBold = () => /\*\*.+?\*\*/.test($("#dBody").value);
const plainBody = () => $("#dBody").value.replace(BOLD, "$1");
const htmlBody = () => "<div>" + $("#dBody").value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(BOLD, "<b>$1</b>").replace(/\n/g, "<br>") + "</div>";
// With **bold** in the message: copy it as formatted text, then open Gmail with an empty body to paste into.
async function openGmailBold(e) {
  if (!hasBold() || !navigator.clipboard || !navigator.clipboard.write || !window.ClipboardItem) return;
  e.preventDefault();
  try {
    await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([htmlBody()], { type: "text/html" }), "text/plain": new Blob([plainBody()], { type: "text/plain" }) })]);
    window.open(gmailHref(false), "_blank", "noopener");
    $("#dHint").textContent = "Message copied with bold. In Gmail, click the message box and paste (Ctrl+V, or Cmd+V on Mac).";
  } catch (_) { window.open(gmailHref(true), "_blank", "noopener"); toast("Couldn't copy the bold text, so Gmail opened with plain text"); }
}
/* bold:end */
function gmailHref(withBody = true) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: $("#dTo").value, su: $("#dSubj").value, body: withBody ? plainBody() : "" });
  if (senderEmail()) params.set("authuser", senderEmail());
  return "https://mail.google.com/mail/?" + params.toString();
}
function syncDraft() {
  const a = $("#dGmail");
  a.href = gmailHref(); a.setAttribute("aria-disabled", "false");
  const h = $("#dHint");
  h.textContent = hasBold() ? `Text between ** and ** is sent in bold. "Open in Gmail" copies the message and opens a new email from ${senderEmail()}: paste it into the message box, review it, then press Send.` : `Opens a new Gmail message from ${senderEmail()}. Fill in any [placeholders], review it, then press Send.`; h.className = "hint";
}
function regenerate() {
  const t = TEMPLATES[$("#dTpl").value], name = $("#dName").value.trim();
  $("#dSubj").value = fill(t.subject, current, name); $("#dBody").value = fill(t.body, current, name); syncDraft();
}
function openDraft(d) {
  current = d;
  $("#dTitle").textContent = "Email to " + d.name;
  $("#dSub").textContent = [arr(d.brands).join(", "), arr(d.cities).join(", ")].filter(Boolean).join(" · ");
  $("#dTo").innerHTML = arr(d.emails).map(e => `<option>${esc(e)}</option>`).join("");
  $("#dName").value = d.contact_name || "";
  $("#dTpl").innerHTML = Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join("");
  $("#dTpl").value = ["Emailed", "Followed up"].includes(d.status) ? "follow" : "easy";
  regenerate();
  $("#draftOverlay").hidden = false; $("#dName").focus();
}

/* ---------- Add / edit ---------- */
async function openEdit(d) {
  editing = d || null; delArmed = false;
  $("#eTitle").textContent = d ? "Edit " + d.name : "Add dealer";
  const v = d || {};
  $("#eName").value = v.name || ""; $("#eLegal").value = v.legal_name || ""; $("#eBrands").value = arr(v.brands).join(", ");
  $("#eCities").value = arr(v.cities).join(", "); $("#eEmails").value = arr(v.emails).join(", "); $("#ePhones").value = arr(v.phones).join(", ");
  $("#eWeb").value = v.website || ""; $("#eGroup").value = v.dealer_group || ""; $("#eContact").value = v.contact_name || ""; $("#eGst").value = v.gstin || "";
  $("#eShow").value = v.showrooms || ""; $("#eNotes").value = v.notes || ""; $("#eMsg").textContent = "";
  $("#eDelete").hidden = !d; $("#eDelete").textContent = "Delete dealer";
  const h = $("#eHistory"); h.hidden = true; h.innerHTML = "";
  $("#editOverlay").hidden = false; $("#eName").focus();
  if (d) {
    const { data } = await sb.from("outreach_events").select("kind,template,to_email,created_at").eq("dealer_id", d.id).order("created_at", { ascending: false }).limit(20);
    if (data && data.length) {
      const label = { email: "Emailed", follow_up: "Followed up", call: "Called", whatsapp: "WhatsApp", visit: "Visited", note: "Note" };
      h.innerHTML = `<span class="label">History</span><ul>${data.map(e => `<li>${esc(fmtDate(e.created_at))}: ${esc(label[e.kind] || e.kind)}${e.to_email ? " to " + esc(e.to_email) : ""}${e.template ? " (" + esc(TEMPLATES[e.template]?.label || e.template) + ")" : ""}</li>`).join("")}</ul>`;
      h.hidden = false;
    }
  }
}

/* ---------- Import / export ---------- */
function normalizeRow(raw, index, seen) {
  const problems = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { index, problems: ["Not an object"] };
  const r = {};
  Object.entries(raw).forEach(([k, v]) => { r[ALIASES[k] || k] = v; });
  const out = {};
  const name = typeof r.name === "string" ? r.name.trim() : "";
  if (!name) problems.push("Missing name");
  out.name = name;
  out.slug = slugify(r.slug || name);
  if (!out.slug) problems.push("Missing slug");
  else if (seen.has(out.slug)) problems.push("Same slug appears twice in the file");
  seen.add(out.slug);
  ["legal_name", "showrooms", "website", "dealer_group", "gstin", "source", "notes", "contact_name"].forEach(k => { if (r[k] != null) out[k] = String(r[k]).trim(); });
  ARRAY_FIELDS.forEach(k => { if (r[k] != null) out[k] = (Array.isArray(r[k]) ? r[k] : split(r[k])).map(x => String(x).trim()).filter(Boolean); });
  (out.emails || []).forEach(e => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) problems.push("Bad email: " + e); });
  if (r.status != null && r.status !== "") { if (STATUSES.includes(r.status)) out.status = r.status; else problems.push("Unknown status: " + r.status); }
  if (r.last_contacted) { const t = new Date(r.last_contacted); if (isNaN(t)) problems.push("Bad last_contacted date"); else out.last_contacted = t.toISOString(); }
  return { index, row: out, problems, present: Object.keys(raw).map(k => ALIASES[k] || k) };
}
function planImport(json) {
  const list = Array.isArray(json) ? json : (json && Array.isArray(json.dealers) ? json.dealers : null);
  if (!list) throw new Error("The file needs a list of dealers: either [ … ] or { \"dealers\": [ … ] }.");
  if (!list.length) throw new Error("The file has no dealers in it.");
  const bySlug = new Map(state.dealers.map(d => [d.slug, d])), seen = new Set();
  return list.map((raw, i) => {
    const n = normalizeRow(raw, i, seen);
    n.kind = n.problems.length ? "bad" : (bySlug.has(n.row.slug) ? "upd" : "new");
    return n;
  });
}
function renderImportPreview() {
  const p = importPlan, c = k => p.filter(x => x.kind === k).length;
  $("#iCounts").innerHTML = [["New dealers", c("new")], ["Updated", c("upd")], ["Skipped (errors)", c("bad")]].map(([l, n]) => `<div class="stat"><span class="label">${l}</span><b>${n}</b></div>`).join("");
  const tag = { new: '<span class="tag new">New</span>', upd: '<span class="tag upd">Update</span>', bad: '<span class="tag bad">Skip</span>' };
  $("#iRows").innerHTML = p.slice(0, 300).map(x => `<tr><td>${tag[x.kind]}${x.problems.length ? `<div class="hint">${esc(x.problems.join("; "))}</div>` : ""}</td><td>${esc(x.row?.name || "(row " + (x.index + 1) + ")")}</td><td>${esc(arr(x.row?.brands).join(", "))}</td><td>${esc(arr(x.row?.cities).join(", "))}</td><td>${arr(x.row?.emails).length}</td></tr>`).join("");
  $("#iPreview").hidden = false;
  $("#iGo").disabled = !(c("new") + c("upd"));
}
async function readImportFile(file) {
  $("#iMsg").textContent = ""; $("#iStatus").textContent = ""; $("#iPreview").hidden = true; $("#iGo").disabled = true; importPlan = null;
  if (!file) return;
  $("#iFileName").textContent = file.name;
  try { importPlan = planImport(JSON.parse(await file.text())); renderImportPreview(); }
  catch (e) { $("#iMsg").textContent = e instanceof SyntaxError ? "This file isn’t valid JSON. Check for a missing comma or bracket." : e.message; }
}
async function runImport() {
  if (!importPlan) return;
  $("#iGo").disabled = true; $("#iMsg").textContent = "";
  const news = importPlan.filter(x => x.kind === "new").map(x => {
    const r = x.row, o = { owner_id: user.id, slug: r.slug };
    DIRECTORY_FIELDS.forEach(k => o[k] = r[k] ?? (ARRAY_FIELDS.includes(k) ? [] : ""));
    o.status = r.status || "Not contacted"; o.contact_name = r.contact_name || ""; o.last_contacted = r.last_contacted || null;
    return o;
  });
  const upds = importPlan.filter(x => x.kind === "upd");
  let done = 0, failed = 0;
  const total = news.length + upds.length;
  const progress = () => $("#iStatus").textContent = `Imported ${done} of ${total}…`;
  for (let i = 0; i < news.length; i += 200) {
    const chunk = news.slice(i, i + 200);
    const { error } = await sb.from("dealers").insert(chunk);
    if (error) { failed += chunk.length; $("#iMsg").textContent = "Some new dealers failed: " + errText(error); } else done += chunk.length;
    progress();
  }
  for (const x of upds) { // only the directory fields present in the file; status, contact and history stay as they are
    const fields = {}; DIRECTORY_FIELDS.forEach(k => { if (x.present.includes(k) && x.row[k] !== undefined) fields[k] = x.row[k]; });
    const { error } = await sb.from("dealers").update(fields).eq("owner_id", user.id).eq("slug", x.row.slug);
    if (error) { failed++; $("#iMsg").textContent = "Some updates failed: " + errText(error); } else done++;
    progress();
  }
  $("#iStatus").textContent = failed ? `Imported ${done}, ${failed} failed.` : `Imported ${done} dealers.`;
  await loadDealers();
  if (!failed) { toast(`Imported ${done} dealers`); setTimeout(() => $("#importOverlay").hidden = true, 600); }
}
function exportJSON() {
  const dealers = state.dealers.map(d => {
    const o = { slug: d.slug }; DIRECTORY_FIELDS.forEach(k => o[k] = d[k] ?? (ARRAY_FIELDS.includes(k) ? [] : ""));
    o.status = d.status; o.contact_name = d.contact_name || ""; o.last_contacted = d.last_contacted || "";
    return o;
  });
  const blob = new Blob([JSON.stringify({ format: "dealer-desk/v1", exported: new Date().toISOString().slice(0, 10), dealers }, null, 2)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `dealers-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button, a"); if (!t) return;
  if (t.dataset.close !== undefined) { t.closest(".overlay").hidden = true; return; }
  if (t.dataset.city) { state.city = t.dataset.city; render(); return; }
  if (t.dataset.copy) { copy(t.dataset.copy); return; }
  const card = t.closest(".dealer"); const d = card && state.dealers.find(x => x.id === card.dataset.id);
  if (t.dataset.draft !== undefined && d) openDraft(d);
  if (t.dataset.edit !== undefined && d) openEdit(d);
});
document.addEventListener("change", async e => {
  if (!e.target.matches("[data-status]")) return;
  const id = e.target.closest(".dealer").dataset.id, status = e.target.value;
  const { error } = await sb.from("dealers").update({ status }).eq("id", id);
  if (error) { toast("Couldn't save the status: " + errText(error)); render(); } else { patchLocal(id, { status }); toast("Status updated"); }
});
document.querySelectorAll(".overlay").forEach(o => o.addEventListener("click", e => { if (e.target === o) o.hidden = true; }));
document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".overlay").forEach(o => o.hidden = true); });
$("#q").addEventListener("input", e => { state.q = e.target.value; render(); });
$("#fBrand").addEventListener("change", e => { state.brand = e.target.value; render(); });
$("#fStatus").addEventListener("change", e => { state.status = e.target.value; render(); });
$("#fEmail").addEventListener("change", e => { state.emailOnly = e.target.checked; render(); });
$("#addBtn").addEventListener("click", () => openEdit(null));
$("#dTpl").addEventListener("change", regenerate);
$("#dName").addEventListener("change", regenerate);
["#dSubj", "#dBody"].forEach(s => $(s).addEventListener("input", syncDraft));
$("#dTo").addEventListener("change", syncDraft);
$("#dCopy").addEventListener("click", () => copy(`To: ${$("#dTo").value}\nSubject: ${$("#dSubj").value}\n\n${plainBody()}`));
$("#dGmail").addEventListener("click", openGmailBold);
$("#dDone").addEventListener("click", async () => {
  if (!current) return;
  const follow = $("#dTpl").value === "follow";
  const fields = { status: follow ? "Followed up" : "Emailed", last_contacted: new Date().toISOString(), contact_name: $("#dName").value.trim() };
  const { error } = await sb.from("dealers").update(fields).eq("id", current.id);
  if (error) { toast("Couldn't save: " + errText(error)); return; }
  await sb.from("outreach_events").insert({ owner_id: user.id, dealer_id: current.id, kind: follow ? "follow_up" : "email", template: $("#dTpl").value, to_email: $("#dTo").value, subject: $("#dSubj").value });
  patchLocal(current.id, fields); $("#draftOverlay").hidden = true; toast(follow ? "Marked as followed up" : "Marked as emailed");
});
$("#editForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = { name: $("#eName").value.trim(), legal_name: $("#eLegal").value.trim(), brands: split($("#eBrands").value), cities: split($("#eCities").value),
    emails: split($("#eEmails").value), phones: split($("#ePhones").value), website: $("#eWeb").value.trim(), dealer_group: $("#eGroup").value.trim(),
    contact_name: $("#eContact").value.trim(), gstin: $("#eGst").value.trim(), showrooms: $("#eShow").value.trim(), notes: $("#eNotes").value.trim() };
  if (!body.name) { $("#eMsg").textContent = "Add the dealer’s name."; return; }
  let res;
  if (editing) res = await sb.from("dealers").update(body).eq("id", editing.id);
  else {
    let slug = slugify(body.name) || "dealer"; if (state.dealers.some(d => d.slug === slug)) slug = (slug + "-" + Date.now().toString(36)).slice(0, 80);
    res = await sb.from("dealers").insert({ ...body, owner_id: user.id, slug, source: "Added by you" });
  }
  if (res.error) { $("#eMsg").textContent = "Couldn't save: " + errText(res.error); return; }
  $("#editOverlay").hidden = true; toast(editing ? "Dealer updated" : "Dealer added"); loadDealers();
});
$("#eDelete").addEventListener("click", async () => {
  if (!editing) return;
  if (!delArmed) { delArmed = true; $("#eDelete").textContent = "Click again to delete"; return; }
  const { error } = await sb.from("dealers").delete().eq("id", editing.id);
  if (error) { toast("Couldn't delete: " + errText(error)); return; }
  $("#editOverlay").hidden = true; state.dealers = state.dealers.filter(d => d.id !== editing.id); render(); toast("Dealer deleted");
});
$("#importBtn").addEventListener("click", () => { $("#iFile").value = ""; $("#iFileName").textContent = ""; $("#iMsg").textContent = ""; $("#iStatus").textContent = ""; $("#iPreview").hidden = true; $("#iGo").disabled = true; importPlan = null; $("#importOverlay").hidden = false; });
$("#iFile").addEventListener("change", e => readImportFile(e.target.files[0]));
const drop = $("#drop");
["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => readImportFile(e.dataTransfer.files[0]));
$("#iGo").addEventListener("click", runImport);
$("#exportBtn").addEventListener("click", exportJSON);
$("#signOutBtn").addEventListener("click", async () => { await sb.auth.signOut(); });
$("#signinView").addEventListener("submit", async e => {
  e.preventDefault(); $("#liMsg").textContent = ""; $("#liBtn").disabled = true;
  const { error } = await sb.auth.signInWithPassword({ email: $("#liEmail").value.trim(), password: $("#liPass").value });
  $("#liBtn").disabled = false;
  if (error) $("#liMsg").textContent = error.message === "Invalid login credentials" ? "Wrong email or password." : errText(error);
});

/* ---------- Start ---------- */
async function startApp() {
  show("appView"); $("#who").textContent = user.email || "";
  await Promise.all([loadDealers(), loadSettings()]);
}
(async () => {
  const cfg = window.DEALER_DESK_CONFIG || {};
  const configured = cfg.supabaseUrl && cfg.supabaseKey && !/YOUR-/.test(cfg.supabaseUrl + cfg.supabaseKey);
  if (!configured || !window.supabase) { show("setupView"); return; }
  sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
  sb.auth.onAuthStateChange((_event, session) => {
    const next = session?.user || null;
    // defer: Supabase calls made directly inside this callback can stall the auth client
    if (next && (!user || user.id !== next.id)) { user = next; setTimeout(startApp, 0); }
    else if (!next) { user = null; state.dealers = []; show("signinView"); }
  });
  const { data } = await sb.auth.getSession();
  if (!data.session) show("signinView");
})();
