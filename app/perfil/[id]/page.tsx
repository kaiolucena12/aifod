"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


type Perfil = {
  id: string;
  nome_artistico: string | null;
  idade: number | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  plano: string | null;
  descricao_curta: string | null;
  sobre: string | null;
  disponibilidade: string | null;
  foto_capa: string | null;
};


type Foto = {
  id: string;
  url: string;
  ordem: number;
};


export default function PerfilPublicoPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const id =
    params.id as string;


  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [fotos, setFotos] =
    useState<Foto[]>([]);

  const [fotoAtiva, setFotoAtiva] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [enviando, setEnviando] =
    useState(false);


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();


      /* PERFIL */

      const {
        data,
        error,
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
            estado,
            plano,
            descricao_curta,
            sobre,
            disponibilidade,
            foto_capa
          `)
          .eq(
            "id",
            id
          )
          .eq(
            "status",
            "aprovado"
          )
          .single();


      if (error || !data) {

        setErro(
          "Este perfil não está disponível."
        );

        setLoading(false);

        return;
      }


      setPerfil(data);


      if (
        data.foto_capa
      ) {

        setFotoAtiva(
          data.foto_capa
        );
      }


      /* FOTOS */

      const {
        data: fotosData,
      } =
        await supabase
          .from(
            "profile_photos"
          )
          .select(`
            id,
            url,
            ordem
          `)
          .eq(
            "acompanhante_id",
            id
          )
          .order(
            "ordem",
            {
              ascending: true,
            }
          );


      if (fotosData) {

        setFotos(
          fotosData
        );


        if (
          !data.foto_capa &&
          fotosData.length > 0
        ) {

          setFotoAtiva(
            fotosData[0].url
          );

        }

      }


      setLoading(false);
    }


    if (id) {

      carregar();

    }

  }, [id]);


  async function demonstrarInteresse() {

    if (
      !perfil ||
      enviando
    ) {
      return;
    }


    setEnviando(true);
    setMessage("");


    const supabase =
      createClient();


    const {
      data: {
        user,
      },
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

      setEnviando(false);

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
              perfil.id,

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

      setMessage(
        "Não foi possível enviar seu interesse."
      );

      setEnviando(false);

      return;
    }


    setMessage(
      "Interesse enviado com sucesso."
    );

    setEnviando(false);
  }


  function nomePlano() {

    if (
      perfil?.plano ===
      "comfort"
    ) {

      return "Comfort";

    }

    if (
      perfil?.plano ===
      "black"
    ) {

      return "Black";

    }

    return "X";
  }


  if (loading) {

    return (
      <main className="publicProfilePage">

        <div className="discoveryLoading">

          <span
            className="loginLoader"
          />

          <p>
            Carregando perfil...
          </p>

        </div>

      </main>
    );
  }


  if (
    erro ||
    !perfil
  ) {

    return (
      <main className="publicProfilePage">

        <div className="discoveryEmpty">

          <span>
            ✦
          </span>

          <h2>
            Perfil indisponível
          </h2>

          <p>
            {erro}
          </p>

          <Link
            href="/profissionais"
            className="heroButton"
          >
            Voltar
          </Link>

        </div>

      </main>
    );
  }


  const galeria = [

    ...(perfil.foto_capa
      ? [
          {
            id: "capa",
            url:
              perfil.foto_capa,
            ordem: -1,
          },
        ]
      : []),

    ...fotos.filter(
      (foto) =>
        foto.url !==
        perfil.foto_capa
    ),

  ];


  return (
    <main className="publicProfilePage">

      <div className="publicProfileContainer">


        {/* VOLTAR */}

        <button
          type="button"
          className="publicProfileBack"
          onClick={() =>
            router.back()
          }
        >
          ← Voltar
        </button>


        <div className="publicProfileGrid">


          {/* GALERIA */}

          <section className="publicProfileGallery">

            <div className="publicProfileMainPhoto">

              {fotoAtiva ? (

                <img
                  src={
                    fotoAtiva
                  }
                  alt={
                    perfil.nome_artistico ||
                    "Perfil"
                  }
                />

              ) : (

                <div className="publicProfilePlaceholder">

                  <span>
                    ✦
                  </span>

                  <p>
                    Fotos em breve
                  </p>

                </div>

              )}


              <span
                className={`publicProfilePlan publicProfilePlan-${perfil.plano}`}
              >
                {nomePlano()}
              </span>

            </div>


            {galeria.length > 1 && (

              <div className="publicProfileThumbs">

                {galeria.map(
                  (foto) => (

                    <button
                      key={
                        foto.id
                      }
                      type="button"
                      onClick={() =>
                        setFotoAtiva(
                          foto.url
                        )
                      }
                      className={
                        fotoAtiva ===
                        foto.url
                          ? "active"
                          : ""
                      }
                    >

                      <img
                        src={
                          foto.url
                        }
                        alt=""
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </section>


          {/* INFORMAÇÕES */}

          <section className="publicProfileContent">

            <span className="eyebrow">
              PERFIL
            </span>


            <h1>

              {perfil.nome_artistico ||
                "Perfil"}

              {perfil.idade && (

                <small>
                  {perfil.idade}
                </small>

              )}

            </h1>


            <div className="publicProfileLocation">

              <span>
                ◉
              </span>

              <div>

                <strong>

                  {perfil.bairro &&
                    `${perfil.bairro} • `}

                  {perfil.cidade}

                </strong>

                {perfil.estado && (

                  <small>
                    {perfil.estado}
                  </small>

                )}

              </div>

            </div>


            {perfil.descricao_curta && (

              <p className="publicProfileIntro">

                {perfil.descricao_curta}

              </p>

            )}


            {/* CTA */}

            <div className="publicProfileInterest">

              <button
                type="button"
                onClick={
                  demonstrarInteresse
                }
                disabled={
                  enviando
                }
              >

                <span>
                  ♥
                </span>

                {enviando
                  ? "Enviando..."
                  : "Tenho interesse"}

              </button>


              <small>
                Ela receberá seu interesse
                e poderá aceitar ou recusar.
              </small>

            </div>


            {message && (

              <div className="discoveryMessage">

                {message}

              </div>

            )}


            {/* SOBRE */}

            <div className="publicProfileSection">

              <span className="eyebrow">
                SOBRE MIM
              </span>

              <h2>
                Um pouco sobre
                {perfil.nome_artistico
                  ? ` ${perfil.nome_artistico}`
                  : " este perfil"}
              </h2>


              <p>

                {perfil.sobre ||
                  perfil.descricao_curta ||
                  "Mais informações estarão disponíveis em breve."}

              </p>

            </div>


            {/* INFORMAÇÕES */}

            <div className="publicProfileDetails">


              <div>

                <small>
                  CATEGORIA
                </small>

                <strong>
                  {nomePlano()}
                </strong>

              </div>


              <div>

                <small>
                  LOCALIZAÇÃO
                </small>

                <strong>

                  {perfil.bairro ||
                    perfil.cidade ||
                    "Não informado"}

                </strong>

              </div>


              <div>

                <small>
                  DISPONIBILIDADE
                </small>

                <strong>

                  {perfil.disponibilidade ||
                    "Consultar disponibilidade"}

                </strong>

              </div>


            </div>

          </section>


        </div>

      </div>

    </main>
  );
}