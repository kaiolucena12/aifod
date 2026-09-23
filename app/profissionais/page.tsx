"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


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
  preco_hora_centavos: number | null;
};


function ProfissionaisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plano =
    searchParams.get("plano") || "x";

  const cidade =
    searchParams.get("cidade");

  const bairro =
    searchParams.get("bairro");

  const [
    profissionais,
    setProfissionais,
  ] =
    useState<Profissional[]>([]);

  const [
    indice,
    setIndice,
  ] =
    useState(0);

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
    animacao,
    setAnimacao,
  ] =
    useState<
      "like" |
      "dislike" |
      null
    >(null);


  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");

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
            foto_capa,
            preco_hora_centavos
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

        setErro(
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
          (valor) =>
            valor + 1
        );

        setAnimacao(null);
        setMessage("");
      },
      280
    );
  }


  function recusar() {
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
      `Interesse enviado para ${
        atual.nome_artistico ||
        "este perfil"
      }.`
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


  function classePlano() {
    if (
      plano ===
      "black"
    ) {
      return `
        border-[#d2a86b]/30
        text-[#e9c785]
      `;
    }

    if (
      plano ===
      "comfort"
    ) {
      return `
        border-[#e09566]/25
        text-[#e7a77f]
      `;
    }

    return `
      border-white/15
      text-white
    `;
  }


  function formatarPreco(
    valor: number | null
  ) {
    if (
      valor === null ||
      valor === undefined ||
      valor <= 0
    ) {
      return "Valor a combinar";
    }

    return new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(
      valor / 100
    );
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
              text-white/45
            "
          >
            Buscando perfis...
          </p>
        </div>
      </main>
    );
  }


  if (erro) {
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
            border-white/10
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
            !
          </span>

          <h2
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Não foi possível carregar
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-white/45
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
              text-xs
              font-bold
              text-[#160b07]
            "
          >
            Voltar
          </Link>
        </section>
      </main>
    );
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#0b0908]
        px-4
        py-8
        text-[#f8f1e8]
        md:px-6
        md:py-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >

        {/* CABEÇALHO */}

        <header
          className="
            mb-8
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#c46f43]
              "
            >
              {nomePlano()}
            </span>

            <h1
              className="
                mt-2
                max-w-2xl
                text-[40px]
                font-semibold
                leading-[0.95]
                tracking-[-0.055em]
                text-[#fff7f1]
                md:text-6xl
              "
            >
              Descubra quem{" "}

              <span
                className="
                  text-[#d17b50]
                "
              >
                desperta seu interesse.
              </span>
            </h1>
          </div>


          {(cidade || bairro) && (
            <div
              className="
                flex
                flex-col
                gap-1
                md:items-end
              "
            >
              {cidade && (
                <strong
                  className="
                    text-xs
                    font-medium
                    text-white/80
                  "
                >
                  {cidade}
                </strong>
              )}

              {bairro && (
                <span
                  className="
                    text-[10px]
                    text-white/40
                  "
                >
                  {bairro}
                </span>
              )}
            </div>
          )}
        </header>


        {/* MENSAGEM */}

        {message && (
          <div
            className="
              mx-auto
              mb-4
              w-full
              max-w-[430px]
              rounded-2xl
              border
              border-[#e09566]/15
              bg-[#c46f43]/[0.06]
              px-4
              py-3
              text-[11px]
              text-white/65
            "
          >
            {message}
          </div>
        )}


        {/* SEM MAIS PERFIS */}

        {!atual ? (

          <section
            className="
              mx-auto
              mt-24
              w-full
              max-w-md
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
                text-[#f8f1e8]
              "
            >
              Você chegou ao fim
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-white/40
              "
            >
              Não há mais perfis disponíveis
              nesta seleção por enquanto.
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
                text-xs
                font-bold
                text-[#160b07]
                transition
                hover:-translate-y-0.5
              "
            >
              Voltar às opções
            </Link>
          </section>

        ) : (

          <div
            className="
              mx-auto
              w-full
              max-w-[430px]
            "
          >

            {/* CARD */}

            <article
              className={`
                overflow-hidden
                rounded-[30px]
                border
                border-white/[0.08]
                bg-[#15110f]
                shadow-[0_35px_90px_rgba(0,0,0,0.52)]
                transition-all
                duration-300

                ${
                  animacao === "like"
                    ? "translate-x-[120px] rotate-[8deg] opacity-0"
                    : ""
                }

                ${
                  animacao === "dislike"
                    ? "-translate-x-[120px] -rotate-[8deg] opacity-0"
                    : ""
                }
              `}
            >

              <Link
                href={`/perfil/${atual.id}`}
                className="
                  block
                  text-inherit
                  no-underline
                "
              >

                {/* FOTO */}

                <div
                  className="
                    relative
                    h-[520px]
                    overflow-hidden
                    bg-[#181310]
                    sm:h-[560px]
                  "
                >

                  {atual.foto_capa ? (
                    <img
                      src={
                        atual.foto_capa
                      }
                      alt={
                        atual.nome_artistico ||
                        "Perfil"
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-[1.025]
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        bg-[radial-gradient(circle,rgba(196,111,67,0.10),transparent_50%)]
                      "
                    >
                      <span
                        className="
                          text-4xl
                          text-[#704b39]
                        "
                      >
                        ✦
                      </span>

                      <small
                        className="
                          text-[10px]
                          text-white/35
                        "
                      >
                        Foto em breve
                      </small>
                    </div>
                  )}


                  {/* GRADIENTE */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-b
                      from-transparent
                      via-transparent
                      to-black/90
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
                      bg-black/45
                      px-3
                      py-2
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      backdrop-blur-xl
                      ${classePlano()}
                    `}
                  >
                    {nomePlano()}
                  </span>


                  {/* PREÇO JÁ VISÍVEL NO CARD */}

                  <div
                    className="
                      absolute
                      right-5
                      top-5
                      z-20
                      rounded-full
                      border
                      border-[#d2a86b]/35
                      bg-black/70
                      px-4
                      py-2.5
                      text-right
                      backdrop-blur-xl
                      shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                    "
                  >
                    <strong
                      className="
                        block
                        text-[14px]
                        font-black
                        leading-none
                        text-[#f0cf91]
                      "
                    >
                      {formatarPreco(
                        atual.preco_hora_centavos
                      )}
                    </strong>

                    {atual.preco_hora_centavos &&
                      atual.preco_hora_centavos > 0 && (
                        <small
                          className="
                            mt-1
                            block
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-white/45
                          "
                        >
                          por hora
                        </small>
                      )}
                  </div>


                  {/* INFORMAÇÕES */}

                  <div
                    className="
                      absolute
                      bottom-5
                      left-5
                      right-5
                      z-10
                      flex
                      items-end
                      justify-between
                      gap-4
                    "
                  >
                    <div>

                      <h2
                        className="
                          m-0
                          text-[34px]
                          font-semibold
                          leading-none
                          tracking-[-0.05em]
                          text-white
                        "
                      >
                        {atual.nome_artistico ||
                          "Perfil"}

                        {atual.idade && (
                          <span
                            className="
                              ml-2
                              text-xl
                              font-normal
                              text-white/70
                            "
                          >
                            {atual.idade}
                          </span>
                        )}
                      </h2>


                      <p
                        className="
                          mt-2
                          text-[11px]
                          text-white/65
                        "
                      >
                        {atual.bairro &&
                          `${atual.bairro} • `}

                        {atual.cidade}

                        {atual.estado &&
                          `, ${atual.estado}`}
                      </p>

                      <strong
                        className="
                          mt-3
                          block
                          text-[16px]
                          font-semibold
                          tracking-[-0.02em]
                          text-[#f0cf91]
                        "
                      >
                        {formatarPreco(
                          atual.preco_hora_centavos
                        )}

                        {atual.preco_hora_centavos &&
                          atual.preco_hora_centavos > 0 && (
                            <span
                              className="
                                ml-1
                                text-[9px]
                                font-medium
                                text-white/45
                              "
                            >
                              / hora
                            </span>
                          )}
                      </strong>
                    </div>


                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        whitespace-nowrap
                        text-[9px]
                        text-white/70
                      "
                    >
                      Ver perfil

                      <b
                        className="
                          text-sm
                          text-[#d17b50]
                        "
                      >
                        ↗
                      </b>
                    </span>
                  </div>

                </div>


                {/* BIO */}

                {atual.descricao_curta && (
                  <p
                    className="
                      m-0
                      px-5
                      pb-1
                      pt-4
                      text-[11px]
                      leading-6
                      text-white/45
                    "
                  >
                    {atual.descricao_curta}
                  </p>
                )}

              </Link>


              {/* AÇÕES */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-7
                  px-5
                  pb-6
                  pt-5
                "
              >

                <button
                  type="button"
                  onClick={
                    recusar
                  }
                  aria-label="Não tenho interesse"
                  className="
                    grid
                    h-14
                    w-14
                    place-items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.035]
                    text-xl
                    text-white/45
                    transition
                    hover:-translate-y-1
                    hover:bg-white/[0.07]
                    hover:text-white/80
                  "
                >
                  ✕
                </button>


                <button
                  type="button"
                  onClick={
                    curtir
                  }
                  aria-label="Demonstrar interesse"
                  className="
                    grid
                    h-[68px]
                    w-[68px]
                    place-items-center
                    rounded-full
                    bg-gradient-to-br
                    from-[#f2ab7c]
                    to-[#c35f3c]
                    text-[28px]
                    text-[#190b08]
                    shadow-[0_15px_38px_rgba(196,95,60,0.24)]
                    transition
                    hover:-translate-y-1
                    hover:scale-105
                  "
                >
                  ♥
                </button>

              </div>

            </article>


            {/* CONTADOR */}

            <p
              className="
                mt-4
                text-center
                text-[9px]
                text-white/30
              "
            >
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


/*
  O useSearchParams precisa estar
  dentro do Suspense no Next.js 15.
*/

export default function ProfissionaisPage() {
  return (
    <Suspense
      fallback={
        <main
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#0b0908]
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
                text-white/45
              "
            >
              Buscando perfis...
            </p>
          </div>
        </main>
      }
    >
      <ProfissionaisContent />
    </Suspense>
  );
}