import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="container" style={{minHeight:"100vh",display:"grid",placeItems:"center",textAlign:"center"}}>
    <div><span className="kicker">ERRO 404</span><h1 style={{fontSize:48,letterSpacing:"-.05em",margin:"14px 0"}}>Página não encontrada.</h1>
      <p style={{color:"var(--muted)",marginBottom:24}}>O endereço pode estar incorreto ou a página não existe.</p>
      <Link className="btn btn-primary" href="/"><ArrowLeft size={15}/> Voltar ao início</Link>
    </div>
  </main>;
}
