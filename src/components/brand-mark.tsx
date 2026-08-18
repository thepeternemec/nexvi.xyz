type Size = "sm" | "md" | "lg";

const TEXT: Record<Size, string> = {
  sm: "text-[15px] font-medium",
  md: "text-lg",
  lg: "text-[1.35rem]",
};

const DOT: Record<Size, string> = {
  sm: "h-[5px] w-[5px] mr-[6px]",
  md: "h-1.5 w-1.5 mr-[7px]",
  lg: "h-2 w-2 mr-2",
};

export function BrandMark({ size = "md", className = "" }: { size?: Size; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`relative inline-flex shrink-0 ${DOT[size]}`}>
        <span className="absolute inset-0 rounded-full bg-primary/60 motion-safe:animate-ping" />
        <span className="relative inline-block h-full w-full rounded-full bg-primary" />
      </span>
      <span className={`font-display tracking-tight ${TEXT[size]}`}>Nexvi</span>
    </span>
  );
}
