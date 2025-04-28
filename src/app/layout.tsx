import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { UserContextProvider } from "../../context/UserContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // adjust as needed
});


export const metadata: Metadata = {
  title: "Urban E-commerce",
  description: "A complete e-commerce application with Next.js and Wix",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserContextProvider>
        <html lang="en">
          <body className={montserrat.className}>
            <Navbar />
            {children}
            <Footer />
          </body>
        </html>
      </UserContextProvider>
    </ClerkProvider>
  );
}
