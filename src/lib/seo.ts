import type { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rifcmarketing.com";
export const SITE_NAME = "R IF C Marketing";
export const DEFAULT_DESCRIPTION =
  "R IF C este primul framework de marketing care demonstreaz\u0103 matematic c\u0103 Forma este un Multiplicator exponen\u021bial. R + (I \u00d7 F) = C. M\u0103soar\u0103-\u021bi Claritatea marketingului.";

/** Fetch SEO overrides from DB and return Metadata for a given path.
 *  Fetches both RO and EN overrides — uses RO for primary metadata
 *  and generates alternates.languages for better multilingual indexing.
 */
export async function generateSeoMetadata(pagePath: string): Promise<Metadata> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { data: rows } = await supabase
      .from("seo_overrides")
      .select("meta_title, meta_description, og_image_url, locale")
      .eq("page_path", pagePath);

    const ro = rows?.find((r: { locale?: string }) => !r.locale || r.locale === "ro");
    const en = rows?.find((r: { locale?: string }) => r.locale === "en");

    if (ro || en) {
      const primary = ro || en;
      const url = `${SITE_URL}${pagePath}`;
      const alternateLanguages: Record<string, string> = { "x-default": url };
      if (ro) alternateLanguages["ro"] = url;
      if (en) alternateLanguages["en"] = url;

      return createMetadata({
        path: pagePath,
        ...(primary!.meta_title && { title: primary!.meta_title }),
        ...(primary!.meta_description && { description: primary!.meta_description }),
        ...(primary!.og_image_url && {
          openGraph: { images: [{ url: primary!.og_image_url, width: 1200, height: 630, alt: SITE_NAME }] },
          twitter: { images: [primary!.og_image_url] },
        }),
        alternates: {
          canonical: url,
          languages: alternateLanguages,
        },
      });
    }
  } catch {
    // fallback to defaults
  }

  return createMetadata({ path: pagePath });
}

export function createMetadata(overrides: Partial<Metadata> & { path?: string } = {}): Metadata {
  const { path = "", ...rest } = overrides;
  const url = `${SITE_URL}${path}`;
  const title = rest.title || `${SITE_NAME} \u2014 Matematica Emo\u021bional\u0103 a Marketingului`;
  const description = (rest.description as string) || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "ro": url,
        "en": url,
      },
    },
    openGraph: {
      title: title as string,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "ro_RO",
      images: [
        {
          url: `${SITE_URL}/images/og-default.png`,
          width: 1200,
          height: 630,
          alt: "R IF C Marketing Protocol",
        },
      ],
      ...(rest.openGraph || {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title as string,
      description,
      images: [`${SITE_URL}/images/og-default.png`],
      ...(rest.twitter || {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...rest,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CONTINUUM GRUP",
    url: SITE_URL,
    founder: {
      "@type": "Person",
      name: "Dumitru Talmazan",
      jobTitle: "Fondator & Strateg de Marketing",
    },
    description: DEFAULT_DESCRIPTION,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author || "Dumitru Talmazan",
    },
    publisher: {
      "@type": "Organization",
      name: "CONTINUUM GRUP",
    },
    image: article.image || `${SITE_URL}/images/og-default.png`,
  };
}

export function calculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "R IF C Calculator",
    url: `${SITE_URL}/calculator`,
    description:
      "Calculeaz\u0103 scorul de Claritate al marketingului t\u0103u folosind formula R IF C: R + (I \u00d7 F) = C. Diagnosticheaz\u0103 variabilele slabe \u0219i prime\u0219te recomand\u0103ri ac\u021bionabile.",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}
