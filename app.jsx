// Prebuilt static bundle — React & Three are loaded as globals from CDN.
const { useState, useRef, useEffect, useCallback, createContext, useContext } = React;
// THREE is a global from three.min.js


// ════════════════════════════════════════════════════════════════════════════
//  THEME — "Field Guide": bright modern SaaS × printed trail-guide warmth.
//  Light + dark. Key names are kept stable so every component can read `T.*`;
//  `T` is swapped for the active palette at the top of <App> via ThemeProvider.
//  Fonts: Fraunces (display serif), Inter Tight (UI), Spline Sans Mono (labels).
// ════════════════════════════════════════════════════════════════════════════
const LIGHT = {
  mode:"light",
  bg:"#FBFAF7", bgCard:"#FFFFFF", bgEl:"#F4F2EC", bgHov:"#EFEDE5", bgAct:"#E9E6DC",
  gDark:"#143F2A", gMid:"#1F5C3D", gBright:"#1F5C3D", gGlow:"#2C7A52",
  amb:"#C98A00", ambL:"#E8763A", ambBr:"#E8763A",
  sDim:"#D8D3C6", sMed:"#9AA39C", sLt:"#5C6660",
  txt:"#1A1F1C", txtD:"#5C6660", txtF:"#9AA39C",
  red:"#C0392B", redD:"#FBE8E5", blu:"#2E6F9E", bluL:"#2E6F9E",
  brd:"#E7E3D9", brdBr:"#D8D3C6", pur:"#7C5CCB",
  shadow:"0 1px 2px rgba(26,31,28,.04), 0 4px 16px rgba(26,31,28,.06)",
  shadowLg:"0 8px 40px rgba(26,31,28,.12)",
};
const DARK = {
  mode:"dark",
  bg:"#10151A", bgCard:"#171E25", bgEl:"#1E272F", bgHov:"#243039", bgAct:"#2A3742",
  gDark:"#1B3A2B", gMid:"#2C7A52", gBright:"#5FB084", gGlow:"#7CC79C",
  amb:"#E8B43C", ambL:"#F08A52", ambBr:"#F4A56E",
  sDim:"#324049", sMed:"#5E726C", sLt:"#9DB0AC",
  txt:"#ECF1F0", txtD:"#9DB0AC", txtF:"#5E726C",
  red:"#E8675A", redD:"#3A1C1A", blu:"#62A8D6", bluL:"#62A8D6",
  brd:"#26313A", brdBr:"#324049", pur:"#A78BFA",
  shadow:"0 1px 2px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.3)",
  shadowLg:"0 8px 40px rgba(0,0,0,.5)",
};

// Mutable active-theme object. Components read `T.*`; we copy the active
// palette onto it whenever the mode changes (see ThemeProvider).
const T = { ...LIGHT };
const applyTheme = (p) => { Object.keys(T).forEach(k => delete T[k]); Object.assign(T, p); };

const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mq?.matches) setMode("dark");
  }, []);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  applyTheme(mode === "dark" ? DARK : LIGHT);
  const toggle = () => setMode(m => (m === "light" ? "dark" : "light"));
  return <ThemeCtx.Provider value={{ mode, toggle, vw, isMobile: vw < 760, isNarrow: vw < 1080 }}>{children}</ThemeCtx.Provider>;
};

const GlobalCss = () => {
  const { mode } = useTheme();
  const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,800&family=Inter+Tight:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
html{-webkit-text-size-adjust:100%}
*{-webkit-tap-highlight-color:transparent}
.app-h{height:100vh;height:100dvh}
@media (max-width:760px){
  input,textarea,select{font-size:16px}  /* prevents iOS auto-zoom on focus */
  button{touch-action:manipulation}
}
body{background:${T.bg};color:${T.txt};font-family:'Inter Tight',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:${T.brdBr};border-radius:6px;border:3px solid ${T.bg}}
input,textarea,select{font-family:'Inter Tight',sans-serif;background:${T.bgCard};border:1.5px solid ${T.brd};border-radius:11px;color:${T.txt};padding:11px 14px;font-size:14px;outline:none;width:100%;transition:border-color .15s,box-shadow .15s}
input:focus,textarea:focus,select:focus{border-color:${T.gBright};box-shadow:0 0 0 4px ${T.gBright}22}
input::placeholder,textarea::placeholder{color:${T.txtF}}
button{cursor:pointer;font-family:'Inter Tight',sans-serif}
label{font-size:11px;color:${T.txtF};font-family:'Spline Sans Mono',monospace;letter-spacing:0.10em;text-transform:uppercase;display:block;margin-bottom:6px;font-weight:500}
::selection{background:${T.gBright}33}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:${T.shadow}}50%{box-shadow:${T.shadowLg}}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes backdrop{from{opacity:0}to{opacity:1}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-40px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
  return <style key={mode}>{css}</style>;
};

const Contours = ({ opacity=0.05, color, height=160 }) => {
  const c = color || T.gBright;
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 20 + i * 16, amp = 8 + (i % 3) * 5;
    return `M -40 ${y} Q 80 ${y - amp}, 200 ${y} T 440 ${y} T 680 ${y} T 920 ${y}`;
  });
  return (
    <svg width="100%" height={height} viewBox={`0 0 880 ${typeof height === "number" ? height : 600}`} preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, pointerEvents:"none" }} aria-hidden>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={c} strokeWidth="1.5" opacity={opacity}
          style={{ animation:`drift ${24 + i * 4}s linear infinite alternate` }} />
      ))}
    </svg>
  );
};

