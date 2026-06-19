import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════
// DESIGN TOKENS
// ════════════════════════════════════════════════
const C = {
  bg: "#0a0505", surface: "#120808", card: "#1a0c0c",
  border: "#2a1010", borderLight: "#3a1818",
  red: "#dc2626", redDark: "#991b1b", redLight: "#ef4444",
  redGlow: "rgba(220,38,38,0.18)", redDim: "#2d1010",
  white: "#fff8f8", muted: "#7c5555", mutedLight: "#a87070",
  success: "#16a34a", successDim: "#052e16",
  yellow: "#ca8a04", yellowDim: "#1c1500",
  blue: "#1d4ed8", blueDim: "#0f1e40",
  purple: "#7c3aed", purpleDim: "#1e1040",
  input: "#0f0606",
};

const DISTRICTS = ["ঢাকা","চট্টগ্রাম","রাজশাহী","খুলনা","সিলেট","বরিশাল","রংপুর","ময়মনসিংহ","কুমিল্লা","নারায়ণগঞ্জ","গাজীপুর","টাঙ্গাইল","ফরিদপুর","যশোর","বগুড়া"];
const UPAZILAS = { "ঢাকা":["মিরপুর","উত্তরা","ধানমন্ডি","মতিঝিল","গুলশান","মোহাম্মদপুর","রামপুরা","বাসাবো"], "চট্টগ্রাম":["কোতোয়ালি","পাহাড়তলী","হালিশহর","ডবলমুরিং"], "রাজশাহী":["বোয়ালিয়া","রাজপাড়া","শাহমখদুম"] };
const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];
const BG_COLORS = { "A+":"#dc2626","A-":"#b91c1c","B+":"#c2410c","B-":"#a16207","O+":"#be123c","O-":"#9f1239","AB+":"#7c3aed","AB-":"#5b21b6" };
const URGENCY = ["জরুরি 🔴","মাঝারি 🟡","স্বাভাবিক 🟢"];

// ════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════
const DONORS_INIT = [
  { id:1, name:"রাকিব হাসান", email:"rakib@email.com", phone:"01711-234567", blood:"O+", gender:"পুরুষ", dob:"1995-05-10", district:"ঢাকা", upazila:"মিরপুর", address:"মিরপুর-১০, ঢাকা", available:true, donations:7, lastDonate:"2026-03-15", verified:true, avatar:"👨", joined:"2024-01-10", badge:"Gold" },
  { id:2, name:"সুমাইয়া আক্তার", email:"sumaiya@email.com", phone:"01812-345678", blood:"B+", gender:"মহিলা", dob:"1998-08-22", district:"চট্টগ্রাম", upazila:"কোতোয়ালি", address:"আগ্রাবাদ, চট্টগ্রাম", available:true, donations:4, lastDonate:"2026-01-20", verified:true, avatar:"👩", joined:"2024-03-15", badge:"Silver" },
  { id:3, name:"তাহের আহমেদ", email:"taher@email.com", phone:"01915-456789", blood:"A+", gender:"পুরুষ", dob:"1990-12-05", district:"ঢাকা", upazila:"উত্তরা", address:"উত্তরা সেক্টর-৬", available:false, donations:12, lastDonate:"2026-05-01", verified:true, avatar:"👨", joined:"2023-06-01", badge:"Platinum" },
  { id:4, name:"নুসরাত জাহান", email:"nusrat@email.com", phone:"01611-567890", blood:"AB+", gender:"মহিলা", dob:"2000-03-18", district:"রাজশাহী", upazila:"বোয়ালিয়া", address:"সাহেববাজার, রাজশাহী", available:true, donations:3, lastDonate:"2025-12-10", verified:false, avatar:"👩", joined:"2024-09-20", badge:"Bronze" },
  { id:5, name:"ফারহান ইসলাম", email:"farhan@email.com", phone:"01711-678901", blood:"O-", gender:"পুরুষ", dob:"1993-07-30", district:"সিলেট", upazila:"কোতোয়ালি", address:"জিন্দাবাজার, সিলেট", available:true, donations:9, lastDonate:"2026-02-28", verified:true, avatar:"👨", joined:"2023-11-05", badge:"Gold" },
  { id:6, name:"মিতু বেগম", email:"mitu@email.com", phone:"01812-789012", blood:"A-", gender:"মহিলা", dob:"1996-11-14", district:"খুলনা", upazila:"কোতোয়ালি", address:"দৌলতপুর, খুলনা", available:false, donations:2, lastDonate:"2026-04-10", verified:true, avatar:"👩", joined:"2025-02-14", badge:"Bronze" },
  { id:7, name:"ইমরান খান", email:"imran@email.com", phone:"01915-890123", blood:"B-", gender:"পুরুষ", dob:"1997-09-25", district:"ঢাকা", upazila:"ধানমন্ডি", address:"ধানমন্ডি ২৭, ঢাকা", available:true, donations:5, lastDonate:"2025-11-15", verified:true, avatar:"👨", joined:"2024-05-30", badge:"Silver" },
  { id:8, name:"শারমিন আক্তার", email:"sharmin@email.com", phone:"01611-901234", blood:"AB-", gender:"মহিলা", dob:"2001-04-08", district:"ময়মনসিংহ", upazila:"কোতোয়ালি", address:"সদর, ময়মনসিংহ", available:true, donations:1, lastDonate:"2025-10-05", verified:false, avatar:"👩", joined:"2025-07-01", badge:"Bronze" },
];

