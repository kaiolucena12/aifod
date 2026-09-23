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


  const [
    perfil,
    setPerfil,
  ] =
    useState<Perfil | null>(
      null
    );


  const [
    fotos,
    setFotos,
  ] =
    useState<Foto[]>([]);


  const [
    fotoAtiva,
    setFotoAtiva,
  ] =
    useState<string | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    erro,
    setErro,
  ] =
    useState("");


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    enviando,
    setEnviando,
  ] =
    useState(false);


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();


      /*
        PERFIL
      */

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


      if (
        error ||
        !data
      ) {

        setErro(
          "Este perfil não está disponível."
        );

        setLoading(false);

        return;
      }


      setPerfil(
        data
      );


      if (
        data.foto_capa
      ) {

        setFotoAtiva(
          data.foto_capa
        );

      }


      /*
        FOTOS
      */

      const {
        data:
          fotosData,
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


      if (
        fotosData
      ) {

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


    setEnviando(
      true
    );

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

      setEnviando(false);

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
        .from(
          "interesses"
        )
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


  function classePlano() {

    if (
      perfil?.plano ===
      "black"
    ) {

      return `
        border-[#d2a86b]/30
        bg-[#d2a86b]/10
        text-[#e8c986]
      `;

    }


    if (
      perfil?.plano ===
      "comfort"
    ) {

      return `
        border-[#e09566]/30
        bg-[#e09566]/10
        text-[#e7a77f]
      `;

    }


    return `
      border-white/15
      bg-black/35
      text-white/80
    `;

  }


  /*
    LOADING
  */

  if (loading) {

    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#0b0908]
          px-5
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
            Carregando perfil...
          </p>

        </div>

      </main>
    );

  }


  /*
    PERFIL INDISPONÍVEL
  */

  if (
    erro ||
    !perfil
  ) {

    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#0b0908]
          px-5
          text-[#f8f1e8]
        "
      >

        <section
          className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-white/[0.08]
            bg-white/[0.025]
            p-8
            text-center
          "
        >

          <span
            className="
              text-3xl
              text-[#c46f43]
            "
          >
            ✦
          </span>


          <h2
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Perfil indisponível
          </h2>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-white/40
            "
          >
            {erro}
          </p>


          <Link
            href="/cliente"
            className="
              mt-7
              inline-flex
              min-h-12
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-[#e09566]
              to-[#c46f43]
              px-6
              text-[10px]
              font-black
              text-[#160b07]
            "
          >
            Voltar
          </Link>

        </section>

      </main>
    );

  }


  /*
    GALERIA
  */

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

    <main
      className="
        min-h-screen
        bg-[#0b0908]
        px-4
        py-7
        text-[#f8f1e8]
        sm:px-6
        md:px-10
        md:py-10
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >


        {/* VOLTAR */}

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            text-[10px]
            text-white/35
            transition
            hover:text-white/70
          "
        >
          ← Voltar
        </button>


        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]
            lg:gap-12
          "
        >


          {/* =========================
              GALERIA
          ========================= */}

          <section>

            {/* FOTO PRINCIPAL */}

            <div
              className="
                relative
                aspect-[4/5]
                overflow-hidden
                rounded-[30px]
                border
                border-white/[0.08]
                bg-[#15110f]
                shadow-[0_35px_100px_rgba(0,0,0,0.38)]
                lg:aspect-[4/5.1]
              "
            >

              {fotoAtiva ? (

                <img
                  src={
                    fotoAtiva
                  }
                  alt={
                    perfil.nome_artistico ||
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
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    bg-[radial-gradient(circle,rgba(196,111,67,0.10),transparent_50%)]
                  "
                >

                  <span
                    className="
                      text-5xl
                      text-[#704b39]
                    "
                  >
                    ✦
                  </span>


                  <p
                    className="
                      text-[10px]
                      text-white/30
                    "
                  >
                    Fotos em breve
                  </p>

                </div>

              )}


              {/* GRADIENTE */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/45
                  via-transparent
                  to-transparent
                "
              />


              {/* PLANO */}

              <span
                className={`
                  absolute
                  left-5
                  top-5
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  backdrop-blur-xl
                  ${classePlano()}
                `}
              >
                {nomePlano()}
              </span>

            </div>


            {/* MINIATURAS */}

            {galeria.length > 1 && (

              <div
                className="
                  mt-3
                  grid
                  grid-cols-4
                  gap-2
                  sm:grid-cols-5
                "
              >

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
                      className={`
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        rounded-xl
                        border
                        transition

                        ${
                          fotoAtiva ===
                          foto.url
                            ? "border-[#e09566]/70 ring-1 ring-[#e09566]/20"
                            : "border-white/[0.07] opacity-60 hover:opacity-100"
                        }
                      `}
                    >

                      <img
                        src={
                          foto.url
                        }
                        alt=""
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </section>


          {/* =========================
              CONTEÚDO
          ========================= */}

          <section
            className="
              flex
              flex-col
              lg:py-4
            "
          >


            {/* PERFIL */}

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.24em]
                text-[#c46f43]
              "
            >
              PERFIL
            </span>


            <h1
              className="
                mt-3
                text-[48px]
                font-semibold
                leading-none
                tracking-[-0.055em]
                text-[#fff7f0]
                sm:text-6xl
              "
            >

              {perfil.nome_artistico ||
                "Perfil"}


              {perfil.idade && (

                <span
                  className="
                    ml-3
                    text-2xl
                    font-normal
                    text-white/45
                  "
                >
                  {perfil.idade}
                </span>

              )}

            </h1>


            {/* LOCALIZAÇÃO */}

            <div
              className="
                mt-5
                flex
                items-start
                gap-3
              "
            >

              <div
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#c46f43]/10
                  text-xs
                  text-[#e09566]
                "
              >
                ◉
              </div>


              <div>

                <strong
                  className="
                    block
                    text-[11px]
                    font-medium
                    text-white/65
                  "
                >

                  {perfil.bairro &&
                    `${perfil.bairro} • `}

                  {perfil.cidade}

                </strong>


                {perfil.estado && (

                  <small
                    className="
                      mt-1
                      block
                      text-[9px]
                      text-white/30
                    "
                  >
                    {perfil.estado}
                  </small>

                )}

              </div>

            </div>


            {/* DESCRIÇÃO */}

            {perfil.descricao_curta && (

              <p
                className="
                  mt-7
                  text-[15px]
                  leading-7
                  text-white/55
                "
              >
                {perfil.descricao_curta}
              </p>

            )}


            {/* INTERESSE */}

            <div
              className="
                mt-8
                rounded-[22px]
                border
                border-[#e09566]/15
                bg-[#c46f43]/[0.05]
                p-5
              "
            >

              <button
                type="button"
                onClick={
                  demonstrarInteresse
                }
                disabled={
                  enviando
                }
                className="
                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-gradient-to-r
                  from-[#e09566]
                  to-[#c46f43]
                  px-6
                  text-[11px]
                  font-black
                  text-[#160b07]
                  shadow-[0_15px_40px_rgba(196,111,67,0.18)]
                  transition
                  hover:-translate-y-0.5
                  disabled:cursor-wait
                  disabled:opacity-50
                "
              >

                <span
                  className="
                    text-lg
                  "
                >
                  ♥
                </span>


                {enviando
                  ? "Enviando..."
                  : "Tenho interesse"}

              </button>


              <small
                className="
                  mt-3
                  block
                  text-center
                  text-[8px]
                  leading-4
                  text-white/25
                "
              >
                Ela receberá seu interesse
                e poderá aceitar ou recusar.
              </small>

            </div>


            {/* MENSAGEM */}

            {message && (

              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-[#e09566]/15
                  bg-[#c46f43]/[0.05]
                  px-5
                  py-4
                  text-[10px]
                  leading-5
                  text-white/60
                "
              >
                {message}
              </div>

            )}


            {/* SOBRE */}

            <div
              className="
                mt-10
                border-t
                border-white/[0.06]
                pt-8
              "
            >

              <span
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#c46f43]
                "
              >
                SOBRE MIM
              </span>


              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.04em]
                  text-[#f3e9e2]
                "
              >
                Um pouco sobre
                {perfil.nome_artistico
                  ? ` ${perfil.nome_artistico}`
                  : " este perfil"}
              </h2>


              <p
                className="
                  mt-4
                  whitespace-pre-line
                  text-[12px]
                  leading-6
                  text-white/40
                "
              >
                {perfil.sobre ||
                  perfil.descricao_curta ||
                  "Mais informações estarão disponíveis em breve."}
              </p>

            </div>


            {/* DETALHES */}

            <div
              className="
                mt-8
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-3
                lg:grid-cols-1
                xl:grid-cols-3
              "
            >

              {/* CATEGORIA */}

              <article
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                "
              >

                <small
                  className="
                    text-[7px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-white/25
                  "
                >
                  CATEGORIA
                </small>


                <strong
                  className="
                    mt-2
                    block
                    text-sm
                    text-[#d2a86b]
                  "
                >
                  {nomePlano()}
                </strong>

              </article>


              {/* LOCALIZAÇÃO */}

              <article
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                "
              >

                <small
                  className="
                    text-[7px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-white/25
                  "
                >
                  LOCALIZAÇÃO
                </small>


                <strong
                  className="
                    mt-2
                    block
                    text-sm
                    text-white/65
                  "
                >
                  {perfil.bairro ||
                    perfil.cidade ||
                    "Não informado"}
                </strong>

              </article>


              {/* DISPONIBILIDADE */}

              <article
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                "
              >

                <small
                  className="
                    text-[7px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-white/25
                  "
                >
                  DISPONIBILIDADE
                </small>


                <strong
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-5
                    text-white/65
                  "
                >
                  {perfil.disponibilidade ||
                    "Consultar disponibilidade"}
                </strong>

              </article>

            </div>

          </section>

        </div>

      </div>

    </main>

  );
}