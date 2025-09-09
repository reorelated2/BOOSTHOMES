// netlify/functions/listings.js
export const config = { path: "/api/listings" };

const TOKEN_URL = "https://api.bridgedataoutput.com/oauth2/token";
const API_BASE  = "https://api.bridgedataoutput.com/api/v2";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60_000) return cachedToken;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.BRIDGE_CLIENT_ID,
    client_secret: process.env.BRIDGE_CLIENT_SECRET,
  });

  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!r.ok) throw new Error(`Token error ${r.status}`);
  const data = await r.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000);
  return cachedToken;
}

export default async (req) => {
  try {
    const token = await getToken();

    const url = new URL(req.url);
    const mls = process.env.BRIDGE_MLS;
    const limit = url.searchParams.get("limit") || "20";
    const city  = url.searchParams.get("city")  || "";
    const min   = url.searchParams.get("min")   || "";
    const max   = url.searchParams.get("max")   || "";

    const filters = [];
    if (city) filters.push(`City.eq=${encodeURIComponent(city)}`);
    if (min)  filters.push(`ListPrice.gte=${min}`);
    if (max)  filters.push(`ListPrice.lte=${max}`);

    const qs = [`limit=${limit}`, ...filters].join("&");
    const apiUrl = `${API_BASE}/${mls}/listings?${qs}`;

    const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` }});
    if (!resp.ok) throw new Error(`MLS fetch ${resp.status}`);
    const json = await resp.json();

    const items = (json.value || []).map(x => ({
      id: x.ListingKey || x._id,
      address: [x.StreetNumber, x.StreetName, x.City].filter(Boolean).join(" "),
      price: x.ListPrice,
      beds: x.BedroomsTotal,
      baths: x.BathroomsTotalInteger || x.BathroomsFull,
      sqft: x.LivingArea || x.BuildingAreaTotal,
      photo: (x.Media && x.Media[0]?.MediaURL) || null,
      attribution: x.ListOfficeName || x.ListAgentFullName || "",
      mlsid: x.ListingId || ""
    }));

    return new Response(JSON.stringify({ items }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
