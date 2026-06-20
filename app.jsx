// Prebuilt static bundle — React & Three are loaded as globals from CDN.
const { useState, useRef, useEffect, useCallback, createContext, useContext } = React;
// THREE is a global from three.min.js. Leaflet (window.L) is loaded on demand.


// Build version — shown next to the "Powered by" credit. Bump on each release.
const BUILD_VERSION = "v6.1.0";

// ════════════════════════════════════════════════════════════════════════════
//  THEME — "Field Guide": bright modern SaaS × printed trail-guide warmth.
//  Light + dark. Key names are kept stable so every component can read `T.*`;
//  `T` is swapped for the active palette at the top of <App> via ThemeProvider.
//  Fonts: Space Grotesk (display serif), Sora (UI), JetBrains Mono (labels).
// ════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════
//  SUMMIT 2.0 — "At Altitude": the view at blue hour from high on a peak.
//  Deep indigo sky, glacier-mint instrument glow, beacon-ember warmth, frosted
//  glass surfaces. Same token key names so every component restyles at once;
//  a few glass-specific keys (glass/glassBrd/glow/bgGrad) are added on top.
// ════════════════════════════════════════════════════════════════════════════
const LIGHT = {
  mode:"light",
  bg:"#EEF2F8", bgCard:"#FFFFFF", bgEl:"#F2F5FA", bgHov:"#E9EEF6", bgAct:"#E0E7F1",
  gDark:"#0E7C6B", gMid:"#13A893", gBright:"#0FA88F", gGlow:"#13C0A6",
  amb:"#D9742E", ambL:"#F2784A", ambBr:"#FF8A5B",
  sDim:"#D4DEEC", sMed:"#8A99AE", sLt:"#5A687E",
  txt:"#0E1726", txtD:"#566479", txtF:"#8A99AE",
  red:"#D6453B", redD:"#FCE9E7", blu:"#3B6FE0", bluL:"#3B6FE0",
  brd:"#DDE5F0", brdBr:"#C8D4E4", pur:"#7C5CCB",
  glass:"rgba(255,255,255,0.72)", glassBrd:"rgba(255,255,255,0.9)", glow:"rgba(15,168,143,0.30)",
  bgGrad:"radial-gradient(1100px 600px at 8% -10%, rgba(15,168,143,.12), transparent 60%), radial-gradient(900px 600px at 100% 0%, rgba(59,111,224,.10), transparent 55%), #EEF2F8",
  shadow:"0 1px 2px rgba(14,23,38,.04), 0 8px 28px rgba(14,23,38,.07)",
  shadowLg:"0 18px 60px rgba(14,23,38,.16)",
};
const DARK = {
  mode:"dark",
  bg:"#0A0E1A", bgCard:"#121A2C", bgEl:"#162035", bgHov:"#1B2740", bgAct:"#223052",
  gDark:"#0C4A40", gMid:"#16A88F", gBright:"#5EEAD4", gGlow:"#7DF3E0",
  amb:"#F0B046", ambL:"#FF8A5B", ambBr:"#FFA478",
  sDim:"#2A3550", sMed:"#5C6B8A", sLt:"#9DAAC6",
  txt:"#E8EEF7", txtD:"#9DAAC6", txtF:"#5C6B8A",
  red:"#FF6B5E", redD:"#3A1A1C", blu:"#7C9CFF", bluL:"#7C9CFF",
  brd:"#222E48", brdBr:"#2E3C5C", pur:"#A78BFA",
  glass:"rgba(20,29,51,0.55)", glassBrd:"rgba(124,156,255,0.18)", glow:"rgba(94,234,212,0.22)",
  bgGrad:"radial-gradient(1100px 620px at 6% -12%, rgba(94,234,212,.10), transparent 58%), radial-gradient(1000px 680px at 100% -8%, rgba(124,156,255,.12), transparent 55%), radial-gradient(900px 700px at 60% 120%, rgba(255,138,91,.06), transparent 60%), #0A0E1A",
  shadow:"0 1px 2px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.45)",
  shadowLg:"0 24px 70px rgba(0,0,0,.6)",
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
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
html{-webkit-text-size-adjust:100%}
*{-webkit-tap-highlight-color:transparent}
.app-h{height:100vh;height:100dvh}
@media (max-width:760px){
  input,textarea,select{font-size:16px}  /* prevents iOS auto-zoom on focus */
  button{touch-action:manipulation}
}
body{background:${T.bgGrad};background-attachment:fixed;color:${T.txt};font-family:'Sora',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;transition:background .4s,color .3s;letter-spacing:-0.01em}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:${T.brdBr};border-radius:6px;border:3px solid transparent;background-clip:padding-box}
input,textarea,select{font-family:'Sora',sans-serif;background:${T.glass};backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid ${T.glassBrd};border-radius:13px;color:${T.txt};padding:12px 15px;font-size:14px;outline:none;width:100%;transition:border-color .15s,box-shadow .15s}
input:focus,textarea:focus,select:focus{border-color:${T.gBright};box-shadow:0 0 0 3px ${T.gBright}33, 0 0 24px -4px ${T.glow}}
input::placeholder,textarea::placeholder{color:${T.txtF}}
button{cursor:pointer;font-family:'Sora',sans-serif}
label{font-size:10.5px;color:${T.txtF};font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;text-transform:uppercase;display:block;margin-bottom:6px;font-weight:500}
::selection{background:${T.gBright}44}
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
// Is a real backend explicitly configured (vs the localhost default)?
const API_CONFIGURED = typeof window !== "undefined" && !!window.SUMMIT_API;
let _token = null;
let _apiAlive = null; // null=unknown, true/false once probed

