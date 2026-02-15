import type { Metadata } from "next";
import { createMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd()),
          }}
        />
      </head>
      <body className="bg-surface-bg text-text-primary font-heading antialiased">
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
