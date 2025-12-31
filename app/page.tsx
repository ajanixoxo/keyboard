"use client";

import { useEffect, useRef } from "react";
import { KeyboardSceneWrapper } from "@/components/three/KeyboardSceneWrapper";
import { ScrollText } from "@/components/ui/ScrollText";
import { PartDescriptions } from "@/components/ui/PartDescriptions";
import { Navbar } from "@/components/ui/Navbar";
import { MadeBy } from "@/components/ui/MadeBy";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Handle wheel events anywhere on the page and forward to scroll container
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;

      // If scrolling over the scroll container, let it handle naturally
      if (scrollContainer.contains(target)) {
        return;
      }

      // If scrolling over the 3D scene or anywhere else, forward to container
      e.preventDefault();
      e.stopPropagation();

      // Calculate scroll amount
      const scrollAmount = e.deltaY;

      // Apply scroll to container
      scrollContainer.scrollTop += scrollAmount;
    };

    // Handle touch events on mobile to prevent body scrolling
    // Only allow scrolling within the scroll container
    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Always allow touch events on interactive elements (links, buttons)
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        return;
      }

      // Store initial touch position
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isScrolling = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Always allow touch events on interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        return;
      }

      // If touch is within scroll container, allow natural scrolling
      if (scrollContainer.contains(target)) {
        // Let the scroll container handle it naturally
        return;
      }

      // For touches outside scroll container (like on 3D scene), prevent default
      // This prevents body scrolling while keeping 3D scene interactions
      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = Math.abs(touchY - touchStartY);
        const deltaX = Math.abs(touchX - touchStartX);

        // Only prevent if it's a vertical scroll gesture
        if (deltaY > deltaX && deltaY > 5) {
          e.preventDefault();
          
          // Forward scroll to container if it's a scroll gesture
          if (!isScrolling) {
            isScrolling = true;
          }
          
          const scrollAmount = touchY - touchStartY;
          scrollContainer.scrollTop -= scrollAmount * 0.8;
          touchStartY = touchY;
        }
      }
    };

    // Add event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-slate-50 via-gray-50 to-zinc-100">
      <Navbar />
      <MadeBy />
      {/* Split Layout: Left Content, Right 3D Scene */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Side: Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="w-full lg:w-2/5 overflow-y-auto scroll-container mt-20 md:mt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-linear-to-b relative z-20 backdrop-blur-sm"
        >
          {/* Section 1: Hero */}
          <section className="section-1 min-h-screen  flex md:items-center justify-start md:px-12 px-5">
            <ScrollText
              section={1}
              title="Mechanical Excellence"
              description="Experience precision engineering in every keystroke"
              className="text-left items-start"
            />
          </section>

          {/* Section 2: Keys Focus */}
          <section className="section-2 min-h-screen  flex md:items-center justify-start md:px-12 px-5">
            <ScrollText
              section={2}
              title="Premium Keycaps"
              description="Individually crafted for optimal feel and durability"
              className="text-left items-start"
            />
          </section>

          {/* Section 3: Internal Layout - Exploded Start */}
          <section className="section-3 min-h-screen  flex flex-col justify-center md:px-12 px-5 gap-12">
            <ScrollText
              section={3}
              title="Internal Architecture"
              description="Discover the intricate layers beneath the surface"
              className="text-left items-start"
            />
            <PartDescriptions
              parts={[
                {
                  label: "Keycaps",
                  description: "Premium double-shot PBT keycaps with custom legends for durability and clarity",
                },
                {
                  label: "Switch Plate",
                  description: "Rigid aluminum plate providing structural integrity and consistent key feel",
                },
                {
                  label: "PCB Base",
                  description: "Advanced circuit board with RGB backlighting and hot-swappable switch support",
                },
              ]}
              className="mt-8"
            />
          </section>

          {/* Section 4: Fully Exploded */}
          <section className="section-4 min-h-screen  flex md:items-center justify-start md:px-12 px-5">
            <ScrollText
              section={4}
              title="Backlit Keyboard"
              description="Illuminated keys for enhanced visibility and ambiance"
              className="text-left items-start"
            />
          </section>

          {/* Section 5: Reassemble / Finish */}
          <section className="section-5 min-h-screen  flex md:items-center justify-start md:px-12 px-5">
            <ScrollText
              section={5}
              title="Complete. Refined."
              description="Where form meets function in perfect balance"
              className="text-left items-start"
            />
          </section>
        </div>

        {/* Right Side: Fixed 3D Scene - stays visible during scroll */}
        <div className="lg:w-3/5 w-full fixed z-30 right-0 top-0 ">
          <KeyboardSceneWrapper />
        </div>
      </div>
    </div>
  );
}
