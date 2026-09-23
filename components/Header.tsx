"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";


export default function Header() {
  const [registerOpen, setRegisterOpen] = useState(false);


  useEffect(() => {
    if (!registerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";


    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setRegisterOpen(false);
      }
    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [registerOpen]);


  return (
    <>
      {/* ========================================
          HEADER
      ======================================== */}

      <header
        className="
          sticky
          top-0
          z-[100]
          border-b
          border-white/10
          bg-[rgba(11,9,8,0.90)]
          backdrop-blur-[18px]
          font-[Arial,Helvetica,sans-serif]
        "
      >
        <div
          className="
            mx-auto
            grid
            min-h-[72px]
            w-[calc(100%-24px)]
            grid-cols-[1fr_auto]
            items-center
            gap-3

            min-[621px]:min-h-[88px]
            min-[621px]:w-[min(1180px,calc(100%-40px))]
            min-[621px]:gap-6

            min-[981px]:grid-cols-[1fr_auto_1fr]
          "
        >

          {/* ========================================
              LOGO
          ======================================== */}

          <div className="justify-self-start">
            <Logo />
          </div>


          {/* ========================================
              MENU
          ======================================== */}

          <nav
            className="
              hidden
              items-center
              gap-7
              text-[12px]
              font-extrabold
              text-[#b9ada1]

              min-[981px]:flex
            "
          >
            <Link
              href="/"
              className="
                transition-colors
                duration-200
                hover:text-white
              "
            >
              Início
            </Link>
          </nav>


          {/* ========================================
              AÇÕES
          ======================================== */}

          <div
            className="
              flex
              items-center
              justify-self-end
              gap-[8px]

              min-[621px]:gap-[10px]
            "
          >

            {/* ENTRAR */}

            <Link
              href="/login"
              className="
                hidden
                min-h-[43px]
                items-center
                justify-center
                rounded-full
                border
                border-white/[0.13]
                bg-white/[0.03]
                px-[18px]
                text-[12px]
                font-black
                text-[#f8f1e8]
                transition
                duration-200
                hover:bg-white/[0.06]

                min-[621px]:inline-flex
              "
            >
              Entrar
            </Link>


            {/* CADASTRE-SE */}

            <button
              type="button"
              onClick={() =>
                setRegisterOpen(true)
              }
              className="
                inline-flex
                min-h-[39px]
                items-center
                justify-center
                rounded-full
                border
                border-[#e09566]/30
                bg-[linear-gradient(135deg,#e8a26f,#b85e39)]
                px-[14px]
                text-[11px]
                font-black
                text-[#160b07]
                shadow-[0_10px_26px_rgba(183,94,57,0.18)]
                transition
                duration-200
                hover:brightness-110

                min-[621px]:min-h-[43px]
                min-[621px]:px-[18px]
                min-[621px]:text-[12px]
              "
            >
              Cadastre-se
            </button>

          </div>

        </div>
      </header>


      {/* ========================================
          MODAL
      ======================================== */}

      {registerOpen && (
        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-end
            justify-center
            bg-black/[0.78]
            p-2
            backdrop-blur-[14px]
            font-[Arial,Helvetica,sans-serif]

            min-[621px]:items-center
            min-[621px]:p-5
          "
          onMouseDown={() =>
            setRegisterOpen(false)
          }
        >

          <div
            className="
              relative
              max-h-[92dvh]
              w-full
              overflow-y-auto
              rounded-[24px_24px_18px_18px]
              border
              border-white/[0.11]
              bg-[radial-gradient(circle_at_100%_0%,rgba(196,111,67,0.15),transparent_35%),#15110f]
              px-[18px]
              pb-[calc(18px+env(safe-area-inset-bottom))]
              pt-[30px]
              shadow-[0_35px_100px_rgba(0,0,0,0.60)]

              min-[621px]:w-[min(620px,100%)]
              min-[621px]:overflow-visible
              min-[621px]:rounded-[28px]
              min-[621px]:p-[38px]
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* ========================================
                FECHAR
            ======================================== */}

            <button
              type="button"
              onClick={() =>
                setRegisterOpen(false)
              }
              aria-label="Fechar"
              className="
                absolute
                right-4
                top-4
                grid
                h-[38px]
                w-[38px]
                place-items-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-[23px]
                text-white
                transition
                hover:bg-white/[0.08]
              "
            >
              ×
            </button>


            {/* ========================================
                EYEBROW
            ======================================== */}

            <span
              className="
                mb-[10px]
                inline-block
                text-[10px]
                font-black
                leading-[1.4]
                tracking-[0.17em]
                text-[#e09566]
              "
            >
              ENTRE PARA O AIFOD
            </span>


            {/* ========================================
                TÍTULO
            ======================================== */}

            <h2
              className="
                m-0
                max-w-[90%]
                text-[36px]
                font-bold
                leading-[0.95]
                tracking-[-0.055em]
                text-[#f8f1e8]

                min-[621px]:max-w-none
                min-[621px]:text-[clamp(34px,6vw,52px)]
              "
            >
              Como você quer entrar?
            </h2>


            {/* ========================================
                TEXTO
            ======================================== */}

            <p
              className="
                mb-7
                mt-[14px]
                leading-[1.6]
                text-[#9f958c]
              "
            >
              Escolha seu perfil para continuar.
            </p>


            {/* ========================================
                OPÇÕES
            ======================================== */}

            <div
              className="
                grid
                gap-[10px]
              "
            >

              {/* ACOMPANHANTE */}

              <Link
                href="/cadastro/acompanhante"
                onClick={() =>
                  setRegisterOpen(false)
                }
                className="
                  group
                  grid
                  grid-cols-[42px_1fr_auto]
                  items-center
                  gap-[14px]
                  rounded-[18px]
                  border
                  border-white/10
                  bg-[linear-gradient(120deg,rgba(196,111,67,0.12),rgba(255,255,255,0.02))]
                  p-[14px]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#e09566]/40
                  hover:bg-white/[0.045]

                  min-[621px]:grid-cols-[46px_1fr_auto]
                  min-[621px]:p-[18px]
                "
              >

                <span
                  className="
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-[14px]
                    bg-[#c46f43]/[0.11]
                    text-[18px]
                    text-[#f2b284]

                    min-[621px]:h-11
                    min-[621px]:w-11
                  "
                >
                  ✦
                </span>


                <div>
                  <strong className="block">
                    Sou acompanhante
                  </strong>

                  <small
                    className="
                      mt-1
                      block
                      text-[11px]
                      leading-[1.4]
                      text-[#8f857c]
                    "
                  >
                    Quero criar meu perfil e aparecer na plataforma.
                  </small>
                </div>


                <b
                  className="
                    text-[22px]
                    font-normal
                    text-[#d28a5d]
                    transition
                    group-hover:translate-x-1
                  "
                >
                  →
                </b>

              </Link>


              {/* CLIENTE */}

              <Link
                href="/cadastro/cliente"
                onClick={() =>
                  setRegisterOpen(false)
                }
                className="
                  group
                  grid
                  grid-cols-[42px_1fr_auto]
                  items-center
                  gap-[14px]
                  rounded-[18px]
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-[14px]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#e09566]/40
                  hover:bg-white/[0.045]

                  min-[621px]:grid-cols-[46px_1fr_auto]
                  min-[621px]:p-[18px]
                "
              >

                <span
                  className="
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-[14px]
                    bg-[#c46f43]/[0.11]
                    text-[18px]
                    text-[#f2b284]

                    min-[621px]:h-11
                    min-[621px]:w-11
                  "
                >
                  ◉
                </span>


                <div>
                  <strong className="block">
                    Sou cliente
                  </strong>

                  <small
                    className="
                      mt-1
                      block
                      text-[11px]
                      leading-[1.4]
                      text-[#8f857c]
                    "
                  >
                    Quero explorar perfis, favoritos e experiências.
                  </small>
                </div>


                <b
                  className="
                    text-[22px]
                    font-normal
                    text-[#d28a5d]
                    transition
                    group-hover:translate-x-1
                  "
                >
                  →
                </b>

              </Link>

            </div>

          </div>

        </div>
      )}
    </>
  );
}