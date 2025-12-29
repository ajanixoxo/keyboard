"use client";

import { KeyboardScene } from "@/components/three/KeyboardScene";
import { ScrollText } from "@/components/ui/ScrollText";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Fixed 3D Scene */}
      <KeyboardScene />

      {/* Scrollable Content Container */}
      <div className="scroll-container relative z-10">
        {/* Section 1: Hero */}
        <section className="section-1 h-screen flex items-center justify-center">
          <ScrollText
            section={1}
            title="Mechanical Excellence"
            description="Experience precision engineering in every keystroke"
          />
        </section>

        {/* Section 2: Keys Focus */}
        <section className="section-2 h-screen flex items-center justify-center">
          <ScrollText
            section={2}
            title="Premium Keycaps"
            description="Individually crafted for optimal feel and durability"
          />
        </section>

        {/* Section 3: Internal Layout - Exploded Start */}
        <section className="section-3 h-screen flex items-center justify-center">
          <ScrollText
            section={3}
            title="Internal Architecture"
            description="Discover the intricate layers beneath the surface"
          />
        </section>

        {/* Section 4: Fully Exploded */}
        <section className="section-4 h-screen flex items-center justify-center">
          <ScrollText
            section={4}
            title="Every Component Matters"
            description="Precision-engineered parts working in perfect harmony"
          />
        </section>

        {/* Section 5: Reassemble / Finish */}
        <section className="section-5 h-screen flex items-center justify-center">
          <ScrollText
            section={5}
            title="Complete. Refined."
            description="Where form meets function in perfect balance"
          />
        </section>
      </div>
    </div>
  );
}