const probeApi = async (force = false) => {
  if (_apiAlive !== null && !force) return _apiAlive;
  try {
    const res = await fetch(`${API_ROOT}/health`, { signal: AbortSignal.timeout(4000) });
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

// ════════════════════════════════════════════════════════════════════════════
//  ADIRONDACK 46ERS — the 46 traditional High Peaks (originally surveyed over
//  4,000 ft). Each row: [rank, name, summit elevation (ft), round-trip miles,
//  lat, lon]. Distances/times are typical standard-route values; difficulty is
//  derived from distance + the trailless/scramble nature of the peak.
// ════════════════════════════════════════════════════════════════════════════
const ADK_46_DATA = [
  [1,"Mount Marcy",5344,14.8,44.1126,-73.9237],
  [2,"Algonquin Peak",5114,9.6,44.1435,-73.9870],
  [3,"Mount Haystack",4960,17.6,44.1050,-73.9000],
  [4,"Mount Skylight",4926,17.9,44.0950,-73.9270],
  [5,"Whiteface Mountain",4867,10.6,44.3658,-73.9026],
  [6,"Dix Mountain",4857,13.2,44.0830,-73.7790],
  [7,"Gray Peak",4840,17.2,44.1020,-73.9340],
  [8,"Iroquois Peak",4840,11.5,44.1380,-74.0030],
  [9,"Basin Mountain",4827,15.8,44.1180,-73.8680],
  [10,"Gothics",4736,12.6,44.1230,-73.8590],
  [11,"Mount Colden",4714,13.8,44.1280,-73.9590],
  [12,"Giant Mountain",4627,6.4,44.1610,-73.7200],
  [13,"Nippletop",4620,13.6,44.0860,-73.8200],
  [14,"Santanoni Peak",4607,15.0,44.0760,-74.1340],
  [15,"Mount Redfield",4606,17.4,44.0890,-73.9510],
  [16,"Wright Peak",4580,8.6,44.1530,-73.9760],
  [17,"Saddleback Mountain",4515,14.6,44.1230,-73.8730],
  [18,"Panther Peak",4442,15.4,44.0950,-74.1280],
  [19,"Table Top Mountain",4427,12.4,44.1340,-73.9170],
  [20,"Rocky Peak Ridge",4420,8.4,44.1560,-73.6960],
  [21,"Macomb Mountain",4405,8.4,44.0560,-73.7820],
  [22,"Armstrong Mountain",4400,12.9,44.1320,-73.8480],
  [23,"Hough Peak",4400,12.0,44.0680,-73.7720],
  [24,"Seward Mountain",4361,13.8,44.1650,-74.1840],
  [25,"Mount Marshall",4360,15.6,44.1180,-74.0090],
  [26,"Allen Mountain",4340,17.6,44.0530,-74.0140],
  [27,"Big Slide Mountain",4240,9.6,44.1700,-73.8550],
  [28,"Esther Mountain",4240,9.8,44.3470,-73.8980],
  [29,"Upper Wolfjaw",4185,14.0,44.1380,-73.8400],
  [30,"Lower Wolfjaw",4175,13.5,44.1450,-73.8290],
  [31,"Street Mountain",4166,9.6,44.1810,-74.0070],
  [32,"Phelps Mountain",4161,11.0,44.1480,-73.9330],
  [33,"Mount Donaldson",4140,15.0,44.1600,-74.1980],
  [34,"Seymour Mountain",4120,14.0,44.1760,-74.1700],
  [35,"Sawteeth",4100,12.2,44.1080,-73.8400],
  [36,"Cascade Mountain",4098,4.8,44.2200,-73.8610],
  [37,"South Dix (Carson)",4060,12.6,44.0630,-73.7660],
  [38,"Porter Mountain",4059,6.4,44.2160,-73.8460],
  [39,"Mount Colvin",4057,12.4,44.0980,-73.8090],
  [40,"Mount Emmons",4040,16.2,44.1540,-74.2090],
  [41,"Dial Mountain",4020,14.2,44.0980,-73.8000],
  [42,"East Dix (Grace Peak)",4012,11.0,44.0660,-73.7470],
  [43,"Blake Peak",3960,15.4,44.0900,-73.8160],
  [44,"Cliff Mountain",3960,17.0,44.0990,-73.9700],
  [45,"Nye Mountain",3895,9.6,44.1830,-74.0150],
  [46,"Couchsachraga Peak",3820,18.0,44.0860,-74.1500],
];
// ft→m gain estimate uses summit elevation minus a typical ~2,000 ft trailhead.
const ADK_ICONS = ["⛰","🏔","🗻","🥾","🌲"];
const ADK_46ERS = ADK_46_DATA.map(([rank,name,ft,miles,lat,lon]) => {
  const km = +(miles*1.60934).toFixed(1);
  const gain = Math.max(300, Math.round((ft-2000)*0.3048)); // rough vertical from a ~2,000 ft trailhead
  const diff = miles>=16?"expert":miles>=12?"hard":miles>=8?"moderate":"easy";
  const hrsLo = Math.max(2,Math.round(miles/1.6)), hrsHi = Math.max(hrsLo+1,Math.round(miles/1.1));
  return {
    id:`adk${rank}`, name, loc:"Adirondack High Peaks, NY",
    dist:km, gain, diff, icon:ADK_ICONS[rank%ADK_ICONS.length],
    rating:+(4.3+((ft-3800)/1600)*0.6).toFixed(1), saves:200+(47-rank)*60,
    time:`${hrsLo}-${hrsHi}h`, rank, elev_ft:ft,
    track:synthTrack(gain,[lat,lon]),
  };
});


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

  // ── Users / social graph ──
  async searchUsers(q) {
    const d = await apiCall("GET", `/community/users?q=${encodeURIComponent(q)}`);
    return (d.items || d.users || []).map(u => ({
      id: u.id, username: u.username, display_name: u.display_name || u.username,
      bio: u.bio || "", following: !!u.is_following,
    }));
  },
  followUser: (id) => apiCall("POST", `/community/follow/${id}`),
  unfollowUser: (id) => apiCall("DELETE", `/community/follow/${id}`),
  updateProfile: (body) => apiCall("PATCH", "/users/me", body),
  me: () => apiCall("GET", "/users/me"),
  // ── Admin (role==="admin"; backend enforces) ──
  adminMetrics: () => apiCall("GET", "/admin/metrics"),
  adminUsers: (q="") => apiCall("GET", `/admin/users?q=${encodeURIComponent(q)}`),
  adminBan: (id) => apiCall("POST", `/admin/users/${id}/ban`),
  adminUnban: (id) => apiCall("DELETE", `/admin/users/${id}/ban`),
  adminPosts: () => apiCall("GET", "/admin/posts"),
  adminModeratePost: (id, restore=false) => apiCall("DELETE", `/admin/posts/${id}?restore=${restore?1:0}`),
  adminAudit: () => apiCall("GET", "/admin/audit"),
};

// Demo user directory for offline search (used when no backend is connected)
const DEMO_USERS = [
  { id:"u1", username:"alexk",   display_name:"Alex K",   bio:"Cascades peak-bagger · 124km this month" },
  { id:"u2", username:"mayar",   display_name:"Maya R",   bio:"Trail runner & photographer" },
  { id:"u3", username:"jordant", display_name:"Jordan T", bio:"Weekend warrior, PNW" },
  { id:"u4", username:"priyam",  display_name:"Priya M",  bio:"Thru-hiker · PCT '23" },
  { id:"u5", username:"bent",    display_name:"Ben T",    bio:"Alpine scrambles & ski tours" },
  { id:"u6", username:"ninap",   display_name:"Nina P",   bio:"Backcountry overnights" },
  { id:"u7", username:"samb",    display_name:"Sam B",    bio:"Map nerd, gear tinkerer" },
  { id:"u8", username:"chloed",  display_name:"Chloe D",  bio:"Volcano circuits, OR & WA" },
  { id:"u9", username:"marcusl", display_name:"Marcus L", bio:"Ultralight enthusiast" },
  { id:"u10",username:"tinaw",   display_name:"Tina W",   bio:"Family-friendly day hikes" },
];

// ════════════════════════════════════════════════════════════════════════════
//  LOCAL STORE (in-memory fallback) + React context
// ════════════════════════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2, 10);

const SEED = {
  routes: ADK_46ERS,
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
    { id:"p1", kind:"photo", media_url:"", caption:"Golden hour at Colchuck Lake — worth the 4am start", location_name:"Enchantments", like_count:142, comment_count:8, liked:false, following:false, author:{ display_name:"Alex K", username:"alexk" }, created_at:"2h ago", grad:["#1e3a5f","#0d2818"] },
    { id:"p2", kind:"video", media_url:"", duration_s:34, caption:"Ridgeline traverse in the clouds ☁️", location_name:"Mt Si", like_count:89, comment_count:3, liked:true, following:true, author:{ display_name:"Maya R", username:"mayar" }, created_at:"5h ago", grad:["#3a2f5f","#0d1828"] },
    { id:"p3", kind:"photo", media_url:"", caption:"First snow of the season up high", location_name:"Lake Serene", like_count:204, comment_count:15, liked:false, following:true, author:{ display_name:"Jordan T", username:"jordant" }, created_at:"1d ago", grad:["#4a5060","#0d2818"] },
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
  const [following, setFollowing] = useState([
    { id:"u2", username:"mayar",   display_name:"Maya R" },
    { id:"u3", username:"jordant", display_name:"Jordan T" },
    { id:"u4", username:"priyam",  display_name:"Priya M" },
    { id:"u7", username:"samb",    display_name:"Sam B" },
  ]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [online, setOnline] = useState(false);
  const [activity, setActivity] = useState([]);   // audit trail for admin

  const toast = useCallback((msg, kind = "ok") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, kind }]);
    setActivity(a => [{ id, msg, kind, at: new Date().toISOString() }, ...a].slice(0, 200));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  // Hydrate from backend once authed; falls back to SEED on failure.
  const hydrate = useCallback(async () => {
    const alive = await probeApi();
    setOnline(alive);
    if (!alive) {
      toast(API_CONFIGURED ? "Backend unreachable — demo mode" : "No backend set — demo mode", "warn");
      return;
    }
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
      toast("Live data synced ✓");
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

  // Download a markdown trip/route report
  const exportReport = useCallback((t) => {
    const lines = [
      `# ${t.name}`,
      ``,
      `- Date: ${t.date || "—"}`,
      `- Distance: ${t.dist ?? "—"} km`,
      `- Elevation gain: ${(t.gain||0).toLocaleString()} m`,
      `- Duration: ${t.dur || "—"}`,
      `- Status: ${t.status || "—"}`,
      ``,
      `## Journal`,
      ...((t.journal||[]).length ? t.journal.map(e => `- ${e}`) : ["_No entries._"]),
      ``,
      `_Generated by Summit · Powered by Daie DillyAI Enterprise_`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(t.name||"trip").replace(/[^a-z0-9]/gi,"_")}_report.md`;
    a.click(); URL.revokeObjectURL(url);
    toast(`Report exported ✓`);
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

  // Replace the whole feed list (used when server returns scoped results)
  const setFeedPosts = useCallback((list) => {
    setPosts(list.map(p => ({ liked:false, like_count:0, comment_count:0, ...p })));
  }, []);
  // Bump a post's comment count after a comment is added
  const bumpComments = useCallback((id, by=1) => {
    setPosts(ps => ps.map(p => p.id===id ? { ...p, comment_count:(p.comment_count||0)+by } : p));
  }, []);

  // ── User search & follow graph ──
  const isFollowing = useCallback((u) => following.some(f => f.id === u.id || f.username === u.username), [following]);
  const searchUsers = useCallback(async (q) => {
    const query = (q||"").trim();
    if (!query) return [];
    let results = [];
    if (online) {
      try { results = await backend.searchUsers(query); } catch { results = []; }
    }
    if (!results.length) {
      const lq = query.toLowerCase();
      results = DEMO_USERS.filter(u =>
        u.display_name.toLowerCase().includes(lq) || u.username.toLowerCase().includes(lq));
    }
    // annotate with current follow state
    return results.map(u => ({ ...u, following: isFollowing(u) }));
  }, [online, isFollowing]);

  const followUser = useCallback(async (u) => {
    if (isFollowing(u)) return;
    setFollowing(f => [...f, { id:u.id, username:u.username, display_name:u.display_name }]);
    toast(`Following ${u.display_name} ✓`);
    if (online) { try { await backend.followUser(u.id); } catch {} }
  }, [online, toast, isFollowing]);

  const unfollowUser = useCallback(async (u) => {
    setFollowing(f => f.filter(x => x.id !== u.id && x.username !== u.username));
    toast(`Unfollowed ${u.display_name}`);
    if (online) { try { await backend.unfollowUser(u.id); } catch {} }
  }, [online, toast]);

  const value = {
    routes, trips, gear, reports, posts, following, activeTrip, toasts, toast, online, hydrate, activity,
    addRoute, deleteRoute, exportGpx, exportReport,
    startTrip, endTrip, addJournal,
    addGear, deleteGear, addReport,
    createPost, toggleLike, deletePost, setFeedPosts, bumpComments,
    searchUsers, followUser, unfollowUser, isFollowing,
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
    pri:{background:`linear-gradient(120deg, ${T.gMid}, ${T.gBright})`,color:T.mode==="dark"?"#06231F":"#fff",boxShadow:`0 4px 18px -4px ${T.glow}, 0 1px 2px rgba(0,0,0,.2)`,fontWeight:600},
    accent:{background:`linear-gradient(120deg, ${T.amb}, ${T.ambBr})`,color:"#1a0d05",boxShadow:`0 4px 18px -4px ${T.ambL}66`,fontWeight:600},
    soft:{background:T.mode==="dark"?"rgba(94,234,212,.12)":"#DCF5F0",color:T.mode==="dark"?T.gGlow:T.gDark},
    ghost:{background:"transparent",color:T.txtD,border:`1px solid ${T.brd}`},
    danger:{background:T.redD,color:T.red,border:`1px solid ${T.red}33`},
    subtle:{background:T.glass,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",color:T.txtD,border:`1px solid ${T.glassBrd}`},
    active:{background:T.mode==="dark"?"rgba(94,234,212,.14)":"#DCF5F0",color:T.gBright,border:`1px solid ${T.gMid}`},
  };
  return <button type={type} style={{...base,...vs[v],...s}} onClick={!disabled&&!load?onClick:undefined}
    onMouseEnter={e=>{if(!disabled&&!load){e.currentTarget.style.filter="brightness(1.06)";e.currentTarget.style.transform="translateY(-1px)"}}}
    onMouseLeave={e=>{e.currentTarget.style.filter="";e.currentTarget.style.transform=""}}>{load?<Spin s={13}/>:ic}{children}</button>;
};

const Card = ({children,style:s,onClick,glow}) => (
  <div onClick={onClick} style={{position:"relative",background:T.glass,backdropFilter:"blur(16px) saturate(140%)",WebkitBackdropFilter:"blur(16px) saturate(140%)",border:`1px solid ${T.glassBrd}`,borderRadius:18,overflow:"hidden",boxShadow:glow?`${T.shadow}, 0 0 40px -12px ${T.glow}`:T.shadow,transition:"border-color .2s,transform .2s,box-shadow .2s",cursor:onClick?"pointer":"default",...s}}
    onMouseEnter={e=>{if(onClick){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`${T.shadowLg}, 0 0 50px -14px ${T.glow}`;e.currentTarget.style.borderColor=T.gBright+"66"}}}
    onMouseLeave={e=>{if(onClick){e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=glow?`${T.shadow}, 0 0 40px -12px ${T.glow}`:T.shadow;e.currentTarget.style.borderColor=T.glassBrd}}}>
    <div style={{position:"absolute",top:0,left:16,right:16,height:1,background:`linear-gradient(90deg,transparent,${T.mode==="dark"?"rgba(255,255,255,.18)":"rgba(255,255,255,.9)"},transparent)`,pointerEvents:"none"}}/>
    {children}
  </div>
);

const Badge = ({children,c="g"}) => {
  const m={
    g:{bg:T.mode==="dark"?"rgba(94,234,212,.14)":"#DCF5F0",fg:T.mode==="dark"?T.gGlow:T.gDark,gl:T.gBright},
    a:{bg:T.mode==="dark"?"rgba(240,176,70,.14)":"#FBEFD6",fg:T.amb,gl:T.amb},
    r:{bg:T.redD,fg:T.red,gl:T.red},
    p:{bg:T.mode==="dark"?"rgba(167,139,250,.14)":"#EFE9FB",fg:T.pur,gl:T.pur},
    b:{bg:T.mode==="dark"?"rgba(124,156,255,.14)":"#E4ECFB",fg:T.blu,gl:T.blu},
    s:{bg:T.bgEl,fg:T.txtD,gl:T.brdBr},
  };
  const col=m[c]||m.s;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:col.bg,color:col.fg,padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:600,letterSpacing:"0.02em",whiteSpace:"nowrap",border:`1px solid ${col.gl}2e`,boxShadow:`0 0 12px -4px ${col.gl}44`}}>{children}</span>;
};

const Eyebrow = ({children}) => <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:T.txtF}}>{children}</div>;

const Row=({children,g=12,style:s})=><div style={{display:"flex",alignItems:"center",gap:g,...s}}>{children}</div>;
const Col=({children,g=12,style:s})=><div style={{display:"flex",flexDirection:"column",gap:g,...s}}>{children}</div>;

// ── Modal ──
const Modal = ({ title, onClose, children, width=440 }) => (
  <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#000000bb", backdropFilter:"blur(4px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", animation:"backdrop .2s ease", padding:20 }}>
    <div onClick={e=>e.stopPropagation()} style={{ width, maxWidth:"100%", maxHeight:"90vh", overflow:"auto", background:T.glass, backdropFilter:"blur(22px) saturate(150%)", WebkitBackdropFilter:"blur(22px) saturate(150%)", border:`1px solid ${T.glassBrd}`, borderRadius:18, animation:"slideUp .25s ease", boxShadow:`0 28px 90px rgba(0,0,0,.5), 0 0 60px -20px ${T.glow}` }}>
      <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.brd}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:T.bgCard, zIndex:1 }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700 }}>{title}</div>
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

// Representative coordinate for a route (midpoint of track, else default).
const routeCoord = (route) => {
  const t = route?.track || route?.track_points;
  if (Array.isArray(t) && t.length) {
    const m = t[Math.floor(t.length/2)] || t[0];
    const lat = m?.lat, lon = m?.lon ?? m?.lng;
    if (typeof lat === "number" && typeof lon === "number") return [lat, lon];
  }
  return [46.8523, -121.7603]; // Mt Rainier fallback
};

// ── Weather (Open-Meteo, no API key) ──
const _weatherCache = {};
// WMO weather interpretation codes → icon + label
const WMO = (c) => {
  if (c===0) return ["☀️","Clear"];
  if (c<=2) return ["🌤️","Partly cloudy"];
  if (c===3) return ["☁️","Overcast"];
  if (c<=48) return ["🌫️","Fog"];
  if (c<=57) return ["🌦️","Drizzle"];
  if (c<=67) return ["🌧️","Rain"];
  if (c<=77) return ["❄️","Snow"];
  if (c<=82) return ["🌧️","Showers"];
  if (c<=86) return ["🌨️","Snow showers"];
  if (c<=99) return ["⛈️","Thunderstorm"];
  return ["🌡️","—"];
};
const WeatherWidget = ({ route, lat: latProp, lon: lonProp, compact }) => {
  const [la, lo] = route ? routeCoord(route) : [latProp, lonProp];
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | error
  useEffect(() => {
    if (la == null || lo == null) { setState("error"); return; }
    const lat = la, lon = lo;
    const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (_weatherCache[key]) { setData(_weatherCache[key]); setState("ok"); return; }
    let cancel = false;
    setState("loading");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max`
      + `&timezone=auto&forecast_days=3&temperature_unit=celsius&wind_speed_unit=kmh`;
    fetch(url, { signal: AbortSignal.timeout(6000) })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("weather")))
      .then(j => { if (cancel) return; _weatherCache[key] = j; setData(j); setState("ok"); })
      .catch(() => { if (!cancel) setState("error"); });
    return () => { cancel = true; };
  }, [la, lo]);

  if (state === "error") {
    return <div style={{ fontSize:11, color:T.txtF, padding:"8px 0" }}>Weather unavailable for this location.</div>;
  }
  if (state === "loading" || !data) {
    return <Row g={8} style={{ padding:"8px 0", color:T.txtF, fontSize:12 }}><Spin s={14}/> Loading forecast…</Row>;
  }
  const cur = data.current || {};
  const [icon, label] = WMO(cur.weather_code);
  const daily = data.daily || {};
  const days = (daily.time || []).map((t, i) => ({
    date: new Date(t).toLocaleDateString([], { weekday: "short" }),
    code: daily.weather_code?.[i], hi: daily.temperature_2m_max?.[i], lo: daily.temperature_2m_min?.[i],
    pop: daily.precipitation_probability_max?.[i], wind: daily.weather_code && daily.wind_speed_10m_max?.[i],
  }));
  // hazard checks
  const hazards = [];
  if (cur.wind_speed_10m > 40) hazards.push("High winds");
  if ((daily.precipitation_probability_max?.[0] ?? 0) > 70) hazards.push("Likely precipitation");
  if ([95,96,99].includes(cur.weather_code)) hazards.push("Thunderstorms");
  if ((daily.temperature_2m_min?.[0] ?? 99) < 0) hazards.push("Freezing temps");
  if ([71,73,75,77,85,86].includes(cur.weather_code)) hazards.push("Snow");

  return (
    <div>
      <Row style={{ justifyContent:"space-between", alignItems:"center", marginBottom:compact?0:10 }}>
        <Row g={10}>
          <span style={{ fontSize:30 }}>{icon}</span>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700 }}>{Math.round(cur.temperature_2m)}°C</div>
            <div style={{ fontSize:11, color:T.txtD }}>{label} · feels {Math.round(cur.apparent_temperature)}°</div>
          </div>
        </Row>
        <div style={{ textAlign:"right", fontSize:11, color:T.txtD }}>
          <div>💨 {Math.round(cur.wind_speed_10m)} km/h</div>
          <div>💧 {cur.precipitation ?? 0} mm</div>
        </div>
      </Row>
      {hazards.length>0 && (
        <div style={{ background:`${T.red}14`, border:`1px solid ${T.red}44`, borderRadius:8, padding:"7px 11px", margin:"4px 0 10px", fontSize:11, color:T.red }}>
          ⚠ {hazards.join(" · ")}
        </div>
      )}
      {!compact && (
        <Row g={8}>
          {days.map((d,i) => { const [di] = WMO(d.code); return (
            <div key={i} style={{ flex:1, background:T.bgEl, borderRadius:9, padding:"9px 6px", textAlign:"center" }}>
              <div style={{ fontSize:10, color:T.txtD, marginBottom:3 }}>{i===0?"Today":d.date}</div>
              <div style={{ fontSize:20 }}>{di}</div>
              <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{Math.round(d.hi)}°<span style={{ color:T.txtF, fontWeight:400 }}>/{Math.round(d.lo)}°</span></div>
              {d.pop!=null && <div style={{ fontSize:10, color:d.pop>60?T.bluL:T.txtF, marginTop:2 }}>💧{d.pop}%</div>}
            </div>
          );})}
        </Row>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
const Trail3D = ({ route, onUnavailable }) => {
  const mountRef=useRef(null), animRef=useRef(null), flyRef=useRef(0);
  const [loaded,setLoaded]=useState(false), [camMode,setCamMode]=useState("orbit"), [failed,setFailed]=useState(false);

  useEffect(()=>{
    const el=mountRef.current; if(!el) return;
    setLoaded(false);
    let renderer;
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
      if(!renderer || !renderer.getContext()) throw new Error("no-gl");
    } catch(e) { setFailed(true); if(onUnavailable) onUnavailable(); return; }
    // Fallback dims if the flex parent hasn't laid out yet (avoids 0x0 canvas → blank view)
    let W=el.clientWidth||el.offsetWidth||800, H=el.clientHeight||el.offsetHeight||600;
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.domElement.style.display="block";
    renderer.domElement.style.width="100%"; renderer.domElement.style.height="100%";
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
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:700,color:T.gGlow}}>{route?.name||"Lake Serene"}</div>
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
// ── Leaflet loader (CDN, no key). Resolves once window.L is ready. ──
let _leafletPromise = null;
const loadLeaflet = () => {
  if (typeof window !== "undefined" && window.L) return Promise.resolve(window.L);
  if (_leafletPromise) return _leafletPromise;
  _leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error("leaflet-load-failed"));
    document.head.appendChild(js);
  });
  return _leafletPromise;
};

