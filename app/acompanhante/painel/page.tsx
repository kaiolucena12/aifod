"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";


type Acompanhante = {
  nome_artistico: string | null;
  status: string | null;
  plano: string | null;
};


type Interesse = {
  id: string;
  cliente_id: string;
  status: string;
  created_at: string;
};


type Match = {
  id: string;
  cliente_id: string;
  created_at: string;
};


export default function PainelAcompanhantePage() {

  const router = useRouter();

  const [perfil, setPerfil] =
    useState<Acompanhante | null>(null);

  const [interesses, setInteresses] =
    useState<Interesse[]>([]);

  const [matches, setMatches] =
    useState<Match[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();


      /* USUÁRIO */

      const {
        data: { user },
      } =
        await supabase.auth.getUser();


      if (!user) {

        router.replace(
          "/login"
        );

        return;
      }


      /* CONFERE ROLE */

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();


      if (
        !profile ||
        profile.role !==
          "acompanhante"
      ) {

        router.replace(
          "/profissionais"
        );

        return;
      }


      /* PERFIL */

      const {
        data:
          acompanhanteData,
      } =
        await supabase
          .from(
            "acompanhante_profiles"
          )
          .select(`
            nome_artistico,
            status,
            plano
          `)
          .eq("id", user.id)
          .single();


      if (acompanhanteData) {

        setPerfil(
          acompanhanteData
        );
      }


      /* INTERESSES */

      const {
        data:
          interessesData,
      } =
        await supabase
          .from("interesses")
          .select(`
            id,
            cliente_id,
            status,
            created_at
          `)
          .eq(
            "acompanhante_id",
            user.id
          )
          .eq(
            "status",
            "pendente"
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );


      setInteresses(
        interessesData || []
      );


      /* MATCHES */

      const {
        data:
          matchesData,
      } =
        await supabase
          .from("matches")
          .select(`
            id,
            cliente_id,
            created_at
          `)
          .eq(
            "acompanhante_id",
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
          );


      setMatches(
        matchesData || []
      );


      setLoading(false);
    }


    carregar();

  }, [router]);


  async function responderInteresse(
    id: string,
    resposta:
      | "aceito"
      | "recusado"
  ) {

    const supabase =
      createClient();


    const {
      error,
    } =
      await supabase
        .from("interesses")
        .update({
          status:
            resposta,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          id
        );


    if (error) {

      setMessage(
        "Não foi possível atualizar o interesse."
      );

      return;
    }


    setInteresses(
      (atual) =>
        atual.filter(
          (item) =>
            item.id !== id
        )
    );


    if (
      resposta === "aceito"
    ) {

      setMessage(
        "Interesse aceito. Um novo match foi criado."
      );

    } else {

      setMessage(
        "Interesse recusado."
      );
    }

  }


  async function sair() {

    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.replace("/");

    router.refresh();
  }


  if (loading) {

    return (
      <main className="dashboardPage">

        <div className="dashboardLoading">

          <span
            className="loginLoader"
          />

          <p>
            Carregando seu painel...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="dashboardPage">

      <div className="dashboardContainer">


        {/* TOPO */}

        <div className="dashboardTop">

          <div>

            <span className="eyebrow">
              PAINEL AIFOD
            </span>

            <h1>
              Olá,{" "}

              <em>
                {perfil?.nome_artistico ||
                  "bem-vinda"}
              </em>
            </h1>

            <p>
              Veja quem demonstrou interesse
              no seu perfil e acompanhe seus
              matches.
            </p>

          </div>


          <button
            type="button"
            className="dashboardLogout"
            onClick={sair}
          >
            Sair
          </button>

        </div>


        {/* RESUMO */}

        <section className="dashboardGrid">

          <article className="dashboardCard">

            <small>
              NOVOS INTERESSES
            </small>

            <h2>
              {interesses.length}
            </h2>

            <p>
              Pessoas aguardando
              sua resposta.
            </p>

          </article>


          <article className="dashboardCard">

            <small>
              MATCHES
            </small>

            <h2>
              {matches.length}
            </h2>

            <p>
              Conexões ativas.
            </p>

          </article>


          <article className="dashboardCard">

            <small>
              SEU PLANO
            </small>

            <h2>
              {perfil?.plano ===
              "black"
                ? "Black"
                : perfil?.plano ===
                    "comfort"
                  ? "Comfort"
                  : "X"}
            </h2>

            <p>
              Categoria atual
              do seu perfil.
            </p>

          </article>

        </section>


        {/* MENSAGEM */}

        {message && (

          <div className="registerMessage">

            {message}

          </div>

        )}


        {/* INTERESSES */}

        <section className="dashboardActions">

          <div className="dashboardSectionTitle">

            <span className="eyebrow">
              NOVOS INTERESSES
            </span>

            <h2>
              Quem quer conhecer você
            </h2>

          </div>


          {interesses.length === 0 ? (

            <div className="dashboardCard">

              <h2>
                Nenhum novo interesse
              </h2>

              <p>
                Quando alguém clicar no
                coração do seu perfil,
                aparecerá aqui.
              </p>

            </div>

          ) : (

            <div className="dashboardActionsGrid">

              {interesses.map(
                (interesse) => (

                  <article
                    className="dashboardActionCard"
                    key={
                      interesse.id
                    }
                  >

                    <span>
                      ♥
                    </span>


                    <div>

                      <strong>
                        Novo interesse
                      </strong>

                      <small>
                        Um cliente demonstrou
                        interesse no seu perfil.
                      </small>

                    </div>


                    <div className="interestActions">

                      <button
                        type="button"
                        onClick={() =>
                          responderInteresse(
                            interesse.id,
                            "recusado"
                          )
                        }
                      >
                        Recusar
                      </button>


                      <button
                        type="button"
                        className="interestAccept"
                        onClick={() =>
                          responderInteresse(
                            interesse.id,
                            "aceito"
                          )
                        }
                      >
                        Aceitar
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* MATCHES */}

        <section
          className="dashboardActions"
          style={{
            marginTop: "55px",
          }}
        >

          <div className="dashboardSectionTitle">

            <span className="eyebrow">
              MATCHES
            </span>

            <h2>
              Suas conexões
            </h2>

          </div>


          {matches.length === 0 ? (

            <div className="dashboardCard">

              <h2>
                Nenhum match ainda
              </h2>

              <p>
                Quando você aceitar um
                interesse, o match aparecerá
                aqui.
              </p>

            </div>

          ) : (

            <div className="dashboardActionsGrid">

              {matches.map(
                (match) => (

                  <article
                    className="dashboardActionCard"
                    key={
                      match.id
                    }
                  >

                    <span>
                      ✦
                    </span>

                    <div>

                      <strong>
                        Match
                      </strong>

                      <small>
                        Nova conexão criada.
                      </small>

                    </div>

                    <b>
                      →
                    </b>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ACESSO PERFIL */}

        <section
          className="dashboardActions"
          style={{
            marginTop: "55px",
          }}
        >

          <div className="dashboardSectionTitle">

            <span className="eyebrow">
              MINHA CONTA
            </span>

            <h2>
              Gerencie seu perfil
            </h2>

          </div>


          <div className="dashboardActionsGrid">

            <Link
              href="/acompanhante/perfil"
              className="dashboardActionCard"
            >

              <span>
                01
              </span>

              <div>

                <strong>
                  Meu perfil
                </strong>

                <small>
                  Dados, descrição,
                  localização e informações.
                </small>

              </div>

              <b>
                →
              </b>

            </Link>


            <Link
              href="/acompanhante/perfil"
              className="dashboardActionCard"
            >

              <span>
                02
              </span>

              <div>

                <strong>
                  Minhas fotos
                </strong>

                <small>
                  Gerencie as imagens
                  do seu perfil.
                </small>

              </div>

              <b>
                →
              </b>

            </Link>

          </div>

        </section>


      </div>

    </main>
  );
}