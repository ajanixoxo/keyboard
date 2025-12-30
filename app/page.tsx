"use client";

import { KeyboardScene } from "@/components/three/KeyboardScene";
import { ScrollText } from "@/components/ui/ScrollText";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Split Layout: Left Content, Right 3D Scene */}
      <div className="flex h-full">
        {/* Left Side: Scrollable Content */}
        <div className="w-2/5 overflow-y-auto scroll-container [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-linear-to-b from-white/80 to-slate-50/80 backdrop-blur-sm">
          {/* Section 1: Hero */}
          <section className="section-1 min-h-screen flex items-center justify-start px-12">
            <ScrollText
              section={1}
              title="Mechanical Excellence"
              description="Experience precision engineering in every keystroke"
              className="text-left items-start"
            />
          </section>

          {/* Section 2: Keys Focus */}
          <section className="section-2 min-h-screen flex items-center justify-start px-12">
            <ScrollText
              section={2}
              title="Premium Keycaps"
              description="Individually crafted for optimal feel and durability"
              className="text-left items-start"
            />
          </section>

          {/* Section 3: Internal Layout - Exploded Start */}
          <section className="section-3 min-h-screen flex items-center justify-start px-12">
            <ScrollText
              section={3}
              title="Internal Architecture"
              description="Discover the intricate layers beneath the surface"
              className="text-left items-start"
            />
          </section>

          {/* Section 4: Fully Exploded */}
          <section className="section-4 min-h-screen flex items-center justify-start px-12">
            <ScrollText
              section={4}
              title="Backlit Keyboard"
              description="Illuminated keys for enhanced visibility and ambiance"
              className="text-left items-start"
            />
          </section>

          {/* Section 5: Reassemble / Finish */}
          <section className="section-5 min-h-screen flex items-center justify-start px-12">
            <ScrollText
              section={5}
              title="Complete. Refined."
              description="Where form meets function in perfect balance"
              className="text-left items-start"
            />
          </section>
        </div>

        {/* Right Side: Fixed 3D Scene */}
        <div className="w-3/5 fixed right-0 top-0 h-full">
          <KeyboardScene />
        </div>
      </div>
    </div>
  );
}
