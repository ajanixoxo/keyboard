"use client";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md ">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-audiowide)' }}>
            NXZT KEYS
          </div>
        </div>
      </div>
    </nav>
  );
}

