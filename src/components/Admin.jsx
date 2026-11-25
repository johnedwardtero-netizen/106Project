import { useState } from "react";
import { useApp } from "../AppContext.js";
import { money } from "../data.js";

const TABS = ["Destinations", "Packages", "Bookings", "Users", "Reports"];
const gap = { marginBottom: ".6rem" };

function DestRow({ d }) {
  const { editDest, deleteDest, setImg } = useApp();
  const [name, setName] = useState(d.name);
  const [type, setType] = useState(d.type);
  const [desc, setDesc] = useState(d.desc);

  return (
    <div className="card row" style={gap}>
      <input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 2 }} aria-label="Name" />
      <input value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }} aria-label="Type" />
      <input value={desc} onChange={(e) => setDesc(e.target.value)} style={{ flex: 4 }} aria-label="Description" />
      <input
        type="file"
        accept="image/*"
        aria-label={`Photo for ${d.name}`}
        onChange={(e) => {
          setImg(d.id, e.target.files[0]);
          e.target.value = "";
        }}
        style={{ flex: 3 }}
      />
      <button className="btn sm" onClick={() => editDest(d.id, { name, type, desc })}>
        Save
      </button>{" "}
      <button className="btn sm bad" onClick={() => deleteDest(d.id)}>
        Delete
      </button>
    </div>
  );
}

const EMPTY = { name: "", type: "", desc: "", days: "", price: "", slots: "", date: "" };

function NewDest() {
  const { addDest } = useApp();
  const [f, setF] = useState(EMPTY);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="card row">
      <input placeholder="New destination" value={f.name} onChange={set("name")} style={{ flex: 2 }} />
      <input placeholder="Type" value={f.type} onChange={set("type")} style={{ flex: 1 }} />
      <input placeholder="Description" value={f.desc} onChange={set("desc")} style={{ flex: 4 }} />
      <input type="number" min="1" placeholder="Days" value={f.days} onChange={set("days")} style={{ width: "5rem" }} aria-label="Days" />
      <input type="number" min="1" placeholder="Price ₱" value={f.price} onChange={set("price")} style={{ width: "7rem" }} aria-label="Price" />
      <input type="number" min="1" placeholder="Slots" value={f.slots} onChange={set("slots")} style={{ width: "5rem" }} aria-label="Slots" />
      <input type="date" value={f.date} onChange={set("date")} aria-label="Departure date" />
      <button className="btn sm" onClick={() => addDest(f) && setF(EMPTY)}>
        Add
      </button>
    </div>
  );
}

function PkgRow({ p }) {
  const { dest, editPkg } = useApp();
  const [price, setPrice] = useState(String(p.price));
  const [slots, setSlots] = useState(String(p.slots));

  return (
    <div className="card row" style={gap}>
      <b style={{ flex: 2 }}>
        {dest(p.d).name} · {p.days}d
      </b>
      <label style={{ margin: 0 }}>Price ₱</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "7rem" }} />
      <label style={{ margin: 0 }}>Slots</label>
      <input type="number" value={slots} onChange={(e) => setSlots(e.target.value)} style={{ width: "5rem" }} />
      <button className="btn sm" onClick={() => editPkg(p.id, price, slots)}>
        Update
      </button>
    </div>
  );
}

function Destinations() {
  const { db } = useApp();
  return (
    <>
      {db.dests.map((d) => (
        <DestRow key={d.id} d={d} />
      ))}
      <NewDest />
    </>
  );
}

function Packages() {
  const { db } = useApp();
  // Key includes price+slots so the inputs re-sync if a booking changes the slot count.
  return db.pkgs.map((p) => <PkgRow key={`${p.id}-${p.price}-${p.slots}`} p={p} />);
}

function Bookings() {
  const { db, dest, pk, decide } = useApp();
  if (!db.bookings.length) return <p>No bookings yet.</p>;
  return db.bookings.map((b) => (
    <div className="card row" style={{ ...gap, justifyContent: "space-between" }} key={b.ref}>
      <span>
        <b>{b.ref}</b> · {dest(pk(b.pkg).d).name} · {b.n}× · {b.u} · {money(b.total)}{" "}
        <span className={`tag ${b.status.split(" ")[0]}`}>{b.status}</span>
      </span>
      {b.status === "pending approval" && (
        <span>
          <button className="btn sm" onClick={() => decide(b.ref, "approved")}>
            Approve
          </button>{" "}
          <button className="btn sm bad" onClick={() => decide(b.ref, "rejected")}>
            Reject
          </button>
        </span>
      )}
    </div>
  ));
}

function Users() {
  const { db, deleteReview } = useApp();
  return (
    <>
      <h3>Users</h3>
      <div className="scroll">
        {db.users.map((u) => (
          <p key={u.u}>
            {u.u} · {u.role} · {u.email}
          </p>
        ))}
      </div>
      <h3>Reviews</h3>
      {db.reviews.length ? (
        db.reviews.map((r, i) => (
          <div className="card row" style={{ ...gap, justifyContent: "space-between" }} key={i}>
            <span>
              {r.u} {"★".repeat(r.stars)} {r.text}
            </span>
            <button className="btn sm bad" onClick={() => deleteReview(i)}>
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No reviews to manage yet.</p>
      )}
    </>
  );
}

function Reports() {
  const { db, dest, pk } = useApp();
  const ok = db.bookings.filter((b) => !["cancelled", "rejected"].includes(b.status));
  const sales = ok.reduce((s, b) => s + b.total, 0);
  const by = {};
  ok.forEach((b) => {
    const n = dest(pk(b.pkg).d).name;
    by[n] = (by[n] || 0) + b.total;
  });
  const mx = Math.max(1, ...Object.values(by));
  const entries = Object.entries(by);

  return (
    <>
      <p>
        Sales (excluding cancelled and rejected): <b className="price">{money(sales)}</b> across{" "}
        {ok.length} booking{ok.length === 1 ? "" : "s"}.
      </p>
      <h3>Sales by destination</h3>
      {entries.length ? (
        entries.map(([n, t]) => (
          <div key={n}>
            <p style={{ margin: ".3rem 0" }}>
              {n} · {money(t)}
            </p>
            <div className="bar" style={{ width: `${(t / mx) * 100}%` }} />
          </div>
        ))
      ) : (
        <p>No sales yet. Book a trip as the guest user to see trends.</p>
      )}
      <h3 style={{ marginTop: "1.5rem" }}>Activity log</h3>
      {db.log.length ? (
        db.log.slice(0, 8).map((l, i) => (
          <div key={i}>
            <small>{l}</small>
          </div>
        ))
      ) : (
        <small>Nothing logged yet.</small>
      )}
    </>
  );
}

const PANELS = { Destinations, Packages, Bookings, Users, Reports };

export default function Admin() {
  const { tab, setTab, logout } = useApp();
  const Panel = PANELS[tab];

  return (
    <>
      <h2>Admin dashboard</h2>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} aria-current={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <Panel />
      <p style={{ marginTop: "2rem" }}>
        <button className="btn alt" onClick={logout}>
          Log out
        </button>
      </p>
    </>
  );
}
