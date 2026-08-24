import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Algoryx — 3D Asset Creation Platform",
  description: "Create original 3D assets, prepare them for the community, preview them in the browser, and submit them for review.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-200 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
