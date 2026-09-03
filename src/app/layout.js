import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "QRAFT — QR Codes, Redesigned",
  description:
    "Create branded, dynamic QR experiences that look incredible, work everywhere, and give you the data to prove they work. The premium QR design, deployment, management and intelligence platform.",
  keywords: [
    "QR code generator",
    "QR code design",
    "dynamic QR codes",
    "QR analytics",
    "branded QR codes",
    "QR management",
  ],
  openGraph: {
    title: "QRAFT — QR Codes, Redesigned",
    description:
      "Create branded, dynamic QR experiences that look incredible, work everywhere, and give you the data to prove they work.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