// Esri / ArcGIS basemap tile services — free, no API key required.
const ESRI_BASEMAPS = {
  Topographic: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles © Esri — Esri, DeLorme, NAVTEQ, USGS, NPS",
  },
  Imagery: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, USDA, USGS",
  },
  Terrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles © Esri — Source: Esri, USGS, NOAA",
  },
};

const TopoMap2D = ({ route }) => {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);   // current basemap tile layer
  const trackRef = useRef(null);   // route overlay group
  const [layer, setLayer] = useState("Topographic");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Derive track coords (real or a gentle synthetic line near the route seed)
  const coords = (() => {
    const t = route?.track || route?.track_points;
    if (Array.isArray(t) && t.length > 1) return t.map(p => [p.lat, p.lon ?? p.lng]).filter(c => typeof c[0]==="number" && typeof c[1]==="number");
    return null;
  })();

  // Init the map once
  useEffect(() => {
    let cancelled = false;
    // If Leaflet/tiles don't load within 8s (e.g. CDN blocked), show fallback.
    const failTimer = setTimeout(() => { if (!cancelled && !mapRef.current) setFailed(true); }, 8000);
    loadLeaflet().then((L) => {
      if (cancelled || !elRef.current || mapRef.current) return;
      const center = coords ? coords[Math.floor(coords.length/2)] : [46.8523, -121.7603]; // Mt Rainier default
      const map = L.map(elRef.current, { zoomControl: false, attributionControl: true }).setView(center, 12);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      const bm = ESRI_BASEMAPS[layer];
      layerRef.current = L.tileLayer(bm.url, { attribution: bm.attr, maxZoom: 19 }).addTo(map);
      mapRef.current = map;
      setReady(true);
      clearTimeout(failTimer);
      // Re-measure several times as the flex/grid layout settles (fixes blank/0-size map)
      [60, 200, 500, 900].forEach(ms => setTimeout(() => { try { map.invalidateSize(); } catch {} }, ms));
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; clearTimeout(failTimer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  // eslint-disable-next-line
  }, []);

  // Keep the map sized to its container (handles 2D/3D toggle + viewport changes)
  useEffect(() => {
    const map = mapRef.current, el = elRef.current; if (!map || !el || !ready) return;
    const ro = new ResizeObserver(() => { try { map.invalidateSize(); } catch {} });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  // Swap basemap when layer changes
  useEffect(() => {
    const L = window.L, map = mapRef.current; if (!L || !map) return;
    if (layerRef.current) map.removeLayer(layerRef.current);
    const bm = ESRI_BASEMAPS[layer];
    layerRef.current = L.tileLayer(bm.url, { attribution: bm.attr, maxZoom: 19 }).addTo(map);
  }, [layer, ready]);

  // Draw / update the route track
  useEffect(() => {
    const L = window.L, map = mapRef.current; if (!L || !map) return;
    if (trackRef.current) { map.removeLayer(trackRef.current); trackRef.current = null; }
    if (!coords) return;
    const grp = L.layerGroup();
    L.polyline(coords, { color: "#1b3a2a", weight: 7, opacity: 0.5, lineCap: "round" }).addTo(grp); // shadow
    L.polyline(coords, { color: "#4db8ff", weight: 4, opacity: 0.95, lineCap: "round" }).addTo(grp); // bright blue route
    const mk = (latlng, color, label) => L.circleMarker(latlng, { radius: 7, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1 }).bindTooltip(label, { direction: "top" });
    mk(coords[0], "#2fbf6c", "Trailhead").addTo(grp);
    mk(coords[coords.length - 1], "#E8763A", "Summit / End").addTo(grp);
    grp.addTo(map);
    trackRef.current = grp;
    map.fitBounds(L.latLngBounds(coords).pad(0.25));
  }, [route, ready]);

  if (failed) {
    // Network/CDN blocked → keep a usable styled fallback
    return (
      <div style={{ width:"100%", height:"100%", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, color:T.txtD }}>
        <div style={{ fontSize:13 }}>Map tiles unavailable (offline or blocked).</div>
        <div style={{ fontSize:11 }}>Route data is still loaded — connect to load Esri basemaps.</div>
      </div>
    );
  }

  return (
    <div style={{ width:"100%", height:"100%", position:"relative" }}>
      <div ref={elRef} style={{ position:"absolute", inset:0, background:T.bg }} />
      {!ready && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:T.txtD, fontSize:12, pointerEvents:"none" }}>
          Loading Esri basemap…
        </div>
      )}
      {/* basemap switcher — bottom-left, clear of the top-right 2D/3D toggle */}
      <div style={{ position:"absolute", bottom:14, left:14, zIndex:500, display:"flex", gap:4, maxWidth:"calc(100% - 28px)", overflowX:"auto", background:`${T.bgCard}dd`, backdropFilter:"blur(8px)", border:`1px solid ${T.brd}`, borderRadius:8, padding:4 }}>
        {Object.keys(ESRI_BASEMAPS).map(l => (
          <button key={l} onClick={()=>setLayer(l)} style={{ height:26, padding:"0 10px", flexShrink:0, background:layer===l?`${T.gMid}44`:"transparent", border:`1px solid ${layer===l?T.gBright:"transparent"}`, borderRadius:6, color:layer===l?T.gBright:T.txtD, fontSize:11, fontFamily:"'JetBrains Mono',monospace", cursor:"pointer", whiteSpace:"nowrap" }}>{l}</button>
        ))}
      </div>
    </div>
  );
};
const mapBtn={width:34,height:34,background:`${T.bgCard}ee`,backdropFilter:"blur(8px)",border:`1px solid ${T.brd}`,borderRadius:7,color:T.txt,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"};

// ── MapLibre GL 3D — beta photorealistic terrain viewer ──────────────────────
// Loads MapLibre GL JS from CDN, drapes Esri World Imagery over AWS Terrain
// Tiles (Terrarium format, no key). Shows real summit elevations + route track.
let _maplibrePromise = null;
const loadMapLibre = () => {
  if (typeof window !== "undefined" && window.maplibregl) return Promise.resolve(window.maplibregl);
  if (_maplibrePromise) return _maplibrePromise;
  _maplibrePromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/maplibre-gl@4.7.0/dist/maplibre-gl.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://unpkg.com/maplibre-gl@4.7.0/dist/maplibre-gl.js";
    js.onload = () => resolve(window.maplibregl);
    js.onerror = () => reject(new Error("maplibre-load-failed"));
    document.head.appendChild(js);
  });
  return _maplibrePromise;
};

