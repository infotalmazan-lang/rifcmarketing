"use client";

import { useTranslation } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditForm from "@/components/audit/AuditForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AuditPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-content mx-auto">
        <SectionHeader
          chapter={t.audit.chapter}
          titlePlain={t.audit.titlePlain}
          titleBold={t.audit.titleBold}
          description={t.audit.description}
          watermarkNumber="A"
          watermarkColor="#DC2626"
        />

        <AuditForm />
      </main>
      <Footer />
    </>
  );
}
