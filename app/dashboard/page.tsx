import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, BrainCircuit, ChartNoAxesColumn, FileSearch, Network } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

const planned = [
  { icon: FileSearch, title: "Fundamentos de Mineração de Texto", desc: "Conceitos, aplicações e etapas de um processo de mineração textual." },
  { icon: BrainCircuit, title: "Pré-processamento e PLN", desc: "Tokenização, normalização, stopwords, stemming e lematização." },
  { icon: ChartNoAxesColumn, title: "Análise e representação", desc: "Frequência de termos, sentimentos e representação vetorial." },
  { icon: Network, title: "Aplicações práticas", desc: "Exploração de exemplos e cenários de uso de técnicas de análise textual." }
];

export default async function DashboardPage() {
  if (!hasSupabaseEnv()) redirect("/login?setup=supabase");

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login?next=/dashboard");

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "estudante";
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return <main className="dashboard-wrap">
    <header className="dashboard-header"><div className="container nav-wrap">
      <Link href="/"><Brand/></Link>
      <div className="user-chip">
        {avatar ? <img className="avatar" src={avatar} alt="" referrerPolicy="no-referrer"/> : <span className="avatar" aria-hidden="true"/>}
        <span className="user-name">{name}</span>
        <LogoutButton/>
      </div>
    </div></header>
    <div className="container dashboard-main">
      <div className="dashboard-welcome">
        <div><span className="kicker">Área do estudante</span><h1>Olá, {name.split(" ")[0]}.</h1><p>Sua jornada pelo universo dos dados textuais começa aqui.</p></div>
      </div>
      <section>
        <div className="section-head"><span className="kicker">Sua trilha</span><h2>Explore os módulos planejados</h2><p>Os módulos abaixo representam a estrutura prevista para a plataforma. O conteúdo será liberado conforme o desenvolvimento das próximas etapas.</p></div>
        <div className="planned-grid">{planned.map(({icon:Icon,title,desc}) => <article className="planned-card" key={title}><div className="topic-icon"><Icon size={18}/></div><h3>{title}</h3><p>{desc}</p><span className="pill">Em desenvolvimento</span></article>)}</div>
      </section>
      <div className="about-panel dashboard-return">
        <BookOpen size={22} color="var(--accent)"/><div><h3>Continue explorando</h3><p>Enquanto os módulos são preparados, você pode revisitar a apresentação do projeto.</p></div>
        <Link className="btn btn-secondary" href="/">Ver projeto</Link>
      </div>
    </div>
  </main>;
}