const ThemeToggle = ({ style }) => {
  const { mode, toggle } = useTheme();
  return (
    <button onClick={toggle} title={mode === "light" ? "Switch to dark" : "Switch to light"}
      style={{ width:38, height:38, borderRadius:11, border:`1px solid ${T.brd}`, background:T.bgCard, color:T.txtD, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, ...style }}>
      {mode === "light" ? "◐" : "◑"}
    </button>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  API LAYER — tries real backend, falls back to local store
// ════════════════════════════════════════════════════════════════════════════
const API_ROOT = (typeof window !== "undefined" && window.SUMMIT_API) || "http://localhost:8080";
const API_BASE = `${API_ROOT}/v1`;
let _token = null;
let _apiAlive = null; // null=unknown, true/false once probed

const probeApi = async () => {
  if (_apiAlive !== null) return _apiAlive;
  try {
    const res = await fetch(`${API_ROOT}/health`, { signal: AbortSignal.timeout(1500) });
    _apiAlive = res.ok;
  } catch { _apiAlive = false; }
  return _apiAlive;
};

const apiCall = async (method, path, body) => {
  const headers = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
//  BACKEND ADAPTER — maps frontend shapes ⇄ exact Rust/Axum contracts
//  Enum cases verified against summit-core domain models:
//   • RouteType/Difficulty/Visibility deserialize as PascalCase in JSON bodies
//   • gear_category deserializes as snake_case
//   • responses nest numbers under `stats` { distance_km, elevation_gain_m, ... }
// ════════════════════════════════════════════════════════════════════════════
const PASCAL = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

// frontend difficulty ("expert") → backend enum ("Expert")
const toDifficultyEnum = d => PASCAL(d || "moderate");
// frontend visibility ("public") → backend enum ("Public")
const toVisibilityEnum = v => PASCAL(v || "public");
// route shape → route_type enum (we only model out-and-back from the form)
const toRouteTypeEnum = () => "OutAndBack";

// frontend gear category label → backend snake_case enum
const GEAR_CAT_MAP = {
  Shelter:"shelter", Sleep:"sleep_system", "Sleep System":"sleep_system",
  Clothing:"clothing", Footwear:"footwear", Navigation:"navigation",
  Nutrition:"nutrition", Hydration:"hydration", "First Aid":"first_aid",
  Tools:"tools", Pack:"shelter", Electronics:"electronics",
  Safety:"safety", Other:"other",
};
const toGearCategory = c => GEAR_CAT_MAP[c] || (c||"other").toLowerCase().replace(/\s+/g,"_");

// Generate a small synthetic track so backend coordinate + non-empty checks pass.
// Real apps would capture GPS; here we fan out points around a seed coordinate
// and ramp elevation by the route's gain so stats compute sensibly.
const synthTrack = (gainM = 500, seed = [47.6062, -122.3321]) => {
  const [lat0, lon0] = seed;
  const N = 24;
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return {
      lat: +(lat0 + Math.sin(t * Math.PI * 1.4) * 0.03).toFixed(6),
      lon: +(lon0 + t * 0.05).toFixed(6),
      elevation_m: Math.round(100 + gainM * Math.sin(t * Math.PI)),
    };
  });
};

// Normalize a backend route (nested stats) → flat frontend card shape
const fromBackendRoute = (r) => {
  const s = r.stats || {};
  const diff = (r.difficulty || "moderate").toLowerCase();
  return {
    id: r.id,
    name: r.name,
    loc: r.location || r.loc || "—",
    dist: +(s.distance_km ?? r.dist ?? 0).toFixed(1),
    gain: Math.round(s.elevation_gain_m ?? r.gain ?? 0),
    diff,
    icon: { easy:"💧", moderate:"🦅", hard:"🏔", expert:"⛰", extreme:"🗻" }[diff] || "⛰",
    rating: r.rating || s.avg_rating || 0,
    saves: s.save_count || 0,
    time: r.time || (s.estimated_duration_min ? `${Math.round(s.estimated_duration_min/60)}h` : "—"),
    track: r.track_points || null,    // keep raw track for the 3D viewer
    raw: r,
  };
};

const backend = {
  // ── Auth ──
  async login(email, password, mfa) {
    const d = await apiCall("POST", "/auth/login", { email, password, mfa_token: mfa || undefined });
    _token = d.access_token;
    return { token: d.access_token, refresh: d.refresh_token, userId: d.user_id };
  },
  async register({ email, password, username, display_name }) {
    const d = await apiCall("POST", "/auth/register", { email, password, username, display_name });
    _token = d.access_token;
    return { token: d.access_token, refresh: d.refresh_token, userId: d.user_id };
  },

  // ── Routes ──
  async listRoutes() {
    const d = await apiCall("GET", "/routes");
    return (d.items || []).map(fromBackendRoute);
  },
  async getRoute(id) {
    const d = await apiCall("GET", `/routes/${id}`);
    return fromBackendRoute(d);
  },
  async createRoute(r) {
    const body = {
      name: r.name,
      description: r.description || null,
      route_type: toRouteTypeEnum(),
      difficulty: toDifficultyEnum(r.diff),
      visibility: toVisibilityEnum(r.visibility),
      tags: r.tags || [],
      waypoints: [],
      track_points: synthTrack(r.gain || 500),
    };
    const d = await apiCall("POST", "/routes", body);
    return { id: d.id, stats: d.stats };
  },
  deleteRoute: (id) => apiCall("DELETE", `/routes/${id}`),

  // ── Gear ──
  async listGear() {
    const d = await apiCall("GET", "/gear");
    return (d.items || []).map(g => ({
      id: g.id, name: g.name, brand: g.brand || "—",
      cat: g.category, w: g.weight_g || 0, cond: g.condition || "good",
      cost: g.purchase_price_usd || 0, uses: g.times_used || 0,
      life: g.remaining_life_pct != null ? Math.round(g.remaining_life_pct) : 100,
      ic: "🎒",
    }));
  },
  async createGear(g) {
    const body = {
      name: g.name, brand: g.brand || null, model: null,
      category: toGearCategory(g.cat),
      weight_g: g.w || null,
      purchase_price_usd: g.cost || null,
      is_consumable: false, lifespan_km: null, notes: null,
    };
    const d = await apiCall("POST", "/gear", body);
    return { id: d.id };
  },
  deleteGear: (id) => apiCall("DELETE", `/gear/${id}`),

  // ── Trips ──
  async listTrips() {
    const d = await apiCall("GET", "/trips");
    return (d.trips || d.items || []).map(t => {
      const s = t.stats || {};
      return {
        id: t.id, name: t.name, date: t.started_at ? new Date(t.started_at).toLocaleDateString() : "—",
        dist: +(s.distance_km ?? 0).toFixed(1), gain: Math.round(s.elevation_gain_m ?? 0),
        dur: s.duration_min ? `${Math.floor(s.duration_min/60)}h ${s.duration_min%60}m` : "—",
        status: t.status || "completed",
        color: t.status === "active" ? T.ambL : T.gBright,
        journal: [],
      };
    });
  },
  async startTrip(name, routeId) {
    const d = await apiCall("POST", "/trips", { name, route_id: routeId || null, visibility: "Private" });
    return { id: d.id };
  },
  endTrip: (id) => apiCall("POST", `/trips/${id}/end`),
  addJournal: (id, body) => apiCall("POST", `/trips/${id}/journal`, { body, entry_type: "note" }),

  // ── Social feed ──
  async listFeed(scope) {
    const qs = scope === "following" ? "?scope=following" : "";
    const d = await apiCall("GET", `/feed/posts${qs}`);
    return d.items || [];
  },
  // Full upload flow: ask API for a presigned URL, PUT the file straight to S3,
  // then create the post referencing the returned key.
  async uploadMedia(file, kind) {
    const u = await apiCall("POST", "/feed/media/upload-url", { kind, content_type: file.type });
    const put = await fetch(u.upload_url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!put.ok) throw new Error(`Upload failed (${put.status})`);
    return u.media_key;
  },
  async createPost(p) {
    const d = await apiCall("POST", "/feed/posts", p);
    return { id: d.id };
  },
  deletePost: (id) => apiCall("DELETE", `/feed/posts/${id}`),
  likePost: (id) => apiCall("POST", `/feed/posts/${id}/like`),
  unlikePost: (id) => apiCall("DELETE", `/feed/posts/${id}/like`),
  listComments: async (id) => (await apiCall("GET", `/feed/posts/${id}/comments`)).items || [],
  addComment: (id, body) => apiCall("POST", `/feed/posts/${id}/comments`, { body }),
};

// ════════════════════════════════════════════════════════════════════════════
//  LOCAL STORE (in-memory fallback) + React context
// ════════════════════════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2, 10);

const SEED = {
  routes: [
    { id:"r1", name:"Enchantments Loop", loc:"Leavenworth, WA", dist:26.4, gain:1820, diff:"expert",   icon:"⛰", rating:4.9, saves:2341, time:"9-12h" },
    { id:"r2", name:"Lake Serene",       loc:"Index, WA",        dist:13.2, gain:1158, diff:"hard",     icon:"🏔", rating:4.8, saves:1876, time:"5-7h"  },
    { id:"r3", name:"Rattlesnake Ledge", loc:"North Bend, WA",   dist:7.1,  gain:396,  diff:"moderate", icon:"🦅", rating:4.6, saves:5210, time:"2-3h"  },
    { id:"r4", name:"Franklin Falls",    loc:"Snoqualmie, WA",   dist:3.2,  gain:61,   diff:"easy",     icon:"💧", rating:4.5, saves:8900, time:"1h"    },
    { id:"r5", name:"Mt Si Summit",      loc:"North Bend, WA",   dist:14.4, gain:1256, diff:"hard",     icon:"🗻", rating:4.7, saves:3102, time:"5-8h"  },
  ],
  trips: [
    { id:"t1", name:"Enchantments Traverse",   date:"Oct 14–16, 2024", dist:26.4, gain:1820, dur:"3 days", status:"completed", color:T.gBright,
      journal:["Summit reached — visibility 40km across the range","Weather shifted; descended alternate route","Camp at Perfection Lake — truly earned the name"] },
    { id:"t2", name:"Lake Serene Day Hike",    date:"Sep 28, 2024",    dist:13.2, gain:1158, dur:"6h 22m", status:"completed", color:T.gBright, journal:["Waterfall roaring after the rain","Lunch at the lake — perfect"] },
    { id:"t3", name:"Wonderland Segment",      date:"Aug 3–5, 2024",   dist:38.2, gain:2940, dur:"3 days", status:"completed", color:T.gBright, journal:["Longest carry yet","Glacier views all day"] },
  ],
  gear: [
    { id:"g1", name:"Nemo Hornet Elite 2P", brand:"Nemo Equipment",        cat:"Shelter",     w:990,  cond:"new",  ic:"⛺", cost:549, uses:3,  life:92 },
    { id:"g2", name:"WM UltraLite 20°",     brand:"Western Mountaineering", cat:"Sleep",       w:680,  cond:"good", ic:"🛏", cost:675, uses:18, life:64 },
    { id:"g3", name:"Hoka Speedgoat 5",     brand:"Hoka",                   cat:"Footwear",    w:298,  cond:"fair", ic:"👟", cost:155, uses:47, life:22 },
    { id:"g4", name:"BD Distance Z",        brand:"Black Diamond",           cat:"Navigation",  w:240,  cond:"good", ic:"🧗", cost:80,  uses:22, life:74 },
    { id:"g5", name:"Osprey Exos Pro 55",   brand:"Osprey",                  cat:"Pack",        w:1020, cond:"good", ic:"🎒", cost:340, uses:15, life:68 },
    { id:"g6", name:"Garmin inReach Mini 2",brand:"Garmin",                  cat:"Electronics", w:100,  cond:"new",  ic:"📡", cost:399, uses:5,  life:96 },
  ],
  reports: [
    { id:"rp1", user:"Alex K",  time:"2h ago", cond:"excellent", msg:"Trail completely clear, no snow. Summit views incredible today.", route:"Enchantments", rating:5 },
    { id:"rp2", user:"Priya M", time:"5h ago", cond:"good",      msg:"Some muddy sections after mile 4. Waterfall is roaring.",          route:"Lake Serene",  rating:4 },
    { id:"rp3", user:"Ben T",   time:"1d ago", cond:"fair",      msg:"Blowdown across trail at 3mi. Passable but slow.",                  route:"Mt Si",        rating:3 },
  ],
  posts: [
    { id:"p1", kind:"photo", media_url:"", caption:"Golden hour at Colchuck Lake — worth the 4am start", location_name:"Enchantments", like_count:142, comment_count:8, liked:false, author:{ display_name:"Alex K", username:"alexk" }, created_at:"2h ago", grad:["#1e3a5f","#0d2818"] },
    { id:"p2", kind:"video", media_url:"", duration_s:34, caption:"Ridgeline traverse in the clouds ☁️", location_name:"Mt Si", like_count:89, comment_count:3, liked:true, author:{ display_name:"Maya R", username:"mayar" }, created_at:"5h ago", grad:["#3a2f5f","#0d1828"] },
    { id:"p3", kind:"photo", media_url:"", caption:"First snow of the season up high", location_name:"Lake Serene", like_count:204, comment_count:15, liked:false, author:{ display_name:"Jordan T", username:"jordant" }, created_at:"1d ago", grad:["#4a5060","#0d2818"] },
  ],
};

const StoreCtx = createContext(null);
const useStore = () => useContext(StoreCtx);

const StoreProvider = ({ children }) => {
  const [routes, setRoutes] = useState(SEED.routes);
  const [trips, setTrips]   = useState(SEED.trips);
  const [gear, setGear]     = useState(SEED.gear);
  const [reports, setReports] = useState(SEED.reports);
  const [posts, setPosts]   = useState(SEED.posts);
  const [activeTrip, setActiveTrip] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [online, setOnline] = useState(false);

  const toast = useCallback((msg, kind = "ok") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  // Hydrate from backend once authed; falls back to SEED on failure.
  const hydrate = useCallback(async () => {
    const alive = await probeApi();
    setOnline(alive);
    if (!alive) { toast("Backend offline — demo mode", "warn"); return; }
    try {
      const [rs, gs, ts] = await Promise.all([
        backend.listRoutes().catch(() => null),
        backend.listGear().catch(() => null),
        backend.listTrips().catch(() => null),
      ]);
      if (rs && rs.length) setRoutes(rs);
      if (gs && gs.length) setGear(gs);
      if (ts && ts.length) {
        setTrips(ts);
        setActiveTrip(ts.find(t => t.status === "active") || null);
      }
      toast("Synced with server ✓");
    } catch (e) { toast(`Sync failed: ${e.message}`, "warn"); }
  }, [toast]);

  // ── Route ops ──
  const addRoute = useCallback(async (r) => {
    const local = { id: uid(), icon:{easy:"💧",moderate:"🦅",hard:"🏔",expert:"⛰",extreme:"🗻"}[r.diff]||"⛰", rating:0, saves:0, ...r };
    if (online) {
      try {
        const res = await backend.createRoute(r);
        local.id = res.id || local.id;
        if (res.stats) { local.dist = +(res.stats.distance_km||r.dist).toFixed(1); local.gain = Math.round(res.stats.elevation_gain_m||r.gain); }
        toast("Route saved to server ✓");
      } catch (e) { toast(`Server rejected: ${e.message}`, "warn"); }
    } else { toast("Route created (demo mode)"); }
    setRoutes(rs => [local, ...rs]);
    return local;
  }, [online, toast]);

  const deleteRoute = useCallback(async (id) => {
    if (online) { try { await backend.deleteRoute(id); } catch (e) { toast(`Delete failed: ${e.message}`, "warn"); } }
    setRoutes(rs => rs.filter(r => r.id !== id));
    toast("Route deleted");
  }, [online, toast]);

  const exportGpx = useCallback((route) => {
    const pts = route.track && route.track.length
      ? route.track
      : [{lat:47.6062,lon:-122.3321,elevation_m:100},{lat:47.62,lon:-122.35,elevation_m:100+(route.gain||500)}];
    const trkpts = pts.map(p => `    <trkpt lat="${p.lat}" lon="${p.lon}"><ele>${p.elevation_m||0}</ele></trkpt>`).join("\n");
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Summit">
  <metadata><name>${route.name}</name></metadata>
  <trk><name>${route.name}</name><trkseg>
${trkpts}
  </trkseg></trk>
</gpx>`;
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${route.name.replace(/[^a-z0-9]/gi, "_")}.gpx`;
    a.click(); URL.revokeObjectURL(url);
    toast(`Exported ${route.name}.gpx`);
  }, [toast]);

  // ── Trip ops ──
  const startTrip = useCallback(async (routeOrName) => {
    const name = typeof routeOrName === "string" ? routeOrName : routeOrName.name;
    const route = typeof routeOrName === "object" ? routeOrName : null;
    if (activeTrip) { toast("End your active trip first", "warn"); return null; }
    const trip = { id: uid(), name, date:"Now", dist:0, gain:0, dur:"00:00:00", status:"active", color:T.ambL, journal:[], routeId: route?.id, track: route?.track };
    if (online) { try { const res = await backend.startTrip(name, route?.id); trip.id = res.id || trip.id; toast("Trip started on server ✓"); } catch (e) { toast(`Server: ${e.message}`, "warn"); } }
    else toast(`Trip started: ${name}`);
    setTrips(ts => [trip, ...ts]);
    setActiveTrip(trip);
    return trip;
  }, [activeTrip, online, toast]);

  const endTrip = useCallback(async (id, finalStats) => {
    if (online) { try { await backend.endTrip(id); } catch (e) { toast(`Server: ${e.message}`, "warn"); } }
    setTrips(ts => ts.map(t => t.id === id ? { ...t, status:"completed", color:T.gBright, ...finalStats } : t));
    setActiveTrip(null);
    toast("Trip completed ✓");
  }, [online, toast]);

  const addJournal = useCallback(async (tripId, entry) => {
    if (online) { try { await backend.addJournal(tripId, entry); } catch {} }
    setTrips(ts => ts.map(t => t.id === tripId ? { ...t, journal:[...(t.journal||[]), entry] } : t));
    toast("Journal entry added");
  }, [online, toast]);

  // ── Gear ops ──
  const addGear = useCallback(async (g) => {
    const item = { id: uid(), ic:{Shelter:"⛺",Sleep:"🛏",Footwear:"👟",Navigation:"🧭",Pack:"🎒",Electronics:"📡",Other:"🎒"}[g.cat]||"🎒", cond:"new", uses:0, life:100, ...g };
    if (online) {
      try { const res = await backend.createGear(g); item.id = res.id || item.id; toast("Gear saved to server ✓"); }
      catch (e) { toast(`Server rejected: ${e.message}`, "warn"); }
    } else toast("Gear added (demo mode)");
    setGear(gs => [item, ...gs]);
    return item;
  }, [online, toast]);

  const deleteGear = useCallback(async (id) => {
    if (online) { try { await backend.deleteGear(id); } catch (e) { toast(`Delete failed: ${e.message}`, "warn"); } }
    setGear(gs => gs.filter(g => g.id !== id));
    toast("Gear removed");
  }, [online, toast]);

  // ── Report ops (no backend endpoint yet — local only) ──
  const addReport = useCallback((r) => {
    setReports(rs => [{ id: uid(), user:"You", time:"just now", ...r }, ...rs]);
    toast("Trail report posted ✓");
  }, [toast]);

  // ── Feed ops ──
  const createPost = useCallback(async ({ file, kind, caption, location_name }) => {
    const local = {
      id: uid(), kind, caption: caption||"", location_name: location_name||"",
      media_url: file ? URL.createObjectURL(file) : "",
      duration_s: kind==="video" ? 30 : undefined,
      like_count:0, comment_count:0, liked:false,
      author:{ display_name:"You", username:"you" }, created_at:"just now",
      grad:["#1e3a5f","#0d2818"],
    };
    if (online && file) {
      try {
        const media_key = await backend.uploadMedia(file, kind);
        const res = await backend.createPost({ kind, media_key, caption, location_name });
        local.id = res.id || local.id;
        toast("Posted to feed ✓");
      } catch (e) { toast(`Upload failed: ${e.message}`, "warn"); }
    } else { toast("Posted (demo mode)"); }
    setPosts(ps => [local, ...ps]);
    return local;
  }, [online, toast]);

  const toggleLike = useCallback(async (id) => {
    let nowLiked;
    setPosts(ps => ps.map(p => {
      if (p.id !== id) return p;
      nowLiked = !p.liked;
      return { ...p, liked: nowLiked, like_count: p.like_count + (nowLiked ? 1 : -1) };
    }));
    if (online) {
      try { nowLiked ? await backend.likePost(id) : await backend.unlikePost(id); } catch {}
    }
  }, [online]);

  const deletePost = useCallback(async (id) => {
    if (online) { try { await backend.deletePost(id); } catch (e) { toast(`Delete failed: ${e.message}`, "warn"); } }
    setPosts(ps => ps.filter(p => p.id !== id));
    toast("Post deleted");
  }, [online, toast]);

  const value = {
    routes, trips, gear, reports, posts, activeTrip, toasts, toast, online, hydrate,
    addRoute, deleteRoute, exportGpx,
    startTrip, endTrip, addJournal,
    addGear, deleteGear, addReport,
    createPost, toggleLike, deletePost,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
};

// ════════════════════════════════════════════════════════════════════════════
//  PRIMITIVES
// ════════════════════════════════════════════════════════════════════════════
const Spin = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin .8s linear infinite",opacity:.6}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;

const Btn = ({children,v="pri",sz="md",load,ic,onClick,style:s,disabled,type}) => {
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,border:"none",borderRadius:11,fontWeight:600,transition:"transform .12s, filter .15s, background .15s",whiteSpace:"nowrap",cursor:disabled||load?"default":"pointer",
    padding:sz==="xs"?"5px 10px":sz==="sm"?"7px 13px":sz==="lg"?"13px 22px":"10px 17px",
    fontSize:sz==="xs"?12:sz==="sm"?13:sz==="lg"?15:14,opacity:disabled?.5:1};
  const vs={
    pri:{background:T.gMid,color:"#fff",boxShadow:T.shadow},
    accent:{background:T.ambL,color:"#fff",boxShadow:T.shadow},
    soft:{background:T.mode==="dark"?T.gDark:"#E6F0E9",color:T.mode==="dark"?T.gGlow:T.gDark},
    ghost:{background:"transparent",color:T.txtD,border:`1.5px solid ${T.brd}`},
    danger:{background:T.redD,color:T.red},
    subtle:{background:T.bgEl,color:T.txtD,border:`1px solid ${T.brd}`},
    active:{background:T.mode==="dark"?T.gDark:"#E6F0E9",color:T.gBright,border:`1.5px solid ${T.gMid}`},
  };
  return <button type={type} style={{...base,...vs[v],...s}} onClick={!disabled&&!load?onClick:undefined}
    onMouseEnter={e=>{if(!disabled&&!load){e.currentTarget.style.filter="brightness(1.06)";e.currentTarget.style.transform="translateY(-1px)"}}}
    onMouseLeave={e=>{e.currentTarget.style.filter="";e.currentTarget.style.transform=""}}>{load?<Spin s={13}/>:ic}{children}</button>;
};

const Card = ({children,style:s,onClick,glow}) => (
  <div onClick={onClick} style={{background:T.bgCard,border:`1px solid ${T.brd}`,borderRadius:18,overflow:"hidden",boxShadow:T.shadow,transition:"border-color .18s,transform .18s,box-shadow .18s",cursor:onClick?"pointer":"default",...s}}
    onMouseEnter={e=>{if(onClick){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=T.shadowLg}}}
    onMouseLeave={e=>{if(onClick){e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow}}}>{children}</div>
);

const Badge = ({children,c="g"}) => {
  const m={
    g:{bg:T.mode==="dark"?T.gDark:"#E6F0E9",fg:T.mode==="dark"?T.gGlow:T.gDark},
    a:{bg:T.mode==="dark"?"#33290F":"#FBF0D6",fg:T.amb},
    r:{bg:T.redD,fg:T.red},
    p:{bg:T.mode==="dark"?"#2A1F45":"#EFE9FB",fg:T.pur},
    b:{bg:T.mode==="dark"?"#1A2E3B":"#E4EEF5",fg:T.blu},
    s:{bg:T.bgEl,fg:T.txtD},
  };
  const col=m[c]||m.s;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:col.bg,color:col.fg,padding:"3px 10px",borderRadius:8,fontSize:11.5,fontWeight:600,letterSpacing:"0.01em",whiteSpace:"nowrap"}}>{children}</span>;
};

const Eyebrow = ({children}) => <div style={{fontFamily:"'Spline Sans Mono',monospace",fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:T.txtF}}>{children}</div>;

const Row=({children,g=12,style:s})=><div style={{display:"flex",alignItems:"center",gap:g,...s}}>{children}</div>;
const Col=({children,g=12,style:s})=><div style={{display:"flex",flexDirection:"column",gap:g,...s}}>{children}</div>;

// ── Modal ──
const Modal = ({ title, onClose, children, width=440 }) => (
  <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#000000bb", backdropFilter:"blur(4px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", animation:"backdrop .2s ease", padding:20 }}>
    <div onClick={e=>e.stopPropagation()} style={{ width, maxWidth:"100%", maxHeight:"90vh", overflow:"auto", background:T.bgCard, border:`1px solid ${T.brdBr}`, borderRadius:16, animation:"slideUp .25s ease", boxShadow:"0 24px 80px #000000aa" }}>
      <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.brd}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:T.bgCard, zIndex:1 }}>
        <div style={{ fontFamily:"Fraunces,serif", fontSize:18, fontWeight:700 }}>{title}</div>
        <button onClick={onClose} style={{ background:"transparent", border:"none", color:T.txtD, fontSize:22, lineHeight:1, cursor:"pointer", padding:0, width:28, height:28 }}>×</button>
      </div>
      <div style={{ padding:22 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, ...p }) => (<div><label>{label}</label><input {...p}/></div>);
const SelectField = ({ label, options, ...p }) => (<div><label>{label}</label><select {...p}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>);

// ── Toasts ──
const Toasts = () => {
  const { toasts } = useStore();
  return (
    <div style={{ position:"fixed", bottom:20, right:20, zIndex:2000, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background:T.bgCard, border:`1px solid ${t.kind==="warn"?T.amb+"66":t.kind==="err"?T.red+"66":T.gMid+"66"}`, borderLeft:`3px solid ${t.kind==="warn"?T.ambL:t.kind==="err"?T.red:T.gBright}`, borderRadius:10, padding:"11px 16px", fontSize:12, color:T.txt, minWidth:220, maxWidth:340, animation:"toastIn .25s ease", boxShadow:"0 8px 28px #00000066" }}>
          <Row g={8}><span>{t.kind==="warn"?"⚠":t.kind==="err"?"✕":"✓"}</span><span>{t.msg}</span></Row>
        </div>
      ))}
    </div>
  );
};

