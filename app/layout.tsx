import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import AdSense from "@/components/AdSense";

export const metadata: Metadata = {
  title: "Tapper dude",
  description: "Try it out!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pId = process.env.ADSENSE_PID as string;
  return (
    <html lang="en">
      <head>
        <AdSense pId="ca-pub-7071713894070581" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
