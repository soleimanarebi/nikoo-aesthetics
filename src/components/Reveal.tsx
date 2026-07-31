"use client";

import { useInView } from "@/hooks/useInView";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      id={id}
      style={{ animationDelay: inView ? `${delay}ms` : undefined }}
      className={`${inView ? "animate-fadeUp" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
