import { useApp } from "../AppContext.js";

export default function Done() {
  const { last: b, user, go } = useApp();
  return (
    <div className="box">
      <h2>Booking received</h2>
      <p>
        Reference <b>{b.ref}</b>. Confirmation sent to {user.email}
        {b.phone ? ` and by SMS to ${b.phone}` : ""}.
      </p>
      <p>
        Status: <span className="tag">{b.status}</span> We'll let you know once
        our team approves it.
      </p>
      <button className="btn" onClick={() => go("mine")}>
        View my bookings
      </button>
    </div>
  );
}
