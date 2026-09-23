"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";

import ExperienceCards from "@/components/ExperienceCards";


type Cliente = {
  full_name: string | null;
  email: string | null;
};


type AcompanhanteResumo = {
  id: string;
  nome_artistico: string | null;
  idade: number | null;
  bairro: string | null;
  cidade: string | null;
  plano: string | null;
  foto_capa: string | null;
};


type MatchItem = {
  id: string;
  acompanhante_id: string;
  created_at: string;
};


type HistoricoItem = {
  id: string;
  acompanhante_id: string;
  status: string;
  created_at: string;
};


export default function ClientePage() {

  const router = useRouter();

  const [cliente, setCliente] =
    useState<Cliente | null>(null);

  const [matches, setMatches] =
    useState<MatchItem[]>([]);

  const [
    acompanhantesMatches,
    setAcompanhantesMatches,
  ] =
    useState<
      Record<
        string,
        AcompanhanteResumo
      >
    >({});

  const [
    historico,
    setHistorico,
  ] =
    useState<HistoricoItem[]>([]);

  const [
    acompanhantesHistorico,
    setAcompanhantesHistorico,
  ] =
    useState<
      Record<
        string,
        AcompanhanteResumo
      >
    >({});

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();


      /*
        USUÁRIO
      */

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();


      if (!user) {
        router.replace(
          "/login"
        );

        return;
      }


      /*
        PERFIL
      */

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select(`
            role,
            full_name,
            email
          `)
          .eq(
            "id",
            user.id
          )
          .single();


      if (
        !profile ||
        profile.role !==
          "cliente"
      ) {
        router.replace(
          "/acompanhante/painel"
        );

        return;
      }


      setCliente({
        full_name:
          profile.full_name,

        email:
          profile.email,
      });


      /*
        MATCHES
      */

      const {
        data: matchesData,
      } =
        await supabase
          .from("matches")
          .select(`
            id,
            acompanhante_id,
            created_at
          `)
          .eq(
            "cliente_id",
            user.id
          )
          .eq(
            "status",
            "ativo"
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(6);


      const listaMatches =
        matchesData || [];


      setMatches(
        listaMatches
      );


      if (
        listaMatches.length >
        0
      ) {

        const ids =
          listaMatches.map(
            (item) =>
              item.acompanhante_id
          );


        const {
          data:
            profissionaisData,
        } =
          await supabase
            .from(
              "acompanhante_profiles"
            )
            .select(`
              id,
              nome_artistico,
              idade,
              bairro,
              cidade,
              plano,
              foto_capa
            `)
            .in(
              "id",
              ids
            );


        const mapa:
          Record<
            string,
            AcompanhanteResumo
          > = {};


        (
          profissionaisData ||
          []
        ).forEach(
          (profissional) => {

            mapa[
              profissional.id
            ] =
              profissional;

          }
        );


        setAcompanhantesMatches(
          mapa
        );
      }


      /*
        HISTÓRICO
      */

      const {
        data:
          historicoData,
      } =
        await supabase
          .from("historico")
          .select(`
            id,
            acompanhante_id,
            status,
            created_at
          `)
          .eq(
            "cliente_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(6);


      const listaHistorico =
        historicoData || [];


      setHistorico(
        listaHistorico
      );


      if (
        listaHistorico.length >
        0
      ) {

        const ids =
          listaHistorico.map(
            (item) =>
              item.acompanhante_id
          );


        const {
          data:
            profissionaisHistorico,
        } =
          await supabase
            .from(
              "acompanhante_profiles"
            )
            .select(`
              id,
              nome_artistico,
              idade,
              bairro,
              cidade,
              plano,
              foto_capa
            `)
            .in(
              "id",
              ids
            );


        const mapa:
          Record<
            string,
            AcompanhanteResumo
          > = {};


        (
          profissionaisHistorico ||
          []
        ).forEach(
          (profissional) => {

            mapa[
              profissional.id
            ] =
              profissional;

          }
        );


        setAcompanhantesHistorico(
          mapa
        );
      }


      setLoading(false);
    }


    carregar();

  }, [router]);


  async function sair() {

    const supabase =
      createClient();


    await supabase.auth.signOut();


    router.replace("/");

    router.refresh();
  }


  function primeiroNome() {

    const nome =
      cliente?.full_name
        ?.trim()
        .split(" ")[0];


    return (
      nome ||
      "bem-vindo"
    );
  }


  function nomePlano(
    plano:
      string | null
  ) {

    if (
      plano === "black"
    ) {
      return "Black";
    }

    if (
      plano === "comfort"
    ) {
      return "Comfort";
    }

    return "X";
  }


  if (loading) {

    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#0b0908]
          text-[#f8f1e8]
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >

          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-white/10
              border-t-[#c46f43]
            "
          />

          <p
            className="
              text-xs
              text-white/40
            "
          >
            Preparando sua experiência...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#0b0908]
        text-[#f8f1e8]
      "
    >

      <div
        className="
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[1500px]
        "
      >


        {/* SIDEBAR DESKTOP */}

        <aside
          className="
            sticky
            top-0
            hidden
            h-screen
            w-[220px]
            shrink-0
            flex-col
            border-r
            border-white/[0.06]
            bg-[#0d0a09]/90
            px-5
            py-7
            backdrop-blur-xl
            md:flex
          "
        >

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              px-2
            "
          >

            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-full
                border
                border-[#d2a86b]/50
                text-lg
                text-[#d2a86b]
              "
            >
              A
            </div>

            <strong
              className="
                text-lg
                text-[#f8f1e8]
              "
            >
              AiFod
            </strong>

          </Link>


          <nav
            className="
              mt-12
            "
          >

            <Link
              href="/cliente"
              className="
                flex
                min-h-12
                items-center
                gap-3
                rounded-xl
                border
                border-[#c46f43]/15
                bg-[#c46f43]/[0.08]
                px-4
                text-xs
                font-semibold
                text-[#f8f1e8]
              "
            >
              <span
                className="
                  text-[#e09566]
                "
              >
                ⌂
              </span>

              Início
            </Link>

          </nav>


          <div
            className="
              mt-auto
              border-t
              border-white/[0.06]
              pt-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-full
                  bg-gradient-to-br
                  from-[#e09566]
                  to-[#c46f43]
                  text-xs
                  font-black
                  text-[#160b07]
                "
              >
                {primeiroNome()
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div
                className="
                  min-w-0
                  flex-1
                "
              >

                <strong
                  className="
                    block
                    truncate
                    text-xs
                    text-white/80
                  "
                >
                  {primeiroNome()}
                </strong>

                <span
                  className="
                    text-[9px]
                    text-white/30
                  "
                >
                  Cliente
                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={sair}
              className="
                mt-4
                w-full
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                py-2.5
                text-[10px]
                text-white/40
                transition
                hover:bg-white/[0.05]
                hover:text-white/70
              "
            >
              Sair
            </button>

          </div>

        </aside>


        {/* CONTEÚDO */}

        <section
          className="
            min-w-0
            flex-1
            px-4
            py-8
            sm:px-6
            md:px-10
            md:py-12
            lg:px-14
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-6xl
            "
          >


            {/* MOBILE TOPO */}

            <div
              className="
                mb-8
                flex
                items-center
                justify-between
                md:hidden
              "
            >

              <Link
                href="/"
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                AiFod
              </Link>


              <button
                type="button"
                onClick={sair}
                className="
                  rounded-full
                  border
                  border-white/10
                  px-4
                  py-2
                  text-[10px]
                  text-white/50
                "
              >
                Sair
              </button>

            </div>


            {/* HERO */}

            <header
              className="
                mb-12
                md:mb-16
              "
            >

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#c46f43]
                "
              >
                SUA EXPERIÊNCIA
              </span>


              <h1
                className="
                  mt-3
                  text-[44px]
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.055em]
                  text-[#fff7f0]
                  sm:text-5xl
                  md:text-6xl
                "
              >
                Olá,{" "}

                <span
                  className="
                    text-[#e09566]
                  "
                >
                  {primeiroNome()}.
                </span>

              </h1>


              <p
                className="
                  mt-4
                  max-w-lg
                  text-sm
                  leading-6
                  text-white/40
                "
              >
                Escolha a experiência que
                combina com seu momento.
              </p>

            </header>


            {/* EXPERIÊNCIAS */}

            <section
              className="
                mb-16
              "
            >

              <div
                className="
                  mb-6
                "
              >

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[#c46f43]
                  "
                >
                  ESCOLHA SUA EXPERIÊNCIA
                </span>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.045em]
                    text-[#f3e9e2]
                  "
                >
                  O que você procura hoje?
                </h2>

              </div>


              <ExperienceCards />

            </section>


            {/* MATCHES */}

            <section
              className="
                mb-16
              "
            >

              <div
                className="
                  mb-6
                "
              >

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[#c46f43]
                  "
                >
                  CONEXÕES
                </span>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.045em]
                    text-[#f3e9e2]
                  "
                >
                  Seus matches
                </h2>

              </div>


              {matches.length === 0 ? (

                <div
                  className="
                    flex
                    items-center
                    gap-5
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.02]
                    p-5
                  "
                >

                  <div
                    className="
                      grid
                      h-12
                      w-12
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-[#c46f43]/10
                      text-lg
                      text-[#e09566]
                    "
                  >
                    ♥
                  </div>


                  <div>

                    <strong
                      className="
                        text-sm
                        text-white/80
                      "
                    >
                      Seus matches aparecerão aqui.
                    </strong>


                    <p
                      className="
                        mt-1
                        max-w-xl
                        text-[11px]
                        leading-5
                        text-white/35
                      "
                    >
                      Demonstre interesse em um perfil.
                      Se ela aceitar, a conexão aparecerá
                      nesta área.
                    </p>

                  </div>

                </div>

              ) : (

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    lg:grid-cols-4
                  "
                >

                  {matches.map(
                    (match) => {

                      const profissional =
                        acompanhantesMatches[
                          match.acompanhante_id
                        ];


                      if (
                        !profissional
                      ) {
                        return null;
                      }


                      return (

                        <Link
                          key={
                            match.id
                          }
                          href={
                            `/perfil/${profissional.id}`
                          }
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            transition
                            duration-200
                            hover:-translate-y-1
                            hover:border-[#e09566]/25
                          "
                        >

                          <div
                            className="
                              relative
                              aspect-[4/5]
                              overflow-hidden
                              bg-[#17120f]
                            "
                          >

                            {profissional.foto_capa ? (

                              <img
                                src={
                                  profissional.foto_capa
                                }
                                alt={
                                  profissional.nome_artistico ||
                                  "Perfil"
                                }
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />

                            ) : (

                              <div
                                className="
                                  grid
                                  h-full
                                  place-items-center
                                  text-[#7b503c]
                                "
                              >
                                ✦
                              </div>

                            )}


                            <span
                              className="
                                absolute
                                left-3
                                top-3
                                rounded-full
                                bg-[#e09566]
                                px-2.5
                                py-1.5
                                text-[7px]
                                font-black
                                tracking-[0.12em]
                                text-[#160b07]
                              "
                            >
                              MATCH
                            </span>

                          </div>


                          <div
                            className="
                              p-4
                            "
                          >

                            <strong
                              className="
                                block
                                text-sm
                                text-white/85
                              "
                            >
                              {profissional.nome_artistico ||
                                "Perfil"}

                              {profissional.idade &&
                                `, ${profissional.idade}`}
                            </strong>


                            <span
                              className="
                                mt-1
                                block
                                text-[9px]
                                text-white/35
                              "
                            >
                              {profissional.bairro ||
                                profissional.cidade ||
                                "Localização não informada"}
                            </span>

                          </div>

                        </Link>

                      );

                    }
                  )}

                </div>

              )}

            </section>


            {/* HISTÓRICO */}

            <section
              className="
                pb-10
              "
            >

              <div
                className="
                  mb-6
                "
              >

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[#c46f43]
                  "
                >
                  HISTÓRICO
                </span>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.045em]
                    text-[#f3e9e2]
                  "
                >
                  Experiências anteriores
                </h2>

              </div>


              {historico.length === 0 ? (

                <div
                  className="
                    flex
                    items-center
                    gap-5
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.02]
                    p-5
                  "
                >

                  <div
                    className="
                      grid
                      h-12
                      w-12
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-[#c46f43]/10
                      text-lg
                      text-[#e09566]
                    "
                  >
                    ◷
                  </div>


                  <div>

                    <strong
                      className="
                        text-sm
                        text-white/80
                      "
                    >
                      Seu histórico ainda está vazio.
                    </strong>


                    <p
                      className="
                        mt-1
                        text-[11px]
                        text-white/35
                      "
                    >
                      Suas experiências anteriores
                      serão organizadas aqui.
                    </p>

                  </div>

                </div>

              ) : (

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                  "
                >

                  {historico.map(
                    (item) => {

                      const profissional =
                        acompanhantesHistorico[
                          item.acompanhante_id
                        ];


                      if (
                        !profissional
                      ) {
                        return null;
                      }


                      return (

                        <Link
                          href={
                            `/perfil/${profissional.id}`
                          }
                          key={
                            item.id
                          }
                          className="
                            grid
                            grid-cols-[52px_1fr_auto]
                            items-center
                            gap-4
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.02]
                            p-3
                            transition
                            hover:border-white/10
                            hover:bg-white/[0.035]
                          "
                        >

                          <div
                            className="
                              grid
                              h-[52px]
                              w-[52px]
                              place-items-center
                              overflow-hidden
                              rounded-xl
                              bg-[#17120f]
                              text-[#77503c]
                            "
                          >

                            {profissional.foto_capa ? (

                              <img
                                src={
                                  profissional.foto_capa
                                }
                                alt=""
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />

                            ) : (
                              <span>
                                ✦
                              </span>
                            )}

                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <strong
                              className="
                                block
                                truncate
                                text-xs
                                text-white/80
                              "
                            >
                              {profissional.nome_artistico ||
                                "Perfil"}
                            </strong>


                            <span
                              className="
                                mt-1
                                block
                                text-[9px]
                                text-white/35
                              "
                            >
                              {nomePlano(
                                profissional.plano
                              )}

                              {" • "}

                              {new Date(
                                item.created_at
                              ).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>

                          </div>


                          <span
                            className="
                              rounded-full
                              bg-emerald-400/[0.08]
                              px-3
                              py-2
                              text-[8px]
                              font-bold
                              text-emerald-300/70
                            "
                          >
                            {item.status ===
                            "concluido"
                              ? "Concluído"
                              : "Cancelado"}
                          </span>

                        </Link>

                      );

                    }
                  )}

                </div>

              )}

            </section>


          </div>

        </section>

      </div>

    </main>
  );
}