const MapLibre3D = ({ route, onUnavailable }) => {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pitch, setPitch] = useState(60);

  // Centre + zoom from the route's track midpoint
  const [cLat, cLon] = routeCoord(route);

  useEffect(() => {
    let cancelled = false;
    const failTimer = setTimeout(() => { if (!cancelled && !mapRef.current) { setFailed(true); if (onUnavailable) onUnavailable(); } }, 10000);
    loadMapLibre().then(ml => {
      if (cancelled || !elRef.current || mapRef.current) return;
      clearTimeout(failTimer);
      const map = new ml.Map({
        container: elRef.current,
        style: {
          version: 8,
          sources: {
            // Esri World Imagery — same no-key source as the 2D map
            imagery: {
              type: "raster",
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Tiles © Esri, Maxar, Earthstar Geographics",
            },
            // AWS Terrain Tiles (Terrarium elevation encoding — free, no key)
            terrain_tiles: {
              type: "raster-dem",
              tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
              tileSize: 256,
              encoding: "terrarium",
              attribution: "Terrain: Mapzen/AWS",
            },
          },
          layers: [{ id: "imagery", type: "raster", source: "imagery" }],
          terrain: { source: "terrain_tiles", exaggeration: 1.5 },
          sky: {
            "sky-color": "#1a2744",
            "sky-horizon-blend": 0.5,
            "horizon-color": "#a0b4d0",
            "horizon-fog-blend": 0.8,
            "fog-color": "#d0dde8",
            "fog-ground-blend": 0.9,
          },
        },
        center: [cLon, cLat],
        zoom: 12,
        pitch: 60,
        bearing: -20,
        antialias: true,
      });

      map.on("load", () => {
        if (cancelled) return;
        // Draw the route track as a glowing blue line
        const coords = (route?.track || route?.track_points || [])
          .filter(p => typeof p.lat === "number")
          .map(p => [p.lon ?? p.lng, p.lat]);
        if (coords.length > 1) {
          map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } } });
          // Shadow under the line
          map.addLayer({ id: "route-shadow", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#000", "line-width": 7, "line-blur": 4, "line-opacity": 0.5 } });
          // Bright blue line
          map.addLayer({ id: "route-line", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#4db8ff", "line-width": 4, "line-opacity": 0.95 } });
          // Bright core
          map.addLayer({ id: "route-core", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#dff4ff", "line-width": 1.5, "line-opacity": 0.85 } });
          // Trailhead + summit markers
          [[coords[0], "#2fbf6c", "Trailhead"], [coords[coords.length-1], "#FF8A5B", "Summit"]].forEach(([c, color, label]) => {
            const el = document.createElement("div");
            el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 10px ${color}`;
            new ml.Marker({ element: el }).setLngLat(c).setPopup(new ml.Popup({ offset: 16 }).setText(label)).addTo(map);
          });
          // Fly the camera along the route for a cinematic intro
          map.fitBounds([[Math.min(...coords.map(c=>c[0])), Math.min(...coords.map(c=>c[1]))], [Math.max(...coords.map(c=>c[0])), Math.max(...coords.map(c=>c[1]))]], { padding: 60, pitch: 60, bearing: -20, duration: 2000 });
        }
        setReady(true);
      });
      map.on("error", () => { if (!cancelled) { setFailed(true); if (onUnavailable) onUnavailable(); } });
      mapRef.current = map;
    }).catch(() => { if (!cancelled) { setFailed(true); if (onUnavailable) onUnavailable(); } });
    return () => { cancelled = true; clearTimeout(failTimer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  // eslint-disable-next-line
  }, []);

  // Update pitch when slider changes
  useEffect(() => { if (mapRef.current) { mapRef.current.setPitch(pitch); } }, [pitch]);
  // Update route when selection changes
  useEffect(() => {
    const map = mapRef.current; if (!map || !ready) return;
    const coords = (route?.track || route?.track_points || []).filter(p => typeof p.lat === "number").map(p => [p.lon ?? p.lng, p.lat]);
    if (!coords.length) return;
    const src = map.getSource("route");
    if (src) src.setData({ type: "Feature", geometry: { type: "LineString", coordinates: coords } });
    map.flyTo({ center: [cLon, cLat], pitch: 60, bearing: -20, zoom: 12, duration: 1000 });
  }, [route, ready, cLat, cLon]);

  if (failed) return (
    <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:T.txtD,background:T.bg}}>
      <div style={{fontSize:13}}>3D terrain unavailable (needs network + WebGL).</div>
      <div style={{fontSize:11,color:T.txtF}}>Try the 2D map or check your connection.</div>
    </div>
  );

  return (
    <div style={{width:"100%",height:"100%",position:"relative"}}>
      <div ref={elRef} style={{width:"100%",height:"100%"}}/>
      {!ready && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:`${T.bg}cc`,color:T.txtD,fontSize:12,gap:8}}><Spin s={16}/> Loading 3D terrain…</div>}
      {/* Pitch slider */}
      {ready && <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.7)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Pitch</div>
        <input type="range" min={0} max={85} value={pitch} onChange={e=>setPitch(+e.target.value)} style={{WebkitAppearance:"slider-vertical",writingMode:"vertical-lr",direction:"rtl",height:80,width:20,opacity:.85,cursor:"pointer"}}/>
        <div style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{pitch}°</div>
      </div>}
      {/* Beta badge */}
      <div style={{position:"absolute",bottom:14,left:14,zIndex:10}}>
        <Badge c="p">β Beta · MapLibre 3D Terrain</Badge>
      </div>
    </div>
  );
};
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

const FindPeopleModal = ({ onClose }) => {
  const { searchUsers, followUser, unfollowUser, isFollowing } = useStore();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  // debounce search as the user types
  useEffect(() => {
    if (!q.trim()) { setResults([]); setTouched(false); return; }
    setTouched(true); setLoading(true);
    const t = setTimeout(async () => {
      const r = await searchUsers(q);
      setResults(r); setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q, searchUsers]);
  // re-evaluate follow state after toggling
  const [, force] = useState(0);
  const toggle = async (u) => {
    if (isFollowing(u)) await unfollowUser(u); else await followUser(u);
    setResults(rs => rs.map(x => x.id===u.id ? { ...x, following: !isFollowing(u) } : x));
    force(n => n+1);
  };
  return (
    <Modal title="Find People" onClose={onClose}>
      <Col g={14}>
        <input autoFocus placeholder="Search by name or username…" value={q} onChange={e=>setQ(e.target.value)} style={{ width:"100%" }}/>
        <div style={{ minHeight:120, maxHeight:340, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
          {loading && <div style={{ fontSize:12, color:T.txtF, padding:"8px 2px" }}>Searching…</div>}
          {!loading && touched && results.length===0 && <div style={{ fontSize:12, color:T.txtF, padding:"8px 2px" }}>No people found for “{q}”.</div>}
          {!touched && <div style={{ fontSize:12, color:T.txtF, padding:"8px 2px" }}>Start typing to find hikers to follow.</div>}
          {results.map(u => {
            const fol = isFollowing(u);
            return (
              <Row key={u.id} style={{ justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.brd}` }}>
                <Row g={11} style={{ minWidth:0 }}>
                  <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${T.gMid},${T.ambL})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0,fontFamily:"'Space Grotesk',sans-serif" }}>{u.display_name.charAt(0)}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{u.display_name} <span style={{ color:T.txtF,fontWeight:400 }}>@{u.username}</span></div>
                    {u.bio && <div style={{ fontSize:11,color:T.txtD,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{u.bio}</div>}
                  </div>
                </Row>
                <Btn v={fol?"ghost":"pri"} sz="sm" onClick={()=>toggle(u)}>{fol?"Following":"Follow"}</Btn>
              </Row>
            );
          })}
        </div>
        <Btn v="ghost" onClick={onClose}>Done</Btn>
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
  const shareLocation=()=>{
    if(!navigator.geolocation){ toast("Geolocation not supported","warn"); return; }
    toast("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      pos=>{ const {latitude,longitude}=pos.coords; toast(`Location shared: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} ✓`); },
      ()=>toast("Location permission denied","warn"),
      { enableHighAccuracy:true, timeout:8000 }
    );
  };
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
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Live Tracking</div></Row>
        {activeTrip
          ?<Btn v="danger" sz="sm" onClick={finish} ic={<span style={{fontSize:11}}>■</span>}>End Trip</Btn>
          :<Btn v="pri" sz="sm" onClick={()=>setShowStart(true)} ic={<span style={{fontSize:11}}>▶</span>}>Start Trip</Btn>}
      </div>
      <div style={{padding:18}}>
        {activeTrip&&<div style={{background:`${T.gMid}11`,border:`1px solid ${T.gMid}44`,borderRadius:10,padding:16,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:11,color:T.gBright,marginBottom:4}}>● {activeTrip.name}</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:34,fontWeight:700,color:T.gGlow,letterSpacing:"0.05em"}}>{fmt(elapsed)}</div>
          <Row g={32} style={{justifyContent:"center",marginTop:10}}>
            <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700}}>{dist.toFixed(2)}</div><div style={{fontSize:10,color:T.txtD}}>KM</div></div>
            <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700}}>{Math.round(dist*85)}</div><div style={{fontSize:10,color:T.txtD}}>M GAIN</div></div>
            <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700}}>{dist>0?(elapsed/60/dist).toFixed(1):"—"}</div><div style={{fontSize:10,color:T.txtD}}>MIN/KM</div></div>
          </Row>
        </div>}
        <div style={{fontSize:11,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Group · 3 Members</div>
        {friends.map((f,i)=>(<Row key={i} g={12} style={{padding:"9px 0",borderBottom:i<friends.length-1?`1px solid ${T.brd}`:"none"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:f.color+"33",border:`1px solid ${f.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:f.color,flexShrink:0}}>{f.name.charAt(0)}</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{f.name}</div><div style={{fontSize:11,color:T.txtD}}>{f.pos}</div></div>
          <div style={{width:8,height:8,borderRadius:"50%",background:f.status==="active"?T.gBright:T.sDim,boxShadow:f.status==="active"?`0 0 8px ${T.gBright}`:undefined}}/>
        </Row>))}
        <Row g={8} style={{marginTop:14}}>
          <Btn v="subtle" style={{flex:1}} onClick={shareLocation} ic={<span style={{fontSize:12}}>📍</span>}>Share Location</Btn>
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
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Trail Conditions Forecast</div>
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
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:28,fontWeight:700,lineHeight:1,marginBottom:3}}>{value}</div>
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
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>{trips[0]?.name||"Latest"} — Elevation</div>
              <Btn v="ghost" sz="xs" onClick={()=>go("trips")}>View trip →</Btn>
            </div>
            <div style={{padding:18}}>
              <ElevChart height={100} showGrid/>
              <Row g={26} style={{marginTop:14}}>
                {[["Max","2,394m"],["Min","614m"],["Grade","6.4%"],["Duration","11h 42m"],["Calories","3,840"]].map(([l,v])=>(
                  <div key={l}><div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:700,marginTop:2}}>{v}</div></div>))}
              </Row>
            </div>
          </Card>
          <WeatherPanel/>
        </Col>
        <Col g={20}>
          <LiveTracking/>
          <Card style={{animation:"fadeIn .4s ease .4s both"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Saved Routes</div>
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
      <div style={{textAlign:"center",padding:"8px 0 2px",fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,letterSpacing:"0.14em",textTransform:"uppercase",color:T.txtF}}>
        Powered by Daie DillyAI Enterprise · {BUILD_VERSION}
      </div>
    </div>
  );
};

const Explore = ({ openNewRoute }) => {
  const { routes, deleteRoute, exportGpx, startTrip, toast, online } = useStore();
  const { isMobile } = useTheme();
  const [sel,setSel]=useState(routes[1]||routes[0]);
  const [viewMode,setViewMode]=useState("map"); // "map" | "3d" | "3d-beta"
  const [webglOK,setWebglOK]=useState(true);
  const show3D = viewMode==="3d";
  const showBeta = viewMode==="3d-beta";
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
                  <div style={{flex:1}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:700}}>{r.name}</div><div style={{fontSize:11,color:T.txtD}}>📍 {r.loc}</div></div>
                  <Badge c={DCOL[r.diff]}>{r.diff}</Badge></Row>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {[["Distance",r.dist+"km"],["Elev. Gain",r.gain+"m"],["Est. Time",r.time],["Rating",r.rating?r.rating+" ★":"—"]].map(([l,v])=>(
                    <div key={l} style={{background:T.bgEl,borderRadius:8,padding:"9px 11px"}}><div style={{fontSize:9,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700}}>{v}</div></div>))}
                </div>
                <ElevChart color={T.ambL} height={52}/>
                <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.brd}`}}>
                  <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Trail Weather</div>
                  <WeatherWidget route={r}/>
                </div>
                <Col g={6} style={{marginTop:12}}>
                  <Row g={6}><Btn style={{flex:1}} onClick={()=>startTrip(r)}>Start Trip</Btn>
                    {webglOK&&<Btn v={show3D?"active":"ghost"} onClick={()=>setViewMode(m=>m==="3d"?"map":"3d")} ic={<span style={{fontSize:12}}>🏔</span>}>3D</Btn>}
                    <Btn v={showBeta?"active":"ghost"} onClick={()=>setViewMode(m=>m==="3d-beta"?"map":"3d-beta")} ic={<span style={{fontSize:10}}>🛰</span>} title="MapLibre 3D terrain — beta">β</Btn></Row>
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
        {showBeta
          ? <MapLibre3D route={view3D} onUnavailable={()=>setViewMode("map")}/>
          : show3D&&webglOK
            ? <Trail3D route={view3D} onUnavailable={()=>{setWebglOK(false);setViewMode("map");}}/>
            : <TopoMap2D route={view3D}/>}
        {/* View mode toggle — top right */}
        <div style={{position:"absolute",top:14,right:14,zIndex:600,display:"flex",gap:6}}>
          {webglOK&&<Btn v={show3D?"active":"subtle"} sz="sm" onClick={()=>setViewMode(m=>m==="3d"?"map":"3d")} ic={<span style={{fontSize:12}}>🏔</span>}>{show3D?"2D Map":"3D"}</Btn>}
          <Btn v={showBeta?"active":"subtle"} sz="sm" onClick={()=>setViewMode(m=>m==="3d-beta"?"map":"3d-beta")} ic={<span style={{fontSize:11}}>🛰</span>}>{showBeta?"Exit Beta":"3D Map β"}</Btn>
        </div>
      </div>
    </div>
  );
};

const Trips = ({ openStart }) => {
  const { trips, exportGpx, exportReport, toast } = useStore();
  const { isMobile } = useTheme();
  const [sel,setSel]=useState(trips[0]);
  const [show3D,setShow3D]=useState(false);
  const [webglOK,setWebglOK]=useState(true);
  const [journalFor,setJournalFor]=useState(null);
  useEffect(()=>{ if(!trips.find(t=>t.id===sel?.id))setSel(trips[0]); },[trips,sel]);

  // Lifetime aggregates across all trips
  const totalDist = trips.reduce((s,t)=>s+(t.dist||0),0);
  const totalGain = trips.reduce((s,t)=>s+(t.gain||0),0);
  const activeCount = trips.filter(t=>t.status==="active").length;
  const hoursOf = (d) => { const m=/(\d+):(\d+)/.exec(d||""); return m?(+m[1]+ +m[2]/60):0; };
  const totalHours = trips.reduce((s,t)=>s+hoursOf(t.dur),0);
  const longest = trips.reduce((a,t)=>(t.dist||0)>(a?.dist||0)?t:a,null);

  const HERO=[
    {label:"Trips logged",value:trips.length,sub:activeCount?`${activeCount} active now`:"all completed",accent:T.gBright,icon:"⛰"},
    {label:"Distance",value:totalDist.toFixed(0),unit:"km",sub:longest?`longest ${longest.dist}km`:"",accent:T.bluL,icon:"📏"},
    {label:"Elevation",value:(totalGain/1000).toFixed(1),unit:"km ↑",sub:`${totalGain.toLocaleString()} m total`,accent:T.ambL,icon:"📈"},
    {label:"Time moving",value:totalHours.toFixed(0),unit:"hrs",sub:"across all trips",accent:T.gGlow,icon:"⏱"},
  ];

  return(
    <div style={{flex:1,overflow:"auto",padding:isMobile?16:24,display:"flex",flexDirection:"column",gap:isMobile?16:22}}>
      {journalFor&&<JournalModal trip={journalFor} onClose={()=>setJournalFor(null)}/>}

      {/* Header */}
      <Row style={{justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <Eyebrow>Your expedition log</Eyebrow>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:isMobile?26:32,fontWeight:700,letterSpacing:"-0.02em",marginTop:4}}>Trips</div>
        </div>
        <Btn onClick={openStart} ic={<span style={{fontSize:12}}>▶</span>}>Start new trip</Btn>
      </Row>

      {/* Lifetime hero stats */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?10:14}}>
        {HERO.map((h,i)=>(
          <Card key={h.label} glow style={{padding:isMobile?14:18,animation:`fadeIn .4s ease ${i*.06}s both`}}>
            <Row style={{justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.1em"}}>{h.label}</div>
              <span style={{fontSize:15,opacity:.85}}>{h.icon}</span>
            </Row>
            <div style={{display:"flex",alignItems:"baseline",gap:5}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:isMobile?24:30,fontWeight:700,color:h.accent,letterSpacing:"-0.02em"}}>{h.value}</div>
              {h.unit&&<div style={{fontSize:12,color:T.txtD,fontWeight:500}}>{h.unit}</div>}
            </div>
            {h.sub&&<div style={{fontSize:11,color:T.txtF,marginTop:3,fontFamily:"'JetBrains Mono',monospace"}}>{h.sub}</div>}
          </Card>
        ))}
      </div>

      {/* List + detail */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 400px",gap:isMobile?16:22,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {trips.map((t,i)=>{const on=sel?.id===t.id;return(
            <Card key={t.id} onClick={()=>setSel(t)} glow={on} style={{padding:0,overflow:"hidden",border:`1px solid ${on?T.gBright+"66":T.glassBrd}`,animation:`fadeIn .4s ease ${i*.06}s both`}}>
              <div style={{display:"flex"}}>
                <div style={{width:4,background:`linear-gradient(${t.color},${t.color}00)`,flexShrink:0}}/>
                <div style={{flex:1,padding:isMobile?15:18,minWidth:0}}>
                  <Row style={{justifyContent:"space-between",marginBottom:10,gap:8}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                      <div style={{fontSize:11,color:T.txtD,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{t.date}</div>
                    </div>
                    <Badge c={t.status==="active"?"a":"g"}>{t.status==="active"?"● Active":"Completed"}</Badge>
                  </Row>
                  <ElevChart color={t.color} height={44}/>
                  <Row g={20} style={{marginTop:12}}>{[["Distance",t.dist+" km"],["Elevation",t.gain+" m"],["Time",t.dur]].map(([l,v])=>(
                    <div key={l}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600}}>{v}</div><div style={{fontSize:9.5,color:T.txtF,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:1}}>{l}</div></div>))}
                    {(t.journal||[]).length>0&&<div style={{marginLeft:"auto",fontSize:11,color:T.txtF,alignSelf:"center"}}>📓 {t.journal.length}</div>}
                  </Row>
                </div>
              </div>
            </Card>
          );})}
          {trips.length===0&&<Card style={{padding:32,textAlign:"center"}}><div style={{fontSize:13,color:T.txtD}}>No trips yet. Start tracking your first adventure.</div></Card>}
        </div>

        {sel&&<Card glow style={{position:isMobile?"static":"sticky",top:0,maxHeight:isMobile?"none":"calc(100vh - 120px)",display:"flex",flexDirection:"column",padding:0}}>
          {/* hero: 3D or elevation */}
          <div style={{position:"relative"}}>
            {show3D&&webglOK
              ? <div style={{height:220}}><Trail3D route={sel} onUnavailable={()=>{setWebglOK(false);setShow3D(false);}}/></div>
              : <div style={{padding:"22px 20px 6px",background:`linear-gradient(180deg, ${sel.color}14, transparent)`}}><ElevChart color={sel.color} height={96}/></div>}
            <div style={{position:"absolute",top:14,left:18,right:14,display:"flex",justifyContent:"space-between",alignItems:"flex-start",pointerEvents:"none"}}>
              <div style={{pointerEvents:"auto"}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.01em",textShadow:show3D?"0 2px 12px rgba(0,0,0,.7)":"none"}}>{sel.name}</div>
                <div style={{fontSize:11,color:show3D?"rgba(255,255,255,.8)":T.txtD,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{sel.date}</div>
              </div>
              <Row g={6} style={{pointerEvents:"auto"}}>
                <Badge c={sel.status==="active"?"a":"g"}>{sel.status}</Badge>
                {webglOK&&<Btn v={show3D?"active":"subtle"} sz="xs" onClick={()=>setShow3D(s=>!s)} ic={<span style={{fontSize:10}}>🏔</span>}>{show3D?"Chart":"3D"}</Btn>}
              </Row>
            </div>
          </div>

          <div style={{padding:18,overflowY:"auto",flex:1}}>
            {/* stat grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18}}>
              {[["Distance",sel.dist+" km",T.gBright],["Duration",sel.dur,T.bluL],["Elev. gain",sel.gain+" m",T.ambL],["Status",sel.status,T.gGlow]].map(([l,v,c])=>(
                <div key={l} style={{background:T.bgEl,borderRadius:11,padding:"11px 13px",border:`1px solid ${T.glassBrd}`}}><div style={{fontSize:9,color:T.txtF,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{l}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:700,color:c}}>{v}</div></div>))}
            </div>

            {sel.track&&<div style={{marginBottom:18,paddingBottom:16,borderBottom:`1px solid ${T.brd}`}}>
              <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Conditions</div>
              <WeatherWidget route={sel} compact/>
            </div>}

            {/* journal timeline */}
            <Row style={{justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em"}}>Trail journal</div>
              <Btn v="ghost" sz="xs" onClick={()=>setJournalFor(sel)} ic={<span style={{fontSize:10}}>＋</span>}>Add entry</Btn>
            </Row>
            {(sel.journal||[]).length===0&&<div style={{fontSize:11,color:T.txtF,padding:"4px 0 12px"}}>No entries yet. Capture a moment from this trip.</div>}
            {(sel.journal||[]).length>0&&(
              <div style={{position:"relative",paddingLeft:16,marginBottom:6}}>
                <div style={{position:"absolute",left:4,top:4,bottom:4,width:1.5,background:`linear-gradient(${sel.color},${sel.color}22)`}}/>
                {(sel.journal||[]).map((e,i)=>(
                  <div key={i} style={{position:"relative",marginBottom:12}}>
                    <div style={{position:"absolute",left:-15,top:4,width:8,height:8,borderRadius:"50%",background:sel.color,boxShadow:`0 0 8px ${sel.color}`}}/>
                    <div style={{fontSize:12,color:T.txtD,lineHeight:1.6}}>{e}</div>
                  </div>
                ))}
              </div>
            )}

            <Row g={8} style={{marginTop:16}}>
              <Btn style={{flex:1}} onClick={()=>exportReport(sel)} ic={<span style={{fontSize:12}}>📄</span>}>Full report</Btn>
              <Btn v="ghost" onClick={()=>exportGpx({name:sel.name,gain:sel.gain,track:sel.track})} ic={<span style={{fontSize:12}}>↓</span>}>GPX</Btn>
            </Row>
          </div>
        </Card>}
      </div>
    </div>
  );
};

const LOADOUT_PRESETS = {
  "Day Hike":      { target: 4000,  essentials:["Navigation","Footwear"],                              icon:"🥾" },
  "Overnight":     { target: 8000,  essentials:["Shelter","Sleep","Pack","Footwear","Navigation"],     icon:"⛺" },
  "Ultralight":    { target: 4500,  essentials:["Shelter","Sleep","Pack"],                              icon:"⚡" },
  "Winter Alpine": { target: 12000, essentials:["Shelter","Sleep","Pack","Navigation","Electronics"],  icon:"🏔" },
};
const WORN_CATEGORIES = new Set(["Footwear"]);  // worn weight doesn't count toward base pack weight

const Gear = ({ openAddGear }) => {
  const { gear, deleteGear } = useStore();
  const { isMobile } = useTheme();
  const [tab,setTab]=useState("inventory");
  const [confirmId,setConfirmId]=useState(null);  // gear id awaiting delete confirmation
  // Loadout state: which preset, and which gear ids are included
  const [preset,setPreset]=useState("Overnight");
  const [included,setIncluded]=useState(()=>new Set(gear.map(g=>g.id)));
  const toggleItem=(id)=>setIncluded(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  const packGear=gear.filter(g=>included.has(g.id));
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
                  {confirmId===g.id ? (
                    <Row g={4}>
                      <button onClick={()=>{deleteGear(g.id);setConfirmId(null);}}
                        style={{height:26,padding:"0 10px",borderRadius:13,border:"none",background:T.red,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Remove</button>
                      <button onClick={()=>setConfirmId(null)}
                        style={{height:26,padding:"0 10px",borderRadius:13,border:`1px solid ${T.brd}`,background:"transparent",color:T.txtD,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                    </Row>
                  ) : (
                    <button onClick={()=>setConfirmId(g.id)} title="Remove gear"
                      onMouseEnter={e=>{e.currentTarget.style.background=`${T.red}1a`;e.currentTarget.style.color=T.red;e.currentTarget.style.borderColor=`${T.red}55`;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.txtF;e.currentTarget.style.borderColor=T.brd;}}
                      style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`1px solid ${T.brd}`,background:"transparent",color:T.txtF,fontSize:14,cursor:"pointer",padding:0,transition:"all .15s",lineHeight:1}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  )}
                </Row></Row>
              <div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{g.name}</div>
              <div style={{fontSize:11,color:T.txtD,marginBottom:12}}>{g.brand} · {g.cat}</div>
              <Row g={14} style={{marginBottom:12}}>{[["Weight",g.w+"g"],["Cost","$"+g.cost],["Used",g.uses+"×"]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:9,color:T.txtF,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div><div style={{fontSize:12,color:T.txtD,marginTop:2}}>{v}</div></div>))}</Row>
              <div><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:4}}><span>Lifespan</span><span style={{color:g.life<25?T.red:g.life<60?T.ambL:T.gBright,fontWeight:600}}>{g.life}%</span></Row>
                <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${g.life}%`,background:g.life<25?T.red:g.life<60?T.ambL:T.gBright,borderRadius:2,transition:"width .6s ease"}}/></div></div>
            </Card>))}
          </div>
        )}
        {tab==="loadouts"&&(()=>{
          const cfg=LOADOUT_PRESETS[preset];
          const packW=packGear.reduce((s,g)=>s+(g.w||0),0);
          const wornW=packGear.filter(g=>WORN_CATEGORIES.has(g.cat)).reduce((s,g)=>s+(g.w||0),0);
          const baseW=packW-wornW;  // base weight = carried, excludes worn
          const pct=Math.min(100,Math.round((packW/cfg.target)*100));
          const overTarget=packW>cfg.target;
          const wclass=baseW<4500?{l:"Ultralight",c:T.gBright}:baseW<7300?{l:"Lightweight",c:T.ambL}:{l:"Traditional",c:T.bluL};
          const byCat=packGear.reduce((a,g)=>{a[g.cat]=(a[g.cat]||0)+g.w;return a;},{});
          const packedCats=new Set(packGear.map(g=>g.cat));
          const missing=cfg.essentials.filter(c=>!packedCats.has(c));
          return(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 340px",gap:isMobile?16:22}}>
            <div>
              {/* preset selector */}
              <Row g={8} style={{marginBottom:16,flexWrap:"wrap"}}>
                {Object.entries(LOADOUT_PRESETS).map(([name,p])=>(
                  <button key={name} onClick={()=>setPreset(name)} style={{display:"flex",alignItems:"center",gap:7,height:36,padding:"0 14px",borderRadius:10,border:`1px solid ${preset===name?T.gBright:T.brd}`,background:preset===name?`${T.gMid}22`:"transparent",color:preset===name?T.gBright:T.txtD,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                    <span style={{fontSize:15}}>{p.icon}</span>{name}</button>))}
              </Row>
              <Row style={{justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700}}>{preset} Loadout</div>
                <div style={{fontSize:12,color:T.txtD}}>{packGear.length} of {gear.length} items packed</div>
              </Row>
              <Row g={8} style={{marginBottom:16}}>
                <Btn v="ghost" sz="xs" onClick={()=>setIncluded(new Set(gear.map(g=>g.id)))}>Select all</Btn>
                <Btn v="ghost" sz="xs" onClick={()=>setIncluded(new Set())}>Clear</Btn>
                <Btn v="ghost" sz="xs" onClick={()=>setIncluded(new Set(gear.filter(g=>cfg.essentials.includes(g.cat)).map(g=>g.id)))}>Essentials only</Btn>
              </Row>
              {/* gear checklist */}
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
                {gear.map((g,i)=>{const on=included.has(g.id);const worn=WORN_CATEGORIES.has(g.cat);return(
                  <Card key={g.id} onClick={()=>toggleItem(g.id)} style={{padding:14,cursor:"pointer",border:`1.5px solid ${on?T.gMid:T.brd}`,background:on?undefined:T.bgEl,opacity:on?1:.6,transition:"all .15s",animation:`fadeIn .35s ease ${i*.05}s both`}}>
                    <Row g={10} style={{justifyContent:"space-between"}}>
                      <Row g={10} style={{minWidth:0}}><span style={{fontSize:22}}>{g.ic}</span>
                        <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.name}</div>
                          <div style={{fontSize:11,color:T.txtD}}>{g.w}g · {g.cat}{worn?" · worn":""}</div></div></Row>
                      <div style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${on?T.gMid:T.brd}`,background:on?T.gMid:"transparent",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{on?"✓":""}</div>
                    </Row>
                  </Card>);})}
              </div>
            </div>
            {/* summary rail */}
            <Col g={14} style={{alignSelf:"start"}}>
              <Card style={{padding:18}}>
                <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Total Pack Weight</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:36,fontWeight:700,color:overTarget?T.red:T.gGlow,marginBottom:3}}>{(packW/1000).toFixed(2)} kg</div>
                <Row g={8} style={{marginBottom:14}}><Badge c={wclass.c===T.gBright?"g":wclass.c===T.ambL?"a":"s"}>{wclass.l}</Badge>
                  <span style={{fontSize:11,color:T.txtD}}>base {(baseW/1000).toFixed(2)}kg · worn {(wornW/1000).toFixed(2)}kg</span></Row>
                {/* target gauge */}
                <Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:4}}><span>vs {preset} target</span><span style={{color:overTarget?T.red:T.gBright,fontWeight:600}}>{(cfg.target/1000).toFixed(1)}kg</span></Row>
                <div style={{height:6,background:T.bgEl,borderRadius:3,overflow:"hidden",marginBottom:14}}><div style={{height:"100%",width:`${pct}%`,background:overTarget?T.red:T.gBright,borderRadius:3,transition:"width .5s ease"}}/></div>
                {missing.length>0&&<div style={{background:`${T.ambL}14`,border:`1px solid ${T.ambL}44`,borderRadius:9,padding:"10px 12px",marginBottom:6}}>
                  <div style={{fontSize:11,color:T.ambL,fontWeight:600,marginBottom:3}}>⚠ Missing essentials</div>
                  <div style={{fontSize:11,color:T.txtD}}>No {missing.join(", ")} packed for this loadout.</div></div>}
                {missing.length===0&&packGear.length>0&&<div style={{fontSize:11,color:T.gBright,marginBottom:4}}>✓ All essentials covered</div>}
              </Card>
              {/* category breakdown */}
              <Card style={{padding:18}}>
                <div style={{fontSize:10,color:T.txtD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Packed by Category</div>
                {Object.entries(byCat).length===0&&<div style={{fontSize:12,color:T.txtF}}>Nothing packed yet.</div>}
                {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat,w])=>(
                  <div key={cat} style={{marginBottom:9}}><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:3}}><span>{cat}</span><span>{w}g · {Math.round((w/packW)*100)||0}%</span></Row>
                    <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(w/packW)*100}%`,background:T.gBright,borderRadius:2,transition:"width .5s ease"}}/></div></div>))}
              </Card>
            </Col>
          </div>
          );
        })()}
        {tab==="analytics"&&(()=>{
          const byCatW=gear.reduce((a,g)=>{a[g.cat]=(a[g.cat]||0)+(g.w||0);return a;},{});
          const byCatC=gear.reduce((a,g)=>{a[g.cat]=(a[g.cat]||0)+(g.cost||0);return a;},{});
          const priciest=[...gear].sort((a,b)=>(b.cost||0)-(a.cost||0))[0];
          const costPerUse=gear.map(g=>({...g,cpu:(g.uses>0?(g.cost||0)/g.uses:(g.cost||0))})).sort((a,b)=>b.cpu-a.cpu);
          const avgPerGram=totalW>0?(totalCost/totalW):0;
          return(
          <Col g={20}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:16}}>
              <StatTile label="Total Value" value={"$"+totalCost.toLocaleString()} unit="invested" accent={T.gBright} icon="💰"/>
              <StatTile label="Cost / Gram" value={"$"+avgPerGram.toFixed(2)} unit="per gram carried" accent={T.bluL} icon="⚖"/>
              <StatTile label="Needs Replacement" value={needsRepl} unit="items under 25%" accent={T.red} icon="⚠"/>
              <StatTile label="Avg Lifespan" value={avgLife+"%"} unit="remaining" accent={T.ambL} icon="📊"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20}}>
              <Card><div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Weight by Category</div></div>
                <div style={{padding:18}}>{Object.entries(byCatW).sort((a,b)=>b[1]-a[1]).map(([cat,w])=>(
                  <div key={cat} style={{marginBottom:10}}><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:3}}><span>{cat}</span><span>{w}g · {Math.round((w/totalW)*100)||0}%</span></Row>
                    <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(w/totalW)*100}%`,background:T.gBright,borderRadius:2}}/></div></div>))}
                </div></Card>
              <Card><div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Cost by Category</div></div>
                <div style={{padding:18}}>{Object.entries(byCatC).sort((a,b)=>b[1]-a[1]).map(([cat,c])=>(
                  <div key={cat} style={{marginBottom:10}}><Row style={{justifyContent:"space-between",fontSize:11,color:T.txtD,marginBottom:3}}><span>{cat}</span><span>${c.toLocaleString()} · {Math.round((c/totalCost)*100)||0}%</span></Row>
                    <div style={{height:4,background:T.bgEl,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(c/totalCost)*100}%`,background:T.ambL,borderRadius:2}}/></div></div>))}
                </div></Card>
            </div>
            <Card><div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Cost per Use</div>
                {priciest&&<span style={{fontSize:11,color:T.txtD}}>Most expensive: {priciest.name} (${priciest.cost})</span>}
              </div>
              <div style={{padding:"6px 18px"}}>{costPerUse.map((g,i)=>(
                <Row key={g.id} style={{padding:"10px 0",borderBottom:i<costPerUse.length-1?`1px solid ${T.brd}`:"none",gap:12}}>
                  <span style={{fontSize:18}}>{g.ic}</span>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.name}</div>
                    <div style={{fontSize:11,color:T.txtF}}>${g.cost} · {g.uses} use{g.uses===1?"":"s"}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:700,color:g.cpu>50?T.red:g.cpu>20?T.ambL:T.gBright}}>${g.cpu.toFixed(2)}</div><div style={{fontSize:9,color:T.txtF,textTransform:"uppercase",letterSpacing:"0.06em"}}>per use</div></div>
                </Row>))}
              </div></Card>
          </Col>
          );
        })()}
      </div>
    </div>
  );
};

const Community = ({ openAddReport }) => {
  const { reports, following, followUser, unfollowUser, isFollowing } = useStore();
  const { isMobile } = useTheme();
  const condCol={excellent:"g",good:"a",fair:"a",poor:"r",impassable:"r"};
  const [helpful,setHelpful]=useState({});   // reportId -> bool voted
  const [findOpen,setFindOpen]=useState(false);
  const toggleHelpful=(id)=>setHelpful(h=>({...h,[id]:!h[id]}));
  // suggested = directory users not already followed
  const suggested = DEMO_USERS.filter(u => !isFollowing(u)).slice(0,3);
  return(
    <div style={{flex:1,overflow:"auto",padding:isMobile?16:22}}>
      {findOpen && <FindPeopleModal onClose={()=>setFindOpen(false)}/>}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?16:20}}>
        <Card>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Trail Reports</div>
            <Btn sz="sm" onClick={openAddReport} ic={<span style={{fontSize:11}}>＋</span>}>Add Report</Btn>
          </div>
          <div style={{padding:"6px 18px"}}>
            {reports.map((r,i)=>{const voted=!!helpful[r.id];const base=r.helpful||0;return(<div key={r.id} style={{padding:"12px 0",borderBottom:i<reports.length-1?`1px solid ${T.brd}`:"none"}}>
              <Row style={{marginBottom:8}}><div style={{width:28,height:28,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.gBright,flexShrink:0}}>{r.user.charAt(0)}</div>
                <div style={{flex:1,minWidth:0}}><Row g={8}><span style={{fontSize:12,fontWeight:500}}>{r.user}</span><span style={{fontSize:10,color:T.txtF}}>·</span><span style={{fontSize:11,color:T.txtD}}>{r.route}</span></Row><div style={{fontSize:10,color:T.txtF}}>{r.time}</div></div>
                <Badge c={condCol[r.cond]}>{r.cond}</Badge></Row>
              <div style={{fontSize:12,color:T.txtD,lineHeight:1.6,marginLeft:36}}>{r.msg}</div>
              <Row style={{marginLeft:36,marginTop:6,justifyContent:"space-between"}}>
                <Row g={2}>{Array.from({length:5}).map((_,j)=><span key={j} style={{color:j<r.rating?T.ambL:T.txtF,fontSize:11}}>{j<r.rating?"★":"☆"}</span>)}</Row>
                <span onClick={()=>toggleHelpful(r.id)} style={{cursor:"pointer",fontSize:11,color:voted?T.gBright:T.txtD,userSelect:"none"}}>👍 Helpful {base+(voted?1:0)>0?`· ${base+(voted?1:0)}`:""}</span>
              </Row>
            </div>);})}
          </div>
        </Card>
        <Col g={20}>
          <Card>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Leaderboard — This Month</div></div>
            <div style={{padding:"6px 18px"}}>{[{name:"Alex K",km:"124 km",icon:"🥇",col:T.ambBr},{name:"Maya R",km:"108 km",icon:"🥈",col:T.sLt},{name:"Jordan T",km:"97 km",icon:"🥉",col:T.amb},{name:"Priya M",km:"84 km",icon:"4",col:T.txtD},{name:"You",km:"71 km",icon:"5",col:T.gBright}].map((p,i)=>(
              <Row key={i} style={{padding:"9px 0",borderBottom:i<4?`1px solid ${T.brd}`:"none",gap:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<3?14:11,fontWeight:700,color:p.col,flexShrink:0}}>{p.icon}</div>
                <div style={{flex:1,fontSize:13,fontWeight:500}}>{p.name}</div><div style={{fontSize:13,color:T.gBright,fontWeight:600}}>{p.km}</div></Row>))}
            </div>
          </Card>
          <Card>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Following · {following.length}</div>
              <Btn sz="sm" onClick={()=>setFindOpen(true)} ic={<span style={{fontSize:12}}>🔍</span>}>Find People</Btn>
            </div>
            <div style={{padding:"6px 18px"}}>
              {following.length===0 && <div style={{fontSize:12,color:T.txtF,padding:"10px 0"}}>You're not following anyone yet. Tap “Find People”.</div>}
              {following.map((u,i)=>(<Row key={u.id||i} style={{padding:"9px 0",borderBottom:i<following.length-1?`1px solid ${T.brd}`:"none",justifyContent:"space-between"}}>
              <Row g={10}><div style={{width:32,height:32,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.gBright}}>{u.display_name.charAt(0)}</div>
                <div><div style={{fontSize:12,fontWeight:500}}>{u.display_name}</div><div style={{fontSize:11,color:T.txtD}}>@{u.username}</div></div></Row>
              <Btn v="ghost" sz="xs" onClick={()=>unfollowUser(u)}>Unfollow</Btn></Row>))}
            </div>
          </Card>
          {suggested.length>0&&<Card>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.brd}`}}><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:600}}>Suggested for You</div></div>
            <div style={{padding:"6px 18px"}}>{suggested.map((u,i)=>(<Row key={u.id} style={{padding:"9px 0",borderBottom:i<suggested.length-1?`1px solid ${T.brd}`:"none",justifyContent:"space-between"}}>
              <Row g={10}><div style={{width:32,height:32,borderRadius:"50%",background:`${T.amb}22`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.ambL}}>{u.display_name.charAt(0)}</div>
                <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:500}}>{u.display_name}</div><div style={{fontSize:11,color:T.txtD,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.bio}</div></div></Row>
              <Btn sz="xs" onClick={()=>followUser(u)}>Follow</Btn></Row>))}</div>
          </Card>}
        </Col>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  FEED — photo/video shorts with likes + comments
