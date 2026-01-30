import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import StreamVideoProvider from "@/providers/steamClientProvider";
import { Inter } from "next/font/google";


export const metadata: Metadata = {
  title: "YOOM",
  description: "Video Calling App",
  icons:{
    icon:"/icons/logo.svg"
  }
};
const inter = Inter({ subsets: ["latin"] });    
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
    <body className={`${inter.className} bg-[#151825]`}>


      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
     
      </body>
      </ClerkProvider>
    </html>
  );
}
