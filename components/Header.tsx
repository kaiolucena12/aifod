"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container headerInner">

          {/* LOGO AIFOD */}
          <Link
            href="/"
            className="aifodBrand"
            aria-label="AiFod - Início"
          >
            <span className="aifodBrandIcon">
              <img
                src="/image/logo-symbol.png"
                alt=""
                className="aifodBrandSymbol"
              />
            </span>

            <span className="aifodWordmarkWrap">
  <img
    src="/image/logo-wordmark.png"
    alt="AiFod"
    className="aifodBrandWordmark"
  />
</span>
          </Link>

          {/* MENU */}
          <nav className="nav">
            <Link href="/">
              Início
            </Link>

            <Link href="/profissionais">
              Explorar
            </Link>

            <Link href="/planos">
              Categorias
            </Link>
          </nav>

          {/* AÇÕES */}
          <div className="headerActions">

            <Link
  href="/login"
  className="ghostButton"
>
  Entrar
</Link>

            <button
              type="button"
              className="goldButton"
              onClick={() => setRegisterOpen(true)}
            >
              Cadastre-se
            </button>

          </div>
        </div>
      </header>

      {/* MODAL */}
      {registerOpen && (
        <div
          className="modalOverlay"
          onClick={() => setRegisterOpen(false)}
        >
          <div
            className="modalCard"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modalClose"
              onClick={() => setRegisterOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>

            <span className="eyebrow">
              ENTRE PARA O AIFOD
            </span>

            <h2>
              Como você quer entrar?
            </h2>

            <p>
              Escolha seu perfil para continuar.
            </p>

           <div className="choiceGrid">

  <Link
  href="/cadastro/acompanhante"
  className="choiceCard choiceFeatured"
  onClick={() => setRegisterOpen(false)}
>
    <span className="choiceIcon">
      ✦
    </span>

    <div>
      <strong>
        Sou acompanhante
      </strong>

      <small>
        Quero criar meu perfil e aparecer na plataforma.
      </small>
    </div>

    <b>→</b>
  </Link>

  <Link
    href="/cadastro/cliente"
    className="choiceCard"
    onClick={() => setRegisterOpen(false)}
  >
    <span className="choiceIcon">
      ◉
    </span>

    <div>
      <strong>
        Sou cliente
      </strong>

      <small>
        Quero explorar perfis, favoritos e experiências.
      </small>
    </div>

    <b>→</b>
  </Link>

</div>
          </div>
        </div>
      )}
    </>
  );
}