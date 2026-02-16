"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CaseStudyEditor from "../../components/CaseStudyEditor";
import type { CaseStudy } from "@/types";

export default function EditCaseStudyPage() {
  const { id } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudy();
  }, [id]);

  const fetchStudy = async () => {
    const res = await fetch(`/api/admin/case-studies/${id}`);
    if (res.ok) setStudy(await res.json());
    setLoading(false);
  };

  if (loading) return <p className="font-body text-sm text-text-ghost">Se incarca...</p>;
  if (!study) return <p className="font-body text-sm text-rifc-red">Case study-ul nu a fost gasit.</p>;

  return <CaseStudyEditor study={study} />;
}
