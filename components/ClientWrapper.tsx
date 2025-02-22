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
import AdBanner from "@/components/adsense/AdBanner";

export default function ClientWrapper() {
  return (
    <>
      <TonConnectButton />
      <MobileClicker />
      <Leaderboard />
      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="4777889819"
      />
    </>
  );
}
