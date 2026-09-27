"use client";

import InsaneLiquidTransition from "@/components/transition/InsaneLiquidTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <InsaneLiquidTransition>{children}</InsaneLiquidTransition>;
}
