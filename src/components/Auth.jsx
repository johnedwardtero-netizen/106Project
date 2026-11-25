import { useState } from "react";
import { useApp } from "../AppContext.js";

function Verify() {
  const { reg, confirmEmail } = useApp();
  return (
    <div className="box">
      <h2>Verify your email</h2>
      <p>
        We sent a confirmation link to <b>{reg.email}</b>.
      </p>
      <button className="btn" onClick={confirmEmail}>
        Open confirmation link
      </button>
    </div>
  );
}

function Register() {
  const { err, register, start } = useApp();
  const [u, setU] = useState("");
  const [e, setE] = useState("");
  const [p, setP] = useState("");

  return (
    <div className="box">
      <h2>Create your account</h2>
      <label htmlFor="ru">Username</label>
      <input id="ru" autoComplete="username" value={u} onChange={(ev) => setU(ev.target.value)} />
      <label htmlFor="re">Email</label>
      <input id="re" type="email" value={e} onChange={(ev) => setE(ev.target.value)} />
      <label htmlFor="rp">Password (6+ characters)</label>
      <input id="rp" type="password" value={p} onChange={(ev) => setP(ev.target.value)} />
      <p className="err">{err}</p>
      <button className="btn" onClick={() => register(u.trim(), e.trim(), p)}>
        Send confirmation link
      </button>{" "}
      <button className="btn alt" onClick={() => start("login")}>
        I have an account
      </button>
    </div>
  );
}

function Login() {
  const { err, fails, setFails, go, login, start } = useApp();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const locked = fails >= 3;

  return (
    <div className="box">
      <h2>Log in</h2>
      {locked ? (
        <>
          <p className="err">
            Too many failed attempts. Reset your password to continue.
          </p>
          <button
            className="btn"
            onClick={() => {
              setFails(0);
              go("auth");
            }}
          >
            Reset and retry
          </button>
        </>
      ) : (
        <>
          <label htmlFor="lu">Username</label>
          <input id="lu" autoComplete="username" value={u} onChange={(ev) => setU(ev.target.value)} />
          <label htmlFor="lp">Password</label>
          <input
            id="lp"
            type="password"
            autoComplete="current-password"
            value={p}
            onChange={(ev) => setP(ev.target.value)}
          />
          <p className="err">{err}</p>
          <button className="btn" onClick={() => login(u.trim(), p.trim())}>
            Log in
          </button>{" "}
          <button className="btn alt" onClick={() => start("register")}>
            Create account
          </button>
        </>
      )}
      <p className="mut">
        <small>Demo: guest / guest123 (customer), admin / admin123 (admin)</small>
      </p>
    </div>
  );
}

export default function Auth() {
  const { mode } = useApp();
  if (mode === "verify") return <Verify />;
  if (mode === "register") return <Register />;
  return <Login />;
}
