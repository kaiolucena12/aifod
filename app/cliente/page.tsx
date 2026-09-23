"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

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

  const router =
    useRouter();


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
        PERFIL DO CLIENTE
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
          (
            profissional
          ) => {

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
          (
            profissional
          ) => {

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


  /*
    SAIR
  */

  async function sair() {

    const supabase =
      createClient();


    await supabase.auth.signOut();


    router.replace("/");

    router.refresh();

  }


  /*
    PRIMEIRO NOME
  */

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


  /*
    NOME DO PLANO
  */

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


  /*
    CARREGAMENTO
  */

  if (loading) {

    return (
      <main className="clientDashboardPage">

        <div className="dashboardLoading">

          <span
            className="loginLoader"
          />

          <p>
            Preparando sua experiência...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="clientDashboardPage">

      <div className="clientDashboardShell">


        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="clientSidebar">


          <Link
            href="/"
            className="clientSidebarLogo"
          >

            <span>
              A
            </span>

            <strong>
              AiFod
            </strong>

          </Link>


          {/* SOMENTE INÍCIO */}

          <nav className="clientSidebarNav">

            <Link
              href="/cliente"
              className="active"
            >

              <span>
                ⌂
              </span>

              Início

            </Link>

          </nav>


          {/* USUÁRIO */}

          <div className="clientSidebarBottom">

            <div className="clientSidebarUser">

              <div className="clientSidebarAvatar">

                {primeiroNome()
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <strong>
                  {primeiroNome()}
                </strong>

                <small>
                  Cliente
                </small>

              </div>

            </div>


            <button
              type="button"
              onClick={sair}
            >
              Sair
            </button>

          </div>

        </aside>


        {/* =========================
            CONTEÚDO
        ========================= */}

        <section className="clientDashboardContent">


          {/* CABEÇALHO */}

          <header className="clientDashboardHeader">

            <div>

              <span className="eyebrow">
                SUA EXPERIÊNCIA
              </span>


              <h1>

                Olá,{" "}

                <em>
                  {primeiroNome()}.
                </em>

              </h1>


              <p>
                Escolha a experiência
                que combina com seu momento.
              </p>

            </div>

          </header>


          {/* =========================
              ESCOLHER EXPERIÊNCIA
          ========================= */}

          <section className="clientSection">

            <div className="clientSectionHeader">

              <div>

                <span className="eyebrow">
                  ESCOLHA SUA EXPERIÊNCIA
                </span>

                <h2>
                  O que você procura hoje?
                </h2>

              </div>

            </div>


            <div className="clientExperienceArea">

              <ExperienceCards />

            </div>

          </section>


          {/* =========================
              MATCHES
          ========================= */}

          <section className="clientSection">

            <div className="clientSectionHeader">

              <div>

                <span className="eyebrow">
                  CONEXÕES
                </span>

                <h2>
                  Seus matches
                </h2>

              </div>

            </div>


            {matches.length ===
            0 ? (

              <div className="clientEmptyState">

                <span>
                  ♥
                </span>


                <div>

                  <strong>
                    Seus matches aparecerão aqui.
                  </strong>


                  <p>
                    Demonstre interesse em um
                    perfil. Se ela aceitar,
                    a conexão aparecerá nesta área.
                  </p>

                </div>

              </div>

            ) : (

              <div className="clientMatchesGrid">

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
                        className="clientMatchCard"
                      >

                        <div className="clientMatchPhoto">


                          {profissional.foto_capa ? (

                            <img
                              src={
                                profissional.foto_capa
                              }
                              alt={
                                profissional.nome_artistico ||
                                "Perfil"
                              }
                            />

                          ) : (

                            <div>
                              ✦
                            </div>

                          )}


                          <span>
                            MATCH
                          </span>

                        </div>


                        <div className="clientMatchInfo">

                          <strong>

                            {profissional.nome_artistico ||
                              "Perfil"}

                            {profissional.idade &&
                              `, ${profissional.idade}`}

                          </strong>


                          <small>

                            {profissional.bairro ||
                              profissional.cidade ||
                              "Localização não informada"}

                          </small>

                        </div>

                      </Link>

                    );

                  }
                )}

              </div>

            )}

          </section>


          {/* =========================
              HISTÓRICO
          ========================= */}

          <section className="clientSection">

            <div className="clientSectionHeader">

              <div>

                <span className="eyebrow">
                  HISTÓRICO
                </span>

                <h2>
                  Experiências anteriores
                </h2>

              </div>

            </div>


            {historico.length ===
            0 ? (

              <div className="clientEmptyHistory">

                <span>
                  ◷
                </span>


                <div>

                  <strong>
                    Seu histórico ainda
                    está vazio.
                  </strong>


                  <p>
                    Suas experiências anteriores
                    serão organizadas aqui.
                  </p>

                </div>

              </div>

            ) : (

              <div className="clientHistoryList">

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
                        className="clientHistoryItem"
                      >

                        <div className="clientHistoryPhoto">


                          {profissional.foto_capa ? (

                            <img
                              src={
                                profissional.foto_capa
                              }
                              alt={
                                profissional.nome_artistico ||
                                "Perfil"
                              }
                            />

                          ) : (

                            <span>
                              ✦
                            </span>

                          )}

                        </div>


                        <div className="clientHistoryInfo">

                          <strong>

                            {profissional.nome_artistico ||
                              "Perfil"}

                          </strong>


                          <small>

                            {nomePlano(
                              profissional.plano
                            )}

                            {" • "}

                            {new Date(
                              item.created_at
                            ).toLocaleDateString(
                              "pt-BR"
                            )}

                          </small>

                        </div>


                        <span className="clientHistoryStatus">

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


        </section>

      </div>

    </main>
  );
}