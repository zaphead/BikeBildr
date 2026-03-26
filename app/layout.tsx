import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BikeBildr",
  description:
    "Technical build studio for custom bikes and go-karts with seeded parts and physics-driven performance estimates."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

