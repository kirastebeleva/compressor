import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Compressor MVP",
  description: "Browser-only image compression MVP",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
