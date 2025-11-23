"use client";

import { ReactNode } from "react";
import { SpecProvider } from "../lib/spec/SpecContext";

export function Providers({ children }: { children: ReactNode }) {
  return <SpecProvider>{children}</SpecProvider>;
}