const REQUESTS_INIT = [
  { id:1, patientName:"করিম সাহেব", blood:"O+", hospital:"DMCH, ঢাকা", units:2, contact:"01712-000001", urgency:"জরুরি 🔴", status:"active", date:"2026-06-19", requesterId:null, responses:[] },
  { id:2, patientName:"রহিমা বেগম", blood:"A+", hospital:"CMCH, চট্টগ্রাম", units:1, contact:"01812-000002", urgency:"মাঝারি 🟡", status:"fulfilled", date:"2026-06-18", requesterId:null, responses:[] },
  { id:3, patientName:"শিশু রোগী", blood:"B+", hospital:"শিশু হাসপাতাল, ঢাকা", units:3, contact:"01911-000003", urgency:"জরুরি 🔴", status:"active", date:"2026-06-19", requesterId:null, responses:[] },
];

const STORIES = [
  { name:"আরিফ হোসেন", text:"রক্তদানে আমার জীবন বাঁচানো সম্ভব হয়েছিল। BloodConnect-কে ধন্যবাদ!", blood:"O+" },
  { name:"শেফালি বেগম", text:"আমার সন্তানের জন্য সঠিক সময়ে B+ রক্ত পেয়েছিলাম। অসাধারণ সেবা!", blood:"B+" },
  { name:"কামরুল ইসলাম", text:"৫ মিনিটের মধ্যে donor খুঁজে পেলাম। এই অ্যাপ জীবন বাঁচায়!", blood:"A-" },
];

const FACTS = [
  { icon:"🩸", text:"একজন donor তিনজনের জীবন বাঁচাতে পারেন" },
  { icon:"⏱", text:"রক্তদান মাত্র ১০-১৫ মিনিট সময় নেয়" },
  { icon:"💪", text:"প্রতি ৩ মাসে একবার রক্ত দেওয়া নিরাপদ" },
  { icon:"❤️", text:"রক্তদান হৃদরোগের ঝুঁকি কমায়" },
];

