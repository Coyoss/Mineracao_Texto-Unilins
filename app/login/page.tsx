import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { LoginButton } from "@/components/login-button";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type Props = { searchParams: Promise<{ error?: string; setup?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const configured = hasSupabaseEnv();
  const errorMessage = params.error === "oauth"
    ? "Não foi possível concluir a autenticação. Tente novamente."
    : params.error === "setup"
      ? "A configuração do Supabase está incompleta."
      : null;

  return <main className="auth-shell">
    <aside className="auth-aside">
      <Link href="/"><Brand/></Link>
      <div>
        <span className="eyebrow">Projeto acadêmico</span>
        <h1>Mineração de texto e PLN</h1>
        <p>Entre na TextoLab e acompanhe uma jornada de aprendizado sobre mineração de texto e processamento de linguagem natural.</p>
      </div>
    </aside>
    <section className="auth-main">
      <div className="auth-box">
        <Link href="/" className="auth-back"><ArrowLeft size={14}/> Voltar para o início</Link>
        <h2>Bem-vindo à plataforma</h2>
        <p>Entre para continuar sua jornada de aprendizado.</p>
        {errorMessage && <div className="notice error-notice" role="alert">{errorMessage}</div>}
        {!configured && <div className="notice" role="status">A autenticação ainda precisa ser configurada. Preencha as variáveis do Supabase e habilite o provedor Google seguindo o README.</div>}
        <LoginButton enabled={configured} next={params.next}/>
        <div className="auth-privacy">Ao continuar, seus dados básicos de perfil fornecidos pelo Google serão utilizados para identificar sua sessão. Consulte a política de privacidade do projeto quando publicada.</div>
      </div>
    </section>
  </main>;
}
