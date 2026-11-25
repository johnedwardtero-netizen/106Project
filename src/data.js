const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

export const money = (n) => "₱" + Number(n).toLocaleString("en-US");

export const initialDB = () => ({
  users: [
    {
      u: "admin",
      p: "admin123",
      role: "admin",
      email: "admin@wanderlux.test",
      notes: [],
    },
    {
      u: "guest",
      p: "guest123",
      role: "customer",
      email: "guest@wanderlux.test",
      notes: [],
    },
  ],
  dests: [
    {
      id: 1,
      name: "Palawan",
      img: img("palawan.jpg"),
      art: "cliffs",
      type: "Adventure",
      desc: "El Nido lagoons, limestone cliffs and island hopping.",
    },
    {
      id: 2,
      name: "Boracay",
      img: img("boracay.jpg"),
      art: "beach",
      type: "Beach",
      desc: "White Beach, sandbars and sunset sailing.",
    },
    {
      id: 3,
      name: "Siargao",
      img: img("sargao.jpg"),
      art: "surf",
      type: "Beach",
      desc: "Surf breaks, Sugba Lagoon and Cloud 9 mornings.",
    },
    {
      id: 4,
      name: "Banaue & Sagada",
      img: img("banaue_and_sagana.jpg"),
      art: "terrace",
      type: "Culture",
      desc: "Ifugao rice terraces, hanging coffins and mountain cafes.",
    },
    {
      id: 5,
      name: "Vigan",
      img: img("vigan-city-02.jpg"),
      art: "town",
      type: "Culture",
      desc: "Cobblestone Calle Crisologo and Spanish-era houses.",
    },
    {
      id: 6,
      name: "Bohol",
      img: img("bohol.jpg"),
      art: "hills",
      type: "Adventure",
      desc: "Chocolate Hills, tarsiers and Loboc river cruises.",
    },
  ],
  pkgs: [
    { id: 1, d: 1, days: 4, price: 18500, slots: 12, date: "2027-02-20" },
    { id: 2, d: 2, days: 4, price: 16900, slots: 8, date: "2027-03-12" },
    { id: 3, d: 3, days: 5, price: 21800, slots: 6, date: "2027-04-02" },
    { id: 4, d: 4, days: 5, price: 14200, slots: 2, date: "2027-05-09" },
    { id: 5, d: 5, days: 3, price: 9800, slots: 10, date: "2027-06-15" },
    { id: 6, d: 6, days: 4, price: 15400, slots: 9, date: "2027-07-08" },
  ],
  bookings: [],
  reviews: [],
  log: [],
});

// Fallback illustrations (static, trusted SVG markup) used when a destination has no photo.
export const ART = {
  cliffs: `<rect width="300" height="160" fill="#9fd6d9"/><circle cx="240" cy="35" r="16" fill="#f6e3a1"/><rect y="105" width="300" height="55" fill="#2F7F86"/><path d="M20 110 L40 40 Q55 30 70 45 L95 110Z" fill="#5b6b66"/><path d="M150 110 L170 55 Q190 45 205 60 L235 110Z" fill="#6f7f78"/><path d="M120 128h40l-6 10h-28z" fill="#C9A24D"/>`,
  beach: `<rect width="300" height="160" fill="#bfe6ee"/><circle cx="70" cy="45" r="20" fill="#f7d774"/><rect y="85" width="300" height="35" fill="#3aa0ad"/><path d="M0 120 Q150 100 300 120 V160 H0Z" fill="#f1e2bc"/><path d="M235 135 Q232 95 240 70" stroke="#6b4f2a" stroke-width="4" fill="none"/><path d="M240 70 q-25-8-40 8 M240 70 q22-14 42 0 M240 70 q-8-22-30-22 M240 70 q14-20 36-16" stroke="#2d7a4f" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  surf: `<rect width="300" height="160" fill="#ffd9a8"/><circle cx="220" cy="60" r="24" fill="#ffb067"/><rect y="90" width="300" height="70" fill="#2F7F86"/><path d="M0 110 Q40 85 80 105 T160 105 T240 100 T300 108 V160H0Z" fill="#14213D" opacity=".55"/><path d="M0 125 Q50 105 100 123 T200 122 T300 126" stroke="#fff" stroke-width="3" fill="none"/><path d="M40 90 Q38 60 46 40" stroke="#4a3622" stroke-width="4" fill="none"/><path d="M46 40 q-18-6-28 6 M46 40 q16-10 30 2" stroke="#2d6a45" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  terrace: `<rect width="300" height="160" fill="#d8ead3"/><path d="M0 70 L90 20 L180 60 L260 15 L300 40 V160H0Z" fill="#7fae7a"/><path d="M0 100 Q150 70 300 100 V160H0Z" fill="#5f9a62"/><path d="M0 118 Q150 90 300 118" stroke="#3f7a4a" stroke-width="3" fill="none"/><path d="M0 134 Q150 108 300 134" stroke="#2f6a3e" stroke-width="3" fill="none"/><path d="M0 150 Q150 128 300 150 V160H0Z" fill="#2f6a3e"/>`,
  town: `<rect width="300" height="160" fill="#f3e7cf"/><circle cx="250" cy="30" r="14" fill="#f6d98a"/><rect x="15" y="60" width="80" height="85" fill="#b4573a"/><rect x="105" y="45" width="90" height="100" fill="#e6c98d"/><rect x="205" y="65" width="80" height="80" fill="#8a4b36"/><g fill="#14213D"><rect x="30" y="80" width="14" height="24"/><rect x="62" y="80" width="14" height="24"/><rect x="122" y="65" width="14" height="28"/><rect x="154" y="65" width="14" height="28"/><rect x="222" y="85" width="14" height="22"/><rect x="254" y="85" width="14" height="22"/></g><rect y="145" width="300" height="15" fill="#6b5a48"/>`,
  hills: `<rect width="300" height="160" fill="#cfe9f0"/><circle cx="60" cy="35" r="16" fill="#f7d774"/><g fill="#9bb55e"><ellipse cx="60" cy="140" rx="70" ry="38"/><ellipse cx="170" cy="140" rx="80" ry="52"/><ellipse cx="260" cy="140" rx="60" ry="34"/></g><rect y="140" width="300" height="20" fill="#5d8040"/>`,
};
