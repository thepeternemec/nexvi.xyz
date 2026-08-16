import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealVariant = "up" | "blur" | "scale" | "fade";

/**
 * Scroll-reveal wrapper: fades + lifts its children into view once.
 * Falls back to visible content when IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {

  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 0;
    };

    let done = false;
    const timers: number[] = [];
    let io: IntersectionObserver | null = null;

    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const t of timers) window.clearTimeout(t);
    };

    const onScroll = () => {
      if (inView()) reveal();
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Layout can still be settling during hydration (fonts, streamed markup), so the
    // observer's first callback may report "not intersecting" and never fire again.
    // Re-check a few times after mount to catch anything already in the viewport.
    onScroll();
    timers.push(
      window.setTimeout(onScroll, 60),
      window.setTimeout(onScroll, 250),
      window.setTimeout(onScroll, 800),
    );

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);



  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-revealed={shown ? "true" : "false"}
      data-reveal-variant={variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