// ── Charts ──
const ElevChart = ({color=T.gBright,data,height=80,showGrid}) => {
  const pts=data||[180,240,310,400,490,560,630,700,730,760,775,780,765,730,680,620,560,480,390,300,220];
  const W=500,H=height,mn=Math.min(...pts),mx=Math.max(...pts),rng=mx-mn||1;
  const n=v=>H-((v-mn)/rng)*(H-12)-6, step=W/(pts.length-1);
  const path=pts.map((v,i)=>`${i===0?"M":"L"}${i*step},${n(v)}`).join(" ");
  const area=path+` L${(pts.length-1)*step},${H} L0,${H} Z`;
  const id=`ec${color.replace(/[^a-z0-9]/gi,"")}${height}`;
  return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}} preserveAspectRatio="none">
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".4"/><stop offset="100%" stopColor={color} stopOpacity=".02"/></linearGradient></defs>
    {showGrid&&[.25,.5,.75].map(f=><line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke={T.brd} strokeWidth="1" vectorEffect="non-scaling-stroke"/>)}
    <path d={area} fill={`url(#${id})`}/><path d={path} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
};

const DCOL={easy:"g",moderate:"a",hard:"r",expert:"p",extreme:"r"};
const CCOL={new:"g",excellent:"g",good:"a",fair:"r",poor:"r",retired:"s"};

// ════════════════════════════════════════════════════════════════════════════
//  3D TRAIL VIEWER
// ════════════════════════════════════════════════════════════════════════════
const Trail3D = ({ route }) => {
  const mountRef=useRef(null), animRef=useRef(null), flyRef=useRef(0);
  const [loaded,setLoaded]=useState(false), [camMode,setCamMode]=useState("orbit"), [failed,setFailed]=useState(false);

  useEffect(()=>{
    const el=mountRef.current; if(!el) return;
    setLoaded(false);
    let renderer;
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    } catch(e) { setFailed(true); return; }
    // Fallback dims if the flex parent hasn't laid out yet (avoids 0x0 canvas → blank view)
    let W=el.clientWidth||el.offsetWidth||800, H=el.clientHeight||el.offsetHeight||600;
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.domElement.style.display="block";
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.1;
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const bgHex = parseInt((T.bg||"#10151A").slice(1), 16);
    scene.fog=new THREE.FogExp2(bgHex,0.016); scene.background=new THREE.Color(bgHex);
    const camera=new THREE.PerspectiveCamera(55,W/H,0.1,500); camera.position.set(30,22,30); camera.lookAt(0,0,0);

    const GRID=80, geo=new THREE.PlaneGeometry(60,60,GRID-1,GRID-1); geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position;
    const noise=(x,z,f,a)=>Math.sin(x*f*.8+z*f*.6)*a+Math.cos(x*f*.5-z*f*.9)*a*.7+Math.sin((x+z)*f*1.3)*a*.5;
    const heights=[];
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);
      const h=noise(x,z,.12,5.5)+noise(x,z,.28,2.2)+noise(x,z,.55,.9)+noise(x,z,1.1,.3)+Math.exp(-((x*x+z*z)/400))*6;
      pos.setY(i,Math.max(0,h)); heights.push(Math.max(0,h));}
    geo.computeVertexNormals();
    const cols=new Float32Array(pos.count*3), maxH=Math.max(...heights);
    for(let i=0;i<pos.count;i++){const t=heights[i]/maxH,c=new THREE.Color();
      if(t<.15)c.setHex(0x0d2d1a);else if(t<.4)c.setHex(0x1a4a2a);else if(t<.65)c.setHex(0x2d6a4f);else if(t<.82)c.setHex(0x4a6050);else c.setHex(0xc8d8e0);
      cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
    geo.setAttribute("color",new THREE.BufferAttribute(cols,3));
    scene.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true})));
    const grid=new THREE.GridHelper(60,30,0x74c69d,0x0f2030); grid.material.opacity=.15; grid.material.transparent=true; scene.add(grid);

    // ── Build the trail curve ──
    // If the route carries real track points (lat/lon/elevation), project them
    // into terrain space. Otherwise fall back to the synthetic spiral to summit.
    const sampleHeight = (x, z) => {
      const gx = Math.round((x/60+.5)*(GRID-1)), gz = Math.round((z/60+.5)*(GRID-1));
      return heights[Math.max(0, Math.min(GRID*GRID-1, gz*GRID+gx))];
    };
    const tp = [];
    const realTrack = route?.track && route.track.length > 1 ? route.track : null;
    if (realTrack) {
      // Normalize lat/lon to the ±28 terrain extent; drape elevation over the surface
      const lats = realTrack.map(p => p.lat), lons = realTrack.map(p => p.lon);
      const eles = realTrack.map(p => p.elevation_m ?? 0);
      const latMin = Math.min(...lats), latMax = Math.max(...lats);
      const lonMin = Math.min(...lons), lonMax = Math.max(...lons);
      const eleMin = Math.min(...eles), eleMax = Math.max(...eles);
      const span = Math.max(latMax-latMin, lonMax-lonMin) || 1;
      realTrack.forEach(p => {
        const x = ((p.lon - lonMin) / span - 0.5) * 48;
        const z = ((p.lat - latMin) / span - 0.5) * 48;
        // Blend GPS elevation with terrain so the line hugs the surface but honors real gain
        const eleNorm = eleMax > eleMin ? (( (p.elevation_m??0) - eleMin)/(eleMax-eleMin)) : 0;
        const y = Math.max(sampleHeight(x, z) + 0.25, eleNorm * 8 + 0.25);
        tp.push(new THREE.Vector3(x, y, z));
      });
    } else {
      const N = 120;
      for (let i=0;i<N;i++){const t=i/(N-1),ang=t*Math.PI*1.6-Math.PI*.8,r=18-t*12;
        const x=Math.cos(ang)*r+Math.sin(t*3)*2,z=Math.sin(ang)*r+Math.cos(t*2.5)*1.5;
        tp.push(new THREE.Vector3(x, sampleHeight(x,z)+.25, z));}
    }
    const curve=new THREE.CatmullRomCurve3(tp);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,200,.12,6,false),new THREE.MeshBasicMaterial({color:0x33aaff})));
    const lineMat=new THREE.LineBasicMaterial({color:0x6fd4ff,transparent:true,opacity:.9});
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(300)),lineMat));

    [[0,0x52b788,1.2],[.35,0x3b82f6,.9],[.65,0xf59e0b,.9],[1,0xe03030,1.4]].forEach(([t,color,sc])=>{
      const pt=curve.getPoint(t);
      const cone=new THREE.Mesh(new THREE.ConeGeometry(.4*sc,1.2*sc,8),new THREE.MeshBasicMaterial({color}));
      cone.position.set(pt.x,pt.y+.8*sc,pt.z); scene.add(cone);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.5*sc,.7*sc,24),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,side:THREE.DoubleSide}));
      ring.position.set(pt.x,pt.y+.1,pt.z); ring.rotation.x=-Math.PI/2; scene.add(ring);});

    scene.add(new THREE.AmbientLight(0x1a3a2a,1.8));
    const sun=new THREE.DirectionalLight(0xfff4e0,2.2); sun.position.set(20,40,15); scene.add(sun);
    const fill=new THREE.DirectionalLight(0x1a4a6a,.8); fill.position.set(-20,10,-20); scene.add(fill);
    const sg=new THREE.BufferGeometry(),sp=new Float32Array(3000);
    for(let i=0;i<3000;i+=3){sp[i]=(Math.random()-.5)*400;sp[i+1]=Math.random()*200+20;sp[i+2]=(Math.random()-.5)*400;}
    sg.setAttribute("position",new THREE.BufferAttribute(sp,3));
    scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xddeef8,size:.3,transparent:true,opacity:.6})));

    let drag=false,lx=0,ly=0,theta=Math.PI/4,phi=Math.PI/4,radius=40;
    const onDown=e=>{drag=true;lx=e.clientX||e.touches?.[0]?.clientX;ly=e.clientY||e.touches?.[0]?.clientY;};
    const onUp=()=>drag=false;
    const onMove=e=>{if(!drag||flyRef.current===1)return;const cx=e.clientX||e.touches?.[0]?.clientX,cy=e.clientY||e.touches?.[0]?.clientY;
      theta-=(cx-lx)*.008;phi=Math.max(.15,Math.min(Math.PI/2.2,phi+(cy-ly)*.006));lx=cx;ly=cy;};
    const onWheel=e=>{radius=Math.max(10,Math.min(80,radius+e.deltaY*.04));};
    renderer.domElement.addEventListener("mousedown",onDown);
    renderer.domElement.addEventListener("touchstart",onDown);
    window.addEventListener("mouseup",onUp); window.addEventListener("touchend",onUp);
    window.addEventListener("mousemove",onMove); window.addEventListener("touchmove",onMove);
    renderer.domElement.addEventListener("wheel",onWheel);

    let fly=0,frame=0;
    const animate=()=>{animRef.current=requestAnimationFrame(animate);frame++;
      if(flyRef.current===1){fly=(fly+.0008)%1;const pt=curve.getPoint(fly),pt2=curve.getPoint(Math.min(1,fly+.02));
        camera.position.set(pt.x,pt.y+1.5,pt.z);camera.lookAt(pt2.x,pt2.y+1.5,pt2.z);}
      else{if(!drag)theta+=.003;camera.position.set(radius*Math.sin(phi)*Math.sin(theta),radius*Math.cos(phi),radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(0,4,0);}
      scene.children.forEach(c=>{if(c.geometry instanceof THREE.RingGeometry){c.scale.setScalar(1+Math.sin(frame*.04)*.12);c.material.opacity=.3+Math.sin(frame*.04)*.2;}});
      lineMat.opacity=.7+Math.sin(frame*.05)*.3; renderer.render(scene,camera);};
    animate(); setLoaded(true);
    const applySize=()=>{const W2=el.clientWidth||el.offsetWidth,H2=el.clientHeight||el.offsetHeight;
      if(W2>0&&H2>0){renderer.setSize(W2,H2);camera.aspect=W2/H2;camera.updateProjectionMatrix();}};
    // ResizeObserver fires once the flex parent settles, fixing any 0x0 initial render
    const ro=new ResizeObserver(applySize); ro.observe(el);
    window.addEventListener("resize",applySize);
    // Belt-and-braces: re-measure a few times early in case observer is late
    const t1=setTimeout(applySize,60), t2=setTimeout(applySize,250), t3=setTimeout(applySize,600);
    return()=>{cancelAnimationFrame(animRef.current);ro.disconnect();clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchend",onUp);window.removeEventListener("mousemove",onMove);window.removeEventListener("touchmove",onMove);window.removeEventListener("resize",applySize);renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[route?.id]);

  const toggle=()=>{flyRef.current=flyRef.current===1?0:1;setCamMode(flyRef.current===1?"fly":"orbit");};
  return(
    <div style={{position:"relative",width:"100%",height:"100%",minHeight:240,background:T.bg}}>
      <div ref={mountRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
      {!loaded&&!failed&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><Spin s={28}/><div style={{fontSize:12,color:T.txtD}}>Building terrain…</div></div>}
      {failed&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}><div style={{fontSize:32}}>🏔</div><div style={{fontSize:13,color:T.txtD}}>3D view needs WebGL</div><div style={{fontSize:11,color:T.txtF}}>Your browser or environment has it disabled</div></div>}
      {loaded&&<>
        <div style={{position:"absolute",top:16,left:16}}>
          <div style={{background:`${T.bgCard}ee`,backdropFilter:"blur(12px)",border:`1px solid ${T.brd}`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Route</div>
            <div style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:700,color:T.gGlow}}>{route?.name||"Lake Serene"}</div>
            <div style={{fontSize:11,color:T.txtD,marginTop:2}}>{route?route.dist+" km · ↑ "+route.gain+"m":"13.2 km · ↑ 1,158m"}</div>
          </div>
        </div>
        <div style={{position:"absolute",top:16,right:16}}>
          <Btn v={camMode==="fly"?"active":"subtle"} sz="sm" onClick={toggle} ic={<span style={{fontSize:12}}>✈</span>}>{camMode==="fly"?"Orbit":"Fly-through"}</Btn>
        </div>
        <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:`${T.bgCard}cc`,backdropFilter:"blur(10px)",border:`1px solid ${T.brd}`,borderRadius:8,padding:"6px 14px",fontSize:11,color:T.txtD}}>
          {camMode==="fly"?"✈ Following trail":"🖱 Drag to orbit · Scroll to zoom"}
        </div>
      </>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  2D TOPO MAP — with working zoom
// ════════════════════════════════════════════════════════════════════════════
const TopoMap2D = () => {
  const [hov,setHov]=useState(null);
  const [zoom,setZoom]=useState(1);
  const [layer,setLayer]=useState("Topo");
  const cs=Array.from({length:22},(_,i)=>{const r=50+i*26,cx=440,cy=320,s=i*1.7;const w=n=>Math.sin(n)*30+Math.cos(n*1.4)*20;
    return `M${cx+r+w(s)},${cy} C${cx+r*.7+w(s+1)},${cy-r+w(s+2)} ${cx+w(s+3)},${cy-r*1.1+w(s+4)} ${cx-r+w(s+5)},${cy} C${cx-r*.7+w(s+6)},${cy+r+w(s+7)} ${cx+w(s+8)},${cy+r*1.1+w(s+9)} ${cx+r+w(s)},${cy} Z`;});
  const track="M70,500 C110,460 180,415 250,380 S360,345 420,320 S500,302 560,294 S640,290 700,295 S770,308 840,330";
  const wpts=[[70,500,T.gBright,"▶ TH","s"],[440,320,T.ambL,"⛰ Summit","sum"],[840,330,T.red,"■ End","e"],[590,332,T.bluL,"💧 Spring","w"]];
  const layerBg={Topo:T.bg,Satellite:"#0a1418",Trail:"#0d1812"};
  return(
    <div style={{width:"100%",height:"100%",background:layerBg[layer],position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",transition:"transform .3s ease",transform:`scale(${zoom})`}} viewBox="0 0 940 640" preserveAspectRatio="xMidYMid slice">
        {layer!=="Satellite"&&cs.map((d,i)=><path key={i} d={d} fill="none" stroke={T.gBright} strokeWidth={i%5===0?1.3:.6} opacity={.04+i*.012}/>)}
        {layer==="Satellite"&&cs.map((d,i)=><path key={i} d={d} fill={i%2?"#0f1a14":"#0c1610"} stroke="none" opacity={.5}/>)}
        <path d="M0,180 Q200,155 380,185 T760,170 T940,180" fill="none" stroke="#4a9fd4" strokeWidth="1.5" opacity=".22"/>
        <defs><filter id="tg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d={track} fill="none" stroke={T.gBright} strokeWidth="3" filter="url(#tg)" strokeLinecap="round"/>
        <path d={track} fill="none" stroke={T.gBright} strokeWidth="1.5" opacity=".4" strokeDasharray="7 14"/>
        {wpts.map(([x,y,c,l,k])=>(<g key={k} style={{cursor:"pointer"}} onMouseEnter={()=>setHov(k)} onMouseLeave={()=>setHov(null)}>
          <circle cx={x} cy={y} r="11" fill={c} opacity=".18"/><circle cx={x} cy={y} r="5" fill={c} style={{filter:`drop-shadow(0 0 6px ${c})`}}/>
          {hov===k&&<g><rect x={x-42} y={y-36} width="84" height="22" rx="5" fill={T.bgCard} stroke={c} strokeWidth="1"/><text x={x} y={y-20} textAnchor="middle" fill={c} fontSize="10" fontFamily="JetBrains Mono">{l}</text></g>}
        </g>))}
      </svg>
      <div style={{position:"absolute",top:16,left:16,background:`${T.bgCard}ee`,backdropFilter:"blur(12px)",border:`1px solid ${T.brd}`,borderRadius:10,padding:"10px 14px"}}>
        <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Active Track</div>
        <div style={{fontFamily:"Fraunces,serif",fontSize:21,fontWeight:700,color:T.gGlow}}>13.2 km</div>
        <div style={{fontSize:11,color:T.txtD}}>↑ 1,158m · Est. 5–7h</div>
      </div>
      <div style={{position:"absolute",bottom:14,right:14,display:"flex",flexDirection:"column",gap:4}}>
        <button onClick={()=>setZoom(z=>Math.min(2.5,z+.25))} style={mapBtn}>+</button>
        <button onClick={()=>setZoom(z=>Math.max(1,z-.25))} style={mapBtn}>−</button>
        <button onClick={()=>setZoom(1)} style={mapBtn}>⊕</button>
      </div>
      <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5}}>
        {["Topo","Satellite","Trail"].map(l=><button key={l} onClick={()=>setLayer(l)} style={{height:26,padding:"0 11px",background:layer===l?`${T.gMid}44`:`${T.bgCard}cc`,backdropFilter:"blur(8px)",border:`1px solid ${layer===l?T.gBright:T.brd}`,borderRadius:6,color:layer===l?T.gBright:T.txtD,fontSize:11,fontFamily:"JetBrains Mono",cursor:"pointer"}}>{l}</button>)}
      </div>
    </div>
  );
};
const mapBtn={width:34,height:34,background:`${T.bgCard}ee`,backdropFilter:"blur(8px)",border:`1px solid ${T.brd}`,borderRadius:7,color:T.txt,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"};

// ════════════════════════════════════════════════════════════════════════════
//  MODALS — forms
// ════════════════════════════════════════════════════════════════════════════
const NewRouteModal = ({ onClose }) => {
  const { addRoute } = useStore();
  const [f,setF]=useState({name:"",loc:"",dist:"",gain:"",diff:"moderate",time:""});
  const [busy,setBusy]=useState(false);
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}));
  const submit=async()=>{
    if(!f.name){return;}
    setBusy(true);
    await addRoute({name:f.name,loc:f.loc||"Unknown",dist:parseFloat(f.dist)||0,gain:parseInt(f.gain)||0,diff:f.diff,time:f.time||"—"});
    setBusy(false); onClose();
  };
  return(
    <Modal title="New Route" onClose={onClose}>
      <Col g={14}>
        <Field label="Route name" placeholder="Lake Serene" value={f.name} onChange={set("name")}/>
        <Field label="Location" placeholder="Index, WA" value={f.loc} onChange={set("loc")}/>
        <Row g={12}><div style={{flex:1}}><Field label="Distance (km)" type="number" placeholder="13.2" value={f.dist} onChange={set("dist")}/></div>
          <div style={{flex:1}}><Field label="Elev. gain (m)" type="number" placeholder="1158" value={f.gain} onChange={set("gain")}/></div></Row>
        <Row g={12}><div style={{flex:1}}><SelectField label="Difficulty" options={["easy","moderate","hard","expert","extreme"]} value={f.diff} onChange={set("diff")}/></div>
          <div style={{flex:1}}><Field label="Est. time" placeholder="5-7h" value={f.time} onChange={set("time")}/></div></Row>
        <Row g={8} style={{marginTop:6}}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn onClick={submit} load={busy} disabled={!f.name} style={{flex:1}}>Create Route</Btn></Row>
      </Col>
    </Modal>
  );
};

const AddGearModal = ({ onClose }) => {
  const { addGear } = useStore();
  const [f,setF]=useState({name:"",brand:"",cat:"Shelter",w:"",cost:""});
  const [busy,setBusy]=useState(false);
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}));
  const submit=async()=>{
    if(!f.name)return;
    setBusy(true);
    await addGear({name:f.name,brand:f.brand||"—",cat:f.cat,w:parseInt(f.w)||0,cost:parseFloat(f.cost)||0,ic:{Shelter:"⛺",Sleep:"🛏",Footwear:"👟",Navigation:"🧭",Pack:"🎒",Electronics:"📡",Other:"🎒"}[f.cat]||"🎒"});
    setBusy(false); onClose();
  };
  return(
    <Modal title="Add Gear" onClose={onClose}>
      <Col g={14}>
        <Field label="Item name" placeholder="Nemo Hornet 2P" value={f.name} onChange={set("name")}/>
        <Field label="Brand" placeholder="Nemo Equipment" value={f.brand} onChange={set("brand")}/>
        <SelectField label="Category" options={["Shelter","Sleep","Footwear","Navigation","Pack","Electronics","Other"]} value={f.cat} onChange={set("cat")}/>
        <Row g={12}><div style={{flex:1}}><Field label="Weight (g)" type="number" placeholder="990" value={f.w} onChange={set("w")}/></div>
          <div style={{flex:1}}><Field label="Cost (USD)" type="number" placeholder="549" value={f.cost} onChange={set("cost")}/></div></Row>
        <Row g={8} style={{marginTop:6}}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn onClick={submit} load={busy} disabled={!f.name} style={{flex:1}}>Add Gear</Btn></Row>
      </Col>
    </Modal>
  );
};

