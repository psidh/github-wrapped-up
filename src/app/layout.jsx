import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const plus = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitHub Profile Reviewer",
  description:
    "A reviewer, roaster, and friend for your GitHub profile and to evaluate your GitHub profile.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black text-white font-sans antialiased`}>
        <Toaster />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
