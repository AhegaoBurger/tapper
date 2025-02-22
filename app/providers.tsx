"use client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl =
  process.env.NEXT_PUBLIC_SITE_URL + "/tonconnect-manifest.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
