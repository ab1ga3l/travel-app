// An original geometric band (diamonds and bars) used as a section divider. Pure SVG, no images.
const svg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="14" viewBox="0 0 56 14">
    <rect width="56" height="14" fill="#14213d"/>
    <path d="M0 7 L7 0 L14 7 L7 14Z" fill="#f2a541"/>
    <rect x="16" y="3" width="10" height="8" fill="#0f5c4d"/>
    <path d="M28 7 L35 0 L42 7 L35 14Z" fill="#c8306e"/>
    <rect x="44" y="3" width="10" height="8" fill="#f2a541"/>
  </svg>`,
);

export function Band() {
  return <div className="band" aria-hidden="true" style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }} />;
}
