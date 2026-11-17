import Link from "next/link";
import { ArrowRight, ArrowUpRight, Braces, ChartNoAxesColumn, FileSearch, GitBranch, Languages, Network, ScanText, Sparkles, TextSearch } from "lucide-react";
import { Header } from "@/components/header";
import { Brand } from "@/components/brand";

const topics = [
  { icon: FileSearch, title: "Introdução à Mineração", desc: "Entenda como extrair padrões e conhecimento de coleções de textos." },
  { icon: ScanText, title: "Pré-processamento", desc: "Prepare os dados textuais para análises mais consistentes." },
  { icon: Braces, title: "Tokenização e normalização", desc: "Explore a divisão e a padronização de palavras e sentenças." },
  { icon: TextSearch, title: "Remoção de stopwords", desc: "Identifique termos frequentes que pouco acrescentam à análise." },
  { icon: GitBranch, title: "Stemming e lematização", desc: "Conheça formas de reduzir palavras às suas representações-base." },
  { icon: ChartNoAxesColumn, title: "Frequência de palavras", desc: "Investigue ocorrências, distribuição e relevância de termos." },
  { icon: Sparkles, title: "Análise de sentimentos", desc: "Compreenda abordagens para identificar opiniões em textos." },
  { icon: Languages, title: "Processamento de linguagem", desc: "Conheça conceitos e tarefas fundamentais de PLN." },
  { icon: Network, title: "Representação vetorial e classificação", desc: "Represente documentos numericamente e entenda como classificá-los." }
];

export default function Home() {
  return <>
    <Header />
    <main>
      <section className="hero" id="inicio">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Projeto acadêmico · Unilins</span>
            <h1>Transforme palavras em conhecimento.</h1>
            <p className="hero-copy">Aprenda a extrair padrões de textos com técnicas de mineração e processamento de linguagem natural. Leia, pratique e acompanhe sua evolução.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/login">Começar minha jornada <ArrowRight size={18} /></Link>
              <a className="btn btn-secondary" href="#conteudos">Explorar conteúdos</a>
            </div>
          </div>
          <figure className="visual-card">
            <figcaption className="visual-top">
              <div className="topic-icon" aria-hidden="true"><ChartNoAxesColumn size={20} /></div>
              <div><strong>Frequência de palavras</strong><span>Exemplo de análise</span></div>
            </figcaption>
            <span className="example-label">Texto de entrada</span>
            <blockquote className="example-text">“Dados geram conhecimento. Conhecimento e dados apoiam decisões baseadas em dados.”</blockquote>
            <span className="example-label">Ocorrências de termos selecionados</span>
            <ul className="example-chart">
              {[
                { term: "dados", count: 3 },
                { term: "conhecimento", count: 2 },
                { term: "decisões", count: 1 }
              ].map(({ term, count }) => (
                <li className="chart-row" key={term}>
                  <span>{term}</span>
                  <span className="chart-track" aria-hidden="true">
                    <span className="chart-bar" style={{ width: `${count / 3 * 100}%` }} />
                  </span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </section>

      <section className="section section-alt" id="sobre">
        <div className="container about-grid">
          <div>
            <span className="kicker">Sobre o projeto</span>
            <h2>Do texto à análise</h2>
            <p className="about-copy">A plataforma foi desenvolvida com o propósito de facilitar o aprendizado sobre Mineração de Texto e Processamento de Linguagem Natural, apresentando conceitos fundamentais, técnicas de análise e aplicações práticas utilizadas na transformação de informações textuais em conhecimento.</p>
            <p className="about-copy">A proposta é aproximar os fundamentos teóricos de situações reais, organizando o aprendizado em etapas claras e progressivas.</p>
          </div>
          <div className="about-panel">
            <h3>Onde a mineração de texto é usada</h3>
            <p>Textos estão presentes em avaliações, notícias, pesquisas, redes sociais e documentos. Com as técnicas certas, é possível organizar esse conteúdo, identificar padrões e apoiar decisões baseadas em informação.</p>
          </div>
        </div>
      </section>

      <section className="section" id="conteudos">
        <div className="container">
          <div className="section-head">
            <h2>O que você vai aprender?</h2>
            <p>A trilha inicial passa pelos fundamentos, pelo pré-processamento e pela análise de textos. Cada aula inclui uma atividade de verificação.</p>
          </div>
          <div className="topic-grid">
            {topics.map(({icon: Icon,title,desc}) => <article className="topic-card" key={title}>
              <div className="topic-icon"><Icon size={18}/></div><h3>{title}</h3><p>{desc}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="metodo">
        <div className="container">
          <div className="section-head">
            <h2>Conheça a plataforma</h2>
            <p>Uma sequência didática para conectar fundamentos, técnicas e aplicação.</p>
          </div>
          <div className="steps">
            {[
              ["01","Aprenda os conceitos","Construa uma base para compreender os dados textuais."],
              ["02","Conheça as técnicas","Entenda os métodos utilizados no processamento."],
              ["03","Explore exemplos","Observe como as técnicas se comportam em diferentes textos."],
              ["04","Acompanhe sua evolução","Veja seu progresso e desbloqueie conquistas ao concluir as atividades."]
            ].map(([num,title,desc]) => <article className="step" key={num}><span className="step-num">{num}</span><h3>{title}</h3><p>{desc}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container home-learning">
          <div className="section-head"><h2>Aprenda e evolua</h2><p>Conclua aulas para ganhar XP, avançar de nível e acompanhar sua posição se optar pelo ranking.</p></div>
          <div className="learn-card demo-card">
            <p className="kicker">Exemplo demonstrativo</p>
            <h3>Nível 3 · Analista</h3>
            <div className="learn-progress"><progress max={100} value={50} aria-label="Progresso fictício" /><span>50%</span></div>
            <dl><div><dt>Pontuação</dt><dd>180 XP</dd></div><div><dt>Ranking</dt><dd>5ª posição</dd></div><div><dt>Conquista</dt><dd>Primeiros passos</dd></div></dl>
          </div>
        </div>
        <div className="container">
          <div className="cta">
            <div><h2>Acesse a área do estudante</h2><p>Acesse a plataforma e acompanhe a evolução dos conteúdos educacionais.</p></div>
            <Link className="btn btn-primary" href="/login">Acessar plataforma <ArrowUpRight size={15}/></Link>
          </div>
        </div>
      </section>
    </main>
    <footer className="footer">
      <div className="container footer-inner">
        <Brand />
        <div className="footer-links"><a href="#sobre">Projeto</a><a href="#conteudos">Conteúdos</a><Link href="/idealizadores">Idealizadores</Link><Link href="/login">Entrar</Link></div>
        <span>© {new Date().getFullYear()} TextoLab. Projeto acadêmico.</span>
      </div>
    </footer>
  </>;
}