// ════════════════════════════════════════════════════════════════════════════
const CommentSheet = ({ post, onClose }) => {
  const { online, bumpComments } = useStore();
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
    bumpComments(post.id);
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
  const { toggleLike, deletePost, toast } = useStore();
  const [showComments, setShowComments] = useState(false);
  const share = async () => {
    const text = `${post.author?.display_name} on Summit: ${post.caption||""}`.trim();
    try {
      if (navigator.share) { await navigator.share({ title:"Summit", text }); return; }
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard ✓");
    } catch { toast("Share canceled","warn"); }
  };
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
          <span onClick={share} style={{ fontSize:17, color:T.txtD, marginLeft:"auto", cursor:"pointer" }}>↗</span>
        </Row>
        {post.caption ? <div style={{ fontSize:13, lineHeight:1.5 }}><strong>{post.author?.display_name}</strong> {post.caption}</div> : null}
        {post.comment_count>0 && <div onClick={()=>setShowComments(true)} style={{ fontSize:12, color:T.txtD, marginTop:6, cursor:"pointer" }}>View all {post.comment_count} comments</div>}
      </div>
    </Card>
  );
};

const Feed = ({ openCreate }) => {
  const { posts, following, setFeedPosts, online, toast } = useStore();
  const [scope, setScope] = useState("all");
  const [loading, setLoading] = useState(false);
  // When online, refresh from server on scope change and store the result
  useEffect(() => {
    if (!online) return;
    let cancel = false;
    setLoading(true);
    backend.listFeed(scope)
      .then(list => { if (!cancel && Array.isArray(list)) setFeedPosts(list); })
      .catch(()=>{})
      .finally(()=>{ if(!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [scope, online, setFeedPosts]);
  // In demo mode, filter locally against who you follow (by username) + your own posts
  const followedUsernames = new Set(following.map(f => f.username));
  const shown = scope === "following"
    ? posts.filter(p => followedUsernames.has(p.author?.username) || p.author?.username === "you")
    : posts;
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
        {loading && <div style={{ textAlign:"center", color:T.txtF, fontSize:12, padding:12 }}>Loading feed…</div>}
        {shown.length===0 && !loading && <div style={{ textAlign:"center", color:T.txtF, fontSize:13, padding:40 }}>{scope==="following"?"No posts from people you follow yet.":"No posts yet. Share your first adventure."}</div>}
        {shown.map(p => <PostCard key={p.id} post={p}/>)}
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
  // Demo admin shortcut: username/email "dilly" + password "dilly".
  const isDillyAdmin = () => {
    const id = (f.email || f.username || "").trim().toLowerCase();
    return id === "dilly" && f.password === "dilly";
  };
  const mkUser = (extra={}) => {
    const email = f.email || "";
    const display_name = f.display_name || email.split("@")[0] || "Hiker";
    const username = f.username || (email.split("@")[0] || "hiker").toLowerCase();
    // Demo rule: the "dilly" account (or emails containing "admin") get the admin
    // role. Live backends can override this by returning a role on the auth response.
    const role = isDillyAdmin() || /admin/i.test(email) ? "admin" : "member";
    return { display_name, email, username, bio:"", role, ...extra };
  };
  const submit=async()=>{
    setErr(""); setLoad(true);
    // Demo admin login — bypasses normal validation entirely.
    if (isDillyAdmin()) {
      onAuth({ display_name:"Dilly", email:"dilly", username:"dilly", bio:"Platform administrator", role:"admin" });
      setLoad(false); return;
    }
    try{
      const alive=await probeApi();
      if(alive){
        let resp;
        if(mode==="login"){
          resp = await backend.login(f.email, f.password);
        } else {
          if(!f.username||f.username.length<3){ throw new Error("Username must be 3–30 characters"); }
          if(!f.display_name||f.display_name.length<2){ throw new Error("Full name required"); }
          if(f.password.length<8){ throw new Error("Password must be at least 8 characters"); }
          resp = await backend.register({ email:f.email, password:f.password, username:f.username, display_name:f.display_name });
        }
        onAuth(mkUser({ role: resp?.role || (/admin/i.test(f.email) ? "admin" : "member") }));
      } else { throw new Error("__offline__"); }
    }catch(e){
      if(e.message==="__offline__"){
        // No backend → demo mode straight through
        onAuth(mkUser());
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
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:56,fontWeight:900,color:T.gGlow,lineHeight:1,filter:`drop-shadow(0 0 40px ${T.gBright}55)`}}>Summit</div>
          <div style={{fontStyle:"italic",fontSize:16,color:T.txtD,marginTop:10,fontFamily:"Georgia,serif"}}>Your mountains. Your routes. Your data.</div>
        </div>
      </div>}
      <div style={{width:isMobile?"100%":440,background:T.glass,backdropFilter:"blur(20px) saturate(140%)",WebkitBackdropFilter:"blur(20px) saturate(140%)",borderLeft:isMobile?"none":`1px solid ${T.glassBrd}`,display:"flex",flexDirection:"column",justifyContent:"center",padding:isMobile?"32px 22px":"56px 46px",gap:18,overflowY:"auto"}}>
        {isMobile&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{width:40,height:40,borderRadius:12,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:22}}>S</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:800,color:T.gGlow}}>Summit</div>
        </div>}
        <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:isMobile?24:28,fontWeight:700,marginBottom:5}}>{mode==="login"?"Welcome back":"Create account"}</div>
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
        <Btn v="subtle" sz="lg" onClick={()=>onAuth({display_name:"Demo Hiker",email:"demo@summit.app",username:"demohiker",bio:"",role:"member"})} style={{width:"100%"}}>Continue as Demo</Btn>
        <div style={{fontSize:12,color:T.txtD,textAlign:"center"}}>{mode==="login"?"No account? ":"Have an account? "}
          <span style={{color:T.gBright,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setMode(m=>m==="login"?"register":"login");setErr("");}}>{mode==="login"?"Register":"Sign in"}</span></div>
        <div style={{marginTop:4,paddingTop:14,borderTop:`1px solid ${T.brd}`,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:T.txtF}}>
          Powered by Daie DillyAI Enterprise · {BUILD_VERSION}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  USER SETTINGS — profile
