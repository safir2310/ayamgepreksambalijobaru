import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih!",
  description: "Pesan makanan online di AYAM GEPREK SAMBAL IJO. Ayam geprek, ayam bakar, dan berbagai menu lezat lainnya.",
  keywords: ["ayam geprek", "sambal ijo", "makanan pedas", "pesanan online", "AYAM GEPREK SAMBAL IJO"],
  authors: [{ name: "AYAM GEPREK SAMBAL IJO" }],
  openGraph: {
    title: "AYAM GEPREK SAMBAL IJO",
    description: "Pesan makanan online - Pedasnya Bikin Nagih!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
