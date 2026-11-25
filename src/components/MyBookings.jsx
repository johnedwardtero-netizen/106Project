import { useState } from "react";
import { useApp } from "../AppContext.js";
import { money } from "../data.js";

function BookingCard({ b, stars, setStars }) {
  const { db, pk, dest, modify, cancelBooking, postReview } = useApp();
  const p = pk(b.pkg);
  const review = db.reviews.find((r) => r.ref === b.ref);
  const live = !["cancelled", "rejected"].includes(b.status);
  const [count, setCount] = useState(String(b.n));
  const [text, setText] = useState("");

  const post = () => {
    if (postReview(b.ref, stars, text.trim())) setStars(5);
  };

  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>
          {dest(p.d).name} · {b.ref}
        </h3>
        <span className={`tag ${b.status.split(" ")[0]}`}>{b.status}</span>
      </div>
      <p>
        {p.date} · {b.n} traveler{b.n > 1 ? "s" : ""} · {money(b.total)} via {b.method}
      </p>
      {live && (
        <div className="row">
          <label htmlFor={`m${b.ref}`} style={{ margin: 0 }}>
            Travelers
          </label>
          <input
            id={`m${b.ref}`}
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: "5rem" }}
          />
          <button className="btn sm" onClick={() => modify(b.ref, count)}>
            Update
          </button>
          <button className="btn sm bad" onClick={() => cancelBooking(b.ref)}>
            Cancel booking
          </button>
        </div>
      )}
      {b.status === "approved" &&
        (review ? (
          <p>
            Your review: {"★".repeat(review.stars)} {review.text}
          </p>
        ) : (
          <>
            <h3 style={{ marginTop: "1rem" }}>Review and rating</h3>
            <small>
              Opens after your trip. For this demo it's open once a booking is approved.
            </small>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} aria-label={`${i} stars`} onClick={() => setStars(i)}>
                  {i <= stars ? "★" : "☆"}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="How was the trip?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p>
              <button className="btn sm" onClick={post}>
                Post review
              </button>
            </p>
          </>
        ))}
    </div>
  );
}

export default function MyBookings() {
  const { db, user, go, logout } = useApp();
  const [stars, setStars] = useState(5);
  const bs = db.bookings.filter((b) => b.u === user.u);

  return (
    <>
      <h2>My bookings</h2>
      {user.notes.length > 0 && (
        <div className="card okmsg" style={{ marginBottom: "1rem" }}>
          {user.notes.slice(0, 3).map((n, i) => (
            <div key={i}>{n}</div>
          ))}
        </div>
      )}
      {bs.length ? (
        bs.map((b) => <BookingCard key={b.ref} b={b} stars={stars} setStars={setStars} />)
      ) : (
        <>
          <p>No bookings yet. Pick a package to start.</p>
          <button className="btn" onClick={() => go("browse")}>
            Browse packages
          </button>
        </>
      )}
      <p>
        <button className="btn alt" onClick={logout}>
          Log out
        </button>
      </p>
    </>
  );
}
