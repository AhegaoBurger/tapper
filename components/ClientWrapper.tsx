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

import TonConnectButton from "@/components/TonConnect";

export default function ClientWrapper() {
  return (
    <>
      <TonConnectButton />
      <MobileClicker />
      <Leaderboard />
    </>
  );
}
