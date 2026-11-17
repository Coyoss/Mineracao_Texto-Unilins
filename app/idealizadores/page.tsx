import Link from "next/link";
import { UserRound, UsersRound } from "lucide-react";
import { Header } from "@/components/header";
import { idealizadores } from "@/lib/idealizadores";

export default function IdealizadoresPage() {
  return <><Header /><main>
    <section className="hero team-hero"><div className="container hero-grid">
      <div><span className="eyebrow">Equipe TextoLab</span><h1>Conheça os idealizadores</h1>
      <p className="hero-copy">Por trás de cada projeto existe uma equipe movida pela curiosidade, pela inovação e pelo desejo de compartilhar conhecimento.</p></div>
      <div className="team-symbol" aria-hidden="true"><UsersRound size={96} strokeWidth={1.2} /></div>
    </div></section>
    <section className="section"><div className="container team-grid">
      {idealizadores.map(person => <article className="learn-card team-card" key={person.id}>
        <div className="team-photo">
          {person.photo ? <img src={person.photo} alt={person.name ?? ""} /> : <UserRound size={62} strokeWidth={1.2} aria-hidden="true" />}
        </div>
        <div className="team-detail"><h2>{person.name ?? "Identificação a publicar"}</h2>
          {person.course && <p>{person.course}</p>}
          {person.role && <p>{person.role}</p>}
          {person.bio && <p>{person.bio}</p>}
          {person.contribution && <p>{person.contribution}</p>}
        </div>
      </article>)}
    </div></section>
    <section className="section section-alt"><div className="container cta">
      <div><h2>Conhecimento se constrói em conjunto.</h2><p>O TextoLab aproxima a teoria da prática para tornar o estudo de dados textuais mais acessível.</p></div>
      <Link href="/" className="btn btn-primary">Voltar para a plataforma</Link>
    </div></section>
  </main></>;
}
