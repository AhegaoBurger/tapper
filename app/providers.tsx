"use client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = "https://tapper-xi.vercel.app/tonconnect-manifest.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
