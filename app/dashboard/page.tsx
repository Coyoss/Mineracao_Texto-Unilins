import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpen, ChartNoAxesColumn, Compass, Home, Trophy, UserRound, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import { openLesson, completeLesson, saveProfile } from "./actions";

type Module = { id: string; title: string };
type Lesson = { id: string; module_id: string; title: string; body: string; question: string; options: string[] };
type Entry = { lesson: string; completed_at: string | null; accessed_at: string };
type Level = { number: number; title: string; threshold: number };
type Rank = { position: number; nickname: string; xp: number; completed: number; mine: boolean; level: string };
type State = {
  badges: { id: string; title: string; criterion: string; earned: boolean }[];
  xp: number; level: Level; next: Level | null; profile: { nickname: string; listed: boolean } | null;
  position: number | null; ranking: Rank[]; ownRank: Rank | null; rankingCount: number;
  modules: Module[]; lessons: Lesson[]; progress: Entry[];
};
const sections = [
  { id: "visao", name: "Visão geral", Icon: Home },
  { id: "estudos", name: "Meus estudos", Icon: Compass },
  { id: "conteudos", name: "Conteúdos", Icon: BookOpen },
  { id: "ranking", name: "Ranking", Icon: Trophy },
  { id: "conquistas", name: "Minhas conquistas", Icon: Award },
  { id: "perfil", name: "Meu perfil", Icon: UserRound }
];
const feedback: Record<string, string> = {
  completed: "Aula concluída! Seu XP foi atualizado.",
  level_badge: "Aula concluída! Você subiu de nível e desbloqueou uma conquista.",
  level: "Aula concluída! Você subiu de nível.",
  badge: "Aula concluída! Você desbloqueou uma conquista.",
  already: "Esta aula já foi concluída.",
  retry: "Releia a explicação e tente outra resposta.",
  missing: "Esta aula está indisponível.",
  error: "A ação não pôde ser concluída. Tente novamente.",
  saved: "Preferências salvas."
};

function percent(done: number, total: number) {
  return total ? Math.round(100 * done / total) : 0;
}

function Progress({ value, label }: { value: number; label: string }) {
  return <div className="learn-progress">
    <progress max={100} value={value} aria-label={label} />
    <span>{value}%</span>
  </div>;
}

