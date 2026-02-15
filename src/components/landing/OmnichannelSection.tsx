"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Sparkles, Calculator } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HeroScore, FormulaDisplay, GradientBorderBlock, WatermarkNumber, getScoreColor, getScoreZone } from "@/components/ui/V2Elements";

/* ─── RIFC Colors ──────────────────────────────────────────── */
const COLORS = { r: "#DC2626", i: "#2563EB", f: "#D97706", c: "#059669" };

/* ─── Lucide-style SVG mini icons (inline, no emoji) ──────── */
function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  );
}
function IconPlus() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  );
}
function IconX() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  );
}
function IconAlertTriangle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  );
}
function IconLayers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  );
}

/* ─── Channel Zone Data (structural, not translatable) ────── */
interface ZoneData {
  label: string;
  preview: string;
  title: string;
  items: string[];
  fail: string;
}

interface ChannelData {
  name: string;
  category: string;
  default?: boolean;
  zones: {
    r: ZoneData;
    i: ZoneData;
    f: ZoneData;
    c: ZoneData;
  };
}

const ALL_CHANNELS: Record<string, ChannelData> = {
  website: {
    name: "Website / Landing Page",
    category: "Digital",
    default: true,
    zones: {
      r: {
        label: "R — RELEVANCE",
        preview: "URL matches search intent, aligned traffic source",
        title: "R — Who reaches the site?",
        items: [
          "URL matches what they searched for",
          "Traffic source is aligned (Google, ad, referral)",
          "Headline confirms: you\u2019re in the right place",
          "Language, location, context — correct",
          "Visitor self-identifies in 2 seconds",
        ],
        fail: "R < 3: Bounce rate 90%. A beautiful site can\u2019t save irrelevance.",
      },
      i: {
        label: "I — INTEREST",
        preview: "Why 73% of campaigns fail even when they look good?",
        title: "I — What makes them stay?",
        items: [
          "Headline promises a clear benefit",
          "Subheadline creates curiosity",
          "Social proof (testimonials, numbers)",
          "Unique Value Proposition visible",
          "Open loop that draws deeper",
        ],
        fail: "I < 3: Scans 5 sec, finds nothing, closes tab.",
      },
      f: {
        label: "F — FORM",
        preview: "Layout, CTA, font, white space, responsive, speed",
        title: "F — Does design amplify the message?",
        items: [
          "Clear visual hierarchy (H1 > H2 > body)",
          "Sufficient white space — not cluttered",
          "CTA visible above the fold",
          "Readable font, good contrast, responsive",
          "Loading speed < 3 seconds",
        ],
        fail: "F < 3: Good content nobody reads. Wall of text.",
      },
      c: {
        label: "C = CLARITY",
        preview: "Visitor understands exactly who you are and what to do",
        title: "C — The clarity test",
        items: [
          "5-second test: a stranger understands the page",
          "One main message",
          "Single, obvious CTA",
          "Zero confusion",
          "Next step is clear without thinking",
        ],
        fail: "Low C = visits without conversions. Wasted traffic.",
      },
    },
  },
  social: {
    name: "Social Media (organic)",
    category: "Digital",
    default: true,
    zones: {
      r: {
        label: "R — AUDIENCE",
        preview: "Relevant followers, algorithm, timing, clear niche",
        title: "R — Who sees the post?",
        items: ["Followers = relevant audience?", "Algorithm shows it to the right people?", "Profile confirms authority?", "Optimal timing?", "Clear niche from the first 2 words?"],
        fail: "FAIL: Posting marketing but audience is gamers.",
      },
      i: {
        label: "I — HOOK + CONTENT",
        preview: "First line stops the scroll, concrete data, curiosity",
        title: "I — What stops the scroll?",
        items: ["Hook (first line) stops the scroll?", "Open loop: 73% have the same problem", "Concrete data: numbers, percentages", "Curiosity: I discovered a pattern", "Real promise, not clickbait"],
        fail: "FAIL: \u201cI wrote a new article\u201d — zero engagement.",
      },
      f: {
        label: "F — VISUAL FORMAT",
        preview: "Image, carousel, video, text formatting, hashtags",
        title: "F — How does the post look?",
        items: ["Image stops the scroll", "Text formatted with spacing", "Bold on key words", "Carousel vs image vs video", "Relevant hashtags"],
        fail: "FAIL: Long text without formatting, no image.",
      },
      c: {
        label: "C = ENGAGEMENT",
        preview: "Likes, comments, shares, saves, DMs",
        title: "C — What does engagement mean?",
        items: ["Like = emotional resonance", "Comment = interest + opinion", "Share = someone else needs to see this", "Save = I want to come back", "DM = I want to learn more"],
        fail: "Supreme = high share rate.",
      },
    },
  },
  email: {
    name: "Email Marketing",
    category: "Digital",
    default: true,
    zones: {
      r: {
        label: "R — SEGMENTATION",
        preview: "Segmented list, optimized timing, known sender",
        title: "R — Who are you sending to?",
        items: ["List segmented by interest?", "Timing optimized per segment?", "Recognized sender name?", "Not blasting entire list"],
        fail: "FAIL: Email blast to 50K unsegmented.",
      },
      i: {
        label: "I — SUBJECT LINE",
        preview: "Subject line with curiosity + complementary preview text",
        title: "I — Do they open the email?",
        items: ["Subject creates curiosity?", "Preview text completes the hook?", "Not clickbait", "Personalized with context"],
        fail: "FAIL: Newsletter #47.",
      },
      f: {
        label: "F — BODY FORMAT",
        preview: "Short paragraphs, central CTA, mobile-friendly",
        title: "F — Scannable body?",
        items: ["Short paragraphs", "Single main CTA", "Mobile-friendly", "Personalization [Name]", "Visual hierarchy"],
        fail: "FAIL: Wall of text, 5 links, no hierarchy.",
      },
      c: {
        label: "C = METRICS",
        preview: "Open rate, click rate, reply rate, unsub rate",
        title: "C — What do metrics say?",
        items: ["Open rate = R works", "Click rate = IxF works", "Reply = Supreme Clarity", "Low unsub = good segmentation"],
        fail: "Open 40%+ and Click 10%+ = Supreme.",
      },
    },
  },
  paid_ads: {
    name: "Paid Ads (Google/Meta)",
    category: "Digital",
    default: true,
    zones: {
      r: {
        label: "R — TARGETING",
        preview: "Precise audience, lookalike, keyword match, retargeting",
        title: "R — Who sees the ad?",
        items: ["Precise targeting = high R", "Lookalike audiences", "Keyword match type", "Retargeting = maximum R"],
        fail: "FAIL: Broad targeting to everyone.",
      },
      i: {
        label: "I — COPY + OFFER",
        preview: "Clear pain/solution, concrete offer, numbers",
        title: "I — Offer in 2 seconds",
        items: ["Pain + solution in headline", "Free offer = zero barrier", "Concrete numbers", "Subtle urgency"],
        fail: "FAIL: Discover our innovative solution.",
      },
      f: {
        label: "F — CREATIVE",
        preview: "Scroll-stopping visual, contrast, CTA on image",
        title: "F — Does creative stop the scroll?",
        items: ["Scroll-stopping visual", "Strong contrast, large text", "Consistent branding", "Clear CTA on image"],
        fail: "FAIL: Generic stock photo.",
      },
      c: {
        label: "C = CONVERSIONS",
        preview: "CTR, CPC, conversion rate, ROAS",
        title: "C — What do numbers say?",
        items: ["High CTR = IxF works", "High conv = high C", "Low CPC = precise R", "Positive ROAS = everything works"],
        fail: "CTR 3%+ and Conv 5%+ = Supreme.",
      },
    },
  },
  seo_blog: {
    name: "SEO / Blog / Content",
    category: "Digital",
    zones: {
      r: { label: "R — INTENT MATCH", preview: "Keyword matches search intent", title: "R — Does the article answer what they\u2019re searching?", items: ["Correct keyword research", "Search intent match (informational/transactional)", "Optimized title tag", "Clean and descriptive URL"], fail: "FAIL: Article about X when user searches Y." },
      i: { label: "I — VALUABLE CONTENT", preview: "Unique insights, original data, complete answer", title: "I — Why read the whole article?", items: ["Insights not found elsewhere", "Original data, not copied", "Complete answer to the question", "Structure that guides reading"], fail: "FAIL: Generic summary from 5 other sites." },
      f: { label: "F — STRUCTURE + UX", preview: "Scannable H2/H3, images, internal links, speed", title: "F — Reading experience", items: ["Clear and scannable H2/H3", "Relevant images, not decorative", "Logical internal links", "Optimal page speed", "Schema markup"], fail: "FAIL: Continuous text without headings, 15 sec load." },
      c: { label: "C = RANKING + DWELL TIME", preview: "Google position, time on page, bounce rate", title: "C — Google confirms clarity", items: ["Top 3 = maximum relevance", "High dwell time = valuable content", "Low bounce rate = good match", "Featured snippet = Supreme"], fail: "Low C = page 3+ on Google." },
    },
  },
  sms_whatsapp: {
    name: "SMS / WhatsApp",
    category: "Digital",
    zones: {
      r: { label: "R — PERMISSION + CONTEXT", preview: "Valid opt-in, right moment, correct segment", title: "R — Does it make sense to send now?", items: ["Explicit opt-in obtained", "Relevant timing (not 3 AM)", "Behavior-segmented", "Context from previous conversation"], fail: "FAIL: Spam SMS at 3 AM." },
      i: { label: "I — CONCISE MESSAGE", preview: "Clear benefit in 160 characters, real urgency", title: "I — What do you transmit in 160 chars?", items: ["Clear immediate benefit", "Real urgency, not fabricated", "Personalized with name/context", "One thing to remember"], fail: "FAIL: You won a prize! Click here..." },
      f: { label: "F — DIRECT FORMAT", preview: "Short link, strategic emoji, unique CTA", title: "F — Formatted for mobile", items: ["Short link with tracking", "Strategic emoji (max 1-2)", "Single clear CTA", "Length under 160 chars"], fail: "FAIL: 500-character message with 3 links." },
      c: { label: "C = IMMEDIATE ACTION", preview: "Open rate, click rate, reply rate, opt-out", title: "C — Reaction in minutes", items: ["Open rate 95%+ (native SMS)", "Click rate = IxF works", "Reply = conversation", "Low opt-out = relevance"], fail: "Supreme: reply within first 5 minutes." },
    },
  },
  video: {
    name: "Video (YouTube/TikTok/Reels)",
    category: "Digital",
    zones: {
      r: { label: "R — DISCOVERABILITY", preview: "Thumbnail + title in the right feed", title: "R — Who finds the video?", items: ["SEO/algorithm optimized title", "Click-attracting thumbnail", "Correct tags and categories", "Published when audience is active"], fail: "FAIL: Good video on wrong channel." },
      i: { label: "I — HOOK + CONTENT", preview: "First 3 seconds, retention, value", title: "I — First 3 seconds", items: ["Hook in first 3 seconds", "Open loop that retains", "Real value not padding", "Retention over 50%", "Periodic pattern interrupt"], fail: "FAIL: 30 sec intro with animated logo." },
      f: { label: "F — PRODUCTION", preview: "Image/sound quality, editing, rhythm, subtitles", title: "F — Does production amplify?", items: ["Clear audio (more important than video)", "Rhythmic editing, no dead time", "Subtitles (85% watch muted)", "Relevant B-roll", "Custom thumbnail"], fail: "FAIL: Bad audio, no subtitles, monotone." },
      c: { label: "C = WATCH TIME + ACTION", preview: "Retention, likes, subscribes, comments", title: "C — How long did they watch?", items: ["High average view duration", "Like/dislike ratio", "Subscribe after viewing", "Comments with questions", "Share = Supreme"], fail: "Supreme: people watch until the end." },
    },
  },
  podcast: {
    name: "Podcast / Audio",
    category: "Digital",
    zones: {
      r: { label: "R — NICHE AUDIENCE", preview: "Right platform, correct category, relevant guest", title: "R — Who listens?", items: ["Distributed on right platforms", "Correct category and tags", "Guest relevant to audience", "Episode title = searchable"], fail: "FAIL: Marketing podcast in Comedy category." },
      i: { label: "I — CONVERSATION", preview: "New insights, personal stories, aha moments", title: "I — Why listen to the end?", items: ["Unique insights from experience", "Concrete personal stories", "Surprising aha moments", "Clear structure: intro-core-takeaway"], fail: "FAIL: Generic monologue without substance." },
      f: { label: "F — AUDIO QUALITY", preview: "Clear sound, editing, intro/outro, show notes", title: "F — Listening experience", items: ["Professional audio, no noise", "Editing: no long pauses", "Branded intro/outro", "Show notes with timestamps", "Appropriate duration (not 3h)"], fail: "FAIL: Background noise, echoes, no editing." },
      c: { label: "C = LOYALTY", preview: "Completion rate, subscribers, reviews, referrals", title: "C — Do they come back weekly?", items: ["High completion rate", "Subscriber growth", "5-star reviews", "People recommend to others", "Social posts about episodes"], fail: "Supreme: audience waits for each episode." },
    },
  },
  influencer: {
    name: "Influencer Marketing",
    category: "Digital",
    zones: {
      r: { label: "R — INFLUENCER-BRAND FIT", preview: "Influencer\u2019s audience = your customer", title: "R — Is the influencer right?", items: ["Their audience = your target", "Values align", "Real engagement rate (not fake)", "Specific niche, not generalist"], fail: "FAIL: Fashion influencer promoting B2B SaaS." },
      i: { label: "I — AUTHENTIC INTEGRATION", preview: "Natural story, real benefit, personal experience", title: "I — Does it feel authentic?", items: ["Naturally integrated in content", "Real personal experience", "Specific benefit mentioned", "Doesn\u2019t sound like read brief"], fail: "FAIL: Reading the brief word-for-word." },
      f: { label: "F — NATIVE FORMAT", preview: "Influencer\u2019s style preserved, right platform", title: "F — Respects their style?", items: ["In influencer\u2019s natural style", "Platform-native format", "Subtly integrated CTA", "Story vs Post vs Reel \u2014 chosen correctly"], fail: "FAIL: Stock image with overlaid text." },
      c: { label: "C = TRUST TRANSFER", preview: "Engagement, saves, link clicks, discount code", title: "C — Did audience act?", items: ["Engagement above their average", "Link clicks / swipe ups", "Discount code used", "New followers for brand", "Comments: I want one too!"], fail: "Supreme: audience buys from trust." },
    },
  },
  webinar: {
    name: "Webinar / Live Stream",
    category: "Digital",
    zones: {
      r: { label: "R — RELEVANT SIGNUPS", preview: "Targeted promotion, clear title, right audience", title: "R — Who signs up?", items: ["Clear landing page", "Promotion to right audience", "Title promises specific value", "Convenient date/time"], fail: "FAIL: Generic webinar promoted to entire list." },
      i: { label: "I — LIVE CONTENT", preview: "Actionable value, interaction, Q&A, demo", title: "I — Why do they stay live?", items: ["Immediately actionable value", "Audience interaction", "Live demo or case study", "Real Q&A, not prepared", "Element of exclusivity"], fail: "FAIL: PowerPoint read for 60 minutes." },
      f: { label: "F — LIVE PRODUCTION", preview: "Clear audio/video, professional slides, moderated chat", title: "F — Live experience", items: ["Stable clear audio/video", "Visual slides (not text)", "Active moderated chat", "Recording available after", "Easy-to-access platform"], fail: "FAIL: Technical problems, wrong screen shared." },
      c: { label: "C = LIVE CONVERSION", preview: "Attendance rate, engagement, CTA acceptance", title: "C — What do they do after?", items: ["Attendance vs signups > 40%", "Stay until the end", "Questions in chat", "Click on final offer", "Follow-up email opened"], fail: "Supreme: they ask for the offer before you present it." },
    },
  },
  marketplace: {
    name: "Marketplace (Amazon/eMag)",
    category: "Digital",
    zones: {
      r: { label: "R — SEARCH + CATEGORY", preview: "Right keywords, correct category, optimized listing", title: "R — Do they find you when searching?", items: ["Keywords in title and description", "Correct category", "Complete backend keywords", "Competitive price in search"], fail: "FAIL: Product listed in wrong category." },
      i: { label: "I — COMPLETE LISTING", preview: "Clear benefits, reviews, A+ content, comparison", title: "I — Why choose your product?", items: ["Benefits > features", "Positive and plentiful reviews", "A+ content with images", "Answers to questions", "Favorable comparison"], fail: "FAIL: Technical description, zero reviews." },
      f: { label: "F — IMAGES + FORMAT", preview: "7+ HD images, infographics, lifestyle, video", title: "F — Does listing look professional?", items: ["7+ professional HD images", "First image = hero shot", "Infographic with benefits", "Lifestyle images", "Short product video"], fail: "FAIL: Single photo on white background." },
      c: { label: "C = CONVERSION + RANKING", preview: "Conversion rate, BSR, reviews, buy box", title: "C — Do they buy?", items: ["Conversion rate vs category", "Best Seller Rank", "Review velocity", "Buy box won", "Repeat purchases"], fail: "Supreme: top 3 in category." },
    },
  },
  tv: {
    name: "TV / Commercial",
    category: "Traditional",
    zones: {
      r: { label: "R — SLOT + CHANNEL", preview: "Right channel, right time, right show", title: "R — Who sees the spot?", items: ["Channel with target audience", "Right time slot (prime time?)", "During relevant show break", "GRPs on desired segment"], fail: "FAIL: B2B SaaS spot on reality TV." },
      i: { label: "I — SCRIPT + MESSAGE", preview: "Memorable story, emotion, clear benefit in 30s", title: "I — Do they remember the spot?", items: ["Memorable story in 30 sec", "Strong emotion (laughter, surprise)", "Clear benefit, not just branding", "Memorable call to action"], fail: "FAIL: 30 sec of logo and slogan." },
      f: { label: "F — PRODUCTION", preview: "Cinema quality, sound, actors, editing", title: "F — Does it look professional?", items: ["Cinematographic quality", "Professional sound and music", "Convincing actors/voice", "Rhythmic editing, no filler"], fail: "FAIL: Spot filmed with a phone." },
      c: { label: "C = MEMORABILITY", preview: "Brand recall, search lift, conversations", title: "C — Do they talk about the spot?", items: ["Brand recall at 24h", "Search lift on brand name", "Organic social buzz", "People imitate/quote it", "Measurable sales lift"], fail: "Supreme: the spot goes viral organically." },
    },
  },
  radio: {
    name: "Radio",
    category: "Traditional",
    zones: {
      r: { label: "R — STATION + TIME", preview: "Station with target audience, drive time", title: "R — Who hears the spot?", items: ["Station with right demographics", "Drive time vs off-peak", "Compatible programming", "Sufficient frequency"], fail: "FAIL: B2B spot on pop music radio." },
      i: { label: "I — AUDIO SCRIPT", preview: "Audio hook, clear benefit, memorable number/site", title: "I — What do they remember from 20 sec?", items: ["Audio hook in first 3 sec", "Single clear benefit", "Memorable number or site", "Strategic repetition"], fail: "FAIL: 20 sec of technical information." },
      f: { label: "F — AUDIO PRODUCTION", preview: "Professional voice, jingle, sound design", title: "F — Does it sound professional?", items: ["Voice matching the brand", "Memorable jingle", "Clear sound design", "Professional audio mix"], fail: "FAIL: Owner reads the text himself." },
      c: { label: "C = POST-LISTEN ACTION", preview: "Calls, website visits, code mentions", title: "C — Do they call after hearing?", items: ["Calls mentioning radio", "Website traffic spike", "Promo code used", "Increased brand recognition"], fail: "Supreme: people hum the jingle." },
    },
  },
  print: {
    name: "Print (Magazine/Newspaper)",
    category: "Traditional",
    zones: {
      r: { label: "R — PUBLICATION + POSITION", preview: "Magazine read by target, right page", title: "R — Who sees the ad?", items: ["Publication read by target", "Position in magazine (cover?)", "Relevant themed edition", "Verified circulation"], fail: "FAIL: Tech ad in gardening magazine." },
      i: { label: "I — HEADLINE + COPY", preview: "Headline that stops browsing, clear offer", title: "I — Do they stop browsing?", items: ["Visually strong headline", "Concise copy with benefit", "Specific offer", "Visible social proof"], fail: "FAIL: Just a big logo and slogan." },
      f: { label: "F — PRINT DESIGN", preview: "Layout, CMYK colors, font size, QR code", title: "F — Does it look impeccable printed?", items: ["Balanced, airy layout", "Correct CMYK colors", "Readable font (min 9pt body)", "Functional QR code", "HD resolution image"], fail: "FAIL: Small text, dirty colors, cluttered layout." },
      c: { label: "C = MEASURABLE RESPONSE", preview: "QR scans, unique URL visits, coupon redemption", title: "C — Did they act?", items: ["QR code scans", "Unique URL visits", "Coupon redemptions", "Phone calls with mention", "Brand lift survey"], fail: "Supreme: they keep the page and show others." },
    },
  },
  ooh: {
    name: "OOH (Billboard/Banner)",
    category: "Traditional",
    zones: {
      r: { label: "R — PHYSICAL LOCATION", preview: "Location with target traffic, visibility", title: "R — Do the right people pass by?", items: ["Location with right demographic traffic", "Good visibility (angle, distance)", "No visual obstacles", "Sufficient contract duration"], fail: "FAIL: Billboard on the wrong road." },
      i: { label: "I — MESSAGE IN 3 SEC", preview: "Max 7 words, instant benefit", title: "I — Do you understand from the car?", items: ["Maximum 7 words", "Single message/benefit", "Short memorable URL/number", "Emotion or visual surprise"], fail: "FAIL: 30 words on a billboard." },
      f: { label: "F — OUTDOOR DESIGN", preview: "Maximum contrast, huge font, simple image", title: "F — Is it visible from 50m?", items: ["Maximum contrast (background vs text)", "Huge font, readable at distance", "Simple image, one focal point", "Brand visible but not dominant"], fail: "FAIL: Brochure design on billboard." },
      c: { label: "C = AWARENESS + RECALL", preview: "Brand recall, traffic lift, search volume", title: "C — Did they remember?", items: ["Brand recall in the area", "Traffic lift at location", "Increased search volume", "Social media mentions", "People photograph the billboard"], fail: "Supreme: it becomes a local landmark." },
    },
  },
  events: {
    name: "Events / Expo / Conference",
    category: "Traditional",
    zones: {
      r: { label: "R — RIGHT EVENT", preview: "Conference with your target attendees", title: "R — Are you at the right event?", items: ["Event attracts your target", "Stand/slot in relevant area", "Pre-qualified attendees", "Good timing (no competing events)"], fail: "FAIL: SaaS stand at a wedding fair." },
      i: { label: "I — STAND EXPERIENCE", preview: "Live demo, valuable giveaway, conversation", title: "I — Why do they stop?", items: ["Interactive live demo", "Giveaway with real value", "Conversation not pitch", "Exclusivity: only at event"], fail: "FAIL: Brochures on table, nobody at stand." },
      f: { label: "F — STAND DESIGN + MATERIALS", preview: "Visible stand, branded, quality materials", title: "F — Does the stand attract?", items: ["Stand visible from distance", "Coherent attractive branding", "Quality printed materials", "Working screens/demos"], fail: "FAIL: Generic banner and empty table." },
      c: { label: "C = LEADS + RELATIONSHIPS", preview: "Leads collected, meetings scheduled, follow-up", title: "C — Did you leave with contacts?", items: ["Number of leads collected", "Meetings scheduled on-spot", "Business cards exchanged", "Follow-up rate after event", "Deals closed from event"], fail: "Supreme: they schedule meeting before leaving." },
    },
  },
  direct_mail: {
    name: "Direct Mail (Post)",
    category: "Traditional",
    zones: {
      r: { label: "R — LIST + ADDRESS", preview: "Clean list, correct address, precise segment", title: "R — Does it reach the right person?", items: ["Updated and cleaned list", "Segmented by relevant criteria", "Verified addresses", "Not sending to entire database"], fail: "FAIL: Mass mailing to old addresses." },
      i: { label: "I — PHYSICAL OFFER", preview: "Exclusive offer, tangible benefit, urgency", title: "I — Do they open the envelope?", items: ["Offer exclusive to mail only", "Tangible and clear benefit", "Real urgency (deadline)", "Personalization with name"], fail: "FAIL: Generic brochure without offer." },
      f: { label: "F — DESIGN + MATERIAL", preview: "Quality paper, premium design, clear CTA", title: "F — Do they feel quality?", items: ["Quality paper (weight)", "Premium design, not spam look", "Clear CTA (phone, QR, URL)", "Envelope that stands out"], fail: "FAIL: Cheap flyer that looks like spam." },
      c: { label: "C = DIRECT RESPONSE", preview: "Response rate, QR scans, calls, orders", title: "C — Do they respond?", items: ["Response rate (2-5% = good)", "QR code scans", "Phone calls received", "Orders with unique code", "ROI per piece"], fail: "Supreme: they keep the material on their desk." },
    },
  },
  pr: {
    name: "PR / Press Releases",
    category: "Traditional",
    zones: {
      r: { label: "R — JOURNALIST + PUBLICATION", preview: "Journalist covering your niche, news cycle timing", title: "R — Who do you send the release to?", items: ["Journalist covering your industry", "Publication read by target", "Timing with news cycle", "Pre-existing relationship"], fail: "FAIL: Generic release sent to 500 newsrooms." },
      i: { label: "I — ANGLE + STORY", preview: "Unique news angle, exclusive data, human story", title: "I — Is it news or an ad?", items: ["Unique and timely news angle", "Exclusive data or study", "Human story behind it", "Memorable quote included"], fail: "FAIL: Press release = disguised advertisement." },
      f: { label: "F — RELEASE FORMAT", preview: "Inverted pyramid, quote, multimedia kit", title: "F — Can the journalist use it directly?", items: ["Inverted pyramid (essence first)", "Ready-to-publish quote", "Media kit with HD images", "Clear contact for follow-up", "Max 1 page"], fail: "FAIL: 3 pages of corporate speak." },
      c: { label: "C = MEDIA COVERAGE", preview: "Published articles, reach, sentiment, backlinks", title: "C — Did they write about you?", items: ["Number of published articles", "Estimated total reach", "Positive sentiment", "Quality backlinks", "Your quote used directly"], fail: "Supreme: journalist calls you for more." },
    },
  },
  chatbot: {
    name: "Chatbot / Live Chat",
    category: "Digital",
    zones: {
      r: { label: "R — TRIGGER + MOMENT", preview: "Appears when visitor needs it, not random", title: "R — Does it appear at the right time?", items: ["Behavior trigger (exit intent, time)", "On relevant page", "Doesn\u2019t appear every visit", "Contextual message"], fail: "FAIL: Chat pop-up at 2 seconds on homepage." },
      i: { label: "I — USEFUL CONVERSATION", preview: "Relevant answers, guidance, not spam", title: "I — Does it help or annoy?", items: ["Answers the real question", "Guides toward solution", "Consistent personality", "Escalation to human when needed"], fail: "FAIL: Infinite loop of generic answers." },
      f: { label: "F — INTERFACE", preview: "Clean design, fast, mobile-friendly, brand voice", title: "F — Is it easy to use?", items: ["Clean non-intrusive design", "Fast response (< 3 sec)", "Mobile-friendly", "Consistent brand voice"], fail: "FAIL: Ugly widget covering content." },
      c: { label: "C = RESOLUTION", preview: "Resolution rate, satisfaction, conversion", title: "C — Problem solved?", items: ["High resolution rate", "Customer satisfaction", "Conversion from chat", "Low resolution time"], fail: "Supreme: customer says thank you in chat." },
    },
  },
  push: {
    name: "Push Notifications",
    category: "Digital",
    zones: {
      r: { label: "R — PERMISSION + TIMING", preview: "Active opt-in, relevant moment, ok frequency", title: "R — Is it worth disturbing them?", items: ["Active opt-in obtained", "Relevant timing (not at night)", "Reasonable frequency", "Right segment"], fail: "FAIL: 5 pushes per day to everyone." },
      i: { label: "I — SHORT MESSAGE", preview: "Max 50 characters, instant benefit, real urgency", title: "I — Click or dismiss?", items: ["Clear benefit in 50 chars", "Real urgency or novelty", "Behavior-personalized", "Not repetitive"], fail: "FAIL: Don\u2019t forget about us! \u2014 instant dismiss." },
      f: { label: "F — NOTIFICATION FORMAT", preview: "Strategic emoji, image, correct deep link", title: "F — Does it look good on screen?", items: ["Relevant emoji (max 1)", "Image if supported", "Deep link directly to content", "Rich notification when possible"], fail: "FAIL: Truncated text, link to homepage." },
      c: { label: "C = OPEN + ACTION", preview: "Open rate, click-through, retention, opt-out", title: "C — Did they return to app?", items: ["Push open rate (3-10% = good)", "Click-through on CTA", "Retention after push", "Low opt-out rate"], fail: "Supreme: user returns and completes action." },
    },
  },
  affiliate: {
    name: "Affiliate Marketing",
    category: "Digital",
    zones: {
      r: { label: "R — RIGHT AFFILIATE", preview: "Affiliate\u2019s audience = your ideal customer", title: "R — Right affiliate?", items: ["Their audience = your target", "Aligned niche and values", "Real quality traffic", "Commission motivates effort"], fail: "FAIL: Coupon affiliate for premium product." },
      i: { label: "I — OFFER + LANDING", preview: "Attractive offer, optimized landing page", title: "I — Is the click worth it?", items: ["Clear and attractive offer", "Dedicated landing page for affiliates", "Specific benefit mentioned", "Social proof on landing"], fail: "FAIL: Affiliate link to homepage." },
      f: { label: "F — AFFILIATE MATERIALS", preview: "Banners, pre-written copy, correct tracking", title: "F — Do they have what they need?", items: ["Banners in all sizes", "Adaptable pre-written copy", "Working tracking link", "Dashboard with statistics"], fail: "FAIL: Zero materials, just a link." },
      c: { label: "C = SALES + ROI", preview: "Conversions, EPC, revenue, affiliate client LTV", title: "C — Does it generate sales?", items: ["Conversion rate per affiliate", "EPC (earnings per click)", "Total channel revenue", "LTV of clients from affiliate"], fail: "Supreme: affiliate promotes actively without asking." },
    },
  },
  general: {
    name: "General (Any Channel)",
    category: "General",
    zones: {
      r: { label: "R — RELEVANCE", preview: "Does the message reach the right audience?", title: "R — Correct audience?", items: ["Does the channel reach target?", "Is the timing right?", "Is the context relevant?", "Does audience self-identify?"], fail: "R < 3: All effort wasted. Message doesn\u2019t matter if it doesn\u2019t reach the right people." },
      i: { label: "I — INTEREST", preview: "Does content offer value and create curiosity?", title: "I — Why would they care?", items: ["Offers clear insight or benefit?", "Creates curiosity or emotion?", "Has substance, not just form?", "Different from what they\u2019ve seen?"], fail: "I < 3: Audience sees message but doesn\u2019t react. Background noise." },
      f: { label: "F — FORM", preview: "Does presentation amplify or sabotage the message?", title: "F — Does form amplify?", items: ["Format is native to channel?", "Design is professional?", "Scannable/consumable easily?", "CTA is clear and visible?", "Optimized for device?"], fail: "F < 3: Good message presented badly = lost message." },
      c: { label: "C — CLARITY (RESULT)", preview: "Did audience understand exactly what you communicated?", title: "C — Did they understand?", items: ["Message arrived undistorted?", "Audience knows what to do next?", "Desired action happened?", "Can they repeat your message to others?"], fail: "C = R + (IxF). Clarity is the sum of all efforts." },
    },
  },
};

