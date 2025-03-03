import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cherryClub",
  description: "NCMN 체리동아리",
  keywords: ["체리동아리", "NCMN", "cherryClub", "동아리", "프로그래밍"],
  icons: {
    icon: "/logo_black.png",
  },
  metadataBase: new URL("https://cherryclub.kr"),
  verification: {
    google: "AfbSCOA6OJyn397jAZTPzyYip29W3vZBJa-bNxqD5nI",
  },
  openGraph: {
    title: "체리동아리",
    description: "NCMN 체리동아리",
    url: "https://cherryclub.kr",
    siteName: "cherryClub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "체리동아리",
    description: "NCMN 체리동아리",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cherryclub.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="AfbSCOA6OJyn397jAZTPzyYip29W3vZBJa-bNxqD5nI"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