const StartTripModal = ({ onClose, prefill }) => {
  const { startTrip, routes } = useStore();
  const [name,setName]=useState(prefill||"");
  const [busy,setBusy]=useState(false);
  const submit=async()=>{
    if(!name)return; setBusy(true);
    await startTrip(name); setBusy(false); onClose();
  };
  return(
    <Modal title="Start Trip" onClose={onClose} width={400}>
      <Col g={14}>
        <Field label="Trip name" placeholder="Morning hike" value={name} onChange={e=>setName(e.target.value)}/>
        <div><label>Or pick a saved route</label>
          <select value="" onChange={e=>e.target.value&&setName(e.target.value)}>
            <option value="">— select —</option>
            {routes.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <Row g={8} style={{marginTop:6}}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn onClick={submit} load={busy} disabled={!name} style={{flex:1}} ic={<span style={{fontSize:11}}>▶</span>}>Start</Btn></Row>
      </Col>
    </Modal>
  );
};

const AddReportModal = ({ onClose }) => {
  const { addReport, routes } = useStore();
  const [f,setF]=useState({route:routes[0]?.name||"",cond:"good",msg:"",rating:4});
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}));
  const submit=()=>{ if(!f.msg)return; addReport({route:f.route,cond:f.cond,msg:f.msg,rating:parseInt(f.rating)}); onClose(); };
  return(
    <Modal title="Add Trail Report" onClose={onClose}>
      <Col g={14}>
        <SelectField label="Route" options={routes.map(r=>r.name)} value={f.route} onChange={set("route")}/>
        <SelectField label="Condition" options={["excellent","good","fair","poor","impassable"]} value={f.cond} onChange={set("cond")}/>
        <div><label>Report</label><textarea rows={3} placeholder="Trail is clear, some mud after mile 4…" value={f.msg} onChange={set("msg")} style={{resize:"vertical"}}/></div>
        <div><label>Rating: {f.rating} ★</label><input type="range" min="1" max="5" value={f.rating} onChange={set("rating")} style={{padding:0,height:6}}/></div>
        <Row g={8} style={{marginTop:6}}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn onClick={submit} disabled={!f.msg} style={{flex:1}}>Post Report</Btn></Row>
      </Col>
    </Modal>
  );
};

const SosModal = ({ onClose }) => {
  const { toast } = useStore();
  const [sent,setSent]=useState(false);
  const send=()=>{ setSent(true); toast("SOS alert sent to emergency contacts","warn"); setTimeout(onClose,2000); };
  return(
    <Modal title="Emergency SOS" onClose={onClose} width={380}>
      {!sent?<Col g={16}>
        <div style={{background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:10,padding:16,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:8}}>🆘</div>
          <div style={{fontSize:13,color:T.txt,lineHeight:1.6}}>This will share your live location with your emergency contacts and, if configured, alert search & rescue.</div>
        </div>
        <Row g={8}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn v="danger" onClick={send} style={{flex:1}}>Send SOS</Btn></Row>
      </Col>:
      <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40,marginBottom:12}}>✓</div><div style={{color:T.gBright}}>Alert sent. Stay where you are if safe.</div></div>}
    </Modal>
  );
};

