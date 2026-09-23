"use client";

import {
  useEffect,
  useMemo,
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


type Match = {
  id: string;
  cliente_id: string;
  acompanhante_id: string;
  status: string;
};


type Acompanhante = {
  id: string;
  nome_artistico: string | null;
  idade: number | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  plano: string | null;
  foto_capa: string | null;
  preco_hora_centavos: number | null;
};


export default function ReservaPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const matchId =
    params.matchId as string;


  const [
    profissional,
    setProfissional,
  ] =
    useState<Acompanhante | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    criando,
    setCriando,
  ] =
    useState(false);


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
    reservaId,
    setReservaId,
  ] =
    useState<string | null>(
      null
    );


  const [
    duracao,
    setDuracao,
  ] =
    useState(1);


  useEffect(() => {

    async function carregar() {

      setLoading(true);
      setErro("");

      const supabase =
        createClient();


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

        router.replace(
          "/acompanhante/painel"
        );

        return;
      }


      const {
        data: matchData,
        error: matchError,
      } =
        await supabase
          .from("matches")
          .select(`
            id,
            cliente_id,
            acompanhante_id,
            status
          `)
          .eq(
            "id",
            matchId
          )
          .eq(
            "cliente_id",
            user.id
          )
          .eq(
            "status",
            "ativo"
          )
          .single();


      if (
        matchError ||
        !matchData
      ) {

        setErro(
          "Este match não está disponível."
        );

        setLoading(false);

        return;
      }


      const match =
        matchData as Match;


      const {
        data: acompanhanteData,
        error: acompanhanteError,
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
            foto_capa,
            preco_hora_centavos
          `)
          .eq(
            "id",
            match.acompanhante_id
          )
          .eq(
            "status",
            "aprovado"
          )
          .single();


      if (
        acompanhanteError ||
        !acompanhanteData
      ) {

        setErro(
          "Não foi possível carregar este perfil."
        );

        setLoading(false);

        return;
      }


      const acompanhante =
        acompanhanteData as Acompanhante;


      if (
        !acompanhante.preco_hora_centavos ||
        acompanhante.preco_hora_centavos <= 0
      ) {

        setErro(
          "Este perfil ainda não definiu o valor por hora."
        );

        setLoading(false);

        return;
      }


      setProfissional(
        acompanhante
      );

      setLoading(false);
    }


    if (matchId) {
      carregar();
    }

  }, [
    matchId,
    router,
  ]);


  const precoHora =
    profissional
      ?.preco_hora_centavos ||
    0;


  const total =
    useMemo(
      () =>
        precoHora *
        duracao,
      [
        precoHora,
        duracao,
      ]
    );


  function moeda(
    centavos: number
  ) {

    return new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(
      centavos / 100
    );
  }


  function nomePlano(
    plano: string | null
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


  async function criarReserva() {

    if (
      criando ||
      !profissional
    ) {
      return;
    }


    setCriando(true);
    setErro("");
    setMessage("");


    const supabase =
      createClient();


    const {
      data,
      error,
    } =
      await supabase.rpc(
        "criar_reserva",
        {
          p_match_id:
            matchId,

          p_duracao_horas:
            duracao,
        }
      );


    if (error) {

      console.error(
        error
      );

      setErro(
        error.message ||
        "Não foi possível criar a reserva."
      );

      setCriando(false);

      return;
    }


    const id =
      Array.isArray(data)
        ? data[0]
        : data;


    if (!id) {

      setErro(
        "A reserva não retornou um identificador."
      );

      setCriando(false);

      return;
    }


    setReservaId(
      String(id)
    );

    setMessage(
      "Reserva criada. Agora ela está aguardando o pagamento."
    );

    setCriando(false);
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
              text-white/40
            "
          >
            Preparando sua reserva...
          </p>

        </div>

      </main>
    );
  }


  if (
    erro &&
    !profissional
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

          <h1
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.04em]
            "
          >
            Reserva indisponível
          </h1>

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
            Voltar aos matches
          </Link>

        </section>

      </main>
    );
  }


  if (!profissional) {
    return null;
  }


  return (
    <main
      className="
        min-h-screen
        bg-[#0b0908]
        px-4
        py-8
        text-[#f8f1e8]
        sm:px-6
        md:px-10
        md:py-12
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
        "
      >

        <Link
          href="/cliente"
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            text-[10px]
            text-white/35
            transition
            hover:text-white/70
          "
        >
          ← Voltar aos matches
        </Link>


        <header
          className="
            mb-8
          "
        >

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              text-[#c46f43]
            "
          >
            SUA RESERVA
          </span>

          <h1
            className="
              mt-3
              max-w-2xl
              text-[42px]
              font-semibold
              leading-[0.95]
              tracking-[-0.055em]
              text-[#fff7f0]
              sm:text-5xl
              md:text-6xl
            "
          >
            Escolha a{" "}

            <span
              className="
                text-[#e09566]
              "
            >
              duração.
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-white/40
            "
          >
            Confira o valor por hora, escolha a duração e revise o total antes de seguir para o pagamento.
          </p>

        </header>


        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[360px_minmax(0,1fr)]
          "
        >

          <section
            className="
              overflow-hidden
              rounded-[26px]
              border
              border-white/[0.07]
              bg-white/[0.02]
            "
          >

            <div
              className="
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
                    text-4xl
                    text-[#77503c]
                  "
                >
                  ✦
                </div>

              )}

            </div>


            <div
              className="
                p-5
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>
                  <strong
                    className="
                      block
                      text-xl
                      text-white/90
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
                      text-[10px]
                      text-white/35
                    "
                  >
                    {profissional.bairro &&
                      `${profissional.bairro} • `}

                    {profissional.cidade}

                    {profissional.estado &&
                      `, ${profissional.estado}`}
                  </span>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-[#d2a86b]/20
                    bg-[#d2a86b]/[0.06]
                    px-3
                    py-2
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#d2a86b]
                  "
                >
                  {nomePlano(
                    profissional.plano
                  )}
                </span>

              </div>


              <div
                className="
                  mt-5
                  border-t
                  border-white/[0.06]
                  pt-5
                "
              >

                <small
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-white/25
                  "
                >
                  VALOR POR HORA
                </small>

                <strong
                  className="
                    mt-1
                    block
                    text-2xl
                    tracking-[-0.04em]
                    text-[#e8c986]
                  "
                >
                  {moeda(
                    precoHora
                  )}
                </strong>

              </div>

            </div>

          </section>


          <section
            className="
              rounded-[26px]
              border
              border-white/[0.07]
              bg-white/[0.02]
              p-5
              sm:p-7
            "
          >

            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.20em]
                text-[#c46f43]
              "
            >
              DURAÇÃO
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
              Quantas horas?
            </h2>


            <div
              className="
                mt-6
                grid
                grid-cols-3
                gap-2
                sm:grid-cols-6
              "
            >

              {[1, 2, 3, 4, 5, 6].map(
                (horas) => (

                  <button
                    key={
                      horas
                    }
                    type="button"
                    onClick={() =>
                      setDuracao(
                        horas
                      )
                    }
                    disabled={
                      Boolean(
                        reservaId
                      )
                    }
                    className={`
                      min-h-14
                      rounded-xl
                      border
                      text-sm
                      font-black
                      transition

                      ${
                        duracao === horas
                          ? "border-[#e09566]/55 bg-[#c46f43]/15 text-[#f0b184]"
                          : "border-white/[0.07] bg-[#120e0c] text-white/45 hover:border-white/15 hover:text-white/75"
                      }

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    `}
                  >
                    {horas}h
                  </button>

                )
              )}

            </div>


            <div
              className="
                mt-8
                rounded-[22px]
                border
                border-[#d2a86b]/15
                bg-[linear-gradient(135deg,rgba(210,168,107,0.08),rgba(196,111,67,0.03))]
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-white/[0.06]
                  pb-4
                "
              >

                <span
                  className="
                    text-[10px]
                    text-white/40
                  "
                >
                  {moeda(
                    precoHora
                  )} × {duracao}h
                </span>

                <span
                  className="
                    text-[10px]
                    text-white/35
                  "
                >
                  subtotal
                </span>

              </div>


              <div
                className="
                  mt-5
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >

                <div>
                  <small
                    className="
                      block
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.16em]
                      text-white/25
                    "
                  >
                    TOTAL
                  </small>

                  <strong
                    className="
                      mt-1
                      block
                      text-[38px]
                      font-semibold
                      leading-none
                      tracking-[-0.05em]
                      text-[#fff7f0]
                    "
                  >
                    {moeda(
                      total
                    )}
                  </strong>
                </div>

                <span
                  className="
                    text-[9px]
                    text-white/25
                  "
                >
                  {duracao}{" "}
                  {duracao === 1
                    ? "hora"
                    : "horas"}
                </span>

              </div>

            </div>


            {erro && (

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-red-400/15
                  bg-red-400/[0.05]
                  px-5
                  py-4
                  text-[10px]
                  leading-5
                  text-red-200/75
                "
              >
                {erro}
              </div>

            )}


            {message && (

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.05]
                  px-5
                  py-4
                  text-[10px]
                  leading-5
                  text-emerald-200/75
                "
              >
                {message}
              </div>

            )}


            {!reservaId ? (

              <button
                type="button"
                onClick={
                  criarReserva
                }
                disabled={
                  criando
                }
                className="
                  mt-6
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
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.08em]
                  text-[#160b07]
                  shadow-[0_15px_40px_rgba(196,111,67,0.18)]
                  transition
                  hover:-translate-y-0.5
                  disabled:cursor-wait
                  disabled:opacity-50
                "
              >
                {criando
                  ? "Criando reserva..."
                  : "Continuar para pagamento"}

                {!criando && (
                  <span>
                    →
                  </span>
                )}
              </button>

            ) : (

              <div
                className="
                  mt-6
                  rounded-[20px]
                  border
                  border-[#d2a86b]/20
                  bg-[#d2a86b]/[0.05]
                  p-5
                "
              >

                <small
                  className="
                    block
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-[#d2a86b]/60
                  "
                >
                  RESERVA CRIADA
                </small>

                <strong
                  className="
                    mt-2
                    block
                    text-lg
                    text-[#f3e9e2]
                  "
                >
                  Aguardando pagamento
                </strong>

                <p
                  className="
                    mt-2
                    text-[10px]
                    leading-5
                    text-white/35
                  "
                >
                  ID da reserva: {reservaId}
                </p>

                <div
                  className="
                    mt-4
                    rounded-full
                    border
                    border-white/[0.07]
                    bg-white/[0.02]
                    px-4
                    py-3
                    text-center
                    text-[9px]
                    text-white/35
                  "
                >
                  O pagamento será conectado na próxima etapa.
                </div>

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}
