import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import StreamVideoProvider from "@/providers/steamClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video Calling App",
  icons:{
    icon:"/icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
      <body
        className={`${geistSans.variable}  ${geistMono.variable} antialiased bg-dark2`}
      > 
      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
     
      </body>
      </ClerkProvider>
    </html>
  );
}
