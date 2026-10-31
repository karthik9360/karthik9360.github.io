import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// One family, two roles: normal width for text, the expanded end of the width axis for display.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "M. Karthik | Full stack developer",
  description:
    "Full stack developer in Chennai building real-time dashboards, APIs and mobile apps for industrial IoT, energy and production monitoring.",
};

export const viewport: Viewport = {
  themeColor: "#0a1022",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden bg-ink font-sans text-ice">
        {children}
      </body>
    </html>
  );
}