// ════════════════════════════════════════════════════════════════════════════
const Settings = ({ user, setUser }) => {
  const { isMobile } = useTheme();
  const { toast, online } = useStore();
  const [f, setF] = useState({
    display_name: user?.display_name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const pickAvatar = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 4*1024*1024) { toast("Image too large (max 4MB)","warn"); return; }
    setF(s => ({ ...s, avatar: URL.createObjectURL(file) }));
  };
  const dirty = ["display_name","username","email","bio","avatar"].some(k => (f[k]||"") !== (user?.[k]||""));
  const save = async () => {
    if (!f.display_name.trim()) { toast("Name can't be empty","warn"); return; }
    setSaving(true);
    if (online) { try { await backend.updateProfile({ display_name:f.display_name, username:f.username, bio:f.bio }); } catch {} }
    setUser(u => ({ ...u, ...f }));
    setSaving(false);
    toast("Profile updated ✓");
  };
  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?16:26 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:isMobile?24:30, fontWeight:700, marginBottom:4 }}>Settings</div>
        <div style={{ fontSize:13, color:T.txtD, marginBottom:22 }}>Manage your public profile.</div>
        <Card>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}` }}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Profile</div></div>
          <div style={{ padding:isMobile?16:22, display:"flex", flexDirection:"column", gap:18 }}>
            {/* avatar */}
            <Row g={16} style={{ alignItems:"center" }}>
              <div style={{ width:74,height:74,borderRadius:"50%",overflow:"hidden",background:`linear-gradient(135deg,${T.gMid},${T.ambL})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:30,fontFamily:"'Space Grotesk',sans-serif",flexShrink:0 }}>
                {f.avatar ? <img src={f.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (f.display_name||"U").charAt(0).toUpperCase()}
              </div>
              <Col g={6}>
                <Row g={8}>
                  <Btn v="ghost" sz="sm" onClick={()=>fileRef.current?.click()}>Change photo</Btn>
                  {f.avatar && <Btn v="ghost" sz="sm" onClick={()=>setF(s=>({...s,avatar:""}))}>Remove</Btn>}
                </Row>
                <div style={{ fontSize:11, color:T.txtF }}>JPG or PNG, up to 4MB.</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} style={{ display:"none" }}/>
              </Col>
            </Row>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14 }}>
              <Field label="Full name" value={f.display_name} onChange={set("display_name")} placeholder="Alex Kim"/>
              <Field label="Username" value={f.username} onChange={set("username")} placeholder="alexkim"/>
            </div>
            <Field label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@example.com"/>
            <div>
              <label>Bio</label>
              <textarea rows={3} value={f.bio} onChange={set("bio")} placeholder="Tell people about your hiking style…" style={{ resize:"vertical" }}/>
              <div style={{ fontSize:11, color:T.txtF, marginTop:4, textAlign:"right" }}>{(f.bio||"").length}/160</div>
            </div>
            {user?.role==="admin" && <div style={{ fontSize:12, color:T.ambL }}>★ Admin account — you have access to the Admin panel.</div>}
            <Row g={10} style={{ justifyContent:"flex-end" }}>
              <Btn v="ghost" onClick={()=>setF({display_name:user?.display_name||"",username:user?.username||"",email:user?.email||"",bio:user?.bio||"",avatar:user?.avatar||""})} disabled={!dirty}>Reset</Btn>
              <Btn onClick={save} load={saving} disabled={!dirty}>Save changes</Btn>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN PANEL — users · moderation · system metrics · activity log
