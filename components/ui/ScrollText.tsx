"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface ScrollTextProps {
  section: number;
  title: string;
  description?: string;
  className?: string;
}

export function ScrollText({
  section,
  title,
  description,
  className = "",
}: ScrollTextProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Animate title
            if (titleRef.current) {
              animate(titleRef.current, {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1000,
                ease: "out(4)",
              });
            }

            // Animate description with delay
            if (descRef.current) {
              setTimeout(() => {
                animate(descRef.current!, {
                  opacity: [0, 1],
                  translateY: [20, 0],
                  duration: 800,
                  ease: "out(4)",
                });
              }, 200);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    const sectionElement = document.querySelector(`.section-${section}`);
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, [section]);

  return (
    <div className={`flex flex-col ${className}`}>
      <h2
        ref={titleRef}
        className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 opacity-0"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          ref={descRef}
          className="text-lg md:text-xl text-slate-600 max-w-2xl opacity-0"
        >
          {description}
        </p>
      )}
    </div>
  );
}

