import { useApp } from "../AppContext.js";
import { money } from "../data.js";
import Pic from "./Pic.jsx";

export default function Home() {
  const { db, dest, user, go, start } = useApp();

  const bookTrip = () =>
    user ? go(user.role === "admin" ? "admin" : "browse") : start("login");
  const viewPackages = () => (user ? go("browse") : start("register"));

  return (
    <>
      <div className="hero">
        <h1>Journeys crafted with care</h1>
        <p>
          Browse curated trips across the Philippines, check availability and
          book with confidence.
        </p>
        <div className="row">
          <button className="btn" onClick={bookTrip}>
            Book a trip
          </button>
          <button className="btn alt" onClick={viewPackages}>
            View packages
          </button>
        </div>
      </div>
      <div className="grid">
        {db.pkgs.slice(0, 3).map((p) => {
          const d = dest(p.d);
          return (
            <div className="card" key={p.id}>
              <Pic d={d} />
              <h3>{d.name}</h3>
              <small>
                {p.days} days · from {money(p.price)}
              </small>
            </div>
          );
        })}
      </div>
    </>
  );
}