const BADGE_CONFIG = { "Platinum":{ color:"#e5e4e2", icon:"💎" }, "Gold":{ color:"#ca8a04", icon:"🥇" }, "Silver":{ color:"#94a3b8", icon:"🥈" }, "Bronze":{ color:"#b45309", icon:"🥉" } };

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function BloodBadge({ g, big }) {
  return <span style={{ background: BG_COLORS[g]||C.red, color:"#fff", fontWeight:900, fontSize: big?18:12, padding: big?"7px 14px":"2px 8px", borderRadius:8, letterSpacing:.5, display:"inline-block", boxShadow:`0 2px 10px ${BG_COLORS[g]||C.red}55` }}>{g}</span>;
}
function Avatar({ name, size=42, emoji }) {
  const hue = (name||"X").charCodeAt(0)*9%360;
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`hsl(${hue},55%,30%)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.42, flexShrink:0, border:`2px solid hsl(${hue},55%,45%)` }}>{emoji||"👤"}</div>;
}
function Badge({ label }) {
  const b = BADGE_CONFIG[label]||BADGE_CONFIG["Bronze"];
  return <span style={{ fontSize:12, color:b.color, fontWeight:700 }}>{b.icon} {label}</span>;
}
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
      <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
      <div style={{ color:color||C.redLight, fontWeight:900, fontSize:22 }}>{value}</div>
      <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{label}</div>
    </div>
  );
}
function Input({ label, type="text", value, onChange, placeholder, options }) {
  const s = { width:"100%", background:C.input, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 13px", color:C.white, fontSize:13, outline:"none", boxSizing:"border-box" };
  return (
    <div style={{ marginBottom:12 }}>
      {label && <label style={{ color:C.mutedLight, fontSize:12, fontWeight:600, display:"block", marginBottom:5 }}>{label}</label>}
      {options ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={{ ...s, appearance:"none" }}>
          <option value="">{placeholder||"বেছে নিন"}</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} style={s} />
      )}
    </div>
  );
}
function Toast({ msg, type="success", visible }) {
  const bg = type==="error"?C.red:type==="info"?"#1d4ed8":C.success;
  return <div style={{ position:"fixed", bottom:90, left:"50%", transform:`translateX(-50%) translateY(${visible?0:60}px)`, opacity:visible?1:0, transition:"all .35s cubic-bezier(.34,1.56,.64,1)", background:bg, color:"#fff", fontWeight:700, fontSize:13, padding:"10px 22px", borderRadius:30, zIndex:9999, whiteSpace:"nowrap", boxShadow:`0 4px 20px ${bg}55`, pointerEvents:"none" }}>{msg}</div>;
}
function Modal({ children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"20px 20px 0 0", padding:"20px 20px 40px", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ width:36, height:4, background:C.border, borderRadius:4, margin:"0 auto 18px" }} />
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// PAGE: HOME
// ════════════════════════════════════════════════
function HomePage({ donors, requests, onNav, showToast }) {
  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background:`linear-gradient(135deg,#3a0808 0%,#1a0404 60%,#0a0505 100%)`, borderRadius:20, padding:"28px 20px", marginBottom:20, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, fontSize:120, opacity:.07 }}>🩸</div>
        <div style={{ color:C.red, fontSize:12, fontWeight:700, letterSpacing:1.5, marginBottom:8 }}>🩸 BLOOD CONNECT BANGLADESH</div>
        <h2 style={{ color:C.white, fontSize:24, fontWeight:900, margin:"0 0 8px", lineHeight:1.25 }}>রক্ত দিন,<br/>জীবন বাঁচান</h2>
        <p style={{ color:C.mutedLight, fontSize:13, margin:"0 0 20px", lineHeight:1.6 }}>সঠিক সময়ে সঠিক রক্ত পেতে আমরা সর্বদা প্রস্তুত।</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={()=>onNav("search")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:10, padding:"11px 20px", fontWeight:800, fontSize:14, cursor:"pointer", boxShadow:`0 4px 16px ${C.red}44` }}>🔍 রক্ত খুঁজুন</button>
          <button onClick={()=>onNav("register")} style={{ background:"transparent", color:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>➕ Donor হোন</button>
        </div>
      </div>

      {/* Emergency Button */}
      <button onClick={()=>onNav("request")} style={{ width:"100%", background:`linear-gradient(90deg,${C.red},#b91c1c)`, color:"#fff", border:"none", borderRadius:14, padding:"14px 0", fontWeight:900, fontSize:15, cursor:"pointer", marginBottom:20, boxShadow:`0 6px 24px ${C.red}44`, letterSpacing:.5, animation:"pulse 2s infinite" }}>
        🚨 জরুরি রক্তের অনুরোধ করুন
      </button>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        <StatCard icon="👥" label="মোট Donor" value={donors.length} />
        <StatCard icon="✅" label="Available" value={donors.filter(d=>d.available).length} color={C.success} />
        <StatCard icon="🚨" label="Active Req" value={requests.filter(r=>r.status==="active").length} color={C.yellow} />
      </div>

      {/* Active Requests */}
      {requests.filter(r=>r.status==="active").length>0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ color:C.red, fontWeight:800, fontSize:14, marginBottom:10 }}>🚨 জরুরি রক্তের অনুরোধ</div>
          {requests.filter(r=>r.status==="active").map(r=>(
            <div key={r.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"12px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:C.white, fontWeight:700, fontSize:14 }}>{r.patientName}</div>
                <div style={{ color:C.muted, fontSize:12 }}>🏥 {r.hospital}</div>
                <div style={{ color:C.muted, fontSize:12 }}>{r.urgency}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <BloodBadge g={r.blood} />
                <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>{r.units} ব্যাগ</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blood Facts */}
      <div style={{ marginBottom:20 }}>
        <div style={{ color:C.red, fontWeight:800, fontSize:14, marginBottom:10 }}>💡 জানুন</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {FACTS.map((f,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 10px" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{f.icon}</div>
              <div style={{ color:C.mutedLight, fontSize:12, lineHeight:1.5 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donors */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ color:C.red, fontWeight:800, fontSize:14 }}>👥 সাম্প্রতিক Donors</div>
          <button onClick={()=>onNav("donors")} style={{ background:"none", border:"none", color:C.red, fontSize:13, fontWeight:600, cursor:"pointer" }}>সব দেখুন →</button>
        </div>
        {donors.slice(0,3).map(d=>(
          <DonorRow key={d.id} d={d} showToast={showToast} />
        ))}
      </div>

      {/* Success Stories */}
      <div style={{ marginBottom:20 }}>
        <div style={{ color:C.red, fontWeight:800, fontSize:14, marginBottom:10 }}>❤️ সাফল্যের গল্প</div>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
          {STORIES.map((s,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 14px", minWidth:220, flexShrink:0 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>❝</div>
              <div style={{ color:C.mutedLight, fontSize:12, lineHeight:1.6, marginBottom:10 }}>{s.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Avatar name={s.name} size={28} />
                <div>
                  <div style={{ color:C.white, fontSize:12, fontWeight:700 }}>{s.name}</div>
                  <BloodBadge g={s.blood} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// DONOR ROW
// ════════════════════════════════════════════════
function DonorRow({ d, showToast }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:C.card, border:`1px solid ${open?C.border:C.border}`, borderRadius:14, marginBottom:8, overflow:"hidden" }}>
      <div onClick={()=>setOpen(!open)} style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
        <div style={{ position:"relative" }}>
          <Avatar name={d.name} size={42} emoji={d.avatar} />
          <div style={{ position:"absolute", bottom:0, right:0, width:11, height:11, borderRadius:"50%", background:d.available?C.success:C.muted, border:`2px solid ${C.card}` }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ color:C.white, fontWeight:700, fontSize:14 }}>{d.name}</span>
            {d.verified && <span style={{ fontSize:13 }} title="Verified">✅</span>}
          </div>
          <div style={{ color:C.muted, fontSize:12 }}>📍 {d.upazila}, {d.district}</div>
          <Badge label={d.badge} />
        </div>
        <div style={{ textAlign:"right" }}>
          <BloodBadge g={d.blood} />
          <div style={{ color:d.available?C.success:C.muted, fontSize:11, marginTop:4, fontWeight:600 }}>{d.available?"✓ Available":"✗ Unavailable"}</div>
        </div>
      </div>
      {open && (
        <div style={{ borderTop:`1px solid ${C.border}`, background:C.redDim+"33", padding:"12px 14px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            {[["📞","ফোন",d.phone],["🩸","মোট Donation",d.donations+" বার"],["📅","শেষ Donation",d.lastDonate],["🏠","ঠিকানা",d.address]].map(([ic,lb,vl])=>(
              <div key={lb} style={{ background:C.card, borderRadius:10, padding:"9px 10px" }}>
                <div style={{ color:C.muted, fontSize:10 }}>{ic} {lb}</div>
                <div style={{ color:C.white, fontSize:13, fontWeight:600, marginTop:2 }}>{vl}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href={`tel:${d.phone}`} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, color:C.white, borderRadius:10, padding:"9px 0", textAlign:"center", fontWeight:600, fontSize:13, textDecoration:"none" }}>📞 কল করুন</a>
            <button onClick={()=>showToast(`🩸 ${d.name}-কে request পাঠানো হয়েছে!`)} disabled={!d.available} style={{ flex:2, background:d.available?C.red:C.muted, color:"#fff", border:"none", borderRadius:10, padding:"9px 0", fontWeight:800, fontSize:13, cursor:d.available?"pointer":"not-allowed" }}>🩸 Request পাঠান</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// PAGE: SEARCH
// ════════════════════════════════════════════════
function SearchPage({ donors, showToast }) {
  const [blood, setBlood] = useState("All");
  const [district, setDistrict] = useState("");
  const [avail, setAvail] = useState("all");
  const [text, setText] = useState("");

  const filtered = donors.filter(d => {
    const bMatch = blood==="All"||d.blood===blood;
    const dMatch = !district||d.district===district;
    const aMatch = avail==="all"||(avail==="yes"&&d.available)||(avail==="no"&&!d.available);
    const tMatch = !text||d.name.toLowerCase().includes(text.toLowerCase())||d.upazila.toLowerCase().includes(text.toLowerCase());
    return bMatch&&dMatch&&aMatch&&tMatch;
  });

  return (
    <div>
      <div style={{ color:C.white, fontWeight:900, fontSize:18, marginBottom:16 }}>🔍 Donor খুঁজুন</div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:16 }}>
        <input placeholder="নাম বা এলাকা লিখুন..." value={text} onChange={e=>setText(e.target.value)} style={{ width:"100%", background:C.input, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 13px", color:C.white, fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10 }} />
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:8, scrollbarWidth:"none" }}>
          {["All",...BLOOD_GROUPS].map(g=>(
            <button key={g} onClick={()=>setBlood(g)} style={{ background:blood===g?(g==="All"?C.red:BG_COLORS[g]):"transparent", border:`1px solid ${blood===g?(BG_COLORS[g]||C.red):C.border}`, color:blood===g?"#fff":C.muted, borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, transition:"all .15s" }}>{g}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <select value={district} onChange={e=>setDistrict(e.target.value)} style={{ background:C.input, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 10px", color:C.white, fontSize:13, outline:"none" }}>
            <option value="">সব জেলা</option>
            {DISTRICTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select value={avail} onChange={e=>setAvail(e.target.value)} style={{ background:C.input, border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 10px", color:C.white, fontSize:13, outline:"none" }}>
            <option value="all">সব</opti