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

export default function ClientWrapper() {
  return (
    <>
      <MobileClicker />
      <Leaderboard />
    </>
  );
}
