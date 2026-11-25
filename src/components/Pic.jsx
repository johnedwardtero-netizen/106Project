import { ART } from "../data.js";

export default function Pic({ d }) {
  if (d.img) return <img className="pic" src={d.img} alt={d.name} />;
  return (
    <svg
      className="pic"
      viewBox="0 0 300 160"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${d.name} illustration`}
      dangerouslySetInnerHTML={{ __html: ART[d.art] || ART.beach }}
    />
  );
}
