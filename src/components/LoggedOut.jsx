import { useApp } from "../AppContext.js";

export default function LoggedOut() {
  const { start } = useApp();
  return (
    <div className="box">
      <h2>You're logged out</h2>
      <p>Thanks for visiting Wanderlux.</p>
      <button className="btn" onClick={() => start("login")}>
        Log in again
      </button>
    </div>
  );
}
