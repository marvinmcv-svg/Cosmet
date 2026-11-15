"use client";
import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Line-by-line masked reveal, Apple keynote style. Pass lines as array for exact breaks. */
export function SplitReveal({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
  stagger = 0.09,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>(".split-inner");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, immediate, stagger]);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="split-line">
          <span className="split-inner">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade + rise children when scrolled into view. */
export function Reveal({
  children,
  className = "",
  y = 40,
  delay = 0,
  stagger = 0,
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          delay,
          stagger,
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [y, delay, stagger]);
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Parallax image wrapper — moves content against scroll. */
export function Parallax({ children, speed = 0.15, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -speed * 100 },
        { yPercent: speed * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, el);
    return () => ctx.revert();
  }, [speed]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
