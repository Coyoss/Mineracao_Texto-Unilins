"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link href="/" aria-label="TextoLab - início"><Brand /></Link>
      <nav id="main-navigation" className={`nav-links ${open ? "open" : ""}`} aria-label="Navegação principal">
        <a href="#inicio" onClick={() => setOpen(false)}>Início</a>
        <a href="#sobre" onClick={() => setOpen(false)}>Sobre o projeto</a>
        <a href="#conteudos" onClick={() => setOpen(false)}>Conteúdos</a>
        <a href="#metodo" onClick={() => setOpen(false)}>Como funciona</a>
        <Link className="mobile-entry" href="/login" onClick={() => setOpen(false)}>Entrar <ArrowUpRight size={13} /></Link>
      </nav>
      <Link className="btn btn-primary nav-cta" href="/login">Acessar plataforma <ArrowUpRight size={14} /></Link>
      <button className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
        {open ? <X size={19}/> : <Menu size={19}/>}
      </button>
    </div>
  </header>;
}
