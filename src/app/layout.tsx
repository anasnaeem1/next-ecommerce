import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import Notification from "@/components/Notification";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Urban E-commerce",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  // ✅ Grab search params (Next 13/14 way)

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <Navbar />
          {children}
          <Notification />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
