import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";




export const metadata: Metadata = {
  title: "Asset Managment",
  description: "IT Asset Managment system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Toaster position="top-right" />
      
        {children}
      </body>
    </html>
  );
}