type ZoneKey = "r" | "i" | "f" | "c";

/* ─── COMPONENT ──────────────────────────────────────────────── */
export default function OmnichannelSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultIds = Object.keys(ALL_CHANNELS).filter((k) => ALL_CHANNELS[k].default);
  const [activeIds, setActiveIds] = useState<string[]>([...defaultIds, "general"]);
  const [channel, setChannel] = useState("website");
  const [activeZone, setActiveZone] = useState<ZoneKey | null>(null);
  const [scores, setScores] = useState({ r: 8, i: 7, f: 9 });
  const [showAdd, setShowAdd] = useState(false);

  const c = scores.r + scores.i * scores.f;
  const cLabel = c <= 20 ? t.omnichannel.levelCritical : c <= 50 ? t.omnichannel.levelNoise : c <= 80 ? t.omnichannel.levelMedium : t.omnichannel.levelSupreme;
  const cColor = c <= 20 ? COLORS.r : c <= 50 ? COLORS.f : c <= 80 ? COLORS.i : COLORS.c;

  /* Scroll-triggered fade-in */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const addChannel = (id: string) => {
    if (!activeIds.includes(id)) setActiveIds([...activeIds, id]);
  };
  const addAll = () => {
    setActiveIds(Object.keys(ALL_CHANNELS));
    setShowAdd(false);
  };
  const removeChannel = (id: string) => {
    if (defaultIds.includes(id) || id === "general") return;
    const next = activeIds.filter((x) => x !== id);
    setActiveIds(next);
    if (channel === id) setChannel(next[0]);
  };

  const available = Object.keys(ALL_CHANNELS).filter((k) => !activeIds.includes(k));
  const chData = ALL_CHANNELS[channel];
  const zData = activeZone && chData ? chData.zones[activeZone] : null;

  const categories: Record<string, string[]> = {};
  available.forEach((id) => {
    const cat = ALL_CHANNELS[id].category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(id);
  });

  return (
    <section
      ref={sectionRef}
      id="omnichannel"
      className={`py-[120px] px-6 md:px-10 max-w-content mx-auto relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* V2 Section header */}
      <SectionHeader
        chapter={t.omnichannel.chapter}
        titlePlain={t.omnichannel.titlePlain}
        titleBold={t.omnichannel.titleBold}
        description={t.omnichannel.description}
        watermarkNumber="05"
        watermarkColor="#DC2626"
      />

      {/* Equation header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="font-mono text-[15px] tracking-[2px]">
          <span className="text-rifc-red">R</span>
          <span className="text-text-invisible"> + (</span>
          <span className="text-rifc-blue">I</span>
          <span className="text-text-invisible"> x </span>
          <span className="text-rifc-amber">F</span>
          <span className="text-text-invisible">) = </span>
          <span className="text-rifc-green">C</span>
        </div>
        <span className="font-mono text-[11px] text-text-ghost tracking-[1px]">
          {t.omnichannel.perChannel}
        </span>
      </div>

      {/* Channel tabs */}
      <div className="flex flex-wrap gap-1.5 justify-start mb-2">
        {activeIds.map((id) => (
          <div key={id} className="relative inline-flex">
            <button
              onClick={() => { setChannel(id); setActiveZone(null); }}
              className={`px-3 py-2 rounded font-mono text-[10px] transition-all duration-200 border cursor-pointer ${
                channel === id
                  ? "bg-[rgba(220,38,38,0.08)] border-rifc-red text-rifc-red"
                  : "bg-surface-card border-border-medium text-text-faint hover:text-text-muted hover:border-border-medium"
              }`}
            >
              {ALL_CHANNELS[id].name}
            </button>
            {!defaultIds.includes(id) && id !== "general" && (
              <button
                onClick={(e) => { e.stopPropagation(); removeChannel(id); }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-surface-bg border border-border-medium text-text-ghost flex items-center justify-center cursor-pointer hover:text-rifc-red hover:border-rifc-red transition-colors"
              >
                <IconX />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 items-center mb-10">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] transition-all duration-200 border cursor-pointer ${
            showAdd
              ? "bg-[rgba(5,150,105,0.08)] border-rifc-green text-rifc-green"
              : "bg-surface-card border-border-light text-text-ghost hover:text-text-muted"
          }`}
        >
          <IconPlus /> {t.omnichannel.addChannel}
        </button>
        {available.length > 0 && (
          <button
            onClick={addAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] transition-all duration-200 border border-border-light bg-surface-card text-text-ghost hover:text-text-muted cursor-pointer"
          >
            <IconLayers /> {t.omnichannel.addAll} ({available.length})
          </button>
        )}
      </div>

      {/* Add panel */}
      {showAdd && available.length > 0 && (
        <div className="mb-10 border border-border-medium rounded-lg p-5 bg-surface-card">
          {Object.keys(categories).map((cat) => (
            <div key={cat} className="mb-4 last:mb-0">
              <div className="font-mono text-[9px] text-text-ghost tracking-[2px] uppercase mb-3">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {categories[cat].map((id) => (
                  <button
                    key={id}
                    onClick={() => addChannel(id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[rgba(5,150,105,0.05)] border border-[rgba(5,150,105,0.15)] text-rifc-green font-mono text-[9px] cursor-pointer hover:bg-[rgba(5,150,105,0.1)] transition-colors"
                  >
                    <IconPlus /> {ALL_CHANNELS[id].name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main content — 2 columns */}
      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {/* Left column: Channel zones + Sliders */}
        <div className="flex-1 min-w-[320px]">
          {chData && (
            <div className="border border-border-medium rounded-lg overflow-hidden">
              {/* Channel name header */}
              <div className="px-4 py-3 bg-surface-card border-b border-border-subtle flex items-center gap-2">
                <IconGrid />
                <span className="font-mono text-[10px] text-text-ghost tracking-[2px] uppercase">{chData.name}</span>
              </div>

              {/* R, I, F, C zone rows */}
              {(["r", "i", "f", "c"] as ZoneKey[]).map((z) => (
                <div
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`px-4 cursor-pointer transition-all duration-150 ${
                    z !== "c" ? "border-b border-border-subtle" : ""
                  } ${
                    activeZone === z ? "bg-[var(--zone-bg)]" : "hover:bg-surface-card"
                  }`}
                  style={{
                    "--zone-bg": `${COLORS[z]}08`,
                    borderLeft: activeZone === z ? `3px solid ${COLORS[z]}` : "3px solid transparent",
                    padding: z === "i" ? "18px 16px" : "12px 16px",
                  } as React.CSSProperties}
                >
                  <div className="font-mono text-[9px] tracking-[1px] mb-1" style={{ color: COLORS[z] }}>
                    {chData.zones[z].label}
                  </div>
                  <div
                    className={`font-mono leading-[1.5] ${
                      z === "i" ? "text-[13px] text-text-secondary" : "text-[10px] text-text-muted"
                    }`}
                  >
                    {chData.zones[z].preview}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Score sliders */}
          <div className="mt-4 border border-border-medium rounded-lg p-4 bg-surface-card">
            <div className="font-mono text-[9px] text-text-ghost tracking-[2px] uppercase mb-4">
              {t.omnichannel.simulateScore}
            </div>
            {(["r", "i", "f"] as const).map((key) => (
              <div key={key} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[11px] font-semibold" style={{ color: COLORS[key] }}>
                    {key.toUpperCase()} = {scores[key]}
                  </span>
                  <span className="font-mono text-[9px] text-text-ghost">
                    {scores[key] <= 3 ? t.omnichannel.low : scores[key] <= 6 ? t.omnichannel.mid : t.omnichannel.high}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[key]}
                  onChange={(e) => setScores((p) => ({ ...p, [key]: parseInt(e.target.value) }))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: COLORS[key],
                    background: `linear-gradient(to right, ${COLORS[key]} ${(scores[key] - 1) * 11.1}%, rgba(255,255,255,0.06) ${(scores[key] - 1) * 11.1}%)`,
                  }}
                />
              </div>
            ))}

            {/* C Score display */}
            <div
              className="mt-4 rounded-md p-4 text-center border transition-all duration-300"
              style={{ background: `${cColor}0a`, borderColor: cColor }}
            >
              <div className="font-mono text-[18px] tracking-[1px]" style={{ color: cColor }}>
                C = {scores.r} + ({scores.i} x {scores.f}) = <strong className="text-[22px]">{c}</strong>
              </div>
              <div className="font-mono text-[10px] mt-1 tracking-[2px]" style={{ color: cColor, opacity: 0.7 }}>
                {cLabel}
              </div>
              {scores.r < 3 && (
                <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[9px] text-rifc-red bg-[rgba(220,38,38,0.08)] px-3 py-1.5 rounded">
                  <IconAlertTriangle />
                  {t.omnichannel.relevanceGateWarning}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Zone detail + Stats */}
        <div className="flex-1 min-w-[280px]">
          {zData ? (
            <div
              className="rounded-lg p-5 border transition-all duration-300"
              style={{ background: `${COLORS[activeZone!]}06`, borderColor: COLORS[activeZone!] }}
            >
              <div className="font-mono text-[12px] font-semibold tracking-[1px] mb-5" style={{ color: COLORS[activeZone!] }}>
                {zData.title}
              </div>
              <div className="space-y-2.5 mb-5">
                {zData.items.map((item, i) => (
                  <div
                    key={i}
                    className="font-mono text-[10px] text-text-muted leading-[1.6] pl-3"
                    style={{ borderLeft: `2px solid ${COLORS[activeZone!]}25` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                className="mt-4 p-3 rounded font-mono text-[9px] leading-[1.5]"
                style={{ background: `${COLORS[activeZone!]}0c`, color: COLORS[activeZone!] }}
              >
                {zData.fail}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border-light p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <IconChevronDown />
              <div className="font-mono text-[11px] text-text-ghost mt-3">
                {t.omnichannel.selectZone}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="mt-4 border border-border-light rounded-lg p-4 bg-surface-card">
            <div className="font-mono text-[9px] text-text-ghost tracking-[2px] uppercase mb-3">
              {activeIds.length} {t.omnichannel.channelsActive} / {Object.keys(ALL_CHANNELS).length} {t.omnichannel.channelsAvailable}
            </div>
            <div className="font-mono text-[13px] text-text-ghost text-center tracking-[3px] pt-3 border-t border-border-subtle">
              <span className="text-rifc-red">R</span>
              <span className="text-text-invisible"> + (</span>
              <span className="text-rifc-blue">I</span>
              <span className="text-text-invisible"> x </span>
              <span className="text-rifc-amber">F</span>
              <span className="text-text-invisible">) = </span>
              <span className="text-rifc-green">C</span>
            </div>
          </div>

          {/* Channel tip */}
          <div className="mt-4 border border-border-subtle rounded-lg p-4">
            <div className="font-mono text-[9px] text-text-ghost tracking-[1px] uppercase mb-2">
              {t.omnichannel.tipTitle}
            </div>
            <div className="font-body text-[12px] text-text-muted leading-[1.7]">
              {t.omnichannel.tipText}
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Universal: 3 Steps (migrated from ApplicationSection) */}
      <div className="mt-16 pt-12 border-t border-border-subtle">
        <h3 className="font-mono text-[13px] tracking-[3px] uppercase text-rifc-red mb-6">
          {t.omnichannel.diagnosticTitle}
        </h3>
        <div className="space-y-4">
          {t.omnichannel.steps.map((step) => (
            <div
              key={step.num}
              className="border border-border-light rounded-sm p-6 bg-surface-card relative overflow-hidden"
            >
              <WatermarkNumber
                value={step.num}
                color="#DC2626"
                size="sm"
                className="-top-[10px] -right-[10px]"
              />
              <div className="relative z-[1]">
                <div className="font-medium text-text-primary mb-2 text-[17px]">
                  {step.title}
                </div>
                <div className="font-body text-sm leading-[1.7] text-text-muted">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-16">
        <Link
          href="/audit"
          className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] bg-rifc-red text-white rounded-sm hover:bg-rifc-red/90 transition-all duration-300 no-underline"
        >
          <Sparkles size={16} />
          {t.omnichannel.ctaAudit}
        </Link>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-12 py-[18px] border border-rifc-red/40 text-rifc-red rounded-sm hover:border-rifc-red hover:bg-[rgba(220,38,38,0.05)] transition-all duration-300 no-underline"
        >
          <Calculator size={16} />
          {t.omnichannel.ctaDiagnostic}
        </Link>
      </div>
    </section>
  );
}
