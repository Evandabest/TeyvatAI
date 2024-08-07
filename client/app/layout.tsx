import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server";
import NavBar from "@/components/Navbar";
import Bottombar from "@/components/Bottombar";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeyvatAI",
  description: "AI for Genshin Impact",
};

export default async function RootLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <body className= {` flex flex-col min-h-screen ${inter.className}`}>
        <NavBar/>
        <main className="flex-grow">{children}</main>
        <Chatbot/>
        <Bottombar/>
      </body>
    </html>
  );
}
