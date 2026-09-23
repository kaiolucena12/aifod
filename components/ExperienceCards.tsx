"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


type Plano =
  | "x"
  | "comfort"
  | "black";


type Localizacao = {
  cidade: string;
  bairro: string | null;
  total: number | string;
};


type PlanoConfig = {
  id: Plano;
  numero: string;
  nome: string;
  subtitulo: string;
  descricao: string;
};


const planos: PlanoConfig[] = [
  {
    id: "x",
    numero: "01",
    nome: "X",
    subtitulo: "DIRETO",
    descricao:
      "Uma experiência mais simples e descomplicada.",
  },

  {
    id: "comfort",
    numero: "02",
    nome: "Comfort",
    subtitulo: "SELEÇÃO",
    descricao:
      "Mais detalhes, mais possibilidades e uma seleção diferenciada.",
  },

  {
    id: "black",
    numero: "03",
    nome: "Black",
    subtitulo: "EXCLUSIVO",
    descricao:
      "Perfis selecionados para uma experiência mais exclusiva.",
  },
];


export default function ExperienceCards() {

  const router =
    useRouter();


  const [
    modalAberto,
    setModalAberto,
  ] =
    useState(false);


  const [
    planoSelecionado,
    setPlanoSelecionado,
  ] =
    useState<Plano | null>(
      null
    );


  const [
    localizacoes,
    setLocalizacoes,
  ] =
    useState<Localizacao[]>(
      []
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    erro,
    setErro,
  ] =
    useState("");


  const cidades =
    useMemo(() => {

      const mapa =
        new Map<
          string,
          Localizacao[]
        >();


      localizacoes.forEach(
        (localizacao) => {

          const lista =
            mapa.get(
              localizacao.cidade
            ) || [];


          lista.push(
            localizacao
          );


          mapa.set(
            localizacao.cidade,
            lista
          );

        }
      );


      return Array.from(
        mapa.entries()
      );

    }, [localizacoes]);


  async function abrirPlano(
    plano: Plano
  ) {

    setPlanoSelecionado(
      plano
    );

    setModalAberto(
      true
    );

    setLoading(
      true
    );

    setErro("");

    setLocalizacoes(
      []
    );


    const supabase =
      createClient();


    const {
      data,
      error,
    } =
      await supabase.rpc(
        "get_available_locations",
        {
          p_plano:
            plano,
        }
      );


    if (error) {

      console.error(
        error
      );


      setErro(
        "Não foi possível carregar as localizações disponíveis."
      );


      setLoading(
        false
      );


      return;
    }


    setLocalizacoes(
      (data || []) as Localizacao[]
    );


    setLoading(
      false
    );

  }


  function fecharModal() {

    setModalAberto(
      false
    );

    setPlanoSelecionado(
      null
    );

    setErro("");

  }


  function selecionarCidade(
    cidade: string
  ) {

    if (
      !planoSelecionado
    ) {
      return;
    }


    const query =
      new URLSearchParams();


    query.set(
      "plano",
      planoSelecionado
    );


    query.set(
      "cidade",
      cidade
    );


    router.push(
      `/profissionais?${query.toString()}`
    );

  }


  function selecionarBairro(
    cidade: string,
    bairro: string
  ) {

    if (
      !planoSelecionado
    ) {
      return;
    }


    const query =
      new URLSearchParams();


    query.set(
      "plano",
      planoSelecionado
    );


    query.set(
      "cidade",
      cidade
    );


    query.set(
      "bairro",
      bairro
    );


    router.push(
      `/profissionais?${query.toString()}`
    );

  }


  function classeCard(
    plano: Plano
  ) {

    if (
      plano === "black"
    ) {

      return `
        border-[#d2a86b]/20
        bg-[radial-gradient(circle_at_85%_10%,rgba(210,168,107,0.17),transparent_34%),#100e0c]
      `;

    }


    if (
      plano === "comfort"
    ) {

      return `
        border-[#e09566]/15
        bg-[radial-gradient(circle_at_85%_10%,rgba(224,149,102,0.16),transparent_34%),#17110e]
      `;

    }


    return `
      border-white/[0.07]
      bg-[radial-gradient(circle_at_85%_10%,rgba(196,111,67,0.15),transparent_34%),#15100e]
    `;

  }


  function classeDestaque(
    plano: Plano
  ) {

    if (
      plano === "black"
    ) {

      return "text-[#d2a86b]";

    }


    if (
      plano === "comfort"
    ) {

      return "text-[#e09566]";

    }


    return "text-[#c46f43]";

  }


  function nomePlano() {

    if (
      planoSelecionado ===
      "black"
    ) {
      return "Black";
    }


    if (
      planoSelecionado ===
      "comfort"
    ) {
      return "Comfort";
    }


    return "X";

  }


  return (
    <>

      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        {planos.map(
          (plano) => (

            <button
              key={
                plano.id
              }
              type="button"
              onClick={() =>
                abrirPlano(
                  plano.id
                )
              }
              className={`
                group
                relative
                min-h-[280px]
                overflow-hidden
                rounded-[24px]
                border
                p-6
                text-left
                transition
                duration-300
                hover:-translate-y-1.5
                hover:border-[#e09566]/25
                hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)]
                ${classeCard(
                  plano.id
                )}
              `}
            >

              {/* brilho */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-14
                  h-40
                  w-40
                  rounded-full
                  bg-[#c46f43]/10
                  blur-3xl
                  transition
                  duration-500
                  group-hover:bg-[#e09566]/15
                "
              />


              <div
                className="
                  relative
                  z-10
                  flex
                  h-full
                  min-h-[230px]
                  flex-col
                  justify-between
                "
              >

                {/* topo */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <span
                    className="
                      text-[9px]
                      font-bold
                      tracking-[0.2em]
                      text-white/25
                    "
                  >
                    {plano.numero}
                  </span>


                  <span
                    className={`
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      ${classeDestaque(
                        plano.id
                      )}
                    `}
                  >
                    {plano.subtitulo}
                  </span>

                </div>


                {/* centro */}

                <div>

                  <h3
                    className="
                      text-[42px]
                      font-semibold
                      leading-none
                      tracking-[-0.055em]
                      text-[#f8f1e8]
                    "
                  >
                    {plano.nome}
                  </h3>


                  <p
                    className="
                      mt-4
                      max-w-[250px]
                      text-[11px]
                      leading-5
                      text-white/38
                    "
                  >
                    {plano.descricao}
                  </p>

                </div>


                {/* rodapé */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className={`
                      text-[10px]
                      font-bold
                      ${classeDestaque(
                        plano.id
                      )}
                    `}
                  >
                    Escolher
                  </span>


                  <span
                    className={`
                      text-lg
                      transition
                      duration-300
                      group-hover:translate-x-1
                      ${classeDestaque(
                        plano.id
                      )}
                    `}
                  >
                    ↗
                  </span>

                </div>

              </div>

            </button>

          )
        )}

      </div>


      {/* MODAL */}

      {modalAberto && (

        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-md
          "
          onMouseDown={
            fecharModal
          }
        >

          <section
            className="
              relative
              max-h-[82vh]
              w-full
              max-w-[560px]
              overflow-y-auto
              rounded-[28px]
              border
              border-white/10
              bg-[#120e0c]
              p-6
              shadow-[0_40px_100px_rgba(0,0,0,0.65)]
              sm:p-7
            "
            onMouseDown={
              (event) =>
                event.stopPropagation()
            }
          >

            {/* fechar */}

            <button
              type="button"
              onClick={
                fecharModal
              }
              aria-label="Fechar"
              className="
                absolute
                right-5
                top-5
                grid
                h-9
                w-9
                place-items-center
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                text-sm
                text-white/45
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              ✕
            </button>


            {/* cabeçalho */}

            <header
              className="
                pr-12
              "
            >

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#c46f43]
                "
              >
                {nomePlano()}
              </span>


              <h2
                className="
                  mt-2
                  text-[34px]
                  font-semibold
                  leading-none
                  tracking-[-0.05em]
                  text-[#f7eee8]
                  sm:text-[40px]
                "
              >
                Onde você quer procurar?
              </h2>


              <p
                className="
                  mt-3
                  max-w-md
                  text-[11px]
                  leading-5
                  text-white/38
                "
              >
                Escolha uma cidade inteira
                ou selecione um bairro específico.
              </p>

            </header>


            {/* LOADING */}

            {loading && (

              <div
                className="
                  flex
                  min-h-[220px]
                  flex-col
                  items-center
                  justify-center
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

                <span
                  className="
                    text-[10px]
                    text-white/35
                  "
                >
                  Buscando localizações...
                </span>

              </div>

            )}


            {/* ERRO */}

            {!loading &&
              erro && (

              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-red-400/15
                  bg-red-400/[0.05]
                  p-5
                  text-[11px]
                  leading-5
                  text-red-200/70
                "
              >
                {erro}
              </div>

            )}


            {/* SEM LOCALIZAÇÕES */}

            {!loading &&
              !erro &&
              cidades.length ===
                0 && (

              <div
                className="
                  mt-8
                  flex
                  min-h-[190px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  p-7
                  text-center
                "
              >

                <span
                  className="
                    text-2xl
                    text-[#c46f43]
                  "
                >
                  ✦
                </span>


                <strong
                  className="
                    mt-3
                    text-sm
                    text-white/75
                  "
                >
                  Nenhum perfil disponível
                </strong>


                <p
                  className="
                    mt-2
                    max-w-xs
                    text-[10px]
                    leading-5
                    text-white/35
                  "
                >
                  Ainda não existem perfis
                  aprovados nesta categoria.
                </p>

              </div>

            )}


            {/* CIDADES */}

            {!loading &&
              !erro &&
              cidades.length >
                0 && (

              <div
                className="
                  mt-8
                  flex
                  flex-col
                  gap-4
                "
              >

                {cidades.map(
                  (
                    [
                      cidade,
                      bairros,
                    ]
                  ) => {

                    const totalCidade =
                      bairros.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          Number(
                            item.total
                          ),
                        0
                      );


                    return (

                      <article
                        key={
                          cidade
                        }
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.02]
                        "
                      >

                        {/* CIDADE */}

                        <button
                          type="button"
                          onClick={() =>
                            selecionarCidade(
                              cidade
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-4
                            px-5
                            py-4
                            text-left
                            transition
                            hover:bg-white/[0.035]
                          "
                        >

                          <div>

                            <strong
                              className="
                                block
                                text-[13px]
                                font-semibold
                                text-white/80
                              "
                            >
                              {cidade}
                            </strong>


                            <span
                              className="
                                mt-1
                                block
                                text-[9px]
                                text-white/30
                              "
                            >
                              Todos os bairros
                            </span>

                          </div>


                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <span
                              className="
                                rounded-full
                                bg-[#c46f43]/10
                                px-2.5
                                py-1.5
                                text-[8px]
                                font-bold
                                text-[#e09566]
                              "
                            >
                              {totalCidade}
                            </span>


                            <span
                              className="
                                text-sm
                                text-[#c46f43]
                              "
                            >
                              →
                            </span>

                          </div>

                        </button>


                        {/* BAIRROS */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            border-t
                            border-white/[0.05]
                            px-4
                            py-4
                          "
                        >

                          {bairros
                            .filter(
                              (item) =>
                                Boolean(
                                  item.bairro
                                )
                            )
                            .map(
                              (
                                localizacao
                              ) => (

                                <button
                                  key={
                                    `${cidade}-${localizacao.bairro}`
                                  }
                                  type="button"
                                  onClick={() =>
                                    selecionarBairro(
                                      cidade,
                                      localizacao.bairro!
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.025]
                                    px-3
                                    py-2
                                    text-[9px]
                                    text-white/50
                                    transition
                                    hover:border-[#e09566]/25
                                    hover:bg-[#c46f43]/[0.07]
                                    hover:text-white/75
                                  "
                                >

                                  {localizacao.bairro}

                                  <span
                                    className="
                                      text-[#e09566]/70
                                    "
                                  >
                                    {Number(
                                      localizacao.total
                                    )}
                                  </span>

                                </button>

                              )
                            )}

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>

        </div>

      )}

    </>
  );
}