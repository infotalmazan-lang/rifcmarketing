"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudiuRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/articolstiintific");
  }, [router]);
  return null;
}
