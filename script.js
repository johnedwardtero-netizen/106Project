const $ = (id) => document.getElementById(id),
  v = (id) => ($(id) ? $(id).value.trim() : "");
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const money = (n) => "₱" + Number(n).toLocaleString("en-US");
const DB = {
  users: [
    {
      u: "admin",
      p: "admin123",
      role: "admin",
      email: "admin@wanderlux.test",
      notes: [],
    },
    {
      u: "guest",
      p: "guest123",
      role: "customer",
      email: "guest@wanderlux.test",
      notes: [],
    },
  ],
  dests: [
    {
      id: 1,
      name: "Palawan",
      img: "images/palawan.jpg",
      art: "cliffs",
      type: "Adventure",
      desc: "El Nido lagoons, limestone cliffs and island hopping.",
    },
    {
      id: 2,
      name: "Boracay",
      img: "images/boracay.jpg",
      art: "beach",
      type: "Beach",
      desc: "White Beach, sandbars and sunset sailing.",
    },
    {
      id: 3,
      name: "Siargao",
      img: "images/sargao.jpg",
      art: "surf",
      type: "Beach",
      desc: "Surf breaks, Sugba Lagoon and Cloud 9 mornings.",
    },
    {
      id: 4,
      name: "Banaue & Sagada",
      img: "images/banaue%20and%20sagana.jpg",
      art: "terrace",
      type: "Culture",
      desc: "Ifugao rice terraces, hanging coffins and mountain cafes.",
    },
    {
      id: 5,
      name: "Vigan",
      img: "images/vigan-city-02.jpg",
      art: "town",
      type: "Culture",
      desc: "Cobblestone Calle Crisologo and Spanish-era houses.",
    },
    {
      id: 6,
      name: "Bohol",
      img: "images/bohol.jpg",
      art: "hills",
      type: "Adventure",
      desc: "Chocolate Hills, tarsiers and Loboc river cruises.",
    },
  ],
  pkgs: [
    { id: 1, d: 1, days: 4, price: 18500, slots: 12, date: "2027-02-20" },
    { id: 2, d: 2, days: 4, price: 16900, slots: 8, date: "2027-03-12" },
    { id: 3, d: 3, days: 5, price: 21800, slots: 6, date: "2027-04-02" },
    { id: 4, d: 4, days: 5, price: 14200, slots: 2, date: "2027-05-09" },
    { id: 5, d: 5, days: 3, price: 9800, slots: 10, date: "2027-06-15" },
    { id: 6, d: 6, days: 4, price: 15400, slots: 9, date: "2027-07-08" },
  ],
  bookings: [],
  reviews: [],
  log: [],
};
let S = {
  user: null,
  view: "home",
  mode: "login",
  fails: 0,
  f: {},
  pkg: null,
  draft: null,
  tab: "Destinations",
  err: "",
  reg: null,
  pay: null,
  last: null,
  stars: 5,
};
const ART = {
  cliffs: `<rect width="300" height="160" fill="#9fd6d9"/><circle cx="240" cy="35" r="16" fill="#f6e3a1"/><rect y="105" width="300" height="55" fill="#2F7F86"/><path d="M20 110 L40 40 Q55 30 70 45 L95 110Z" fill="#5b6b66"/><path d="M150 110 L170 55 Q190 45 205 60 L235 110Z" fill="#6f7f78"/><path d="M120 128h40l-6 10h-28z" fill="#C9A24D"/>`,
  beach: `<rect width="300" height="160" fill="#bfe6ee"/><circle cx="70" cy="45" r="20" fill="#f7d774"/><rect y="85" width="300" height="35" fill="#3aa0ad"/><path d="M0 120 Q150 100 300 120 V160 H0Z" fill="#f1e2bc"/><path d="M235 135 Q232 95 240 70" stroke="#6b4f2a" stroke-width="4" fill="none"/><path d="M240 70 q-25-8-40 8 M240 70 q22-14 42 0 M240 70 q-8-22-30-22 M240 70 q14-20 36-16" stroke="#2d7a4f" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  surf: `<rect width="300" height="160" fill="#ffd9a8"/><circle cx="220" cy="60" r="24" fill="#ffb067"/><rect y="90" width="300" height="70" fill="#2F7F86"/><path d="M0 110 Q40 85 80 105 T160 105 T240 100 T300 108 V160H0Z" fill="#14213D" opacity=".55"/><path d="M0 125 Q50 105 100 123 T200 122 T300 126" stroke="#fff" stroke-width="3" fill="none"/><path d="M40 90 Q38 60 46 40" stroke="#4a3622" stroke-width="4" fill="none"/><path d="M46 40 q-18-6-28 6 M46 40 q16-10 30 2" stroke="#2d6a45" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  terrace: `<rect width="300" height="160" fill="#d8ead3"/><path d="M0 70 L90 20 L180 60 L260 15 L300 40 V160H0Z" fill="#7fae7a"/><path d="M0 100 Q150 70 300 100 V160H0Z" fill="#5f9a62"/><path d="M0 118 Q150 90 300 118" stroke="#3f7a4a" stroke-width="3" fill="none"/><path d="M0 134 Q150 108 300 134" stroke="#2f6a3e" stroke-width="3" fill="none"/><path d="M0 150 Q150 128 300 150 V160H0Z" fill="#2f6a3e"/>`,
  town: `<rect width="300" height="160" fill="#f3e7cf"/><circle cx="250" cy="30" r="14" fill="#f6d98a"/><rect x="15" y="60" width="80" height="85" fill="#b4573a"/><rect x="105" y="45" width="90" height="100" fill="#e6c98d"/><rect x="205" y="65" width="80" height="80" fill="#8a4b36"/><g fill="#14213D"><rect x="30" y="80" width="14" height="24"/><rect x="62" y="80" width="14" height="24"/><rect x="122" y="65" width="14" height="28"/><rect x="154" y="65" width="14" height="28"/><rect x="222" y="85" width="14" height="22"/><rect x="254" y="85" width="14" height="22"/></g><rect y="145" width="300" height="15" fill="#6b5a48"/>`,
  hills: `<rect width="300" height="160" fill="#cfe9f0"/><circle cx="60" cy="35" r="16" fill="#f7d774"/><g fill="#9bb55e"><ellipse cx="60" cy="140" rx="70" ry="38"/><ellipse cx="170" cy="140" rx="80" ry="52"/><ellipse cx="260" cy="140" rx="60" ry="34"/></g><rect y="140" width="300" height="20" fill="#5d8040"/>`,
};
const pic = (d) =>
  d.img
    ? `<img class="pic" src="${esc(d.img)}" alt="${esc(d.name)}">`
    : `<svg class="pic" viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(d.name)} illustration">${ART[d.art] || ART.beach}</svg>`;
