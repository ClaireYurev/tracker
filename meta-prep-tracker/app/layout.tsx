import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { AuthWrapper } from "@/components/auth-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tech Screen Prep Tracker",
  description: "Daily tracker for Meta interview preparation with client-side persistence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthWrapper>
          {children}
          <OnboardingDialog />
        </AuthWrapper>
      </body>
    </html>
  );
}
