"use client";

export function MadeBy() {
  return (
    <div className="fixed  flex flex-col gap-2 bottom-6 right-6 z-50">
      <a
        href="https://adeoluwagbenro.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        Developed by <span className="font-semibold">Adeoluwa.dev</span>
      </a>
      <a href="https://sketchfab.com/blackcube4"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        3d Model by <span className="font-semibold">Black Cube</span>
      </a>
    </div>
  );
}