function setImg(id, el) {
  const f = el.files[0];
  if (!f) return;
  if (f.size > 2e6) return toast("Choose an image under 2 MB.");
  const r = new FileReader();
  r.onload = () => {
    dest(id).img = r.result;
    save("Photo updated for " + dest(id).name);
    render();
  };
  r.readAsDataURL(f);
}
const dest = (id) => DB.dests.find((d) => d.id == id),
  pk = (id) => DB.pkgs.find((p) => p.id == id);
const user = (u) => DB.users.find((x) => x.u == u);
function toast(m) {
  const t = $("toast");
  t.textContent = m;
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.hidden = true), 2600);
}
function save(action, notify, msg) {
  DB.log.unshift(new Date().toLocaleTimeString() + " · " + action);
  if (notify) {
    const u = user(notify);
    if (u) u.notes.unshift(msg);
  }
  toast("Saved: " + action);
}
function go(view, err = "") {
  S.view = view;
  S.err = err;
  render();
  scrollTo(0, 0);
}
function nav() {
  const u = S.user;
  $("nav").innerHTML =
    `<span class="brand" onclick="go('home')">Wanderlux</span><div>` +
    (u
      ? (u.role == "admin"
          ? `<a onclick="go('admin')">Dashboard</a>`
          : `<a onclick="go('browse')">Packages</a><a onclick="go('mine')">My bookings</a>`) +
        `<a onclick="logout()">Log out (${esc(u.u)})</a>`
      : `<a onclick="go('home')">Destinations</a><a onclick="start('login')">Log in</a><a onclick="start('register')">Register</a>`) +
    `</div>`;
}
function start(m) {
  S.mode = m;
  S.fails = 0;
  go("auth");
}
function logout() {
  S.user = null;
  S.pkg = S.draft = null;
  go("end");
  toast("Logged out");
}
/* ---- auth flow ---- */
function authView() {
  if (S.mode == "verify")
    return `<div class="box"><h2>Verify your email</h2><p>We sent a confirmation link to <b>${esc(S.reg.email)}</b>.</p><button class="btn" onclick="confirmEmail()">Open confirmation link</button></div>`;
  if (S.mode == "register")
    return `<div class="box"><h2>Create your account</h2><label for="ru">Username</label><input id="ru" autocomplete="username"><label for="re">Email</label><input id="re" type="email"><label for="rp">Password (6+ characters)</label><input id="rp" type="password"><p class="err">${S.err}</p><button class="btn" onclick="register()">Send confirmation link</button> <button class="btn alt" onclick="start('login')">I have an account</button></div>`;
  const lock = S.fails >= 3;
  return `<div class="box"><h2>Log in</h2>${
    lock
      ? `<p class="err">Too many failed attempts. Reset your password to continue.</p><button class="btn" onclick="S.fails=0;go('auth')">Reset and retry</button>`
      : `<label for="lu">Username</label><input id="lu" autocomplete="username"><label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password"><p class="err">${S.err}</p><button class="btn" onclick="login()">Log in</button> <button class="btn alt" onclick="start('register')">Create account</button>`
  }
 <p class="mut"><small>Demo: guest / guest123 (customer), admin / admin123 (admin)</small></p></div>`;
}
function login() {
  const u = user(v("lu"));
  if (!u || u.p !== v("lp")) {
    S.fails++;
    return go(
      "auth",
      S.fails >= 3
        ? ""
        : `Wrong username or password. ${3 - S.fails} attempt${3 - S.fails == 1 ? "" : "s"} left.`,
    );
  }
  S.user = u;
  S.fails = 0;
  toast("Welcome, " + u.u);
  go(u.role == "admin" ? "admin" : "browse");
}
function register() {
  const u = v("ru"),
    e = v("re"),
    p = $("rp").value;
  if (u.length < 3)
    return (
      go("auth", "Username needs at least 3 characters."),
      (S.mode = "register"),
      render()
    );
  let m = "";
  if (user(u)) m = "That username is taken.";
  else if (!/^\S+@\S+\.\S+$/.test(e)) m = "Enter a valid email address.";
  else if (p.length < 6) m = "Password needs at least 6 characters.";
  if (m) {
    S.err = m;
    return render();
  }
  S.reg = { u, email: e, p };
  S.mode = "verify";
  render();
}
function confirmEmail() {
  DB.users.push({ ...S.reg, u: S.reg.u, role: "customer", notes: [] });
  S.user = user(S.reg.u);
  S.reg = null;
  save("Account created");
  go("browse");
}
/* ---- browse + booking ---- */
function browse() {
  const f = S.f;
  const list = DB.pkgs.filter(
    (p) =>
      (!f.date || p.date >= f.date) &&
      (!f.budget || p.price <= f.budget) &&
      (!f.type || dest(p.d).type == f.type),
  );
  const types = [...new Set(DB.dests.map((d) => d.type))];
  return (
    `<h2>Find your trip</h2><div class="filters"><div><label for="fd">Leaving after</label><input id="fd" type="date" value="${f.date || ""}" onchange="setF()"></div><div><label for="fb">Max budget (₱)</label><input id="fb" type="number" min="0" value="${f.budget || ""}" onchange="setF()"></div><div><label for="ft">Trip type</label><select id="ft" onchange="setF()"><option value="">Any</option>${types.map((t) => `<option ${f.type == t ? "selected" : ""}>${t}</option>`).join("")}</select></div></div>` +
    (list.length
      ? `<div class="grid">${list
          .map((p) => {
            const d = dest(p.d);
            return `<div class="card">${pic(d)}<h3>${esc(d.name)}</h3><span class="tag">${esc(d.type)}</span><p>${esc(d.desc)}</p><p>${p.days} days · departs ${p.date}<br><span class="price">from ${money(p.price)}</span> <small>per traveler · ${p.slots} slots</small></p><button class="btn" onclick="pick(${p.id})">Book a trip</button></div>`;
          })
          .join("")}</div>`
      : `<p>No packages match these filters. Raise your budget or clear a filter.</p><button class="btn" onclick="S.f={};render()">Clear filters</button>`)
  );
}
function setF() {
  S.f = { date: v("fd"), budget: +v("fb") || 0, type: v("ft") };
  render();
}
function pick(id) {
  S.pkg = id;
  S.draft = { n: 1, name: S.user.u, phone: "", ok: false };
  go("book");
}
function bookView() {
  const p = pk(S.pkg),
    d = dest(p.d),
    t = S.draft;
  if (t.ok)
    return `<div class="box"><h2>Confirm booking?</h2><div class="card">${pic(d)}<h3>${esc(d.name)}, ${p.days} days</h3><p>Departs ${p.date}<br>${t.n} traveler${t.n > 1 ? "s" : ""}: ${esc(t.name)}<br><span class="price">Total ${money(p.price * t.n)}</span></p></div><p class="row"><button class="btn" onclick="S.pay=null;go('pay')">Confirm and continue to payment</button><button class="btn alt" onclick="S.draft.ok=false;render()">Change details</button></p></div>`;
  return `<div class="box">${pic(d)}<h2>${esc(d.name)} · traveler details</h2><p>${money(p.price)} per traveler. ${p.slots} slots left.</p><label for="bn">Lead traveler name</label><input id="bn" value="${esc(t.name)}"><label for="bp">Phone (for SMS confirmation)</label><input id="bp" value="${esc(t.phone)}"><label for="bt">Travelers</label><input id="bt" type="number" min="1" value="${t.n}"><p class="err">${S.err}</p><button class="btn" onclick="checkSlots()">Check availability</button> <button class="btn alt" onclick="go('browse')">Back to packages</button></div>`;
}
function checkSlots() {
  const p = pk(S.pkg);
  S.draft = {
    n: Math.max(1, +v("bt") || 1),
    name: v("bn"),
    phone: v("bp"),
    ok: false,
  };
  if (!S.draft.name) return go("book", "Enter the lead traveler name.");
  if (S.draft.n > p.slots)
    return go(
      "book",
      `Only ${p.slots} slot${p.slots == 1 ? "" : "s"} left. Lower the number of travelers or choose another package.`,
    );
  S.draft.ok = true;
  go("book");
}
/* ---- payment ---- */
function payView() {
  const p = pk(S.pkg),
    t = S.draft,
    m = S.pay?.m || "Card";
  return `<div class="box"><h2>Payment</h2><p>${esc(dest(p.d).name)} · ${t.n} traveler${t.n > 1 ? "s" : ""} · <span class="price">${money(p.price * t.n)}</span></p><label for="pm">Payment method</label><select id="pm" onchange="S.pay={m:this.value};render()">${["Card", "GCash", "PayPal", "Bank transfer"].map((x) => `<option ${x == m ? "selected" : ""}>${x}</option>`).join("")}</select>${m == "Card" ? `<label for="cn">Card number</label><input id="cn" inputmode="numeric" placeholder="4242 4242 4242 4242"><small>Demo: a card ending in 0000 is declined.</small>` : ""}<p class="err">${S.err}</p><button class="btn" onclick="pay()">Pay ${money(p.price * t.n)}</button> <button class="btn alt" onclick="cancelPay()">Cancel</button></div>`;
}
function pay() {
  const m = $("pm").value,
    c = ($("cn") ? $("cn").value : "").replace(/\s/g, "");
  S.pay = { m };
  if (m == "Card" && (c.length < 12 || c.endsWith("0000")))
    return go(
      "pay",
      c.length < 12
        ? "Enter a valid card number."
        : "Payment declined. Retry with another method or cancel.",
    );
  const p = pk(S.pkg),
    t = S.draft,
    ref = "WL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  p.slots -= t.n;
  const b = {
    ref,
    u: S.user.u,
    pkg: p.id,
    n: t.n,
    name: t.name,
    phone: t.phone,
    total: p.price * t.n,
    method: m,
    status: "pending approval",
  };
  DB.bookings.unshift(b);
  S.last = b;
  save("Booking " + ref + " saved (pending approval)");
  go("done");
}
function cancelPay() {
  go("browse");
  toast("Payment cancelled. No booking was saved.");
}
function doneView() {
  const b = S.last;
  return `<div class="box"><h2>Booking received</h2><p>Reference <b>${b.ref}</b>. Confirmation sent to ${esc(S.user.email)}${b.phone ? " and by SMS to " + esc(b.phone) : ""}.</p><p>Status: <span class="tag">${b.status}</span> We'll let you know once our team approves it.</p><button class="btn" onclick="go('mine')">View my bookings</button></div>`;
}
/* ---- my bookings + reviews ---- */
function mine() {
  const u = S.user,
    bs = DB.bookings.filter((b) => b.u == u.u);
  return (
    `<h2>My bookings</h2>` +
    (u.notes.length
      ? `<div class="card okmsg" style="margin-bottom:1rem">${u.notes.slice(0, 3).map(esc).join("<br>")}</div>`
      : "") +
    (bs.length
      ? bs
          .map((b) => {
            const p = pk(b.pkg),
              rv = DB.reviews.find((r) => r.ref == b.ref),
              live = !["cancelled", "rejected"].includes(b.status);
            return (
              `<div class="card" style="margin-bottom:1rem"><div class="row" style="justify-content:space-between"><h3>${esc(dest(p.d).name)} · ${b.ref}</h3><span class="tag ${b.status.split(" ")[0]}">${b.status}</span></div><p>${p.date} · ${b.n} traveler${b.n > 1 ? "s" : ""} · ${money(b.total)} via ${b.method}</p>` +
              (live
                ? `<div class="row"><label for="m${b.ref}" style="margin:0">Travelers</label><input id="m${b.ref}" type="number" min="1" value="${b.n}" style="width:5rem"><button class="btn sm" onclick="modify('${b.ref}')">Update</button><button class="btn sm bad" onclick="cancelB('${b.ref}')">Cancel booking</button></div>`
                : "") +
              (b.status == "approved"
                ? rv
                  ? `<p>Your review: ${"★".repeat(rv.stars)} ${esc(rv.text)}</p>`
                  : `<h3 style="margin-top:1rem">Review and rating</h3><small>Opens after your trip. For this demo it's open once a booking is approved.</small><div class="stars">${[1, 2, 3, 4, 5].map((i) => `<button aria-label="${i} stars" onclick="S.stars=${i};render()">${i <= S.stars ? "★" : "☆"}</button>`).join("")}</div><textarea id="rv${b.ref}" rows="2" placeholder="How was the trip?"></textarea><p><button class="btn sm" onclick="review('${b.ref}')">Post review</button></p>`
                : "") +
              `</div>`
            );
          })
          .join("")
      : `<p>No bookings yet. Pick a package to start.</p><button class="btn" onclick="go('browse')">Browse packages</button>`) +
    `<p><button class="btn alt" onclick="logout()">Log out</button></p>`
  );
}
function modify(ref) {
  const b = DB.bookings.find((x) => x.ref == ref),
    p = pk(b.pkg),
    n = Math.max(1, +v("m" + ref) || 1);
  if (n - b.n > p.slots) return toast("Only " + p.slots + " extra slots left.");
  p.slots -= n - b.n;
  b.n = n;
  b.total = n * p.price;
  b.status = "pending approval";
  save("Booking " + ref + " modified");
  render();
}
function cancelB(ref) {
  const b = DB.bookings.find((x) => x.ref == ref);
  pk(b.pkg).slots += b.n;
  b.status = "cancelled";
  save("Booking " + ref + " cancelled");
  render();
}
function review(ref) {
  const t = v("rv" + ref);
  if (!t) return toast("Write a few words first.");
  DB.reviews.push({ ref, u: S.user.u, stars: S.stars, text: t });
  S.stars = 5;
  save("Review posted for " + ref);
  render();
}
/* ---- admin ---- */
function admin() {
  const T = ["Destinations", "Packages", "Bookings", "Users", "Reports"];
  return (
    `<h2>Admin dashboard</h2><div class="tabs">${T.map((t) => `<button aria-current="${S.tab == t}" onclick="S.tab='${t}';render()">${t}</button>`).join("")}</div>` +
    {
      Destinations: () =>
        DB.dests
          .map(
            (d) =>
              `<div class="card row" style="margin-bottom:.6rem"><input id="dn${d.id}" value="${esc(d.name)}" style="flex:2" aria-label="Name"><input id="dt${d.id}" value="${esc(d.type)}" style="flex:1" aria-label="Type"><input id="dd${d.id}" value="${esc(d.desc)}" style="flex:4" aria-label="Description"><input type="file" accept="image/*" aria-label="Photo for ${esc(d.name)}" onchange="setImg(${d.id},this)" style="flex:3"><button class="btn sm" onclick="editD(${d.id})">Save</button> <button class="btn sm bad" onclick="delD(${d.id})">Delete</button></div>`,
          )
          .join("") +
        `<div class="card row"><input id="nn" placeholder="New destination" style="flex:2"><input id="nt" placeholder="Type" style="flex:1"><input id="nd" placeholder="Description" style="flex:4"><input id="nday" type="number" min="1" placeholder="Days" style="width:5rem" aria-label="Days"><input id="npr" type="number" min="1" placeholder="Price ₱" style="width:7rem" aria-label="Price"><input id="nsl" type="number" min="1" placeholder="Slots" style="width:5rem" aria-label="Slots"><input id="ndt" type="date" aria-label="Departure date"><button class="btn sm" onclick="addD()">Add</button></div>`,
      Packages: () =>
        DB.pkgs
          .map(
            (p) =>
              `<div class="card row" style="margin-bottom:.6rem"><b style="flex:2">${esc(dest(p.d).name)} · ${p.days}d</b><label style="margin:0">Price ₱</label><input id="pp${p.id}" type="number" value="${p.price}" style="width:7rem"><label style="margin:0">Slots</label><input id="ps${p.id}" type="number" value="${p.slots}" style="width:5rem"><button class="btn sm" onclick="editP(${p.id})">Update</button></div>`,
          )
          .join(""),
      Bookings: () =>
        DB.bookings.length
          ? DB.bookings
              .map(
                (b) =>
                  `<div class="card row" style="margin-bottom:.6rem;justify-content:space-between"><span><b>${b.ref}</b> · ${esc(dest(pk(b.pkg).d).name)} · ${b.n}× · ${b.u} · ${money(b.total)} <span class="tag ${b.status.split(" ")[0]}">${b.status}</span></span>${b.status == "pending approval" ? `<span><button class="btn sm" onclick="decide('${b.ref}','approved')">Approve</button> <button class="btn sm bad" onclick="decide('${b.ref}','rejected')">Reject</button></span>` : ""}</div>`,
              )
              .join("")
          : "<p>No bookings yet.</p>",
      Users: () =>
        `<h3>Users</h3><div class="scroll">${DB.users.map((u) => `<p>${esc(u.u)} · ${u.role} · ${esc(u.email)}</p>`).join("")}</div><h3>Reviews</h3>` +
        (DB.reviews.length
          ? DB.reviews
              .map(
                (r, i) =>
                  `<div class="card row" style="margin-bottom:.6rem;justify-content:space-between"><span>${esc(r.u)} ${"★".repeat(r.stars)} ${esc(r.text)}</span><button class="btn sm bad" onclick="delR(${i})">Remove</button></div>`,
              )
              .join("")
          : "<p>No reviews to manage yet.</p>"),
      Reports: () => {
        const ok = DB.bookings.filter(
            (b) => !["cancelled", "rejected"].includes(b.status),
          ),
          sales = ok.reduce((s, b) => s + b.total, 0),
          by = {};
        ok.forEach((b) => {
          const n = dest(pk(b.pkg).d).name;
          by[n] = (by[n] || 0) + b.total;
        });
        const mx = Math.max(1, ...Object.values(by));
        return (
          `<p>Sales (excluding cancelled and rejected): <b class="price">${money(sales)}</b> across ${ok.length} booking${ok.length == 1 ? "" : "s"}.</p><h3>Sales by destination</h3>` +
          (Object.keys(by).length
            ? Object.entries(by)
                .map(
                  ([n, t]) =>
                    `<p style="margin:.3rem 0">${esc(n)} · ${money(t)}</p><div class="bar" style="width:${(t / mx) * 100}%"></div>`,
                )
                .join("")
            : "<p>No sales yet. Book a trip as the guest user to see trends.</p>") +
          `<h3 style="margin-top:1.5rem">Activity log</h3>` +
          (DB.log
            .slice(0, 8)
            .map((l) => `<small>${esc(l)}</small><br>`)
            .join("") || "<small>Nothing logged yet.</small>")
        );
      },
    }[S.tab]() +
    `<p style="margin-top:2rem"><button class="btn alt" onclick="logout()">Log out</button></p>`
  );
}
function editD(id) {
  const d = dest(id);
  d.name = v("dn" + id) || d.name;
  d.type = v("dt" + id) || d.type;
  d.desc = v("dd" + id);
  save("Destination " + d.name + " updated");
  render();
}
function delD(id) {
  const d = dest(id);
  const ids = DB.pkgs.filter((p) => p.d == id).map((p) => p.id);
  if (DB.bookings.some((b) => ids.includes(b.pkg)))
    return toast("Can't delete " + d.name + ": it has bookings.");
  if (!confirm("Delete " + d.name + " and its packages?")) return;
  DB.dests = DB.dests.filter((x) => x.id != id);
  DB.pkgs = DB.pkgs.filter((p) => p.d != id);
  save("Destination " + d.name + " deleted");
  render();
}
function addD() {
  if (!v("nn")) return toast("Enter a destination name.");
  const price = +v("npr");
  if (!price) return toast("Enter a package price so travelers can book it.");
  const id = Date.now();
  DB.dests.push({
    id,
    art: "beach",
    name: v("nn"),
    type: v("nt") || "Other",
    desc: v("nd"),
  });
  DB.pkgs.push({
    id: Math.max(0, ...DB.pkgs.map((p) => p.id)) + 1,
    d: id,
    days: +v("nday") || 3,
    price,
    slots: +v("nsl") || 10,
    date: v("ndt") || "2027-08-01",
  });
  save("Destination " + v("nn") + " added");
  render();
}
function editP(id) {
  const p = pk(id);
  p.price = +v("pp" + id) || p.price;
  p.slots = Math.max(0, +v("ps" + id));
  save("Package " + dest(p.d).name + " updated");
  render();
}
function decide(ref, s) {
  const b = DB.bookings.find((x) => x.ref == ref);
  b.status = s;
  if (s == "rejected") pk(b.pkg).slots += b.n;
  save("Booking " + ref + " " + s, b.u, `Booking ${ref} was ${s}.`);
  render();
}
function delR(i) {
  DB.reviews.splice(i, 1);
  save("Review removed");
  render();
}
/* ---- home / end ---- */
function home() {
  return `<div class="hero"><h1>Journeys crafted with care</h1><p>Browse curated trips across the Philippines, check availability and book with confidence.</p><div class="row"><button class="btn" onclick="S.user?go(S.user.role=='admin'?'admin':'browse'):start('login')">Book a trip</button><button class="btn alt" onclick="S.user?go('browse'):start('register')">View packages</button></div></div><div class="grid">${DB.pkgs
    .slice(0, 3)
    .map(
      (p) =>
        `<div class="card">${pic(dest(p.d))}<h3>${esc(dest(p.d).name)}</h3><small>${p.days} days · from ${money(p.price)}</small></div>`,
    )
    .join("")}</div>`;
}
function render() {
  nav();
  $("app").innerHTML = {
    home,
    auth: authView,
    browse,
    book: bookView,
    pay: payView,
    done: doneView,
    mine,
    admin,
    end: () =>
      `<div class="box"><h2>You're logged out</h2><p>Thanks for visiting Wanderlux.</p><button class="btn" onclick="start('login')">Log in again</button></div>`,
  }[S.view]();
}
render();
