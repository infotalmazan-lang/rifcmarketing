import type { Metadata } from "next";
import { generateSeoMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata("/");
}

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
