import { useApp } from "../AppContext.js";
import { money } from "../data.js";
import Pic from "./Pic.jsx";

export default function Browse() {
  const { db, dest, filters: f, setFilters, pick } = useApp();

  const budget = +f.budget || 0;
  const list = db.pkgs.filter(
    (p) =>
      (!f.date || p.date >= f.date) &&
      (!budget || p.price <= budget) &&
      (!f.type || dest(p.d).type === f.type),
  );
  const types = [...new Set(db.dests.map((d) => d.type))];
  const set = (key) => (e) => setFilters({ ...f, [key]: e.target.value });

  return (
    <>
      <h2>Find your trip</h2>
      <div className="filters">
        <div>
          <label htmlFor="fd">Leaving after</label>
          <input id="fd" type="date" value={f.date} onChange={set("date")} />
        </div>
        <div>
          <label htmlFor="fb">Max budget (₱)</label>
          <input id="fb" type="number" min="0" value={f.budget} onChange={set("budget")} />
        </div>
        <div>
          <label htmlFor="ft">Trip type</label>
          <select id="ft" value={f.type} onChange={set("type")}>
            <option value="">Any</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      {list.length ? (
        <div className="grid">
          {list.map((p) => {
            const d = dest(p.d);
            return (
              <div className="card" key={p.id}>
                <Pic d={d} />
                <h3>{d.name}</h3>
                <span className="tag">{d.type}</span>
                <p>{d.desc}</p>
                <p>
                  {p.days} days · departs {p.date}
                  <br />
                  <span className="price">from {money(p.price)}</span>{" "}
                  <small>per traveler · {p.slots} slots</small>
                </p>
                <button className="btn" onClick={() => pick(p.id)}>
                  Book a trip
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <p>No packages match these filters. Raise your budget or clear a filter.</p>
          <button
            className="btn"
            onClick={() => setFilters({ date: "", budget: "", type: "" })}
          >
            Clear filters
          </button>
        </>
      )}
    </>
  );
}
