import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { createMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-DSRWLHHWHY";

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="bg-surface-bg text-text-primary font-heading antialiased">
        <LanguageProvider>
          <div className="grain" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
