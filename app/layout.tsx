import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

// Load the ABCDiatype font (Regular and Bold only)
const abcdDiatype = localFont({
  src: [
    { path: "./fonts/ABCDiatype-Regular.otf", weight: "400" },
    { path: "./fonts/ABCDiatype-Bold.otf", weight: "700" },
  ],
  variable: "--font-abcd-diatype",
});

// Load the Reckless font (Regular and Medium only)
const reckless = localFont({
  src: [
    { path: "./fonts/RecklessTRIAL-Regular.woff2", weight: "400" },
    { path: "./fonts/RecklessTRIAL-Medium.woff2", weight: "500" },
  ],
  variable: "--font-reckless",
});

export const metadata: Metadata = {
  title: "Research Papers App",
  description: "Ask questions and get answers based on Research Papers",
  openGraph: {
    title: "Research Papers App",
    description: "Ask questions and get answers based on Research Papers",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://demo.exa.ai/research-paper-app/opengraph-image.jpg",
        alt: "Research Papers App"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Papers App",
    description: "Ask questions and get answers based on Research Papers",
    images: ["https://demo.exa.ai/research-paper-app/opengraph-image.jpg"]
  },
  metadataBase: new URL("https://demo.exa.ai/research-paper-app"),
  robots: {
    index: true,
    follow: true
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${abcdDiatype.variable} ${reckless.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}