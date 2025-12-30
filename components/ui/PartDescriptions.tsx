"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface PartDescription {
  label: string;
  description: string;
}

interface PartDescriptionsProps {
  parts: PartDescription[];
  className?: string;
}

export function PartDescriptions({
  parts,
  className = "",
}: PartDescriptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const items = containerRef.current?.querySelectorAll(".part-item");
            items?.forEach((item, index) => {
              setTimeout(() => {
                animate(item as HTMLElement, {
                  opacity: [0, 1],
                  translateX: [-30, 0],
                  duration: 600,
                  ease: "out(4)",
                });
              }, index * 150);
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col gap-6 ${className}`}>
      {parts.map((part, index) => (
        <div
          key={index}
          className="part-item opacity-0 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-slate-400"></div>
            <h3
              ref={(el) => {
                labelRefs.current[index] = el;
              }}
              className="text-2xl font-semibold text-slate-800 part-label"
              data-part-index={index}
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {part.label}
            </h3>
          </div>
          <p className="text-base text-slate-600 ml-4 max-w-md">
            {part.description}
          </p>
        </div>
      ))}
    </div>
  );
}

