import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "AI Marketing Studio | AI Campaign Creation & Marketing Automation Platform",
  description:
    "Create campaigns, generate content, automate marketing, and scale growth with AI Marketing Studio. Your AI marketing team — plan, create, and launch campaigns in minutes.",
  keywords: [
    "AI marketing platform",
    "campaign automation",
    "content generation",
    "marketing automation",
    "AI content",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AI Marketing Studio | AI Campaign Creation & Marketing Automation Platform",
    description:
      "Create campaigns, generate content, automate marketing, and scale growth with AI Marketing Studio.",
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
