import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-card/80 border border-slate-800/60 shadow-xl shadow-black/40 p-6">
      {children}
    </div>
  );
}
