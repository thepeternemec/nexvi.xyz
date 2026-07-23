const PALETTES: Array<[string, string, string, string]> = [
  ["#009DE5", "#FF0197", "#8024C7", "#FFAF1A"],
  ["#0EA5E9", "#22C55E", "#065F46", "#FDE047"],
  ["#F43F5E", "#8B5CF6", "#1E293B", "#F97316"],
  ["#06B6D4", "#3B82F6", "#7C3AED", "#EC4899"],
  ["#FB7185", "#F59E0B", "#84CC16", "#10B981"],
  ["#1E40AF", "#7C3AED", "#DB2777", "#F97316"],
  ["#14B8A6", "#0EA5E9", "#6366F1", "#F472B6"],
  ["#DC2626", "#EA580C", "#CA8A04", "#0F172A"],
  ["#4ADE80", "#22D3EE", "#A78BFA", "#F0ABFC"],
  ["#111827", "#374151", "#9CA3AF", "#F59E0B"],
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function MeshGradient({ seed, className }: { seed: string; className?: string }) {
  const p = PALETTES[hash(seed) % PALETTES.length];
  const uid = `mg-${hash(seed).toString(36)}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${uid}-blur`} filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="500">
          <feGaussianBlur stdDeviation="100" />
        </filter>
        <filter id={`${uid}-noise`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1" octaves="3" result="turbulence" stitchTiles="stitch" />
          <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#000" />
      <g filter={`url(#${uid}-blur)`}>
        <rect x="100" y="0" width="560" height="580" fill={p[0]} />
        <rect x="50" y="-60" width="600" height="320" fill={p[1]} />
        <rect x="-140" y="190" width="420" height="480" fill={p[2]} />
        <rect x="700" y="-200" width="500" height="580" fill={p[3]} />
      </g>
      <rect
        x="0"
        y="0"
        width="1000"
        height="500"
        style={{ mixBlendMode: "luminosity", filter: `url(#${uid}-noise)`, opacity: 0.2 }}
      />
    </svg>
  );
}
