"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleMark() {
  return <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.14-10.17 7.14-17.56z"/>
    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.45-4.84 2.3-8.28 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>;
}

export function LoginButton({ enabled, next }: { enabled: boolean; next?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    if (!enabled || loading) return;
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const callback = new URL("/auth/callback", window.location.origin);
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      callback.searchParams.set("next", safeNext);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback.toString(), queryParams: { access_type: "offline", prompt: "consent" } }
      });
      if (authError) throw authError;
    } catch {
      setError("Não foi possível iniciar o login. Verifique a configuração do Supabase e tente novamente.");
      setLoading(false);
    }
  }

  return <>
    <button className="google-button" type="button" onClick={signIn} disabled={!enabled || loading}>
      <GoogleMark/>{loading ? "Conectando ao Google..." : "Continuar com Google"}
    </button>
    {error && <div className="notice error-notice" role="alert">{error}</div>}
  </>;
}