export default async function Dashboard({ searchParams }: {
  searchParams: Promise<{ tab?: string; aula?: string; pagina?: string; status?: string }>
}) {
  if (!hasSupabaseEnv()) redirect("/login?setup=supabase");
  const db = await createClient();
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) redirect("/login?next=/dashboard");

  const query = await searchParams;
  const tab = sections.find(item => item.id === query.tab)?.id ?? "visao";
  const inputPage = Number(query.pagina);
  const page = Number.isSafeInteger(inputPage) && inputPage >= 1 && inputPage <= 100000 ? inputPage : 1;
  const { data, error } = await db.rpc("textolab_state", { p_offset: tab === "ranking" ? (page - 1) * 12 : 0 });
  const state = data as State | null;
  if (tab === "ranking" && state && page > Math.max(1, Math.ceil(state.rankingCount / 12))) redirect("/dashboard?tab=ranking");
  const name = user.user_metadata?.full_name || user.user_metadata?.name || "estudante";
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const lessons = state?.lessons ?? [];
  const moduleStats = (state?.modules ?? []).map(module => {
    const items = lessons.filter(lesson => lesson.module_id === module.id);
    const completed = items.filter(lesson => state?.progress.some(entry => entry.lesson === lesson.id && entry.completed_at)).length;
    return { ...module, items, completed };
  });
  const done = new Set(state?.progress.filter(entry => entry.completed_at).map(entry => entry.lesson));
  const completedModules = moduleStats.filter(module => module.items.length && module.completed === module.items.length);
  const badges = state?.badges ?? [];
  const recent = state?.progress[0];
  const lastLesson = lessons.find(lesson => lesson.id === recent?.lesson);
  const lastModule = completedModules.map(module => ({
    title: module.title,
    time: Math.max(...module.items.map(lesson => Date.parse(state?.progress.find(entry => entry.lesson === lesson.id)?.completed_at ?? "")))
  })).sort((a,b) => b.time - a.time)[0];
  const nextLesson = lessons.find(lesson => !done.has(lesson.id));
  const lesson = lessons.find(item => item.id === query.aula);
  const overall = percent(done.size, lessons.length);

  return <div className="learning-shell">
    <aside className="learning-sidebar">
      <Link href="/"><Brand /></Link>
      <nav aria-label="Área do estudante">
        {sections.map(({ id, name: label, Icon }) => <Link key={id} href={"/dashboard?tab=" + id}
          aria-current={tab === id ? "page" : undefined} title={label}><Icon size={19} aria-hidden="true" /><span>{label}</span></Link>)}
      </nav>
      <div className="user-chip">
        {avatar ? <img className="avatar" src={avatar} alt="" referrerPolicy="no-referrer" /> : <UserRound aria-hidden="true" />}
        <span className="user-name">{name}</span><LogoutButton />
      </div>
    </aside>
    <main className="learning-main">
      {(error || !state) ? <section className="learn-card">
        <h1>Área de aprendizagem indisponível</h1>
        <p>Verifique a configuração do banco e tente novamente.</p>
      </section> : <>
        {query.status && Object.prototype.hasOwnProperty.call(feedback, query.status) && <p className={query.status === "error" || query.status === "retry" ? "notice error-notice" : "notice"} role="status">{feedback[query.status]}</p>}
        {tab === "visao" && <>
          <header className="dashboard-welcome"><span className="kicker">Área do estudante</span>
            <h1>Olá, {name.split(" ")[0]}!</h1><p>Continue sua jornada de aprendizado e avance para o próximo nível.</p>
          </header>
          <div className="learning-grid">
            {[
              { label: "Minha posição", value: state.position ? "#" + state.position : "Sem posição", Icon: Trophy },
              { label: "Minha pontuação", value: state.xp + " XP", Icon: Zap },
              { label: "Meu progresso", value: overall + "%", Icon: ChartNoAxesColumn },
              { label: "Meu nível", value: state.level.title, Icon: Award }
            ].map(({ label, value, Icon }) => <div className="learn-card metric" key={label}><Icon size={21} aria-hidden="true" /><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <section className="learn-card spaced">
            <h2>Nível {state.level.number} · {state.level.title}</h2>
            <p>{state.next ? (state.next.threshold - state.xp) + " XP para " + state.next.title : "Você chegou ao nível máximo."}</p>
            <Progress label="Evolução no nível" value={state.next ? percent(state.xp - state.level.threshold, state.next.threshold - state.level.threshold) : 100} />
            <Link className="btn btn-primary" href="/dashboard?tab=estudos">Ver minha jornada</Link>
          </section>
        </>}
        {tab === "estudos" && <>
          <header className="learn-heading"><h1>Minha jornada de aprendizagem</h1><p>Acompanhe seu progresso pelas aulas publicadas.</p></header>
          <section className="learn-card"><h2>{done.size} de {lessons.length} aulas concluídas</h2><Progress value={overall} label="Progresso total" /></section>
          <div className="learning-grid spaced">{moduleStats.map(module => <section key={module.id} className="learn-card">
            <h2>{module.title}</h2><p>{module.completed} de {module.items.length} aulas concluídas</p>
            <Progress value={percent(module.completed, module.items.length)} label={module.title} />
            <small>{!module.items.length ? "Sem aulas publicadas" : module.completed === module.items.length ? "Concluído" : module.completed ? "Em andamento" : "Não iniciado"}</small>
          </section>)}</div>
          <section className="learn-card spaced"><h2>Histórico de aprendizagem</h2>
            <dl className="learn-history">
              <div><dt>Última aula acessada</dt><dd>{lastLesson?.title ?? "Nenhuma ainda"}</dd></div>
              <div><dt>Último módulo concluído</dt><dd>{lastModule?.title ?? "Nenhum ainda"}</dd></div>
              <div><dt>Última atividade</dt><dd>{recent ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(recent.accessed_at)) : "Nenhuma ainda"}</dd></div>
            </dl>
            {nextLesson && <form action={openLesson.bind(null, nextLesson.id)}><button className="btn btn-primary">Continuar · {nextLesson.title}</button></form>}
            {done.size > 0 && <details><summary>Evolução por aula concluída</summary><ol>
              {state.progress.filter(entry => entry.completed_at).sort((a,b) => (a.completed_at ?? "").localeCompare(b.completed_at ?? "")).map((entry, index) =>
              <li key={entry.lesson}>{lessons.find(item => item.id === entry.lesson)?.title} · {percent(index + 1, lessons.length)}%</li>)}
            </ol></details>}
          </section>
        </>}
        {tab === "conteudos" && <>
          <header className="learn-heading"><h1>{lesson?.title ?? "Conteúdos"}</h1></header>
          {lesson ? <article className="learn-card lesson-card">
            <Link href="/dashboard?tab=conteudos">← Todas as aulas</Link>
            <p>{lesson.body}</p>
            {done.has(lesson.id) ? <p className="pill">Aula concluída</p> :
              <form action={completeLesson.bind(null, lesson.id)}>
                <fieldset><legend>{lesson.question}</legend>
                  {lesson.options.map((option, index) => <label className="choice" key={option}>
                    <input type="radio" name="answer" value={index + 1} required /> {option}
                  </label>)}
                </fieldset>
                <button className="btn btn-primary">Verificar e concluir aula</button>
              </form>}
          </article> : <div className="learning-grid">{moduleStats.map(module => <section key={module.id} className="learn-card">
            <h2>{module.title}</h2>{module.items.map(item => <form key={item.id} action={openLesson.bind(null, item.id)}>
              <button className="lesson-link"><span>{item.title}</span><small>{done.has(item.id) ? "Concluída" : "Abrir"}</small></button>
            </form>)}
          </section>)}</div>}
        </>}
        {tab === "ranking" && <>
          <header className="learn-heading"><h1>Ranking de aprendizagem</h1><p>Veja sua evolução e acompanhe sua posição entre os estudantes.</p></header>
          {state.ownRank ? <p className="notice">Sua posição é #{state.ownRank.position} · {state.xp} XP.</p> :
            <p className="notice">A participação é opcional. <Link href="/dashboard?tab=perfil">Editar minhas preferências</Link></p>}
          {state.ranking.length ? <ol className="rank-list">{state.ranking.map((row, index) =>
            <li key={index} className={"learn-card rank-row rank-" + row.position + (row.mine ? " rank-mine" : "")}>
              <span className="rank-position">#{row.position}</span><div className="rank-person">
                <span className="rank-avatar" aria-hidden="true">{row.nickname.slice(0, 2).toUpperCase()}</span>
                <div><strong>{row.nickname}{row.mine ? " (você)" : ""}</strong><small>{row.level}</small></div>
              </div><strong>{row.xp} XP</strong><Progress value={percent(row.completed, lessons.length)} label={"Progresso de " + row.nickname} />
            </li>)}</ol> : <p className="learn-card">Ainda não há estudantes participando do ranking.</p>}
          <div className="learn-pagination">
            {page > 1 && <Link className="btn btn-secondary" href={"/dashboard?tab=ranking&pagina=" + (page - 1)}>Anterior</Link>}
            {page * 12 < state.rankingCount && <Link className="btn btn-secondary" href={"/dashboard?tab=ranking&pagina=" + (page + 1)}>Próxima página</Link>}
          </div>
        </>}
        {tab === "conquistas" && <>
          <header className="learn-heading"><h1>Minhas conquistas</h1><p>{badges.filter(badge => badge.earned).length} de {badges.length} desbloqueadas</p></header>
          <div className="learning-grid">{badges.map(badge => <article className="learn-card" key={badge.title}>
            <div className="topic-icon"><Award size={20} aria-hidden="true" /></div><h2>{badge.title}</h2><p>{badge.criterion}</p>
            <span className="pill">{badge.earned ? "Desbloqueada" : "Bloqueada"}</span>
          </article>)}</div>
        </>}
        {tab === "perfil" && <>
          <header className="learn-heading"><h1>Meu perfil</h1><p>{name}</p></header>
          <form className="learn-card profile-form" action={saveProfile}>
            <label htmlFor="nickname">Apelido para o ranking</label>
            <input id="nickname" name="nickname" defaultValue={state.profile?.nickname} minLength={2} maxLength={24} required />
            <label className="choice"><input name="listed" type="checkbox" defaultChecked={state.profile?.listed} /> Participar do ranking</label>
            <p>Ao participar, seu apelido, nível, progresso e XP aparecem para estudantes autenticados.</p>
            <button className="btn btn-primary">Salvar preferências</button>
          </form>
        </>}
      </>}
    </main>
  </div>;
}