const JournalModal = ({ trip, onClose }) => {
  const { addJournal } = useStore();
  const [body,setBody]=useState("");
  const submit=()=>{ if(!body)return; addJournal(trip.id,body); onClose(); };
  return(
    <Modal title={`Journal — ${trip.name}`} onClose={onClose}>
      <Col g={14}>
        <div><label>Entry</label><textarea rows={4} placeholder="Summit reached, weather holding…" value={body} onChange={e=>setBody(e.target.value)} style={{resize:"vertical"}}/></div>
        <Row g={8}><Btn v="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn><Btn onClick={submit} disabled={!body} style={{flex:1}}>Add Entry</Btn></Row>
      </Col>
    </Modal>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  LIVE TRACKING (functional timer + end → saves trip)
// ════════════════════════════════════════════════════════════════════════════
const LiveTracking = () => {
  const { activeTrip, startTrip, endTrip, toast } = useStore();
  const [elapsed,setElapsed]=useState(0);
  const [dist,setDist]=useState(0);
  const [showSos,setShowSos]=useState(false);
  const [showStart,setShowStart]=useState(false);

  useEffect(()=>{
    if(!activeTrip)return;
    setElapsed(0); setDist(0);
    const iv=setInterval(()=>{ setElapsed(e=>e+1); setDist(d=>d+0.003); },1000);
    return ()=>clearInterval(iv);
  },[activeTrip]);

  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const friends=[{name:"Maya K",pos:"2.1km ahead",color:T.ambL,status:"active"},{name:"Jordan T",pos:"0.4km behind",color:T.bluL,status:"active"},{name:"Sam R",pos:"At trailhead",color:T.sMed,status:"waiting"}];

  const finish=()=>{
    endTrip(activeTrip.id,{dist:+dist.toFixed(1),gain:Math.round(dist*85),dur:fmt(elapsed),date:"Today"});
  };

  return(
    <Card>
      {showSos&&<SosModal onClose={()=>setShowSos(false)}/>}
      {showStart&&<StartTripModal onClose={()=>setShowStart(false)}/>}
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Row><div style={{width:8,height:8,borderRadius:"50%",background:activeTrip?T.gBright:T.sDim,animation:activeTrip?"pulse 1.5s ease infinite":"none"}}/>
          <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Live Tracking</div></Row>
        {activeTrip
          ?<Btn v="danger" sz="sm" onClick={finish} ic={<span style={{fontSize:11}}>■</span>}>End Trip</Btn>
          :<Btn v="pri" sz="sm" onClick={()=>setShowStart(true)} ic={<span style={{fontSize:11}}>▶</span>}>Start Trip</Btn>}
      </div>
      <div style={{padding:18}}>
        {activeTrip&&<div style={{background:`${T.gMid}11`,border:`1px solid ${T.gMid}44`,borderRadius:10,padding:16,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:11,color:T.gBright,marginBottom:4}}>● {activeTrip.name}</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:34,fontWeight:700,color:T.gGlow,letterSpacing:"0.05em"}}>{fmt(elapsed)}</div>
          <Row g={32} style={{justifyContent:"center",marginTop:10}}>
            <div><div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700}}>{dist.toFixed(2)}</div><div style={{fontSize:10,color:T.txtD}}>KM</div></div>
            <div><div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700}}>{Math.round(dist*85)}</div><div style={{fontSize:10,color:T.txtD}}>M GAIN</div></div>
            <div><div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700}}>{dist>0?(elapsed/60/dist).toFixed(1):"—"}</div><div style={{fontSize:10,color:T.txtD}}>MIN/KM</div></div>
          </Row>
        </div>}
        <div style={{fontSize:11,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Group · 3 Members</div>
        {friends.map((f,i)=>(<Row key={i} g={12} style={{padding:"9px 0",borderBottom:i<friends.length-1?`1px solid ${T.brd}`:"none"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:f.color+"33",border:`1px solid ${f.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:f.color,flexShrink:0}}>{f.name.charAt(0)}</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{f.name}</div><div style={{fontSize:11,color:T.txtD}}>{f.pos}</div></div>
          <div style={{width:8,height:8,borderRadius:"50%",background:f.status==="active"?T.gBright:T.sDim,boxShadow:f.status==="active"?`0 0 8px ${T.gBright}`:undefined}}/>
        </Row>))}
        <Row g={8} style={{marginTop:14}}>
          <Btn v="subtle" style={{flex:1}} onClick={()=>toast("Location shared with group")} ic={<span style={{fontSize:12}}>📍</span>}>Share Location</Btn>
          <Btn v="danger" onClick={()=>setShowSos(true)} ic={<span style={{fontSize:12}}>🆘</span>}>SOS</Btn>
        </Row>
      </div>
    </Card>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  WEATHER
// ════════════════════════════════════════════════════════════════════════════
const WeatherPanel = () => {
  const days=[{d:"Today",icon:"⛅",hi:12,lo:4,rain:20,wind:18},{d:"Sat",icon:"☀",hi:15,lo:6,rain:5,wind:12},{d:"Sun",icon:"🌧",hi:8,lo:2,rain:80,wind:28},{d:"Mon",icon:"⛅",hi:11,lo:3,rain:30,wind:20},{d:"Tue",icon:"☀",hi:14,lo:5,rain:10,wind:15}];
  const [sel,setSel]=useState(0);
  const d=days[sel];
  const risk=d.rain>60?{l:"HIGH RISK",c:"r"}:d.rain>30?{l:"MODERATE",c:"a"}:{l:"LOW RISK",c:"g"};
  return(
    <Card>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Trail Conditions Forecast</div>
        <Badge c={risk.c}>{risk.l}</Badge>
      </div>
      <div style={{padding:18}}>
        <Row g={8} style={{marginBottom:18}}>
          {days.map((dd,i)=>(<div key={i} onClick={()=>setSel(i)} style={{flex:1,background:sel===i?`${T.gMid}22`:T.bgEl,border:`1px solid ${sel===i?T.gMid:T.brd}`,borderRadius:10,padding:"10px 8px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
            <div style={{fontSize:10,color:T.txtD,marginBottom:4}}>{dd.d}</div><div style={{fontSize:20,marginBottom:4}}>{dd.icon}</div>
            <div style={{fontSize:12,fontWeight:600}}>{dd.hi}°</div><div style={{fontSize:10,color:T.txtD}}>{dd.lo}°</div>
            <div style={{fontSize:10,color:T.bluL,marginTop:4}}>💧{dd.rain}%</div></div>))}
        </Row>
        <Row g={10}>{[["Wind",`${d.wind} km/h`,"💨"],["Rain",`${d.rain}%`,"💧"],["High/Low",`${d.hi}°/${d.lo}°`,"🌡"]].map(([l,v,ic])=>(
          <div key={l} style={{flex:1,background:T.bgEl,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:14,marginBottom:4}}>{ic}</div><div style={{fontSize:11,color:T.txtD,marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>))}</Row>
      </div>
    </Card>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SCREENS
// ════════════════════════════════════════════════════════════════════════════
const StatTile=({label,value,unit,delta,up,accent,icon,delay=0})=>(
  <Card style={{padding:20,position:"relative",overflow:"hidden",animation:`fadeIn .45s ease ${delay}s both`}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:accent,opacity:.8}}/>
    <div style={{position:"absolute",right:14,top:14,fontSize:26,opacity:.1}}>{icon}</div>
    <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:7}}>{label}</div>
    <div style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:700,lineHeight:1,marginBottom:3}}>{value}</div>
    <div style={{fontSize:11,color:T.txtD,marginBottom:5}}>{unit}</div>
    {delta&&<div style={{fontSize:11,color:up?T.gBright:T.red}}>{up?"↑":"↓"} {delta}</div>}
  </Card>
);

const Dashboard = ({ go }) => {
  const { trips, gear, routes } = useStore();
  const { isMobile } = useTheme();
  const totalDist=trips.reduce((s,t)=>s+(t.dist||0),0).toFixed(0);
  const totalGain=trips.reduce((s,t)=>s+(t.gain||0),0).toLocaleString();
  const activeCount=trips.filter(t=>t.status==="active").length;
  const needsAttn=gear.filter(g=>g.life<25).length;
  return(
    <div style={{flex:1,overflow:"auto",padding:isMobile?16:26,display:"flex",flexDirection:"column",gap:isMobile?16:22}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?10:14}}>
        <StatTile label="Total Distance" value={totalDist} unit="km logged" delta="+18% vs 2023" up accent={T.gBright} icon="🗺" delay={0}/>
        <StatTile label="Elevation Gain" value={totalGain} unit="metres" delta="+11%" up accent={T.ambL} icon="📈" delay={.07}/>
        <StatTile label="Active Trips" value={activeCount} unit="ongoing now" delta={activeCount?"Tracking live":"None active"} up={!!activeCount} accent={T.ambL} icon="⛺" delay={.14}/>
        <StatTile label="Gear Items" value={gear.length} unit="tracked" delta={needsAttn?`${needsAttn} need attention`:"All good"} up={!needsAttn} accent={T.red} icon="🎒" delay={.21}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr",gap:isMobile?16:20}}>
        <Col g={20}>
          <Card style={{animation:"fadeIn .4s ease .3s both"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>{trips[0]?.name||"Latest"} — Elevation</div>
              <Btn v="ghost" sz="xs" onClick={()=>go("trips")}>View trip →</Btn>
            </div>
            <div style={{padding:18}}>
              <ElevChart height={100} showGrid/>
              <Row g={26} style={{marginTop:14}}>
                {[["Max","2,394m"],["Min","614m"],["Grade","6.4%"],["Duration","11h 42m"],["Calories","3,840"]].map(([l,v])=>(
                  <div key={l}><div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:700,marginTop:2}}>{v}</div></div>))}
              </Row>
            </div>
          </Card>
          <WeatherPanel/>
        </Col>
        <Col g={20}>
          <LiveTracking/>
          <Card style={{animation:"fadeIn .4s ease .4s both"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Saved Routes</div>
              <Btn v="ghost" sz="xs" onClick={()=>go("explore")}>Explore →</Btn>
            </div>
            <div style={{padding:"6px 18px"}}>
              {routes.slice(0,4).map((r,i)=>(<Row key={r.id} g={12} style={{padding:"10px 0",borderBottom:i<3?`1px solid ${T.brd}`:"none",cursor:"pointer"}} onClick={()=>go("explore")}>
                <div style={{width:38,height:38,borderRadius:9,background:`${T.gMid}22`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{r.icon}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div><div style={{fontSize:11,color:T.txtD}}>{r.dist}km · ↑{r.gain}m</div></div>
                <Badge c={DCOL[r.diff]}>{r.diff}</Badge>
              </Row>))}
            </div>
          </Card>
        </Col>
      </div>
      <div style={{textAlign:"center",padding:"8px 0 2px",fontFamily:"'Spline Sans Mono',monospace",fontSize:9.5,letterSpacing:"0.14em",textTransform:"uppercase",color:T.txtF}}>
        Powered by Daie DillyAI Enterprise
      </div>
    </div>
  );
};

const Explore = ({ openNewRoute }) => {
  const { routes, deleteRoute, exportGpx, startTrip, toast, online } = useStore();
  const { isMobile } = useTheme();
  const [sel,setSel]=useState(routes[1]||routes[0]);
  const [show3D,setShow3D]=useState(false);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [detail,setDetail]=useState(null); // full route w/ track for 3D
  useEffect(()=>{ if(!routes.find(r=>r.id===sel?.id))setSel(routes[0]); },[routes,sel]);
  // When 3D is opened for a server route lacking track points, fetch full detail
  useEffect(()=>{
    let cancel=false;
    if(show3D && online && sel && !sel.track && typeof sel.id==="string" && sel.id.length>10){
      backend.getRoute(sel.id).then(d=>{ if(!cancel) setDetail(d); }).catch(()=>{});
    } else { setDetail(null); }
    return ()=>{cancel=true;};
  },[show3D,sel,online]);
  const view3D = detail && detail.id===sel?.id ? detail : sel;
  const filtered=routes.filter(r=>(filter==="all"||r.diff===filter)&&r.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div style={{flex:1,display:"flex",flexDirection:isMobile?"column":"row",overflow:"hidden"}}>
      <div style={{width:isMobile?"100%":340,height:isMobile?260:"auto",flexShrink:0,borderRight:isMobile?"none":`1px solid ${T.brd}`,borderBottom:isMobile?`1px solid ${T.brd}`:"none",display:"flex",flexDirection:"column",overflow:"hidden",order:isMobile?2:1}}>
        <div style={{padding:12,borderBottom:`1px solid ${T.brd}`,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:T.sDim,fontSize:13,pointerEvents:"none"}}>🔍</span>
            <input placeholder="Search routes…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:34,height:34,fontSize:12}}/></div>
          <Row g={5} style={{flexWrap:"wrap"}}>{["all","easy","moderate","hard","expert"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{height:24,padding:"0 10px",borderRadius:20,border:`1px solid ${filter===f?T.gBright:T.brd}`,background:filter===f?`${T.gMid}33`:"transparent",color:filter===f?T.gBright:T.txtD,fontSize:10,cursor:"pointer"}}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>))}
          </Row>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.length===0&&<div style={{padding:30,textAlign:"center",color:T.txtF,fontSize:12}}>No routes match.</div>}
          {filtered.map(r=>(<div key={r.id} onClick={()=>setSel(r)} style={{borderBottom:`1px solid ${T.brd}`,cursor:"pointer",background:sel?.id===r.id?T.bgHov:"transparent"}}>
            {sel?.id===r.id?(
              <div style={{padding:18,animation:"fadeIn .25s ease"}}>
                <Row style={{marginBottom:10}}><span style={{fontSize:28}}>{r.icon}</span>
                  <div style={{flex:1}}><div style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:700}}>{r.name}</div><div style={{fontSize:11,color:T.txtD}}>📍 {r.loc}</div></div>
                  <Badge c={DCOL[r.diff]}>{r.diff}</Badge></Row>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {[["Distance",r.dist+"km"],["Elev. Gain",r.gain+"m"],["Est. Time",r.time],["Rating",r.rating?r.rating+" ★":"—"]].map(([l,v])=>(
                    <div key={l} style={{background:T.bgEl,borderRadius:8,padding:"9px 11px"}}><div style={{fontSize:9,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div><div style={{fontFamily:"Fraunces,serif",fontSize:18,fontWeight:700}}>{v}</div></div>))}
                </div>
                <ElevChart color={T.ambL} height={52}/>
                <Col g={6} style={{marginTop:12}}>
                  <Row g={6}><Btn style={{flex:1}} onClick={()=>startTrip(r)}>Start Trip</Btn>
                    <Btn v={show3D?"active":"ghost"} onClick={()=>setShow3D(s=>!s)} ic={<span style={{fontSize:12}}>🏔</span>}>3D</Btn></Row>
                  <Row g={6}><Btn v="ghost" style={{flex:1}} onClick={()=>exportGpx(r)} ic={<span style={{fontSize:11}}>↓</span>}>Export GPX</Btn>
                    <Btn v="danger" onClick={()=>{deleteRoute(r.id);}} ic={<span style={{fontSize:11}}>🗑</span>}>Delete</Btn></Row>
                </Col>
              </div>
            ):(
              <Row g={11} style={{padding:"12px 16px"}}><span style={{fontSize:20}}>{r.icon}</span>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div><div style={{fontSize:11,color:T.txtD,marginTop:2}}>{r.dist}km · ↑{r.gain}m</div></div>
                <Badge c={DCOL[r.diff]}>{r.diff}</Badge></Row>
            )}
          </div>))}
        </div>
        <div style={{padding:12,borderTop:`1px solid ${T.brd}`}}>
          <Btn onClick={openNewRoute} style={{width:"100%"}} ic={<span style={{fontSize:12}}>＋</span>}>New Route</Btn>
        </div>
      </div>
      <div style={{flex:1,position:"relative",overflow:"hidden",order:isMobile?1:2,minHeight:isMobile?240:0}}>
        {show3D?<Trail3D route={view3D}/>:<TopoMap2D/>}
        <div style={{position:"absolute",top:14,right:14}}><Btn v={show3D?"active":"subtle"} sz="sm" onClick={()=>setShow3D(s=>!s)} ic={<span style={{fontSize:13}}>🏔</span>}>{show3D?"2D Map":"3D View"}</Btn></div>
      </div>
    </div>
  );
};

const Trips = ({ openStart }) => {
  const { trips, exportGpx, toast } = useStore();
  const { isMobile } = useTheme();
  const [sel,setSel]=useState(trips[0]);
  const [show3D,setShow3D]=useState(false);
  const [journalFor,setJournalFor]=useState(null);
  useEffect(()=>{ if(!trips.find(t=>t.id===sel?.id))setSel(trips[0]); },[trips,sel]);
  return(
    <div style={{flex:1,display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 380px",gap:isMobile?16:22,padding:isMobile?16:22,overflow:"auto"}}>
      {journalFor&&<JournalModal trip={journalFor} onClose={()=>setJournalFor(null)}/>}
      <div>
        {trips.map((t,i)=>(<div key={t.id} onClick={()=>setSel(t)} style={{background:T.bgCard,border:`1px solid ${sel?.id===t.id?T.brdBr:T.brd}`,borderLeft:`3px solid ${t.color}`,borderRadius:14,padding:18,marginBottom:12,cursor:"pointer",transition:"all .2s",animation:`fadeIn .4s ease ${i*.08}s both`}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateX(4px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
          <Row style={{marginBottom:10,justifyContent:"space-between"}}>
            <div><div style={{fontFamily:"Fraunces,serif",fontSize:15,fontWeight:600,marginBottom:2}}>{t.name}</div><div style={{fontSize:11,color:T.txtD}}>{t.date}</div></div>
            <Badge c={t.status==="active"?"a":"g"}>{t.status==="active"?"🟢 Active":"Completed"}</Badge></Row>
          <ElevChart color={t.color} height={44}/>
          <Row g={22} style={{marginTop:10}}>{[["Distance",t.dist+"km"],["Elev.",t.gain+"m"],["Time",t.dur]].map(([l,v])=>(
            <div key={l}><div style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:600}}>{v}</div><div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div></div>))}</Row>
        </div>))}
        <Btn v="subtle" onClick={openStart} style={{width:"100%",marginTop:4}} ic={<span style={{fontSize:12}}>▶</span>}>Start New Trip</Btn>
      </div>
      {sel&&<Card style={{position:isMobile?"static":"sticky",top:0,maxHeight:isMobile?"none":"calc(100vh - 130px)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:13,fontWeight:600}}>{sel.name}</div>
          <Row g={6}><Badge c={sel.status==="active"?"a":"g"}>{sel.status}</Badge>
            <Btn v={show3D?"active":"ghost"} sz="xs" onClick={()=>setShow3D(s=>!s)} ic={<span style={{fontSize:10}}>🏔</span>}>3D</Btn></Row>
        </div>
        {show3D?<div style={{height:240,flexShrink:0}}><Trail3D route={sel}/></div>:<div style={{padding:"14px 18px 0"}}><ElevChart color={sel.color} height={72}/></div>}
        <div style={{padding:18,overflowY:"auto",flex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Distance",sel.dist+"km"],["Duration",sel.dur],["Elev. Gain",sel.gain+"m"],["Date",sel.date]].map(([l,v])=>(
              <div key={l} style={{background:T.bgEl,borderRadius:9,padding:11}}><div style={{fontSize:9,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div><div style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:700}}>{v}</div></div>))}
          </div>
          <Row style={{justifyContent:"space-between",marginBottom:9}}>
            <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em"}}>Journal</div>
            <Btn v="ghost" sz="xs" onClick={()=>setJournalFor(sel)} ic={<span style={{fontSize:10}}>＋</span>}>Add</Btn>
          </Row>
          {(sel.journal||[]).length===0&&<div style={{fontSize:11,color:T.txtF,padding:"8px 0"}}>No entries yet.</div>}
          {(sel.journal||[]).map((e,i)=>(<Row key={i} g={9} style={{marginBottom:9,alignItems:"flex-start"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:sel.color,marginTop:6,flexShrink:0,boxShadow:`0 0 5px ${sel.color}`}}/>
            <div style={{fontSize:12,color:T.txtD,lineHeight:1.55}}>{e}</div></Row>))}
          <Row g={6} style={{marginTop:14}}><Btn style={{flex:1}} onClick={()=>toast("Opening full report…")}>Full Report</Btn><Btn v="ghost" onClick={()=>exportGpx({name:sel.name,gain:sel.gain})}>Export</Btn></Row>
        </div>
      </Card>}
    </div>
  );
};

const Gear = ({ openAddGear }) => {
  const { gear, deleteGear } = useStore();
  const { isMobile } = useTheme();
  const [tab,setTab]=useState("inventory");
  const totalW=gear.reduce((s,g)=>s+(g.w||0),0);
  const totalCost=gear.reduce((s,g)=>s+(g.cost||0),0);
  const needsRepl=gear.filter(g=>g.life<25).length;
  const avgLife=Math.round(gear.reduce((s,g)=>s+g.life,0)/(gear.length||1));
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",gap:4,padding:"0 22px",borderBottom:`1px solid ${T.brd}`,background:T.bgCard,flexShrink:0,alignItems:"center"}}>
        {["inventory","loadouts","analytics"].map(t=>(<button key={t} onClick={()=>setTab(t)} style={{height:46,padding:"0 14px",background:"transparent",border:"none",color:tab===t?T.gBright:T.txtD,fontSize:12,cursor:"pointer",position:"relative"}}>
          {tab===t&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:T.gBright,borderRadius:"2px 2px 0 0"}}/>}{t.charAt(0).toUpperCase()+t.slice(1)}</button>))}
        <div style={{marginLeft:"auto"}}><Btn sz="sm" onClick={openAddGear} ic={<span style={{fontSize:11}}>＋</span>}>Add Gear</Btn></div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:isMobile?16:22}}>
        {tab==="inventory"&&(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(256px,1fr))",gap:14}}>
            {gear.map((g,i)=>(<Card key={g.id} style={{padding:16,animation:`fadeIn .4s ease ${i*.06}s both`}}>
              <Row style={{marginBottom:10,justifyContent:"space-between"}}><span style={{fontSize:26}}>{g.ic}</span>
                <Row g={6}><Badge c={CCOL[g.cond]}>{g.cond}</Badge>
                  <button onClick={()=>deleteGear(g.id)} style={{background:"transparent",border:"none",color:T.txtF,fontSize:14,cursor:"pointer",padding:0}} title="Remove">🗑</button></Row></Row>
              <div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{g.name}</div>
              <div style={{fontSize:11,color:T.txtD,marginBottom:12}}>{g.brand} · {g.cat}</div>
              <Row g={14} style={{marginBottom:12}}>{[["Weight",g.w+"g"],["Cost","$"+g.cost],["Used",g.uses+"×"]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:9,color:T.txtF,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div><div style={{fontSize:12,color:T.txtD,marginTop:2}}>{v}</div></div>))}</Row>
              <div><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:4}}><span>Lifespan</span><span style={{color:g.life<25?T.red:g.life<60?T.ambL:T.gBright,fontWeight:600}}>{g.life}%</span></Row>
                <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${g.life}%`,background:g.life<25?T.red:g.life<60?T.ambL:T.gBright,borderRadius:2,transition:"width .6s ease"}}/></div></div>
            </Card>))}
          </div>
        )}
        {tab==="loadouts"&&(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 340px",gap:isMobile?16:22}}>
            <div><div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700,marginBottom:18}}>Full Inventory Loadout</div>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
                {gear.map((g,i)=>(<Card key={g.id} style={{padding:14,animation:`fadeIn .35s ease ${i*.06}s both`}}><Row g={10}><span style={{fontSize:22}}>{g.ic}</span>
                  <div><div style={{fontSize:12,fontWeight:500}}>{g.name}</div><div style={{fontSize:11,color:T.txtD}}>{g.w}g</div></div></Row></Card>))}
              </div>
            </div>
            <Card style={{padding:18,alignSelf:"start"}}>
              <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Total Pack Weight</div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:36,fontWeight:700,color:T.gGlow,marginBottom:3}}>{(totalW/1000).toFixed(2)} kg</div>
              <div style={{fontSize:11,color:T.txtD,marginBottom:14}}>{totalW<4500?"⚡ Ultralight":totalW<7300?"Lightweight":"Traditional"} · {gear.length} items</div>
              {gear.slice(0,6).map(g=>(<div key={g.id} style={{marginBottom:8}}><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:3}}><span>{g.name.slice(0,18)}</span><span>{g.w}g</span></Row>
                <div style={{height:3,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(g.w/totalW)*100}%`,background:T.gBright,borderRadius:2}}/></div></div>))}
            </Card>
          </div>
        )}
        {tab==="analytics"&&(
          <Col g={20}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:16}}>
              <StatTile label="Total Value" value={"$"+totalCost.toLocaleString()} unit="invested" accent={T.gBright} icon="💰"/>
              <StatTile label="Needs Replacement" value={needsRepl} unit="items under 25%" accent={T.red} icon="⚠"/>
              <StatTile label="Avg Lifespan" value={avgLife+"%"} unit="remaining" accent={T.ambL} icon="📊"/>
            </div>
            <Card><div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Weight by Category</div></div>
              <div style={{padding:18}}>{Object.entries(gear.reduce((a,g)=>{a[g.cat]=(a[g.cat]||0)+g.w;return a;},{})).map(([cat,w])=>(
                <div key={cat} style={{marginBottom:10}}><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:3}}><span>{cat}</span><span>{w}g</span></Row>
                  <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(w/totalW)*100}%`,background:T.gBright,borderRadius:2}}/></div></div>))}
              </div></Card>
          </Col>
        )}
      </div>
    </div>
  );
};

