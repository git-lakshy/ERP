import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Custom ERP | Enterprise Resource Planning",
    template: "%s | Custom ERP",
  },
  description: "Modular, Multi-tenant ERP Platform for SMEs. Manage inventory, HR, finance, and more with ease.",
  applicationName: "Custom ERP",
  authors: [{ name: "Custom ERP Team" }],
  keywords: ["ERP", "Enterprise Resource Planning", "SME", "Business Management", "Inventory", "HR", "Finance"],
  creator: "Sellable Team",
  publisher: "Sellable Inc.",
  metadataBase: new URL("https://sellable-erp.com"), // Replace with actual domain when known, or use localhost for now implicitly via relative checks if needed, but best to set a base.
  openGraph: {
    title: "Sellable ERP | Enterprise Resource Planning",
    description: "Modular, Multi-tenant ERP Platform for SMEs",
    url: "https://sellable-erp.com",
    siteName: "Sellable ERP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Assuming one exists or will exist, otherwise falls back to defaults if any
        width: 1200,
        height: 630,
        alt: "Sellable ERP Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sellable ERP",
    description: "Modular, Multi-tenant ERP Platform for SMEs",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-icon-precomposed.png",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg", // Assuming this might exist or standard fallback
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
