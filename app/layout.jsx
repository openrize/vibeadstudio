import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Vibe Strategist | AI Marketing Strategy & Campaign Generator",
  description:
    "Turn any business website into AI-generated campaign strategy, brand insights, messaging angles, and full-funnel marketing ideas.",
  keywords: [
    "AI marketing strategy",
    "campaign generator",
    "brand intelligence",
    "full-funnel marketing",
    "marketing strategy workspace",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Vibe Strategist | AI Marketing Strategy & Campaign Generator",
    description:
      "Turn any business website into AI-generated campaign strategy, brand insights, messaging angles, and full-funnel marketing ideas.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#f7f8fb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
