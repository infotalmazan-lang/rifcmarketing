import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rifcmarketing.com";
const SITE_NAME = "R IF C Marketing";
const DEFAULT_DESCRIPTION =
  "R IF C is the first marketing framework that mathematically proves Form is an exponential Multiplier. R + (I \u00d7 F) = C. Measure your marketing Clarity.";

export function createMetadata(overrides: Partial<Metadata> & { path?: string } = {}): Metadata {
  const { path = "", ...rest } = overrides;
  const url = `${SITE_URL}${path}`;
  const title = rest.title || `${SITE_NAME} \u2014 The Emotional Mathematics of Marketing`;
  const description = (rest.description as string) || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title as string,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
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
      jobTitle: "Founder & Marketing Strategist",
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
      "Calculate your marketing Clarity score using the R IF C formula: R + (I \u00d7 F) = C. Diagnose weak variables and get actionable recommendations.",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
