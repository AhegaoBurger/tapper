// components/ClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const MobileClicker = dynamic(() => import("@/components/MobileTapper"), {
  ssr: false,
  loading: () => <div>Loading tapper...</div>,
});
const Leaderboard = dynamic(() => import("@/components/Leaderboard"), {
  ssr: false,
  loading: () => <div>Loading leaderboard...</div>,
});
import TopBar from "@/components/TopBar";
import AdBanner from "@/components/adsense/AdBanner";

import { useState } from "react";

export default function ClientWrapper() {
  const [score, setScore] = useState(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950">
      <div className="absolute inset-0 bg-[url('/swamp-texture.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <TopBar />
      <div className="flex flex-col items-center justify-center space-y-8 p-4">
        <MobileClicker />
        <Leaderboard />
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="4777889819"
        />
      </div>
    </div>
  );
}
