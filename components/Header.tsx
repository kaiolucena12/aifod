"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

export default function Header() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container headerInner">
          <Logo />
          <nav className="nav">
            <Link href="/">Início</Link>
            <Link href="/profissionais">Explorar</Link>
            <Link href="/planos">Categorias</Link>
          </nav>
          <div className="headerActions">
            <Link href="/profissionais" className="ghostButton">Entrar</Link>
            <button className="goldButton" onClick={() => setRegisterOpen(true)}>Cadastre-se</button>
          </div>
        </div>
      </header>

      {registerOpen && (
        <div className="modalOverlay" onClick={() => setRegisterOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setRegisterOpen(false)}>×</button>
            <span className="eyebrow">ENTRE PARA O AIFOD</span>
            <h2>Como você quer entrar?</h2>
            <p>Escolha seu perfil para continuar.</p>
            <div className="choiceGrid">
              <Link href="/cadastro?tipo=acompanhante" className="choiceCard choiceFeatured">
                <span className="choiceIcon">✦</span>
                <div><strong>Sou acompanhante</strong><small>Quero criar meu perfil e aparecer na plataforma.</small></div>
                <b>→</b>
              </Link>
              <Link href="/cadastro?tipo=cliente" className="choiceCard">
                <span className="choiceIcon">◉</span>
                <div><strong>Sou cliente</strong><small>Quero explorar perfis, favoritos e experiências.</small></div>
                <b>→</b>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
