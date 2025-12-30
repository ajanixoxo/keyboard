"use client";

export function MadeBy() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://adeoluwagbenro.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
        style={{ fontFamily: 'var(--font-audiowide)' }}
      >
        Made by <span className="font-semibold">Adeoluwa.dev</span>
      </a>
    </div>
  );
}

