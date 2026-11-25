import { useRef, useState } from "react";
import { AppContext } from "./AppContext.js";
import { initialDB } from "./data.js";
import Nav from "./components/Nav.jsx";
import Home from "./components/Home.jsx";
import Auth from "./components/Auth.jsx";
import Browse from "./components/Browse.jsx";
import Book from "./components/Book.jsx";
import Pay from "./components/Pay.jsx";
import Done from "./components/Done.jsx";
import MyBookings from "./components/MyBookings.jsx";
import Admin from "./components/Admin.jsx";
import LoggedOut from "./components/LoggedOut.jsx";

const VIEWS = {
  home: Home,
  auth: Auth,
  browse: Browse,
  book: Book,
  pay: Pay,
  done: Done,
  mine: MyBookings,
  admin: Admin,
  end: LoggedOut,
};

export default function App() {
  // "Database" (in-memory, resets on refresh, same as the original demo)
  const [db, setDb] = useState(initialDB);

  // Session / UI state (formerly the global `S` object)
  const [userName, setUserName] = useState(null);
  const [view, setView] = useState("home");
  const [mode, setMode] = useState("login");
  const [fails, setFails] = useState(0);
  const [filters, setFilters] = useState({ date: "", budget: "", type: "" });
  const [pkgId, setPkgId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("Destinations");
  const [err, setErr] = useState("");
  const [reg, setReg] = useState(null);
  const [last, setLast] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  const user = db.users.find((u) => u.u === userName) || null;
  const dest = (id) => db.dests.find((d) => d.id == id);
  const pk = (id) => db.pkgs.find((p) => p.id == id);

  /* ---- helpers ---- */
  const toast = (m) => {
    setToastMsg(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  };

  // Apply a change to the db, write the activity log, optionally notify a user.
  const update = (fn, action, notify, msg) => {
    const entry = new Date().toLocaleTimeString() + " · " + action;
    setDb((d) => {
      let n = fn(d);
      n = { ...n, log: [entry, ...n.log] };
      if (notify) {
        n = {
          ...n,
          users: n.users.map((u) =>
            u.u === notify ? { ...u, notes: [msg, ...u.notes] } : u,
          ),
        };
      }
      return n;
    });
    toast("Saved: " + action);
  };

  const go = (v, e = "") => {
    setView(v);
    setErr(e);
    window.scrollTo(0, 0);
  };

  const start = (m) => {
    setMode(m);
    setFails(0);
    go("auth");
  };

  const logout = () => {
    setUserName(null);
    setPkgId(null);
    setDraft(null);
    go("end");
    toast("Logged out");
  };

  /* ---- auth ---- */
  const login = (name, password) => {
    const u = db.users.find((x) => x.u === name);
    if (!u || u.p !== password) {
      const n = fails + 1;
      setFails(n);
      return go(
        "auth",
        n >= 3
          ? ""
          : `Wrong username or password. ${3 - n} attempt${3 - n === 1 ? "" : "s"} left.`,
      );
    }
    setUserName(u.u);
    setFails(0);
    toast("Welcome, " + u.u);
    go(u.role === "admin" ? "admin" : "browse");
  };

  const register = (u, email, p) => {
    let m = "";
    if (u.length < 3) m = "Username needs at least 3 characters.";
    else if (db.users.some((x) => x.u === u)) m = "That username is taken.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) m = "Enter a valid email address.";
    else if (p.length < 6) m = "Password needs at least 6 characters.";
    if (m) return setErr(m);
    setErr("");
    setReg({ u, email, p });
    setMode("verify");
  };

  const confirmEmail = () => {
    update(
      (d) => ({
        ...d,
        users: [
          ...d.users,
          { u: reg.u, email: reg.email, p: reg.p, role: "customer", notes: [] },
        ],
      }),
      "Account created",
    );
    setUserName(reg.u);
    setReg(null);
    go("browse");
  };

  /* ---- booking ---- */
  const pick = (id) => {
    setPkgId(id);
    setDraft({ n: 1, name: user.u, phone: "", ok: false });
    go("book");
  };

  const checkSlots = ({ n, name, phone }) => {
    const p = pk(pkgId);
    const next = { n: Math.max(1, +n || 1), name: name.trim(), phone: phone.trim(), ok: false };
    if (!next.name) {
      setDraft(next);
      return go("book", "Enter the lead traveler name.");
    }
    if (next.n > p.slots) {
      setDraft(next);
      return go(
        "book",
        `Only ${p.slots} slot${p.slots === 1 ? "" : "s"} left. Lower the number of travelers or choose another package.`,
      );
    }
    setDraft({ ...next, ok: true });
    go("book");
  };

  /* ---- payment ---- */
  const pay = (method, card) => {
    const c = card.replace(/\s/g, "");
    if (method === "Card" && (c.length < 12 || c.endsWith("0000"))) {
      return go(
        "pay",
        c.length < 12
          ? "Enter a valid card number."
          : "Payment declined. Retry with another method or cancel.",
      );
    }
    const p = pk(pkgId);
    const t = draft;
    const ref = "WL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const b = {
      ref,
      u: user.u,
      pkg: p.id,
      n: t.n,
      name: t.name,
      phone: t.phone,
      total: p.price * t.n,
      method,
      status: "pending approval",
    };
    update(
      (d) => ({
        ...d,
        pkgs: d.pkgs.map((x) => (x.id === p.id ? { ...x, slots: x.slots - t.n } : x)),
        bookings: [b, ...d.bookings],
      }),
      "Booking " + ref + " saved (pending approval)",
    );
    setLast(b);
    go("done");
  };

  const cancelPay = () => {
    go("browse");
    toast("Payment cancelled. No booking was saved.");
  };

  /* ---- my bookings + reviews ---- */
  const modify = (ref, count) => {
    const b = db.bookings.find((x) => x.ref === ref);
    const p = pk(b.pkg);
    const n = Math.max(1, +count || 1);
    if (n - b.n > p.slots) return toast("Only " + p.slots + " extra slots left.");
    update(
      (d) => ({
        ...d,
        pkgs: d.pkgs.map((x) => (x.id === p.id ? { ...x, slots: x.slots - (n - b.n) } : x)),
        bookings: d.bookings.map((x) =>
          x.ref === ref
            ? { ...x, n, total: n * p.price, status: "pending approval" }
            : x,
        ),
      }),
      "Booking " + ref + " modified",
    );
  };

  const cancelBooking = (ref) => {
    const b = db.bookings.find((x) => x.ref === ref);
    update(
      (d) => ({
        ...d,
        pkgs: d.pkgs.map((x) => (x.id === b.pkg ? { ...x, slots: x.slots + b.n } : x)),
        bookings: d.bookings.map((x) =>
          x.ref === ref ? { ...x, status: "cancelled" } : x,
        ),
      }),
      "Booking " + ref + " cancelled",
    );
  };

  const postReview = (ref, stars, text) => {
    if (!text) return toast("Write a few words first.");
    update(
      (d) => ({ ...d, reviews: [...d.reviews, { ref, u: user.u, stars, text }] }),
      "Review posted for " + ref,
    );
    return true;
  };

  /* ---- admin ---- */
  const setImg = (id, file) => {
    if (!file) return;
    if (file.size > 2e6) return toast("Choose an image under 2 MB.");
    const name = dest(id).name;
    const r = new FileReader();
    r.onload = () =>
      update(
        (d) => ({
          ...d,
          dests: d.dests.map((x) => (x.id == id ? { ...x, img: r.result } : x)),
        }),
        "Photo updated for " + name,
      );
    r.readAsDataURL(file);
  };

  const editDest = (id, { name, type, desc }) => {
    const d0 = dest(id);
    const nextName = name.trim() || d0.name;
    update(
      (d) => ({
        ...d,
        dests: d.dests.map((x) =>
          x.id == id
            ? { ...x, name: nextName, type: type.trim() || x.type, desc: desc.trim() }
            : x,
        ),
      }),
      "Destination " + nextName + " updated",
    );
  };

  const deleteDest = (id) => {
    const d0 = dest(id);
    const ids = db.pkgs.filter((p) => p.d == id).map((p) => p.id);
    if (db.bookings.some((b) => ids.includes(b.pkg)))
      return toast("Can't delete " + d0.name + ": it has bookings.");
    if (!window.confirm("Delete " + d0.name + " and its packages?")) return;
    update(
      (d) => ({
        ...d,
        dests: d.dests.filter((x) => x.id != id),
        pkgs: d.pkgs.filter((p) => p.d != id),
      }),
      "Destination " + d0.name + " deleted",
    );
  };

  const addDest = (f) => {
    const name = f.name.trim();
    if (!name) return toast("Enter a destination name.");
    const price = +f.price;
    if (!price) return toast("Enter a package price so travelers can book it.");
    const id = Date.now();
    update(
      (d) => ({
        ...d,
        dests: [
          ...d.dests,
          { id, art: "beach", name, type: f.type.trim() || "Other", desc: f.desc.trim() },
        ],
        pkgs: [
          ...d.pkgs,
          {
            id: Math.max(0, ...d.pkgs.map((p) => p.id)) + 1,
            d: id,
            days: +f.days || 3,
            price,
            slots: +f.slots || 10,
            date: f.date || "2027-08-01",
          },
        ],
      }),
      "Destination " + name + " added",
    );
    return true;
  };

  const editPkg = (id, price, slots) => {
    const p = pk(id);
    update(
      (d) => ({
        ...d,
        pkgs: d.pkgs.map((x) =>
          x.id === id
            ? { ...x, price: +price || x.price, slots: Math.max(0, +slots) }
            : x,
        ),
      }),
      "Package " + dest(p.d).name + " updated",
    );
  };

  const decide = (ref, status) => {
    const b = db.bookings.find((x) => x.ref === ref);
    update(
      (d) => ({
        ...d,
        pkgs:
          status === "rejected"
            ? d.pkgs.map((x) => (x.id === b.pkg ? { ...x, slots: x.slots + b.n } : x))
            : d.pkgs,
        bookings: d.bookings.map((x) => (x.ref === ref ? { ...x, status } : x)),
      }),
      "Booking " + ref + " " + status,
      b.u,
      `Booking ${ref} was ${status}.`,
    );
  };

  const deleteReview = (i) =>
    update(
      (d) => ({ ...d, reviews: d.reviews.filter((_, idx) => idx !== i) }),
      "Review removed",
    );

  const ctx = {
    db, user, dest, pk,
    view, mode, setMode, fails, setFails, err, setErr,
    filters, setFilters, pkgId, draft, setDraft, tab, setTab, reg, last,
    go, start, logout, toast,
    login, register, confirmEmail,
    pick, checkSlots, pay, cancelPay,
    modify, cancelBooking, postReview,
    setImg, editDest, deleteDest, addDest, editPkg, decide, deleteReview,
  };

  const View = VIEWS[view];

  return (
    <AppContext.Provider value={ctx}>
      <Nav />
      <main id="app">
        <View />
      </main>
      <div id="toast" role="status" hidden={!toastMsg}>
        {toastMsg}
      </div>
    </AppContext.Provider>
  );
}
