import { useState } from "react";
import { useApp } from "../AppContext.js";
import { money } from "../data.js";
import Pic from "./Pic.jsx";

export default function Book() {
  const { pk, dest, pkgId, draft, setDraft, err, go, checkSlots } = useApp();
  const p = pk(pkgId);
  const d = dest(p.d);
  const [name, setName] = useState(draft.name);
  const [phone, setPhone] = useState(draft.phone);
  const [n, setN] = useState(String(draft.n));

  if (draft.ok) {
    return (
      <div className="box">
        <h2>Confirm booking?</h2>
        <div className="card">
          <Pic d={d} />
          <h3>
            {d.name}, {p.days} days
          </h3>
          <p>
            Departs {p.date}
            <br />
            {draft.n} traveler{draft.n > 1 ? "s" : ""}: {draft.name}
            <br />
            <span className="price">Total {money(p.price * draft.n)}</span>
          </p>
        </div>
        <p className="row">
          <button className="btn" onClick={() => go("pay")}>
            Confirm and continue to payment
          </button>
          <button
            className="btn alt"
            onClick={() => {
              setN(String(draft.n));
              setDraft({ ...draft, ok: false });
            }}
          >
            Change details
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="box">
      <Pic d={d} />
      <h2>{d.name} · traveler details</h2>
      <p>
        {money(p.price)} per traveler. {p.slots} slots left.
      </p>
      <label htmlFor="bn">Lead traveler name</label>
      <input id="bn" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="bp">Phone (for SMS confirmation)</label>
      <input id="bp" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <label htmlFor="bt">Travelers</label>
      <input id="bt" type="number" min="1" value={n} onChange={(e) => setN(e.target.value)} />
      <p className="err">{err}</p>
      <button className="btn" onClick={() => checkSlots({ n, name, phone })}>
        Check availability
      </button>{" "}
      <button className="btn alt" onClick={() => go("browse")}>
        Back to packages
      </button>
    </div>
  );
}
