// Supabase connection for buyer requests. The publishable key is safe in a browser:
// the buyer_requests table only allows inserts (row level security).
export const SUPABASE = {
  url: "https://xksotitiskssocsnqefi.supabase.co",
  key: "sb_publishable_KOGYTQoRh1xTUqv1y2oiEA_q0zFx6eH",
  table: "buyer_requests"
};