//  (Visible only to users with role === "admin".)
// ════════════════════════════════════════════════════════════════════════════
const AdminStat = ({ label, value, sub, accent }) => (
  <Card style={{ padding:16 }}>
    <div style={{ fontSize:10, color:T.txtD, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:accent||T.txt }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:T.txtF, marginTop:2 }}>{sub}</div>}
  </Card>
);

const Admin = () => {
  const { isMobile } = useTheme();
  const { posts, reports, routes, gear, trips, following, activity, online, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [banned, setBanned] = useState({});      // username -> true
  const [removed, setRemoved] = useState({});    // postId -> true

  // Build a user roster from the directory + people you follow
  const roster = (() => {
    const map = new Map();
    DEMO_USERS.forEach(u => map.set(u.username, { ...u, role:"member" }));
    following.forEach(u => { if(!map.has(u.username)) map.set(u.username, { ...u, role:"member" }); });
    map.set("admin", { id:"admin", username:"admin", display_name:"Admin", bio:"Platform administrator", role:"admin" });
    return Array.from(map.values());
  })();
  const filteredRoster = roster.filter(u => !q || u.display_name.toLowerCase().includes(q.toLowerCase()) || u.username.toLowerCase().includes(q.toLowerCase()));

  const totalLikes = posts.reduce((s,p)=>s+(p.like_count||0),0);
  const totalComments = posts.reduce((s,p)=>s+(p.comment_count||0),0);
  const visiblePosts = posts.filter(p=>!removed[p.id]);

  const TABS = [["overview","Overview"],["users","Users"],["content","Moderation"],["system","System"],["activity","Activity"]];

  const fmtTime = (iso) => { try { return new Date(iso).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}); } catch { return ""; } };

  return (
    <div style={{ flex:1, overflow:"auto", padding:isMobile?16:26 }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <Row style={{ justifyContent:"space-between", alignItems:"flex-end", marginBottom:18, flexWrap:"wrap", gap:10 }}>
          <div>
            <Row g={10}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:isMobile?24:30, fontWeight:700 }}>Admin</div><Badge c="a">{online?"LIVE":"DEMO"}</Badge></Row>
            <div style={{ fontSize:13, color:T.txtD }}>Track and monitor platform activity.</div>
          </div>
        </Row>

        {/* tab bar */}
        <Row g={4} style={{ marginBottom:18, flexWrap:"wrap" }}>
          {TABS.map(([id,l])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ height:34,padding:"0 15px",borderRadius:9,border:`1px solid ${tab===id?T.gBright:T.brd}`,background:tab===id?`${T.gMid}22`:"transparent",color:tab===id?T.gBright:T.txtD,fontSize:13,fontFamily:"inherit",cursor:"pointer" }}>{l}</button>
          ))}
        </Row>

        {tab==="overview" && (
          <Col g={18}>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:14 }}>
              <AdminStat label="Total Users" value={roster.length} sub={`${following.length} followed by you`} accent={T.gBright}/>
              <AdminStat label="Posts" value={visiblePosts.length} sub={`${totalLikes} likes · ${totalComments} comments`} accent={T.ambL}/>
              <AdminStat label="Routes" value={routes.length} sub={`${trips.length} trips logged`} accent={T.bluL}/>
              <AdminStat label="Trail Reports" value={reports.length} sub={`${Object.keys(banned).length} users banned`} accent={T.red}/>
            </div>
            <Card>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}` }}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Recent Activity</div></div>
              <div style={{ padding:"6px 18px" }}>
                {activity.slice(0,6).map(a=>(
                  <Row key={a.id} style={{ padding:"9px 0", borderBottom:`1px solid ${T.brd}`, gap:10 }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:a.kind==="warn"?T.red:T.gBright,flexShrink:0 }}/>
                    <div style={{ flex:1, fontSize:12.5 }}>{a.msg}</div>
                    <div style={{ fontSize:11, color:T.txtF, fontFamily:"'JetBrains Mono',monospace" }}>{fmtTime(a.at)}</div>
                  </Row>
                ))}
                {activity.length===0 && <div style={{ fontSize:12, color:T.txtF, padding:"12px 0" }}>No activity recorded yet.</div>}
              </div>
            </Card>
          </Col>
        )}

        {tab==="users" && (
          <Card>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Users · {filteredRoster.length}</div>
              <input placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)} style={{ maxWidth:220 }}/>
            </div>
            <div style={{ padding:"4px 10px" }}>
              {filteredRoster.map((u,i)=>{ const isBanned=!!banned[u.username]; return (
                <Row key={u.username} style={{ padding:"10px 8px", borderBottom:i<filteredRoster.length-1?`1px solid ${T.brd}`:"none", gap:12, justifyContent:"space-between", opacity:isBanned?.55:1 }}>
                  <Row g={11} style={{ minWidth:0 }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:`${T.gMid}33`,border:`1px solid ${T.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:T.gBright,flexShrink:0 }}>{u.display_name.charAt(0)}</div>
                    <div style={{ minWidth:0 }}><Row g={7}><span style={{ fontSize:13,fontWeight:600,whiteSpace:"nowrap" }}>{u.display_name}</span>{u.role==="admin"&&<Badge c="a">admin</Badge>}{isBanned&&<Badge c="r">banned</Badge>}</Row>
                      <div style={{ fontSize:11,color:T.txtD,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>@{u.username}</div></div>
                  </Row>
                  {u.role!=="admin" && <Btn v={isBanned?"ghost":"danger"} sz="xs" onClick={()=>{ setBanned(b=>({...b,[u.username]:!isBanned})); toast(isBanned?`Unbanned ${u.display_name}`:`Banned ${u.display_name}`, isBanned?"ok":"warn"); }}>{isBanned?"Unban":"Ban"}</Btn>}
                </Row>
              );})}
            </div>
          </Card>
        )}

        {tab==="content" && (
          <Card>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}` }}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Content Moderation · {visiblePosts.length} live posts</div></div>
            <div style={{ padding:"4px 10px" }}>
              {posts.map((p,i)=>{ const gone=!!removed[p.id]; return (
                <Row key={p.id} style={{ padding:"11px 8px", borderBottom:i<posts.length-1?`1px solid ${T.brd}`:"none", gap:12, justifyContent:"space-between", opacity:gone?.5:1 }}>
                  <Row g={11} style={{ minWidth:0 }}>
                    <div style={{ width:42,height:42,borderRadius:8,background:`linear-gradient(160deg,${(p.grad||["#1e3a5f","#0d2818"])[0]},${(p.grad||["#1e3a5f","#0d2818"])[1]})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18 }}>{p.kind==="video"?"🎬":"🏔"}</div>
                    <div style={{ minWidth:0 }}><div style={{ fontSize:12.5,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{p.caption||"(no caption)"}</div>
                      <div style={{ fontSize:11,color:T.txtD }}>{p.author?.display_name} · ♥ {p.like_count||0} · 💬 {p.comment_count||0}{gone?" · removed":""}</div></div>
                  </Row>
                  <Btn v={gone?"ghost":"danger"} sz="xs" onClick={()=>{ setRemoved(r=>({...r,[p.id]:!gone})); toast(gone?"Post restored":"Post removed", gone?"ok":"warn"); }}>{gone?"Restore":"Remove"}</Btn>
                </Row>
              );})}
              <div style={{ padding:"14px 8px 6px", fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600 }}>Flagged Trail Reports</div>
              {reports.map((r,i)=>(
                <Row key={r.id} style={{ padding:"10px 8px", borderBottom:i<reports.length-1?`1px solid ${T.brd}`:"none", gap:12, justifyContent:"space-between" }}>
                  <div style={{ minWidth:0 }}><div style={{ fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{r.msg}</div><div style={{ fontSize:11,color:T.txtD }}>{r.user} · {r.route}</div></div>
                  <Badge c={({excellent:"g",good:"a",fair:"a",poor:"r",impassable:"r"})[r.cond]}>{r.cond}</Badge>
                </Row>
              ))}
            </div>
          </Card>
        )}

        {tab==="system" && (
          <Col g={18}>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:14 }}>
              <AdminStat label="API Status" value={online?"Online":"Offline"} sub={online?"Backend reachable":"Demo mode"} accent={online?T.gBright:T.red}/>
              <AdminStat label="Data Source" value={API_CONFIGURED?"Live":"Seed"} sub={API_CONFIGURED?"window.SUMMIT_API set":"No backend URL"} accent={T.ambL}/>
              <AdminStat label="Build" value={BUILD_VERSION} sub="front-end version" accent={T.bluL}/>
              <AdminStat label="Records" value={routes.length+gear.length+trips.length+posts.length} sub="loaded entities" accent={T.gBright}/>
            </div>
            <Card>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}` }}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Subsystem Health</div></div>
              <div style={{ padding:"6px 18px" }}>
                {[["Authentication", true],["Routes API", online],["Feed / Media", online],["Maps (Esri tiles)", true],["3D Renderer (WebGL)", typeof window!=="undefined" && !!window.WebGLRenderingContext]].map(([name,ok],i,arr)=>(
                  <Row key={name} style={{ padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.brd}`:"none", justifyContent:"space-between" }}>
                    <div style={{ fontSize:13 }}>{name}</div>
                    <Row g={7}><div style={{ width:8,height:8,borderRadius:"50%",background:ok?T.gBright:T.red }}/><span style={{ fontSize:12,color:ok?T.gBright:T.red }}>{ok?"Operational":"Unavailable"}</span></Row>
                  </Row>
                ))}
              </div>
            </Card>
          </Col>
        )}

        {tab==="activity" && (
          <Card>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.brd}` }}><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:600 }}>Activity Log · {activity.length}</div></div>
            <div style={{ padding:"4px 18px", maxHeight:"60vh", overflowY:"auto" }}>
              {activity.map(a=>(
                <Row key={a.id} style={{ padding:"9px 0", borderBottom:`1px solid ${T.brd}`, gap:10 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:a.kind==="warn"?T.red:T.gBright,flexShrink:0,marginTop:5 }}/>
                  <div style={{ flex:1, fontSize:12.5 }}>{a.msg}</div>
                  <div style={{ fontSize:11, color:T.txtF, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap" }}>{fmtTime(a.at)}</div>
                </Row>
              ))}
              {activity.length===0 && <div style={{ fontSize:12, color:T.txtF, padding:"14px 0" }}>No activity recorded yet. Interactions will appear here.</div>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const NAV=[{id:"dashboard",ic:"◴",l:"Home"},{id:"feed",ic:"❏",l:"Feed"},{id:"explore",ic:"◰",l:"Explore"},{id:"trips",ic:"◷",l:"Trips"},{id:"gear",ic:"◫",l:"Gear"},{id:"community",ic:"◎",l:"Community"}];

const Shell = ({ user, setUser, onLogout }) => {
  const { hydrate, online } = useStore();
  const { isMobile } = useTheme();
  const [page,setPage]=useState("dashboard");
  const [modal,setModal]=useState(null);
  useEffect(() => { hydrate(); }, [hydrate]);
  const isAdmin = user?.role==="admin";
  // Bottom-bar keeps core tabs; settings/admin reached via sidebar (desktop) or the
  // overflow row on mobile.
  const navItems = [...NAV,
    {id:"settings",ic:"⚙",l:"Settings"},
    ...(isAdmin ? [{id:"admin",ic:"⚇",l:"Admin"}] : []),
  ];
  const TITLES={dashboard:"Home",feed:"Feed",explore:"Explore routes",trips:"Your trips",gear:"Gear locker",community:"Community",settings:"Settings",admin:"Admin panel"};
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
    {page==="settings"&&<Settings user={user} setUser={setUser}/>}
    {page==="admin"&&isAdmin&&<Admin/>}
  </>);
  const statusPill = (
    <div title={online?"Connected to backend":"Demo mode — backend offline"} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:20,background:online?(T.mode==="dark"?T.gDark:"#E6F0E9"):T.bgEl,border:`1px solid ${online?T.gMid+"55":T.brd}`,fontSize:10.5,color:online?T.gBright:T.txtD,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.06em"}}>
      <div style={{width:7,height:7,borderRadius:"50%",background:online?T.gBright:T.sMed,animation:online?"pulse 2s ease infinite":"none"}}/>
      {online?"LIVE":"DEMO"}
    </div>
  );

  // ── Mobile: top bar + bottom tabs ──
  if (isMobile) {
    return (
      <div className="app-h" style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
        {modals}
        <div style={{height:56,display:"flex",alignItems:"center",padding:"0 16px",gap:10,background:T.glass,backdropFilter:"blur(18px) saturate(140%)",WebkitBackdropFilter:"blur(18px) saturate(140%)",borderBottom:`1px solid ${T.glassBrd}`,flexShrink:0,zIndex:5}}>
          <div style={{width:30,height:30,borderRadius:9,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:17}}>S</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,flex:1}}>{TITLES[page]}</div>
          {headerAction[page]}
          {isAdmin && <button onClick={()=>setPage("admin")} title="Admin" style={{width:34,height:34,borderRadius:9,border:`1px solid ${page==="admin"?T.ambL:T.brd}`,background:"transparent",color:page==="admin"?T.ambL:T.txtD,fontSize:16,cursor:"pointer"}}>⚇</button>}
          <button onClick={()=>setPage("settings")} title="Profile & settings" style={{width:34,height:34,borderRadius:"50%",overflow:"hidden",border:`1px solid ${page==="settings"?T.gBright:T.brd}`,background:`linear-gradient(135deg,${T.gMid},${T.ambL})`,color:"#fff",fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",padding:0}}>{user?.avatar?<img src={user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:((user?.display_name||"U").charAt(0)).toUpperCase()}</button>
          <ThemeToggle style={{width:34,height:34}}/>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>{pages}</div>
        <nav style={{display:"flex",borderTop:`1px solid ${T.glassBrd}`,background:T.glass,backdropFilter:"blur(18px) saturate(140%)",WebkitBackdropFilter:"blur(18px) saturate(140%)",flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
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
      <nav style={{width:230,background:T.glass,backdropFilter:"blur(18px) saturate(140%)",WebkitBackdropFilter:"blur(18px) saturate(140%)",borderRight:`1px solid ${T.glassBrd}`,display:"flex",flexDirection:"column",padding:18,flexShrink:0}}>
        <Row g={10} style={{padding:"6px 8px 22px"}}>
          <div style={{width:36,height:36,borderRadius:11,background:T.gMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:20}}>S</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:20}}>Summit</div>
        </Row>
        <Col g={3}>
          {navItems.map(n=>{const on=page===n.id;return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:11,border:"none",background:on?(T.mode==="dark"?T.gDark:"#E6F0E9"):"transparent",color:on?(T.mode==="dark"?T.gGlow:T.gDark):(n.id==="admin"?T.ambL:T.txtD),fontSize:14.5,fontWeight:on?600:500,transition:"all .15s",textAlign:"left"}}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background=T.bgEl}} onMouseLeave={e=>{if(!on)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:18,width:20,textAlign:"center"}}>{n.ic}</span>{n.l}
            </button>);})}
        </Col>
        <div style={{marginTop:"auto"}}>
          <Row g={10} style={{padding:"12px 8px 0",borderTop:`1px solid ${T.brd}`}}>
            <div onClick={()=>setPage("settings")} title="Profile & settings" style={{width:34,height:34,borderRadius:10,overflow:"hidden",background:`linear-gradient(135deg,${T.gMid},${T.ambL})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}}>{user?.avatar?<img src={user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:((user?.display_name||"U").charAt(0)).toUpperCase()}</div>
            <div onClick={()=>setPage("settings")} style={{flex:1,minWidth:0,cursor:"pointer"}}><div style={{fontSize:13.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.display_name||"Hiker"}</div><div style={{fontSize:12,color:T.txtF}}>{isAdmin?"Administrator":"Free plan"}</div></div>
            <span onClick={onLogout} title="Sign out" style={{cursor:"pointer",color:T.txtF,fontSize:16,padding:"0 4px"}}>⎋</span>
            <ThemeToggle/>
          </Row>
          <div style={{padding:"10px 8px 0",fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:T.txtF,lineHeight:1.5}}>
            Powered by<br/>Daie DillyAI Enterprise<br/>{BUILD_VERSION}
          </div>
        </div>
      </nav>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0,background:T.bg}}>
        <Row style={{height:64,padding:"0 26px",borderBottom:`1px solid ${T.glassBrd}`,justifyContent:"space-between",background:T.glass,backdropFilter:"blur(18px) saturate(140%)",WebkitBackdropFilter:"blur(18px) saturate(140%)",flexShrink:0,zIndex:5}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:700}}>{TITLES[page]}</div>
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
  const [webgl, setWebgl] = useState(true); // false → CSS dawn fallback

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
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer || !renderer.getContext()) throw new Error("no-gl");
    } catch { setWebgl(false); return; }
    let W = el.clientWidth || el.offsetWidth || window.innerWidth || 1280;
    let H = el.clientHeight || el.offsetHeight || window.innerHeight || 720;
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
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
      W = el.clientWidth || window.innerWidth || 1280;
      H = el.clientHeight || window.innerHeight || 720;
      renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    // Re-measure after layout settles (guards against a 0-size first frame)
    requestAnimationFrame(onResize);
    setTimeout(onResize, 60);
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
      <div ref={mountRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* CSS dawn fallback when WebGL is unavailable — keeps the intro intentional */}
      {!webgl && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, #121a2e 0%, #2a3358 38%, #7a5a6e 64%, #f0a463 86%, #f6c98b 100%)" }}>
          <div style={{ position: "absolute", left: "26%", top: "40%", width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, #fff3d6 0%, rgba(255,210,140,.5) 30%, rgba(255,170,110,0) 70%)", transform: "translate(-50%,-50%)" }} />
          {/* simple ridge silhouette */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <polygon points="0,100 0,72 18,60 34,68 50,40 66,62 82,54 100,70 100,100" fill="#222a39" />
            <polygon points="0,100 0,84 22,76 42,82 58,66 76,80 100,78 100,100" fill="#171d29" />
          </svg>
        </div>
      )}

      {/* Vignette + warm grade */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(120% 90% at 50% 60%, transparent 40%, rgba(8,10,14,.5) 100%)" }} />

      {/* Wordmark */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", pointerEvents: "none", padding: 24 }}>
        <div style={{ overflow: "hidden", padding: "0 .1em" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "clamp(52px, 13vw, 132px)",
            color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, textShadow: "0 8px 60px rgba(0,0,0,.6)",
            transform: phase >= 1 ? "translateY(0)" : "translateY(115%)",
            opacity: phase >= 1 ? 1 : 0, transition: "transform 1.1s cubic-bezier(.16,1,.3,1), opacity 1.1s ease" }}>
            Summit
          </div>
        </div>
        <div style={{ height: 1.5, background: "linear-gradient(90deg, transparent, #E8763A, transparent)",
          width: phase >= 2 ? "min(380px, 70vw)" : 0, transition: "width 1s cubic-bezier(.16,1,.3,1)", margin: "18px 0" }} />
        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(13px, 2.4vw, 17px)",
          color: "rgba(255,255,255,.78)", letterSpacing: "0.04em", fontWeight: 400,
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1s ease .1s", textAlign: "center" }}>
          Your mountains. Your routes. Your data.
        </div>
      </div>

      {/* Skip */}
      <button onClick={finish} style={{ position: "absolute", bottom: 28, right: 28, padding: "9px 18px",
        borderRadius: 24, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)",
        color: "rgba(255,255,255,.85)", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 500,
        backdropFilter: "blur(8px)", cursor: "pointer" }}>
        Skip intro →
      </button>

      {/* Loading hint, early only */}
      <div style={{ position: "absolute", bottom: 30, left: 28, fontFamily: "'JetBrains Mono',monospace",
        fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)",
        opacity: phase === 0 ? 1 : 0, transition: "opacity .6s ease" }}>
        Charting the route…
      </div>

      {/* Powered-by credit */}
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center",
        fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "rgba(255,255,255,.5)", pointerEvents: "none",
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 1s ease .2s" }}>
        Powered by Daie DillyAI Enterprise · {BUILD_VERSION}
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
          : <Shell user={user} setUser={setUser} onLogout={()=>{_token=null;_apiAlive=null;setUser(null);}}/>}
        <Toasts/>
      </StoreProvider>
    </ThemeProvider>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
