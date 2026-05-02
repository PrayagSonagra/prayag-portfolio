import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./_components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prayag Sonagra — Full Stack Engineer & Visual Logic Architect",
  description:
    "Full Stack Engineer specializing in real-time systems, WhatsApp CRM, AI-powered applications, and visual builder tools. Crafting pixel-perfect UIs backed by robust backend logic.",
  keywords: [
    "Full Stack Engineer",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Socket.io",
    "AI",
    "Visual Builder",
  ],
  authors: [{ name: "Prayag Sonagra" }],
  openGraph: {
    title: "Prayag Sonagra — Full Stack Engineer",
    description:
      "Building real-time systems, AI products, and visual builder tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased"
        cz-shortcut-listen="true"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
