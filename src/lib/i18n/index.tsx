"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, Dictionary } from "./types";
import { ro } from "./ro";
import { en } from "./en";
import { ru } from "./ru";

export type { Locale, Dictionary };
export { ro, en, ru };

const DICTIONARIES: Record<Locale, Dictionary> = { ro, en, ru };
const COOKIE_KEY = "rifc_lang";
const DEFAULT_LOCALE: Locale = "ro";

function getInitialLocale(): Locale {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`${COOKIE_KEY}=([^;]+)`));
    if (match && (match[1] === "ro" || match[1] === "en" || match[1] === "ru")) {
      return match[1] as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

interface LanguageContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  t: DICTIONARIES[DEFAULT_LOCALE],
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `${COOKIE_KEY}=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`;
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = DICTIONARIES[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
