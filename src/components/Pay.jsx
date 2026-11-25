import { useState } from "react";
import { useApp } from "../AppContext.js";
import { money } from "../data.js";

const METHODS = ["Card", "GCash", "PayPal", "Bank transfer"];

export default function Pay() {
  const { pk, dest, pkgId, draft: t, err, pay, cancelPay } = useApp();
  const p = pk(pkgId);
  const [method, setMethod] = useState("Card");
  const [card, setCard] = useState("");

  return (
    <div className="box">
      <h2>Payment</h2>
      <p>
        {dest(p.d).name} · {t.n} traveler{t.n > 1 ? "s" : ""} ·{" "}
        <span className="price">{money(p.price * t.n)}</span>
      </p>
      <label htmlFor="pm">Payment method</label>
      <select id="pm" value={method} onChange={(e) => setMethod(e.target.value)}>
        {METHODS.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      {method === "Card" && (
        <>
          <label htmlFor="cn">Card number</label>
          <input
            id="cn"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={card}
            onChange={(e) => setCard(e.target.value)}
          />
          <small>Demo: a card ending in 0000 is declined.</small>
        </>
      )}
      <p className="err">{err}</p>
      <button className="btn" onClick={() => pay(method, method === "Card" ? card : "")}>
        Pay {money(p.price * t.n)}
      </button>{" "}
      <button className="btn alt" onClick={cancelPay}>
        Cancel
      </button>
    </div>
  );
}
