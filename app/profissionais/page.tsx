"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";


type Profissional = {
  id: string;
  nome_artistico: string | null;
  idade: number | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  plano: string | null;
  descricao_curta: string | null;
  foto_capa: string | null;
};


export default function ProfissionaisPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const plano =
    searchParams.get("plano") || "x";

  const cidade =
    searchParams.get("cidade");

  const bairro =
    searchParams.get("bairro");


  const [profissionais, setProfissionais] =
    useState<Profissional[]>([]);

  const [indice, setIndice] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [animacao, setAnimacao] =
    useState<
      "like" |
      "dislike" |
      null
    >(null);


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();

      let query =
        supabase
          .from(
            "acompanhante_profiles"
          )
          .select(`
            id,
            nome_artistico,
            idade,
            bairro,
            cidade,
            estado,
            plano,
            descricao_curta,
            foto_capa
          `)
          .eq(
            "status",
            "aprovado"
          )
          .eq(
            "plano",
            plano
          );


      if (cidade) {

        query =
          query.eq(
            "cidade",
            cidade
          );
      }


      if (bairro) {

        query =
          query.eq(
            "bairro",
            bairro
          );
      }


      const {
        data,
        error,
      } =
        await query.order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (error) {

        console.error(error);

        setMessage(
          "Não foi possível carregar os perfis."
        );

        setLoading(false);

        return;
      }


      setProfissionais(
        data || []
      );

      setIndice(0);

      setLoading(false);
    }


    carregar();

  }, [
    plano,
    cidade,
    bairro,
  ]);


  const atual =
    profissionais[indice];


  function proximo(
    tipo:
      | "like"
      | "dislike"
  ) {

    setAnimacao(tipo);

    window.setTimeout(
      () => {

        setIndice(
          (atual) =>
            atual + 1
        );

        setAnimacao(null);

      },
      280
    );
  }


  async function recusar() {

    proximo(
      "dislike"
    );
  }


  async function curtir() {

    if (!atual) {
      return;
    }


    const supabase =
      createClient();


    const {
      data: { user },
    } =
      await supabase.auth.getUser();


    if (!user) {

      router.push(
        "/login"
      );

      return;
    }


    const {
      data: profile,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          user.id
        )
        .single();


    if (
      profile?.role !==
      "cliente"
    ) {

      setMessage(
        "Entre com uma conta de cliente para demonstrar interesse."
      );

      return;
    }


    const {
      error,
    } =
      await supabase
        .from("interesses")
        .upsert(
          {
            cliente_id:
              user.id,

            acompanhante_id:
              atual.id,

            status:
              "pendente",

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              "cliente_id,acompanhante_id",
          }
        );


    if (error) {

      console.error(error);

      setMessage(
        "Não foi possível registrar seu interesse."
      );

      return;
    }


    setMessage(
      `Interesse enviado para ${atual.nome_artistico || "este perfil"}.`
    );


    proximo(
      "like"
    );
  }


  function nomePlano() {

    if (
      plano ===
      "comfort"
    ) {
      return "Comfort";
    }

    if (
      plano ===
      "black"
    ) {
      return "Black";
    }

    return "X";
  }


  if (loading) {

    return (
      <main className="discoveryPage">

        <div className="discoveryLoading">

          <span
            className="loginLoader"
          />

          <p>
            Buscando perfis...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="discoveryPage">

      <div className="discoveryContainer">

        {/* CABEÇALHO */}

        <div className="discoveryHeader">

          <div>

            <span className="eyebrow">
              {nomePlano()}
            </span>

            <h1>
              Descubra quem
              <em> desperta seu interesse.</em>
            </h1>

          </div>


          <div className="discoveryLocation">

            {cidade && (
              <strong>
                {cidade}
              </strong>
            )}

            {bairro && (
              <span>
                {bairro}
              </span>
            )}

          </div>

        </div>


        {/* MENSAGEM */}

        {message && (

          <div className="discoveryMessage">
            {message}
          </div>

        )}


        {/* ACABARAM OS PERFIS */}

        {!atual ? (

          <section className="discoveryEmpty">

            <span>
              ✦
            </span>

            <h2>
              Você chegou ao fim
            </h2>

            <p>
              Não há mais perfis disponíveis
              nesta seleção por enquanto.
            </p>

            <Link
              href="/"
              className="heroButton"
            >
              Explorar outras opções
            </Link>

          </section>

        ) : (

          <div className="discoveryDeck">

            {/* CARD */}

            <article
              className={`
                discoveryCard
                ${
                  animacao ===
                  "like"
                    ? "discoveryLike"
                    : ""
                }
                ${
                  animacao ===
                  "dislike"
                    ? "discoveryDislike"
                    : ""
                }
              `}
            >

              <Link
                href={`/perfil/${atual.id}`}
                className="discoveryCardLink"
              >

                <div className="discoveryPhoto">

                  {atual.foto_capa ? (

                    <img
                      src={
                        atual.foto_capa
                      }
                      alt={
                        atual.nome_artistico ||
                        "Perfil"
                      }
                    />

                  ) : (

                    <div className="discoveryPhotoPlaceholder">
                      <span>
                        ✦
                      </span>

                      <small>
                        Foto em breve
                      </small>
                    </div>

                  )}


                  <div className="discoveryGradient" />


                  {/* PLANO */}

                  <span
                    className={`discoveryPlan discoveryPlan-${plano}`}
                  >
                    {nomePlano()}
                  </span>


                  {/* DADOS */}

                  <div className="discoveryInfo">

                    <div>

                      <h2>
                        {atual.nome_artistico ||
                          "Perfil"}
                        
                        {atual.idade && (
                          <small>
                            {" "}
                            {atual.idade}
                          </small>
                        )}
                      </h2>


                      <p>
                        {atual.bairro &&
                          `${atual.bairro} • `}

                        {atual.cidade}

                        {atual.estado &&
                          `, ${atual.estado}`}
                      </p>

                    </div>


                    <span className="discoveryOpen">
                      Ver perfil
                      <b>
                        ↗
                      </b>
                    </span>

                  </div>

                </div>


                {atual.descricao_curta && (

                  <p className="discoveryBio">
                    {atual.descricao_curta}
                  </p>

                )}

              </Link>


              {/* AÇÕES */}

              <div className="discoveryActions">

                <button
                  type="button"
                  className="discoveryReject"
                  onClick={
                    recusar
                  }
                  aria-label="Não tenho interesse"
                >
                  ✕
                </button>


                <button
                  type="button"
                  className="discoveryHeart"
                  onClick={
                    curtir
                  }
                  aria-label="Demonstrar interesse"
                >
                  ♥
                </button>

              </div>

            </article>


            {/* CONTADOR */}

            <p className="discoveryCounter">

              {indice + 1}
              {" de "}
              {profissionais.length}

            </p>

          </div>

        )}

      </div>

    </main>
  );
}