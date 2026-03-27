"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CEOAppPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/modules/ceo/dashboard');
  }, [router]);
  
  return null;
} 