const Community = ({ openAddReport }) => {
  const { reports, toast } = useStore();
  const { isMobile } = useTheme();
  const condCol={excellent:"g",good:"a",fair:"a",poor:"r",impassable:"r"};
  const [following,setFollowing]=useState(["Maya R","Jordan T","Priya M","Sam B"]);
  return(
    <div style={{flex:1,overflow:"auto",padding:isMobile?16:22}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?16:20}}>
        <Card>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Trail Reports</div>
            <Btn sz="sm" onClick={openAddReport} ic={<span style={{fontSize:11}}>＋</span>}>Add Report</Btn>
          </div>
          <div style={{padding:"6px 18px"}}>
            {reports.map((r,i)=>(<div key={r.id} style={{padding:"12px 0",borderBottom:i<reports.length-1?`1px solid ${T.brd}`:"none"}}>
              <Row style={{marginBottom:8}}><div style={{width:28,height:28,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.gBright,flexShrink:0}}>{r.user.charAt(0)}</div>
                <div style={{flex:1,minWidth:0}}><Row g={8}><span style={{fontSize:12,fontWeight:500}}>{r.user}</span><span style={{fontSize:10,color:T.txtF}}>·</span><span style={{fontSize:11,color:T.txtD}}>{r.route}</span></Row><div style={{fontSize:10,color:T.txtF}}>{r.time}</div></div>
                <Badge c={condCol[r.cond]}>{r.cond}</Badge></Row>
              <div style={{fontSize:12,color:T.txtD,lineHeight:1.6,marginLeft:36}}>{r.msg}</div>
              <Row style={{marginLeft:36,marginTop:6,gap:2}}>{Array.from({length:5}).map((_,j)=><span key={j} style={{color:j<r.rating?T.ambL:T.txtF,fontSize:11}}>{j<r.rating?"★":"☆"}</span>)}</Row>
            </div>))}
          </div>
        </Card>
        <Col g={20}>
          <Card>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Leaderboard — This Month</div></div>
            <div style={{padding:"6px 18px"}}>{[{name:"Alex K",km:"124 km",icon:"🥇",col:T.ambBr},{name:"Maya R",km:"108 km",icon:"🥈",col:T.sLt},{name:"Jordan T",km:"97 km",icon:"🥉",col:T.amb},{name:"Priya M",km:"84 km",icon:"4",col:T.txtD},{name:"You",km:"71 km",icon:"5",col:T.gBright}].map((p,i)=>(
              <Row key={i} style={{padding:"9px 0",borderBottom:i<4?`1px solid ${T.brd}`:"none",gap:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<3?14:11,fontWeight:700,color:p.col,flexShrink:0}}>{p.icon}</div>
                <div style={{flex:1,fontSize:13,fontWeight:500}}>{p.name}</div><div style={{fontSize:13,color:T.gBright,fontWeight:600}}>{p.km}</div></Row>))}
            </div>
          </Card>
          <Card>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600}}>Following · {following.length}</div></div>
            <div style={{padding:"6px 18px"}}>{following.map((n,i)=>(<Row key={i} style={{padding:"9px 0",borderBottom:i<following.length-1?`1px solid ${T.brd}`:"none",justifyContent:"space-between"}}>
              <Row g={10}><div style={{width:32,height:32,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.gBright}}>{n.charAt(0)}</div>
                <div><div style={{fontSize:12,fontWeight:500}}>{n}</div><div style={{fontSize:11,color:T.txtD}}>Hiked 3 days ago</div></div></Row>
              <Btn v="ghost" sz="xs" onClick={()=>{setFollowing(f=>f.filter(x=>x!==n));toast(`Unfollowed ${n}`);}}>Unfollow</Btn></Row>))}</div>
          </Card>
        </Col>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  FEED — photo/video shorts with likes + comments
// ════════════════════════════════════════════════════════════════════════════
const CommentSheet = ({ post, onClose }) => {
  const { online } = useStore();
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancel = false;
    if (online) { backend.listComments(post.id).then(c => { if(!cancel) setComments(c); }).catch(()=>{}); }
    else setComments([
      { id:"c1", body:"This is stunning 😍", author:{display_name:"Maya R"}, created_at:"1h ago" },
      { id:"c2", body:"Adding this to my list", author:{display_name:"Ben T"}, created_at:"40m ago" },
    ]);
    return () => { cancel = true; };
  }, [post.id, online]);
  const submit = async () => {
    if (!body.trim()) return;
    setLoading(true);
    const entry = { id: uid(), body, author:{display_name:"You"}, created_at:"now" };
    setComments(cs => [...cs, entry]); setBody("");
    if (online) { try { await backend.addComment(post.id, entry.body); } catch {} }
    setLoading(false);
  };
  return (
    <Modal title={`Comments · ${post.comment_count ?? comments.length}`} onClose={onClose}>
      <Col g={12}>
        <div style={{ maxHeight:300, overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
          {comments.length===0 && <div style={{fontSize:12,color:T.txtF}}>No comments yet — be the first.</div>}
          {comments.map(c => (
            <Row key={c.id} g={10} style={{ alignItems:"flex-start" }}>
              <div style={{ width:28,height:28,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.gBright,flexShrink:0 }}>{c.author.display_name.charAt(0)}</div>
              <div style={{ flex:1 }}>
                <Row g={6}><span style={{fontSize:12,fontWeight:500}}>{c.author.display_name}</span><span style={{fontSize:10,color:T.txtF}}>{c.created_at}</span></Row>
                <div style={{ fontSize:12,color:T.txtD,lineHeight:1.5 }}>{c.body}</div>
              </div>
            </Row>
          ))}
        </div>
        <Row g={8}>
          <input placeholder="Add a comment…" value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{ flex:1 }}/>
          <Btn onClick={submit} load={loading} disabled={!body.trim()}>Post</Btn>
        </Row>
      </Col>
    </Modal>
  );
};

