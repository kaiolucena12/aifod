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


type ClienteResumo = {
  id: string;
  full_name: string | null;
};


function criarMapaClientes(
  data: unknown
): Record<string, ClienteResumo> {

  const mapa:
    Record<string, ClienteResumo> = {};


  if (!Array.isArray(data)) {
    return mapa;
  }


  const lista =
    data as ClienteResumo[];


  lista.forEach(
    (cliente: ClienteResumo) => {

      if (!cliente?.id) {
        return;
      }


      mapa[cliente.id] = {
        id:
          cliente.id,

        full_name:
          cliente.full_name ??
          null,
      };

    }
  );


  return mapa;
}


export default function PainelAcompanhantePage() {

  const router =
    useRouter();


  const [
    perfil,
    setPerfil,
  ] =
    useState<Acompanhante | null>(
      null
    );


  const [
    interesses,
    setInteresses,
  ] =
    useState<Interesse[]>([]);


  const [
    matches,
    setMatches,
  ] =
    useState<Match[]>([]);


  const [
    clientes,
    setClientes,
  ] =
    useState<
      Record<
        string,
        ClienteResumo
      >
    >({});


  const [
    processandoMatch,
    setProcessandoMatch,
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
    message,
    setMessage,
  ] =
    useState("");


  const [
    erro,
    setErro,
  ] =
    useState("");


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
        ROLE
      */

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
        !profile ||
        profile.role !==
          "acompanhante"
      ) {

        router.replace(
          "/cliente"
        );

        return;
      }


      /*
        PERFIL DA ACOMPANHANTE
      */

      const {
        data:
          acompanhanteData,
        error:
          acompanhanteError,
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
          .eq(
            "id",
            user.id
          )
          .single();


      if (
        acompanhanteError
      ) {

        setErro(
          "Não foi possível carregar seu perfil."
        );

      }


      if (
        acompanhanteData
      ) {

        setPerfil(
          acompanhanteData
        );

      }


      /*
        INTERESSES PENDENTES
      */

      const {
        data:
          interessesData,
        error:
          interessesError,
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


      if (
        interessesError
      ) {

        console.error(
          interessesError
        );

      }


      setInteresses(
        (interessesData || []) as Interesse[]
      );


      /*
        MATCHES
      */

      const {
        data:
          matchesData,
        error:
          matchesError,
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


      if (
        matchesError
      ) {

        console.error(
          matchesError
        );

      }


      const listaMatches =
        (matchesData || []) as Match[];


      setMatches(
        listaMatches
      );


      /*
        NOMES DOS CLIENTES

        A leitura é feita por RPC porque a acompanhante
        não deve ter acesso livre à tabela profiles.
        A função retorna somente clientes relacionados
        a interesses ou matches desta acompanhante.
      */

      const {
        data:
          clientesData,
        error:
          clientesError,
      } =
        await supabase.rpc(
          "get_clientes_para_acompanhante"
        );


      if (
        clientesError
      ) {

        console.error(
          clientesError
        );

      }


      setClientes(
        criarMapaClientes(
          clientesData
        )
      );


      setLoading(false);

    }


    carregar();

  }, [router]);


  /*
    ACEITAR / RECUSAR
  */

  async function responderInteresse(
    id: string,
    resposta:
      | "aceito"
      | "recusado"
  ) {

    const supabase =
      createClient();


    setMessage("");
    setErro("");


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

      setErro(
        "Não foi possível atualizar o interesse."
      );

      return;
    }


    setInteresses(
      (lista: Interesse[]) =>
        lista.filter(
          (item: Interesse) =>
            item.id !== id
        )
    );


    if (
      resposta ===
      "aceito"
    ) {

      setMessage(
        "Interesse aceito. Um novo match foi criado."
      );


      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();


      if (user) {

        const {
          data:
            matchesAtualizados,
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


        const listaAtualizada =
          (matchesAtualizados || []) as Match[];


        setMatches(
          listaAtualizada
        );


        const {
          data:
            clientesData,
          error:
            clientesError,
        } =
          await supabase.rpc(
            "get_clientes_para_acompanhante"
          );


        if (
          clientesError
        ) {

          console.error(
            clientesError
          );

        }


        setClientes(
          criarMapaClientes(
            clientesData
          )
        );

      }

    } else {

      setMessage(
        "Interesse recusado."
      );

    }

  }


  /*
    MARCAR MATCH COMO ATENDIDO
  */

  async function marcarComoAtendido(
    match: Match
  ) {

    if (
      processandoMatch
    ) {
      return;
    }


    const confirmou =
      window.confirm(
        `Marcar o atendimento de ${nomeCliente(
          match.cliente_id
        )} como concluído?`
      );


    if (!confirmou) {
      return;
    }


    setProcessandoMatch(
      match.id
    );

    setMessage("");
    setErro("");


    const supabase =
      createClient();


    const {
      error,
    } =
      await supabase.rpc(
        "marcar_match_atendido",
        {
          p_match_id:
            match.id,
        }
      );


    if (error) {

      console.error(
        error
      );

      setErro(
        error.message ||
          "Não foi possível marcar o atendimento como concluído."
      );

      setProcessandoMatch(
        null
      );

      return;
    }


    setMatches(
      (
        lista:
          Match[]
      ) =>
        lista.filter(
          (
            item:
              Match
          ) =>
            item.id !==
            match.id
        )
    );


    setMessage(
      `${nomeCliente(
        match.cliente_id
      )} foi marcado como atendido.`
    );


    setProcessandoMatch(
      null
    );

  }


  /*
    EXCLUIR MATCH
  */

  async function excluirMatch(
    match: Match
  ) {

    if (
      processandoMatch
    ) {
      return;
    }


    const confirmou =
      window.confirm(
        `Excluir o match com ${nomeCliente(
          match.cliente_id
        )}? O chat e as mensagens desta conexão também serão apagados.`
      );


    if (!confirmou) {
      return;
    }


    setProcessandoMatch(
      match.id
    );

    setMessage("");
    setErro("");


    const supabase =
      createClient();


    const {
      error,
    } =
      await supabase.rpc(
        "excluir_match_acompanhante",
        {
          p_match_id:
            match.id,
        }
      );


    if (error) {

      console.error(
        error
      );

      setErro(
        error.message ||
          "Não foi possível excluir o match."
      );

      setProcessandoMatch(
        null
      );

      return;
    }


    setMatches(
      (
        lista:
          Match[]
      ) =>
        lista.filter(
          (
            item:
              Match
          ) =>
            item.id !==
            match.id
        )
    );


    setMessage(
      `Match com ${nomeCliente(
        match.cliente_id
      )} excluído.`
    );


    setProcessandoMatch(
      null
    );

  }


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


  function nomePlano() {

    if (
      perfil?.plano ===
      "black"
    ) {
      return "Black";
    }


    if (
      perfil?.plano ===
      "comfort"
    ) {
      return "Comfort";
    }


    return "X";

  }


  function nomeStatus() {

    if (
      perfil?.status ===
      "aprovado"
    ) {
      return "Perfil aprovado";
    }


    if (
      perfil?.status ===
      "rejeitado"
    ) {
      return "Perfil não aprovado";
    }


    if (
      perfil?.status ===
      "suspenso"
    ) {
      return "Perfil suspenso";
    }


    return "Em análise";

  }


  function nomeCliente(
    clienteId: string
  ) {

    const nome =
      clientes[
        clienteId
      ]?.full_name
        ?.trim();


    return (
      nome ||
      "Cliente"
    );

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
            Carregando seu painel...
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
          max-w-6xl
        "
      >


        {/* TOPO */}

        <header
          className="
            mb-10
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          <div>

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.24em]
                text-[#c46f43]
              "
            >
              PAINEL AIFOD
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
                {perfil?.nome_artistico ||
                  "bem-vinda"}.
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
              Veja quem demonstrou interesse
              no seu perfil e acompanhe suas
              conexões.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Link
              href="/acompanhante/perfil"
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                border
                border-[#e09566]/20
                bg-[#c46f43]/[0.06]
                px-5
                text-[10px]
                font-bold
                text-[#e09566]
                transition
                hover:bg-[#c46f43]/10
              "
            >
              Meu perfil
            </Link>


            <button
              type="button"
              onClick={sair}
              className="
                min-h-11
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                px-5
                text-[10px]
                text-white/45
                transition
                hover:bg-white/[0.06]
                hover:text-white/75
              "
            >
              Sair
            </button>

          </div>

        </header>


        {/* MENSAGENS */}

        {erro && (

          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-400/15
              bg-red-400/[0.05]
              px-5
              py-4
              text-[11px]
              text-red-200/70
            "
          >
            {erro}
          </div>

        )}


        {message && (

          <div
            className="
              mb-5
              rounded-2xl
              border
              border-emerald-400/15
              bg-emerald-400/[0.05]
              px-5
              py-4
              text-[11px]
              text-emerald-200/70
            "
          >
            {message}
          </div>

        )}


        {/* RESUMO */}

        <section
          className="
            mb-14
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <article
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
            "
          >

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              NOVOS INTERESSES
            </span>


            <strong
              className="
                mt-5
                block
                text-3xl
                tracking-[-0.04em]
                text-[#f8f1e8]
              "
            >
              {interesses.length}
            </strong>


            <p
              className="
                mt-2
                text-[10px]
                text-white/35
              "
            >
              Aguardando sua resposta.
            </p>

          </article>


          <article
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
            "
          >

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              MATCHES
            </span>


            <strong
              className="
                mt-5
                block
                text-3xl
                tracking-[-0.04em]
                text-[#f8f1e8]
              "
            >
              {matches.length}
            </strong>


            <p
              className="
                mt-2
                text-[10px]
                text-white/35
              "
            >
              Conexões ativas.
            </p>

          </article>


          <article
            className="
              rounded-2xl
              border
              border-[#d2a86b]/15
              bg-[radial-gradient(circle_at_90%_0%,rgba(210,168,107,0.12),transparent_40%),rgba(255,255,255,0.02)]
              p-5
            "
          >

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              CATEGORIA
            </span>


            <strong
              className="
                mt-5
                block
                text-3xl
                tracking-[-0.04em]
                text-[#d2a86b]
              "
            >
              {nomePlano()}
            </strong>


            <p
              className="
                mt-2
                text-[10px]
                text-white/35
              "
            >
              Categoria atual do perfil.
            </p>

          </article>


          <article
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
            "
          >

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              STATUS
            </span>


            <strong
              className="
                mt-5
                block
                text-lg
                text-[#e09566]
              "
            >
              {nomeStatus()}
            </strong>


            <p
              className="
                mt-2
                text-[10px]
                text-white/35
              "
            >
              Situação atual do seu perfil.
            </p>

          </article>

        </section>


        {/* INTERESSES */}

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
                font-black
                uppercase
                tracking-[0.22em]
                text-[#c46f43]
              "
            >
              NOVOS INTERESSES
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
              Quem quer conhecer você
            </h2>

          </div>


          {interesses.length ===
          0 ? (

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-6
              "
            >

              <strong
                className="
                  text-sm
                  text-white/75
                "
              >
                Nenhum novo interesse
              </strong>


              <p
                className="
                  mt-2
                  max-w-lg
                  text-[11px]
                  leading-5
                  text-white/35
                "
              >
                Quando um cliente clicar
                no coração do seu perfil,
                o interesse aparecerá aqui.
              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                gap-3
                lg:grid-cols-2
              "
            >

              {interesses.map(
                (interesse: Interesse) => {

                  const clienteNome =
                    nomeCliente(
                      interesse.cliente_id
                    );


                  return (

                  <article
                    key={
                      interesse.id
                    }
                    className="
                      flex
                      aspect-square
                      w-full
                      max-w-[270px]
                      flex-col
                      justify-between
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-4
                      "
                    >

                      <div
                        className="
                          grid
                          h-11
                          w-11
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


                      <div
                        className="
                          flex-1
                        "
                      >

                        <strong
                          className="
                            text-sm
                            text-white/80
                          "
                        >
                          {clienteNome}
                        </strong>


                        <p
                          className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-white/35
                          "
                        >
                          {clienteNome} demonstrou
                          interesse no seu perfil.
                        </p>


                        <span
                          className="
                            mt-2
                            block
                            text-[8px]
                            text-white/20
                          "
                        >
                          {new Date(
                            interesse.created_at
                          ).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          responderInteresse(
                            interesse.id,
                            "recusado"
                          )
                        }
                        className="
                          min-h-11
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.025]
                          text-[10px]
                          font-bold
                          text-white/45
                          transition
                          hover:bg-white/[0.06]
                          hover:text-white/75
                        "
                      >
                        Recusar
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          responderInteresse(
                            interesse.id,
                            "aceito"
                          )
                        }
                        className="
                          min-h-11
                          rounded-full
                          bg-gradient-to-r
                          from-[#e09566]
                          to-[#c46f43]
                          text-[10px]
                          font-black
                          text-[#160b07]
                          transition
                          hover:-translate-y-0.5
                        "
                      >
                        Aceitar
                      </button>

                    </div>

                  </article>

                  );

                }
              )}

            </div>

          )}

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
                font-black
                uppercase
                tracking-[0.22em]
                text-[#c46f43]
              "
            >
              MATCHES
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
              Suas conexões
            </h2>

          </div>


          {matches.length ===
          0 ? (

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-6
              "
            >

              <strong
                className="
                  text-sm
                  text-white/75
                "
              >
                Nenhum match ainda
              </strong>


              <p
                className="
                  mt-2
                  text-[11px]
                  text-white/35
                "
              >
                Quando você aceitar um interesse,
                o match aparecerá aqui.
              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {matches.map(
                (match: Match) => {

                  const clienteNome =
                    nomeCliente(
                      match.cliente_id
                    );


                  return (

                  <article
                    key={
                      match.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <div
                        className="
                          grid
                          h-11
                          w-11
                          shrink-0
                          place-items-center
                          rounded-full
                          bg-[#d2a86b]/10
                          text-[#d2a86b]
                        "
                      >
                        ✦
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
                            text-sm
                            text-white/80
                          "
                        >
                          {clienteNome}
                        </strong>


                        <span
                          className="
                            mt-1
                            block
                            text-[9px]
                            text-white/30
                          "
                        >
                          Match confirmado
                          {" • "}
                          {new Date(
                            match.created_at
                          ).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        mt-5
                        border-t
                        border-white/[0.06]
                        pt-4
                      "
                    >

                      <Link
                        href={
                          `/chat/${match.id}`
                        }
                        className="
                          flex
                          min-h-11
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                          bg-gradient-to-r
                          from-[#e09566]
                          to-[#c46f43]
                          px-5
                          text-[10px]
                          font-black
                          text-[#160b07]
                          transition
                          hover:-translate-y-0.5
                          hover:shadow-[0_10px_28px_rgba(196,111,67,0.18)]
                        "
                      >
                        Conversar
                        <span
                          className="
                            text-sm
                          "
                        >
                          →
                        </span>
                      </Link>


                      <div
                        className="
                          mt-2.5
                          flex
                          items-center
                          justify-center
                          gap-3
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            marcarComoAtendido(
                              match
                            )
                          }
                          disabled={
                            processandoMatch ===
                            match.id
                          }
                          className="
                            inline-flex
                            min-h-8
                            items-center
                            justify-center
                            gap-1.5
                            rounded-full
                            px-3
                            text-[9px]
                            font-semibold
                            text-white/40
                            transition
                            hover:bg-white/[0.035]
                            hover:text-[#e09566]
                            disabled:cursor-wait
                            disabled:opacity-35
                          "
                        >
                          <span
                            className="
                              text-[10px]
                              text-[#d2a86b]/70
                            "
                          >
                            ✓
                          </span>

                          {processandoMatch ===
                          match.id
                            ? "Aguarde..."
                            : "Atendido"}
                        </button>


                        <span
                          className="
                            h-3
                            w-px
                            bg-white/10
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            excluirMatch(
                              match
                            )
                          }
                          disabled={
                            processandoMatch ===
                            match.id
                          }
                          className="
                            inline-flex
                            min-h-8
                            items-center
                            justify-center
                            rounded-full
                            px-3
                            text-[9px]
                            font-medium
                            text-white/25
                            transition
                            hover:bg-red-400/[0.04]
                            hover:text-red-200/65
                            disabled:cursor-wait
                            disabled:opacity-35
                          "
                        >
                          Excluir
                        </button>

                      </div>

                    </div>

                  </article>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* PERFIL */}

        <section>

          <div
            className="
              mb-6
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
              MINHA CONTA
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
              Gerencie seu perfil
            </h2>

          </div>


          <Link
            href="/acompanhante/perfil"
            className="
              group
              flex
              items-center
              gap-5
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
              transition
              hover:border-[#e09566]/25
              hover:bg-[#c46f43]/[0.05]
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
                text-sm
                font-bold
                text-[#e09566]
              "
            >
              01
            </div>


            <div
              className="
                flex-1
              "
            >

              <strong
                className="
                  text-sm
                  text-white/80
                "
              >
                Meu perfil
              </strong>


              <p
                className="
                  mt-1
                  text-[10px]
                  text-white/35
                "
              >
                Edite suas fotos, informações,
                localização e disponibilidade.
              </p>

            </div>


            <span
              className="
                text-lg
                text-[#c46f43]
                transition
                group-hover:translate-x-1
              "
            >
              →
            </span>

          </Link>

        </section>


      </div>

    </main>
  );
}