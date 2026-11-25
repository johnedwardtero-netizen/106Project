import { useApp } from "../AppContext.js";

export default function Nav() {
  const { user, go, start, logout } = useApp();

  const link = (label, action) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        action();
      }}
    >
      {label}
    </a>
  );

  return (
    <nav id="nav">
      <span className="brand" onClick={() => go("home")}>
        Wanderlux
      </span>
      <div>
        {user ? (
          <>
            {user.role === "admin" ? (
              link("Dashboard", () => go("admin"))
            ) : (
              <>
                {link("Packages", () => go("browse"))}
                {link("My bookings", () => go("mine"))}
              </>
            )}
            {link(`Log out (${user.u})`, logout)}
          </>
        ) : (
          <>
            {link("Destinations", () => go("home"))}
            {link("Log in", () => start("login"))}
            {link("Register", () => start("register"))}
          </>
        )}
      </div>
    </nav>
  );
}
