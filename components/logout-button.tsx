"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const [loading,setLoading] = useState(false);
  const router = useRouter();
  async function logout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally { setLoading(false); }
  }
  return <button onClick={logout} disabled={loading} aria-label="Sair da conta" title="Sair da conta" className="logout-button">
    <LogOut size={15}/><span className="sr-only">{loading ? "Saindo..." : "Sair"}</span>
  </button>;
}