const CreatePostModal = ({ onClose }) => {
  const { createPost } = useStore();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [kind, setKind] = useState("photo");
  const [caption, setCaption] = useState("");
  const [loc, setLoc] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const onPick = e => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setKind(f.type.startsWith("video") ? "video" : "photo");
    setPreview(URL.createObjectURL(f));
  };
  const submit = async () => {
    setBusy(true);
    await createPost({ file, kind, caption, location_name: loc });
    setBusy(false); onClose();
  };
  return (
    <Modal title="New Post" onClose={onClose}>
      <Col g={14}>
        <div onClick={()=>fileRef.current?.click()} style={{ height:200, borderRadius:12, border:`1px dashed ${T.brdBr}`, background:preview?"#000":T.bgEl, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {preview ? (
            kind==="video"
              ? <video src={preview} style={{width:"100%",height:"100%",objectFit:"cover"}} muted autoPlay loop/>
              : <img src={preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ) : (
            <Col g={6} style={{ alignItems:"center" }}>
              <span style={{ fontSize:34 }}>📷</span>
              <span style={{ fontSize:12, color:T.txtD }}>Tap to add a photo or video</span>
              <span style={{ fontSize:10, color:T.txtF }}>Shorts up to 90s · max 200MB</span>
            </Col>
          )}
          {preview && <div style={{ position:"absolute", top:8, right:8 }}><Badge c={kind==="video"?"p":"b"}>{kind}</Badge></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={onPick} style={{ display:"none" }}/>
        <textarea rows={2} placeholder="Write a caption…" value={caption} onChange={e=>setCaption(e.target.value)} style={{ resize:"vertical" }}/>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:T.sDim, pointerEvents:"none" }}>📍</span>
          <input placeholder="Add location" value={loc} onChange={e=>setLoc(e.target.value)} style={{ paddingLeft:32 }}/>
        </div>
        <Row g={8}>
          <Btn v="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
          <Btn onClick={submit} load={busy} disabled={!file} style={{ flex:1 }}>Share Post</Btn>
        </Row>
      </Col>
    </Modal>
  );
};

const PostCard = ({ post }) => {
  const { toggleLike, deletePost } = useStore();
  const [showComments, setShowComments] = useState(false);
  const grad = post.grad || ["#1e3a5f","#0d2818"];
  const isMine = post.author?.username === "you";
  return (
    <Card style={{ marginBottom:16 }}>
      {showComments && <CommentSheet post={post} onClose={()=>setShowComments(false)}/>}
      {/* author row */}
      <Row style={{ padding:"12px 14px", justifyContent:"space-between" }}>
        <Row g={10}>
          <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.gMid},${T.amb})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white" }}>{(post.author?.display_name||"?").charAt(0)}</div>
          <div>
            <div style={{ fontSize:13,fontWeight:500 }}>{post.author?.display_name}</div>
            {post.location_name ? <div style={{ fontSize:11,color:T.txtD }}>📍 {post.location_name}</div> : null}
          </div>
        </Row>
        <Row g={8}>
          <span style={{ fontSize:11,color:T.txtF }}>{post.created_at}</span>
          {isMine && <span onClick={()=>deletePost(post.id)} style={{ cursor:"pointer",color:T.txtF,fontSize:13 }}>🗑</span>}
        </Row>
      </Row>
      {/* media */}
      <div style={{ position:"relative", aspectRatio:"4/5", background:`linear-gradient(160deg,${grad[0]},${grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        {post.media_url
          ? (post.kind==="video"
              ? <video src={post.media_url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted autoPlay loop playsInline/>
              : <img src={post.media_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>)
          : <span style={{ fontSize:54, opacity:.5 }}>{post.kind==="video"?"🎬":"🏔"}</span>}
        {post.kind==="video" && <div style={{ position:"absolute", top:10, right:10, background:"#000000aa", borderRadius:6, padding:"3px 8px", fontSize:11, color:"#fff" }}>▶ {Math.round(post.duration_s||0)}s</div>}
      </div>
      {/* actions */}
      <div style={{ padding:"12px 14px" }}>
        <Row g={18} style={{ marginBottom:8 }}>
          <Row g={6} style={{ cursor:"pointer" }} onClick={()=>toggleLike(post.id)}>
            <span style={{ fontSize:18, color:post.liked?T.red:T.txtD }}>{post.liked?"♥":"♡"}</span>
            <span style={{ fontSize:13, color:post.liked?T.red:T.txtD }}>{post.like_count}</span>
          </Row>
          <Row g={6} style={{ cursor:"pointer" }} onClick={()=>setShowComments(true)}>
            <span style={{ fontSize:17, color:T.txtD }}>💬</span>
            <span style={{ fontSize:13, color:T.txtD }}>{post.comment_count}</span>
          </Row>
          <span style={{ fontSize:17, color:T.txtD, marginLeft:"auto", cursor:"pointer" }}>↗</span>
        </Row>
        {post.caption ? <div style={{ fontSize:13, lineHeight:1.5 }}><strong>{post.author?.display_name}</strong> {post.caption}</div> : null}
        {post.comment_count>0 && <div onClick={()=>setShowComments(true)} style={{ fontSize:12, color:T.txtD, marginTop:6, cursor:"pointer" }}>View all {post.comment_count} comments</div>}
      </div>
    </Card>
  );
};

const Feed = ({ openCreate }) => {
  const { posts, online, toast } = useStore();
  const [scope, setScope] = useState("all");
  // When online, optionally refresh from server on scope change
  useEffect(() => {
    if (!online) return;
    backend.listFeed(scope).then(()=>{}).catch(()=>{});
  }, [scope, online]);
  return (
    <div style={{ flex:1, overflow:"auto", padding:"18px 0" }}>
      <div style={{ maxWidth:520, margin:"0 auto", padding:"0 16px" }}>
        <Row style={{ marginBottom:16, justifyContent:"space-between" }}>
          <Row g={6}>
            {["all","following"].map(s=>(
              <button key={s} onClick={()=>setScope(s)} style={{ height:30,padding:"0 14px",borderRadius:20,border:`1px solid ${scope===s?T.gBright:T.brd}`,background:scope===s?`${T.gMid}33`:"transparent",color:scope===s?T.gBright:T.txtD,fontSize:12,fontFamily:"inherit",cursor:"pointer" }}>{s==="all"?"For You":"Following"}</button>
            ))}
          </Row>
          <Btn onClick={openCreate} ic={<span style={{fontSize:13}}>＋</span>}>Post</Btn>
        </Row>
        {posts.length===0 && <div style={{ textAlign:"center", color:T.txtF, fontSize:13, padding:40 }}>No posts yet. Share your first adventure.</div>}
        {posts.map(p => <PostCard key={p.id} post={p}/>)}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  AUTH + SHELL
// ════════════════════════════════════════════════════════════════════════════
const Auth = ({ onAuth }) => {
  const { isMobile } = useTheme();
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({email:"",password:"",username:"",display_name:""});
  const [load,setLoad]=useState(false),[err,setErr]=useState("");
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}));
  const submit=async()=>{
    setErr(""); setLoad(true);
    try{
      const alive=await probeApi();
      if(alive){
        if(mode==="login"){
          await backend.login(f.email, f.password);
        } else {
          if(!f.username||f.username.length<3){ throw new Error("Username must be 3–30 characters"); }
          if(!f.display_name||f.display_name.length<2){ throw new Error("Full name required"); }
          if(f.password.length<8){ throw new Error("Password must be at least 8 characters"); }
          await backend.register({ email:f.email, password:f.password, username:f.username, display_name:f.display_name });
        }
        onAuth({display_name:f.display_name||f.email.split("@")[0]});
      } else { throw new Error("__offline__"); }
    }catch(e){
      if(e.message==="__offline__"){
        // No backend → demo mode straight through
        onAuth({display_name:f.display_name||f.email.split("@")[0]||"Hiker"});
      } else {
        setErr(e.message);
      }
    }finally{setLoad(false);}
  };
  return(
    <div className="app-h" style={{display:"flex",overflow:"hidden"}}>
      {!isMobile&&<div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <Trail3D/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to right, transparent 55%, #060d12)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:64,left:64,pointerEvents:"none"}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:56,fontWeight:900,color:T.gGlow,lineHeight:1,filter:`drop-shadow(0 0 40px ${T.gBright}55)`}}>Summit</div>
          <div style={{fontStyle:"italic",fontSize:16,color:T.txtD,marginTop:10,fontFamily:"Georgia,serif"}}>Your mountains. Your routes. Your data.</div>
        </div>
      </div>}
      <div style={{width:isMobile?"100%":440,background:T.bgCard,borderLeft:isMobile?"none":`1px solid ${T.brd}`,display:"flex",flexDirection:"column",justifyContent:"center",padding:isMobile?"32px 22px":"56px 46px",gap:18,overflowY:"auto"}}>
        {isMobile&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{width:40,height:40,borderRadius:12,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fraunces,serif",fontWeight:800,fontSize:22}}>S</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:800,color:T.gGlow}}>Summit</div>
        </div>}
        <div><div style={{fontFamily:"Fraunces,serif",fontSize:isMobile?24:28,fontWeight:700,marginBottom:5}}>{mode==="login"?"Welcome back":"Create account"}</div>
          <div style={{fontSize:12,color:T.txtD}}>{mode==="login"?"Sign in to continue":"Start tracking your adventures"}</div></div>
        <Col g={12}>
          {mode==="register"&&<>
            <Field label="Full name" placeholder="Alex Kim" value={f.display_name} onChange={set("display_name")}/>
            <Field label="Username" placeholder="alexkim" value={f.username} onChange={set("username")}/></>}
          <Field label="Email" type="email" placeholder="you@example.com" value={f.email} onChange={set("email")}/>
          <Field label="Password" type="password" placeholder="••••••••" value={f.password} onChange={set("password")} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </Col>
        {err&&<div style={{background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:8,padding:"9px 13px",fontSize:12,color:T.red}}>{err}</div>}
        <Btn sz="lg" load={load} onClick={submit} style={{width:"100%"}}>{mode==="login"?"Sign in":"Create account"}</Btn>
        <Row g={10}><div style={{flex:1,height:1,background:T.brd}}/><span style={{fontSize:10,color:T.txtF}}>or</span><div style={{flex:1,height:1,background:T.brd}}/></Row>
        <Btn v="subtle" sz="lg" onClick={()=>onAuth({display_name:"Demo Hiker"})} style={{width:"100%"}}>Continue as Demo</Btn>
        <div style={{fontSize:12,color:T.txtD,textAlign:"center"}}>{mode==="login"?"No account? ":"Have an account? "}
          <span style={{color:T.gBright,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setMode(m=>m==="login"?"register":"login");setErr("");}}>{mode==="login"?"Register":"Sign in"}</span></div>
        <div style={{marginTop:4,paddingTop:14,borderTop:`1px solid ${T.brd}`,textAlign:"center",fontFamily:"'Spline Sans Mono',monospace",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:T.txtF}}>
          Powered by Daie DillyAI Enterprise
        </div>
      </div>
    </div>
  );
};

const NAV=[{id:"dashboard",ic:"◴",l:"Home"},{id:"feed",ic:"❏",l:"Feed"},{id:"explore",ic:"◰",l:"Explore"},{id:"trips",ic:"◷",l:"Trips"},{id:"gear",ic:"◫",l:"Gear"},{id:"community",ic:"◎",l:"Community"}];

const Shell = ({ user, onLogout }) => {
  const { hydrate, online } = useStore();
  const { isMobile } = useTheme();
  const [page,setPage]=useState("dashboard");
  const [modal,setModal]=useState(null);
  useEffect(() => { hydrate(); }, [hydrate]);
  const TITLES={dashboard:"Home",feed:"Feed",explore:"Explore routes",trips:"Your trips",gear:"Gear locker",community:"Community"};
  const headerAction={
    explore:<Btn onClick={()=>setModal("route")} ic="＋">{isMobile?"":"New route"}</Btn>,
    trips:<Btn onClick={()=>setModal("trip")} ic="▶">{isMobile?"":"Start trip"}</Btn>,
    gear:<Btn onClick={()=>setModal("gear")} ic="＋">{isMobile?"":"Add gear"}</Btn>,
    community:<Btn onClick={()=>setModal("report")} ic="＋">{isMobile?"":"Add report"}</Btn>,
    feed:<Btn onClick={()=>setModal("post")} ic="＋">{isMobile?"":"New post"}</Btn>,
    dashboard:null,
  };
  const modals = (<>
    {modal==="route"&&<NewRouteModal onClose={()=>setModal(null)}/>}
    {modal==="gear"&&<AddGearModal onClose={()=>setModal(null)}/>}
    {modal==="trip"&&<StartTripModal onClose={()=>setModal(null)}/>}
    {modal==="report"&&<AddReportModal onClose={()=>setModal(null)}/>}
    {modal==="post"&&<CreatePostModal onClose={()=>setModal(null)}/>}
  </>);
  const pages = (<>
    {page==="dashboard"&&<Dashboard go={setPage}/>}
    {page==="feed"&&<Feed openCreate={()=>setModal("post")}/>}
    {page==="explore"&&<Explore openNewRoute={()=>setModal("route")}/>}
    {page==="trips"&&<Trips openStart={()=>setModal("trip")}/>}
    {page==="gear"&&<Gear openAddGear={()=>setModal("gear")}/>}
    {page==="community"&&<Community openAddReport={()=>setModal("report")}/>}
  </>);
  const statusPill = (
    <div title={online?"Connected to backend":"Demo mode — backend offline"} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:20,background:online?(T.mode==="dark"?T.gDark:"#E6F0E9"):T.bgEl,border:`1px solid ${online?T.gMid+"55":T.brd}`,fontSize:10.5,color:online?T.gBright:T.txtD,fontFamily:"'Spline Sans Mono',monospace",letterSpacing:"0.06em"}}>
      <div style={{width:7,height:7,borderRadius:"50%",background:online?T.gBright:T.sMed,animation:online?"pulse 2s ease infinite":"none"}}/>
      {online?"LIVE":"DEMO"}
    </div>
  );

  // ── Mobile: top bar + bottom tabs ──
  if (isMobile) {
    return (
      <div className="app-h" style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
        {modals}
        <div style={{height:56,display:"flex",alignItems:"center",padding:"0 16px",gap:10,background:T.bgCard,borderBottom:`1px solid ${T.brd}`,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:9,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fraunces,serif",fontWeight:800,fontSize:17}}>S</div>
          <div style={{fontFamily:"Fraunces,serif",fontSize:18,fontWeight:700,flex:1}}>{TITLES[page]}</div>
          {statusPill}
          {headerAction[page]}
          <ThemeToggle style={{width:34,height:34}}/>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>{pages}</div>
        <nav style={{display:"flex",borderTop:`1px solid ${T.brd}`,background:T.bgCard,flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {NAV.map(n=>{const on=page===n.id;return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"9px 0 11px",border:"none",background:"transparent",color:on?T.gBright:T.txtF}}>
              <span style={{fontSize:21}}>{n.ic}</span><span style={{fontSize:10.5,fontWeight:on?600:500}}>{n.l}</span>
            </button>);})}
        </nav>
      </div>
    );
  }

  // ── Desktop: left sidebar ──
  return(
    <div className="app-h" style={{display:"flex",overflow:"hidden"}}>
      {modals}
      <nav style={{width:230,background:T.bgCard,borderRight:`1px solid ${T.brd}`,display:"flex",flexDirection:"column",padding:18,flexShrink:0}}>
        <Row g={10} style={{padding:"6px 8px 22px"}}>
          <div style={{width:36,height:36,borderRadius:11,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fraunces,serif",fontWeight:800,fontSize:20}}>S</div>
          <div style={{fontFamily:"Fraunces,serif",fontWeight:700,fontSize:20}}>Summit</div>
        </Row>
        <Col g={3}>
          {NAV.map(n=>{const on=page===n.id;return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:11,border:"none",background:on?(T.mode==="dark"?T.gDark:"#E6F0E9"):"transparent",color:on?(T.mode==="dark"?T.gGlow:T.gDark):T.txtD,fontSize:14.5,fontWeight:on?600:500,transition:"all .15s",textAlign:"left"}}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background=T.bgEl}} onMouseLeave={e=>{if(!on)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:18,width:20,textAlign:"center"}}>{n.ic}</span>{n.l}
            </button>);})}
        </Col>
        <div style={{marginTop:"auto"}}>
          <Row g={10} style={{padding:"12px 8px 0",borderTop:`1px solid ${T.brd}`}}>
            <div onClick={onLogout} title="Sign out" style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${T.gMid},${T.ambL})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,cursor:"pointer",fontFamily:"Fraunces,serif"}}>{((user?.display_name||"U").charAt(0)).toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.display_name||"Hiker"}</div><div style={{fontSize:12,color:T.txtF}}>Free plan</div></div>
            <ThemeToggle/>
          </Row>
          <div style={{padding:"10px 8px 0",fontFamily:"'Spline Sans Mono',monospace",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:T.txtF,lineHeight:1.5}}>
            Powered by<br/>Daie DillyAI Enterprise
          </div>
        </div>
      </nav>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0,background:T.bg}}>
        <Row style={{height:64,padding:"0 26px",borderBottom:`1px solid ${T.brd}`,justifyContent:"space-between",background:T.bgCard,flexShrink:0}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700}}>{TITLES[page]}</div>
          <Row g={12}>
            {statusPill}
            {page!=="explore"&&<div style={{position:"relative",width:220}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.txtF,pointerEvents:"none"}}>⌕</span>
              <input placeholder="Search…" style={{paddingLeft:34,height:40}}/></div>}
            {headerAction[page]}
          </Row>
        </Row>
        {pages}
      </div>
    </div>
  );
};
// ════════════════════════════════════════════════════════════════════════════
//  CINEMATIC INTRO — dawn flyover of a Denali-like massif, photoreal-surfaced
//  with procedural albedo + bump textures generated on canvas (no network), a
//  trail drawing to the summit, snow plume, then dissolve into the app. Skippable.
// ════════════════════════════════════════════════════════════════════════════
const Intro = ({ onDone }) => {
  const mountRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState(0);   // 0 terrain, 1 wordmark, 2 tagline, 3 fade
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDone(), 900);
  }, [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2600);
    const t2 = setTimeout(() => setPhase(2), 3800);
    const t3 = setTimeout(() => finish(), 7200);
    return () => { [t1, t2, t3].forEach(clearTimeout); };
  }, [finish]);

  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { return; }
    let W = el.clientWidth || window.innerWidth, H = el.clientHeight || window.innerHeight;
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const skyTop = new THREE.Color(0x1a2740), skyHaze = new THREE.Color(0xE8763A).lerp(new THREE.Color(0xf4c889), 0.4);
    scene.background = new THREE.Color(0x10151A).lerp(skyTop, 0.7);
    scene.fog = new THREE.FogExp2(0x2a2438, 0.012);
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 600);

    // ── Terrain: a Denali-like massif ──────────────────────────────────────
    // Denali reads as a single colossal dome of huge prominence, with a steep
    // South Face toward the viewer, a twin summit (South + North peak), sharp
    // ridges radiating down, glacier valleys between them, and a high snowline.
    const GRID = 150, SIZE = 130;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, GRID - 1, GRID - 1);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const fbm = (x, z, f, a) => Math.sin(x*f*.8+z*f*.6)*a + Math.cos(x*f*.5-z*f*.9)*a*.7 + Math.sin((x+z)*f*1.3)*a*.5;

    const PEAK = new THREE.Vector2(0, -34);      // summit footprint (ahead of camera)
    const NORTH = new THREE.Vector2(-9, -42);    // secondary (north) peak
    const heights = [];
    let maxH = 0;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const dS = Math.hypot(x - PEAK.x, z - PEAK.y);
      const dN = Math.hypot(x - NORTH.x, z - NORTH.y);
      let h = 40 * Math.exp(-(dS * dS) / 760);
      h += 30 * Math.exp(-(dN * dN) / 420);
      h -= 7 * Math.exp(-(Math.hypot(x + 4.5, z + 38) ** 2) / 90);
      const front = Math.max(0, z - PEAK.y);
      h -= front * 0.22 * Math.exp(-(x * x) / 900);
      const ang = Math.atan2(z - PEAK.y, x - PEAK.x);
      const ridge = Math.pow(Math.abs(Math.cos(ang * 3.0)), 6) * Math.exp(-(dS * dS) / 1400) * 16;
      h += ridge;
      const valley = -Math.pow(Math.abs(Math.sin(ang * 3.0)), 4) * Math.exp(-(dS * dS) / 2600) * 6;
      h += Math.max(-6, valley) * (dS > 14 ? 1 : 0);
      const rough = (fbm(x,z,.09,3.4) + fbm(x,z,.22,1.5) + fbm(x,z,.5,.6));
      h += rough * (0.5 + 0.5 * Math.min(1, dS / 24));
      h += fbm(x, z, .05, 2.2) * 0.6 + 2;
      h = Math.max(0, h);
      pos.setY(i, h); heights.push(h);
      if (h > maxH) maxH = h;
    }
    geo.computeVertexNormals();
    const nrm = geo.attributes.normal;

    // ── Photoreal surfacing: procedural albedo + bump on a canvas ──────────
    const vnHash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
    const vnoise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const u = xf*xf*(3-2*xf), v = yf*yf*(3-2*yf);
      const a = vnHash(xi,yi), b = vnHash(xi+1,yi), c = vnHash(xi,yi+1), d = vnHash(xi+1,yi+1);
      return a*(1-u)*(1-v) + b*u*(1-v) + c*(1-u)*v + d*u*v;
    };
    const fbm2 = (x, y, oct=5) => {
      let amp=.5, freq=1, sum=0, norm=0;
      for (let o=0;o<oct;o++){ sum+=amp*vnoise(x*freq,y*freq); norm+=amp; amp*=.5; freq*=2.03; }
      return sum/norm;
    };
    const TEX = 1024;
    const makeSurfaceTextures = () => {
      const alb = document.createElement("canvas"); alb.width = alb.height = TEX;
      const bmp = document.createElement("canvas"); bmp.width = bmp.height = TEX;
      const ac = alb.getContext("2d"), bc = bmp.getContext("2d");
      const aimg = ac.createImageData(TEX, TEX), bimg = bc.createImageData(TEX, TEX);
      const A = aimg.data, B = bimg.data;
      // Richer palette: warm granite, iron-stained rock, cold + warm snow, forest
      const rockHi = [138,128,116], rockMid = [96,88,80], rockLo = [58,52,48], rockDk = [34,30,28];
      const iron = [120,86,58], scree = [104,96,84], dirt = [82,74,56];
      const snow = [240,245,250], snowWarm = [250,238,220], snowBlue = [188,206,228];
      const forest = [38,64,44];
      // ridged noise = sharp mountain fracturing (inverted abs of signed noise)
      const ridged = (x, y, oct) => { let s=0,amp=.5,f=1,norm=0; for(let o=0;o<oct;o++){ const nn=1-Math.abs(vnoise(x*f,y*f)*2-1); s+=amp*nn*nn; norm+=amp; amp*=.5; f*=2.07; } return s/norm; };
      const sastNoise = (x, y) => 0.5 + 0.5*Math.sin(x*22 + fbm2(x,y,3)*10);  // wind-carved snow ridging for bump
      for (let py = 0; py < TEX; py++) {
        const v = 1 - py / TEX;
        for (let px = 0; px < TEX; px++) {
          const nx = px / TEX * 16, ny = py / TEX * 16;
          const n   = fbm2(nx, ny, 7);                       // broad albedo variation
          const rg  = ridged(nx*1.1, ny*1.1, 6);             // sharp rock ridges/fractures
          const fine = vnoise(nx*11, ny*11);                 // micro grain
          const micro = vnoise(nx*26, ny*26);                // very fine speckle
          const strata = 0.5 + 0.5*Math.sin((v*52) + fbm2(nx*0.5, ny*0.5,3)*7 + rg*4); // tilted rock banding
          // crevasse / couloir shadow lines (thin dark fractures)
          const crev = ridged(nx*2.3+5, ny*2.3, 4);
          const fracture = crev > 0.86 ? (crev-0.86)/0.14 : 0;
          let r,g,b;
          const snowline = 0.50 + (fbm2(nx*0.55, ny*0.55,3)-0.5)*0.20;
          const snowMask = v > snowline ? Math.min(1,(v-snowline)/0.10) : 0;
          const windScour = fbm2(nx*1.4+10, ny*1.4,5);
          if (snowMask > 0.5 && windScour > 0.30) {
            // snow with sastrugi wind streaks, warm sun-side + cool shadow grain
            const sastrugi = 0.5 + 0.5*Math.sin(nx*22 + fbm2(nx,ny,3)*10);
            const sh = 0.80 + 0.20*fine - 0.10*(1-sastrugi);
            r = (snow[0]*sh)|0; g=(snow[1]*sh)|0; b=(snow[2]*sh)|0;
            // blue ambient-occlusion in hollows
            const ao = Math.max(0, 1 - fine - 0.3);
            r = (r*(1-ao*0.18)+snowBlue[0]*ao*0.18)|0;
            g = (g*(1-ao*0.14)+snowBlue[1]*ao*0.14)|0;
            b = Math.min(255, (b*(1-ao*0.10)+snowBlue[2]*ao*0.10)|0);
            // occasional exposed rock poking through high snow
            if (rg > 0.78 && micro > 0.6) { r=(r*0.45+rockMid[0]*0.55)|0; g=(g*0.45+rockMid[1]*0.55)|0; b=(b*0.45+rockMid[2]*0.55)|0; }
          } else {
            // layered rock: ridged structure drives light/dark, strata + grain on top
            const k = 0.30*n + 0.34*rg + 0.20*strata + 0.16*fine;
            const lo = (v<0.18)?dirt:rockLo;
            r = (rockHi[0]*k + lo[0]*(1-k))|0;
            g = (rockHi[1]*k + lo[1]*(1-k))|0;
            b = (rockHi[2]*k + lo[2]*(1-k))|0;
            // midtone blend for body
            r=(r*0.7+rockMid[0]*0.3)|0; g=(g*0.7+rockMid[1]*0.3)|0; b=(b*0.7+rockMid[2]*0.3)|0;
            // iron / mineral staining streaks
            const stain = fbm2(nx*0.8+20, ny*3.0, 4);
            if (stain > 0.62 && v < snowline) { const m=(stain-0.62)/0.38*0.5; r=(r*(1-m)+iron[0]*m)|0; g=(g*(1-m)+iron[1]*m)|0; b=(b*(1-m)+iron[2]*m)|0; }
            // dark seams in the fine grain
            if (fine < 0.16) { r=(r*0.5)|0; g=(g*0.5)|0; b=(b*0.5)|0; }
            if (micro < 0.12) { r=(r*0.7)|0; g=(g*0.7)|0; b=(b*0.7)|0; }
            // scree fans lower down
            if (v < 0.34 && n > 0.58) { r=(r*0.55+scree[0]*0.45)|0; g=(g*0.55+scree[1]*0.45)|0; b=(b*0.55+scree[2]*0.45)|0; }
            // patchy snow caught on ledges near the snowline
            if (snowMask>0 && fine>0.72){ r=(r*0.35+snow[0]*0.65)|0; g=(g*0.35+snow[1]*0.65)|0; b=(b*0.35+snow[2]*0.65)|0; }
          }
          // crevasse/couloir deep shadow over everything
          if (fracture > 0) { const f=fracture*0.7; r=(r*(1-f))|0; g=(g*(1-f))|0; b=(b*(1-f)+18*f)|0; }
          // low-elevation forest/tundra
          if (v < 0.15) { const veg=0.5+0.5*fbm2(nx*2.2,ny*2.2,4); const m=veg*0.55; r=(r*(1-m)+forest[0]*m)|0; g=(g*(1-m)+forest[1]*m)|0; b=(b*(1-m)+forest[2]*m)|0; }
          const idx=(py*TEX+px)*4;
          A[idx]=Math.max(0,Math.min(255,r)); A[idx+1]=Math.max(0,Math.min(255,g)); A[idx+2]=Math.max(0,Math.min(255,b)); A[idx+3]=255;
          // bump: rock much rougher than snow; fractures cut deep grooves
          let bumpN = snowMask>0.5 ? (0.55+0.45*((fine+sastNoise(nx,ny))*0.5)) : (0.2 + 0.8*((rg*1.3+strata*0.5+fine*0.6)/2.4));
          bumpN -= fracture*0.6;
          const bv = Math.max(0,Math.min(255,(bumpN*255)|0));
          B[idx]=bv; B[idx+1]=bv; B[idx+2]=bv; B[idx+3]=255;
        }
      }
      ac.putImageData(aimg,0,0); bc.putImageData(bimg,0,0);
      const at = new THREE.CanvasTexture(alb), bt = new THREE.CanvasTexture(bmp);
      if (THREE.SRGBColorSpace) at.colorSpace = THREE.SRGBColorSpace;
      else if (THREE.sRGBEncoding) at.encoding = THREE.sRGBEncoding;
      at.wrapS = at.wrapT = bt.wrapS = bt.wrapT = THREE.RepeatWrapping;
      at.repeat.set(2.4, 2.4); bt.repeat.set(2.4, 2.4);   // finer grain across the face
      at.anisotropy = 8; bt.anisotropy = 8;
      return { at, bt };
    };

    let surfaceMat;
    try {
      const { at, bt } = makeSurfaceTextures();
      // Elevation- & steepness-driven tint places the true snowline on the real
      // geometry (texture supplies grain; this supplies snow-vs-rock by height).
      const tint = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const t = heights[i] / maxH;
        const steep = 1 - nrm.getY(i);
        const snowline = 0.50 + (fbm2(pos.getX(i)*0.05, pos.getZ(i)*0.05,3)-0.5)*0.12;
        let snow = t > snowline ? Math.min(1, (t - snowline) / 0.14) : 0;
        snow *= Math.max(0, 1 - steep * 1.4);
        const c = new THREE.Color();
        if (t < 0.14) c.setRGB(0.42,0.46,0.34);
        else c.setRGB(0.62,0.60,0.57);
        c.lerp(new THREE.Color(1.05,1.08,1.12), snow);
        if (t > 0.55) c.lerp(new THREE.Color(1.1,0.92,0.78), 0.12*t);
        else c.lerp(new THREE.Color(0.55,0.62,0.78), 0.10*(1-t));
        tint[i*3]=c.r; tint[i*3+1]=c.g; tint[i*3+2]=c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(tint, 3));
      surfaceMat = new THREE.MeshStandardMaterial({
        map: at, bumpMap: bt, bumpScale: 1.4,
        roughnessMap: bt,                 // rougher where bump is bright (rock), smoother on snow
        vertexColors: true, roughness: 1.0, metalness: 0.02,
      });
    } catch {
      const cols = new Float32Array(pos.count * 3);
      for (let i=0;i<pos.count;i++){ const t=heights[i]/maxH, c=new THREE.Color();
        c.copy(t>0.55? new THREE.Color(0xe8eef2): new THREE.Color(0x5a5650)).lerp(new THREE.Color(0x2f5238), t<0.3?0.5:0);
        cols[i*3]=c.r; cols[i*3+1]=c.g; cols[i*3+2]=c.b; }
      geo.setAttribute("color", new THREE.BufferAttribute(cols,3));
      surfaceMat = new THREE.MeshStandardMaterial({ vertexColors:true, roughness:.92 });
    }
    scene.add(new THREE.Mesh(geo, surfaceMat));

    const sampleH = (x, z) => {
      const gx = Math.round((x/SIZE+.5)*(GRID-1)), gz = Math.round((z/SIZE+.5)*(GRID-1));
      return heights[Math.max(0, Math.min(GRID*GRID-1, gz*GRID+gx))] || 0;
    };

    // ── Trail that draws itself up the south face toward the summit ──
    const tpts = [];
    for (let i = 0; i < 90; i++) {
      const t = i / 89;
      const x = Math.sin(t * Math.PI * 3.0) * 16 * (1 - t * 0.7);
      const z = 42 - t * 76;
      tpts.push(new THREE.Vector3(x, sampleH(x, z) + 0.7, z));
    }
    const curve = new THREE.CatmullRomCurve3(tpts);
    const full = curve.getPoints(400);
    // Outer additive halo — soft wide bright-blue glow
    const halo = new THREE.Mesh(new THREE.TubeGeometry(curve, 260, 0.85, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x33aaff, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.geometry.setDrawRange(0, 0); scene.add(halo);
    // Solid bright core tube
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 260, 0.38, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x6fd4ff, transparent: true, opacity: 0.95 }));
    tube.geometry.setDrawRange(0, 0); scene.add(tube);
    // Crisp top line, near-white blue so it reads as bright
    const trailGeo = new THREE.BufferGeometry().setFromPoints(full);
    const trailMat = new THREE.LineBasicMaterial({ color: 0xdff4ff, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending });
    const trail = new THREE.Line(trailGeo, trailMat);
    trailGeo.setDrawRange(0, 0);
    scene.add(trail);

    const summitTop = new THREE.Vector3(PEAK.x, sampleH(PEAK.x, PEAK.y), PEAK.y);
    const beacon = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3.0, 6), new THREE.MeshBasicMaterial({ color: 0xE8763A }));
    beacon.position.copy(summitTop); beacon.position.y += 1.8; beacon.scale.setScalar(0); scene.add(beacon);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 2.0, 28), new THREE.MeshBasicMaterial({ color: 0xE8763A, transparent: true, opacity: .6, side: THREE.DoubleSide }));
    ring.position.copy(summitTop); ring.position.y += 0.25; ring.rotation.x = -Math.PI/2; ring.scale.setScalar(0); scene.add(ring);

    // Wind-blown summit plume
    const plumeGeo = new THREE.BufferGeometry(), pc = 220, pp = new Float32Array(pc * 3);
    for (let i = 0; i < pc; i++) {
      const s = i / pc;
      pp[i*3]   = summitTop.x + s * 26 + (Math.random()-.5) * 4;
      pp[i*3+1] = summitTop.y + 2 + Math.sin(s * 3) * 3 + (Math.random()-.5) * 2;
      pp[i*3+2] = summitTop.z + (Math.random()-.5) * 5;
    }
    plumeGeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    const plume = new THREE.Points(plumeGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, transparent: true, opacity: 0 }));
    scene.add(plume);

    // ── Lights: dawn alpenglow setup ──
    // Hemisphere gives natural sky-blue fill from above, warm bounce from below,
    // so shadowed faces stay readable instead of crushing to black.
    scene.add(new THREE.HemisphereLight(0x9fb4d8, 0x3a3026, 0.9));
    scene.add(new THREE.AmbientLight(0x2a3346, 0.5));
    const sun = new THREE.DirectionalLight(0xffcf8c, 3.0); sun.position.set(-34, 14, -38); scene.add(sun);   // low warm raking key
    const rim = new THREE.DirectionalLight(0x7fa6ff, 0.7); rim.position.set(30, 10, 30); scene.add(rim);     // cool back rim
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(7, 32), new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: .9 }));
    sunDisc.position.set(-46, 16, -90); scene.add(sunDisc);

    const sg = new THREE.BufferGeometry(), sp = new Float32Array(1800);
    for (let i = 0; i < 1800; i += 3) { sp[i]=(Math.random()-.5)*500; sp[i+1]=Math.random()*120+40; sp[i+2]=(Math.random()-.5)*500; }
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xdfe8ff, size: .5, transparent: true, opacity: .8 });
    scene.add(new THREE.Points(sg, starMat));

    const clock = new THREE.Clock();
    const DUR = 7.2;
    const SUM_Y = summitTop.y;
    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      const e = Math.min(clock.getElapsedTime() / DUR, 1);
      const ease = e < .5 ? 2*e*e : 1 - Math.pow(-2*e+2, 2)/2;

      // Camera cranes up the south face so the peak towers overhead.
      const camZ = 70 - ease * 58;
      const camY = 5 + ease * 20 + Math.sin(e * 5) * 0.5;
      const camX = Math.sin(e * Math.PI) * 16 * (1 - ease * 0.6);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, SUM_Y * (0.45 + ease * 0.5), -34);

      const drawT = Math.min(clock.getElapsedTime() / 2.6, 1);
      const drawEase = 1 - Math.pow(1 - drawT, 3);
      trail.geometry.setDrawRange(0, Math.floor(drawEase * 400));
      const tubeIdx = Math.floor(drawEase * 260 * 8 * 6);
      tube.geometry.setDrawRange(0, tubeIdx);
      halo.geometry.setDrawRange(0, tubeIdx);

      const pop = Math.max(0, (drawT - 0.82) / 0.18);
      beacon.scale.setScalar(pop);
      ring.scale.setScalar(pop * (1 + Math.sin(clock.getElapsedTime() * 3) * 0.15));
      ring.material.opacity = 0.6 * pop;

      plume.material.opacity = Math.min(0.5, ease * 0.7);
      const pa = plume.geometry.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        pa.setX(i, pa.getX(i) + 0.04 + Math.random() * 0.02);
        if (pa.getX(i) > summitTop.x + 30) pa.setX(i, summitTop.x + (Math.random()-.5) * 3);
      }
      pa.needsUpdate = true;

      scene.background.lerpColors(new THREE.Color(0x121a2e), skyHaze, ease * 0.65);
      starMat.opacity = Math.max(0, 0.85 - ease * 1.7);
      renderer.toneMappingExposure = 1.0 + ease * 0.55;
      sunDisc.material.opacity = 0.45 + ease * 0.45;
      sunDisc.position.y = 8 + ease * 16;
      sun.intensity = 2.2 + ease * 1.2;

      const pulse = 0.85 + Math.sin(clock.getElapsedTime() * 2.4) * 0.15;
      trailMat.opacity = pulse;
      halo.material.opacity = 0.22 + Math.sin(clock.getElapsedTime() * 2.4) * 0.12;
      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      W = el.clientWidth; H = el.clientHeight;
      renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#10151A", overflow: "hidden",
      opacity: exiting ? 0 : 1, transition: "opacity .9s ease", pointerEvents: exiting ? "none" : "auto" }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* Vignette + warm grade */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(120% 90% at 50% 60%, transparent 40%, rgba(8,10,14,.5) 100%)" }} />

      {/* Wordmark */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", pointerEvents: "none", padding: 24 }}>
        <div style={{ overflow: "hidden", padding: "0 .1em" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 800, fontSize: "clamp(52px, 13vw, 132px)",
            color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 8px 60px rgba(0,0,0,.6)",
            transform: phase >= 1 ? "translateY(0)" : "translateY(115%)",
            opacity: phase >= 1 ? 1 : 0, transition: "transform 1.1s cubic-bezier(.16,1,.3,1), opacity 1.1s ease" }}>
            Summit
          </div>
        </div>
        <div style={{ height: 1.5, background: "linear-gradient(90deg, transparent, #E8763A, transparent)",
          width: phase >= 2 ? "min(380px, 70vw)" : 0, transition: "width 1s cubic-bezier(.16,1,.3,1)", margin: "18px 0" }} />
        <div style={{ fontFamily: "'Inter Tight',sans-serif", fontSize: "clamp(13px, 2.4vw, 17px)",
          color: "rgba(255,255,255,.78)", letterSpacing: "0.04em", fontWeight: 400,
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1s ease .1s", textAlign: "center" }}>
          Your mountains. Your routes. Your data.
        </div>
      </div>

      {/* Skip */}
      <button onClick={finish} style={{ position: "absolute", bottom: 28, right: 28, padding: "9px 18px",
        borderRadius: 24, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)",
        color: "rgba(255,255,255,.85)", fontFamily: "'Inter Tight',sans-serif", fontSize: 13, fontWeight: 500,
        backdropFilter: "blur(8px)", cursor: "pointer" }}>
        Skip intro →
      </button>

      {/* Loading hint, early only */}
      <div style={{ position: "absolute", bottom: 30, left: 28, fontFamily: "'Spline Sans Mono',monospace",
        fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)",
        opacity: phase === 0 ? 1 : 0, transition: "opacity .6s ease" }}>
        Charting the route…
      </div>

      {/* Powered-by credit */}
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center",
        fontFamily: "'Spline Sans Mono',monospace", fontSize: 10.5, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "rgba(255,255,255,.5)", pointerEvents: "none",
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 1s ease .2s" }}>
        Powered by Daie DillyAI Enterprise
      </div>
    </div>
  );
};



function App() {
  const [user,setUser]=useState(null);
  const [introDone,setIntroDone]=useState(false);
  return(
    <ThemeProvider>
      <GlobalCss/>
      {!introDone && <Intro onDone={()=>setIntroDone(true)}/>}
      <StoreProvider>
        {!user
          ? <Auth onAuth={setUser}/>
          : <Shell user={user} onLogout={()=>{_token=null;_apiAlive=null;setUser(null);}}/>}
        <Toasts/>
      </StoreProvider>
    </ThemeProvider>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
