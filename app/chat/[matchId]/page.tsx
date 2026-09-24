"use client";

import {
  FormEvent,
  useEffect,
  useRef,
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

type MatchData = {
  id: string;
  cliente_id: string;
  acompanhante_id: string;
  status: string;
};

type Mensagem = {
  id: string;
  match_id: string;
  remetente_id: string;
  mensagem: string;
  created_at: string;
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const [userId, setUserId] =
    useState("");

  const [match, setMatch] =
    useState<MatchData | null>(null);

  const [nomeContato, setNomeContato] =
    useState("Conexão");

  const [fotoContato, setFotoContato] =
    useState<string | null>(null);

  const [mensagens, setMensagens] =
    useState<Mensagem[]>([]);

  const [texto, setTexto] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [enviando, setEnviando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const fimRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");

      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

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
          .eq("id", matchId)
          .eq("status", "ativo")
          .single();

      if (
        matchError ||
        !matchData
      ) {
        setErro(
          "Este chat não está disponível."
        );
        setLoading(false);
        return;
      }

      const matchAtual =
        matchData as MatchData;

      const participante =
        matchAtual.cliente_id ===
          user.id ||
        matchAtual.acompanhante_id ===
          user.id;

      if (!participante) {
        setErro(
          "Você não tem acesso a esta conversa."
        );
        setLoading(false);
        return;
      }

      setMatch(matchAtual);

      if (
        user.id ===
        matchAtual.cliente_id
      ) {
        const {
          data: acompanhante,
        } =
          await supabase
            .from(
              "acompanhante_profiles"
            )
            .select(`
              nome_artistico,
              foto_capa
            `)
            .eq(
              "id",
              matchAtual.acompanhante_id
            )
            .single();

        if (acompanhante) {
          setNomeContato(
            acompanhante.nome_artistico ||
              "Acompanhante"
          );
          setFotoContato(
            acompanhante.foto_capa ||
              null
          );
        }
      } else {
        const {
          data:
            clientesRelacionados,
          error:
            clienteError,
        } =
          await supabase.rpc(
            "get_clientes_para_acompanhante"
          );


        if (
          clienteError
        ) {

          console.error(
            clienteError
          );

        }


        const cliente =
          (
            clientesRelacionados ||
            []
          ).find(
            (
              item: {
                id: string;
                full_name: string | null;
              }
            ) =>
              item.id ===
              matchAtual.cliente_id
          );


        if (cliente) {

          const primeiroNome =
            cliente.full_name
              ?.trim()
              .split(" ")[0];


          setNomeContato(
            primeiroNome ||
              "Cliente"
          );

        }
      }

      const {
        data: mensagensData,
        error:
          mensagensError,
      } =
        await supabase
          .from("mensagens")
          .select(`
            id,
            match_id,
            remetente_id,
            mensagem,
            created_at
          `)
          .eq(
            "match_id",
            matchId
          )
          .order(
            "created_at",
            {
              ascending: true,
            }
          );

      if (
        mensagensError
      ) {
        console.error(
          mensagensError
        );
        setErro(
          "Não foi possível carregar as mensagens."
        );
        setLoading(false);
        return;
      }

      setMensagens(
        mensagensData || []
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

  useEffect(() => {
    if (
      !match ||
      !userId
    ) {
      return;
    }

    const supabase =
      createClient();

    const canal =
      supabase
        .channel(
          `chat-${match.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "mensagens",
            filter:
              `match_id=eq.${match.id}`,
          },
          (payload) => {
            const nova =
              payload.new as Mensagem;

            setMensagens(
              (lista) => {
                const jaExiste =
                  lista.some(
                    (item) =>
                      item.id ===
                      nova.id
                  );

                if (jaExiste) {
                  return lista;
                }

                return [
                  ...lista,
                  nova,
                ];
              }
            );
          }
        )
        .subscribe();

    return () => {
      supabase
        .removeChannel(canal);
    };
  }, [
    match,
    userId,
  ]);

  useEffect(() => {
    fimRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });
  }, [mensagens]);

  async function enviarMensagem(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      enviando ||
      !match ||
      !userId
    ) {
      return;
    }

    const mensagem =
      texto.trim();

    if (!mensagem) {
      return;
    }

    if (
      mensagem.length >
      2000
    ) {
      setErro(
        "A mensagem pode ter no máximo 2.000 caracteres."
      );
      return;
    }

    setEnviando(true);
    setErro("");

    const supabase =
      createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("mensagens")
        .insert({
          match_id:
            match.id,
          remetente_id:
            userId,
          mensagem,
        })
        .select(`
          id,
          match_id,
          remetente_id,
          mensagem,
          created_at
        `)
        .single();

    if (error) {
      console.error(error);
      setErro(
        "Não foi possível enviar a mensagem."
      );
      setEnviando(false);
      return;
    }

    if (data) {
      setMensagens(
        (lista) => {
          const jaExiste =
            lista.some(
              (item) =>
                item.id ===
                data.id
            );

          if (jaExiste) {
            return lista;
          }

          return [
            ...lista,
            data as Mensagem,
          ];
        }
      );
    }

    setTexto("");
    setEnviando(false);
  }

  function voltarParaPainel() {
    if (!match) {
      router.back();
      return;
    }

    if (
      userId ===
      match.cliente_id
    ) {
      router.push(
        "/cliente"
      );
      return;
    }

    router.push(
      "/acompanhante/painel"
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
              text-white/40
            "
          >
            Abrindo conversa...
          </p>
        </div>
      </main>
    );
  }

  if (
    erro &&
    !match
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
            Chat indisponível
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
            href="/"
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

  return (
    <main
      className="
        min-h-screen
        bg-[#0b0908]
        px-3
        py-4
        text-[#f8f1e8]
        sm:px-5
        md:py-7
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[calc(100vh-32px)]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.07]
          bg-[#100d0b]
          shadow-[0_35px_100px_rgba(0,0,0,0.38)]
          md:h-[calc(100vh-56px)]
        "
      >
        <header
          className="
            flex
            shrink-0
            items-center
            gap-4
            border-b
            border-white/[0.06]
            bg-[#0d0a09]/95
            px-4
            py-4
            backdrop-blur-xl
            sm:px-6
          "
        >
          <button
            type="button"
            onClick={
              voltarParaPainel
            }
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.025]
              text-white/50
              transition
              hover:bg-white/[0.05]
              hover:text-white/80
            "
          >
            ←
          </button>

          <div
            className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              overflow-hidden
              rounded-full
              bg-[#1c1511]
              text-[#d2a86b]
            "
          >
            {fotoContato ? (
              <img
                src={
                  fotoContato
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
              flex-1
            "
          >
            <strong
              className="
                block
                truncate
                text-sm
                text-white/90
              "
            >
              {nomeContato}
            </strong>

            <span
              className="
                mt-0.5
                block
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-[#49d286]/70
              "
            >
              Match ativo
            </span>
          </div>
        </header>

        <section
          className="
            flex-1
            overflow-y-auto
            px-4
            py-6
            sm:px-6
          "
        >
          {mensagens.length ===
          0 ? (
            <div
              className="
                flex
                h-full
                min-h-[300px]
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  max-w-sm
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
                    text-xl
                    font-semibold
                    text-white/80
                  "
                >
                  Vocês deram match
                </h2>

                <p
                  className="
                    mt-2
                    text-[11px]
                    leading-5
                    text-white/35
                  "
                >
                  A conversa está liberada. Envie a primeira mensagem.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="
                flex
                flex-col
                gap-3
              "
            >
              {mensagens.map(
                (item) => {
                  const minha =
                    item.remetente_id ===
                    userId;

                  return (
                    <div
                      key={
                        item.id
                      }
                      className={`
                        flex
                        ${
                          minha
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >
                      <div
                        className={`
                          max-w-[82%]
                          rounded-[20px]
                          px-4
                          py-3
                          sm:max-w-[70%]

                          ${
                            minha
                              ? "rounded-br-md bg-gradient-to-br from-[#e09566] to-[#c46f43] text-[#160b07]"
                              : "rounded-bl-md border border-white/[0.07] bg-white/[0.035] text-white/80"
                          }
                        `}
                      >
                        <p
                          className="
                            whitespace-pre-wrap
                            break-words
                            text-[12px]
                            leading-5
                          "
                        >
                          {item.mensagem}
                        </p>

                        <span
                          className={`
                            mt-1.5
                            block
                            text-right
                            text-[7px]

                            ${
                              minha
                                ? "text-[#160b07]/55"
                                : "text-white/25"
                            }
                          `}
                        >
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}

              <div
                ref={
                  fimRef
                }
              />
            </div>
          )}
        </section>

        {erro && match && (
          <div
            className="
              mx-4
              mb-2
              rounded-xl
              border
              border-red-400/15
              bg-red-400/[0.05]
              px-4
              py-3
              text-[9px]
              text-red-200/70
              sm:mx-6
            "
          >
            {erro}
          </div>
        )}

        <form
          onSubmit={
            enviarMensagem
          }
          className="
            flex
            shrink-0
            items-end
            gap-2
            border-t
            border-white/[0.06]
            bg-[#0d0a09]
            p-3
            sm:p-4
          "
        >
          <textarea
            rows={1}
            maxLength={2000}
            value={
              texto
            }
            onChange={
              (event) =>
                setTexto(
                  event.target.value
                )
            }
            onKeyDown={
              (event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  event.currentTarget
                    .form
                    ?.requestSubmit();
                }
              }
            }
            placeholder="Digite uma mensagem..."
            className="
              max-h-32
              min-h-12
              flex-1
              resize-none
              rounded-[18px]
              border
              border-white/[0.08]
              bg-[#17120f]
              px-4
              py-3.5
              text-sm
              leading-5
              text-white/85
              outline-none
              transition
              placeholder:text-white/20
              focus:border-[#e09566]/35
            "
          />

          <button
            type="submit"
            disabled={
              enviando ||
              !texto.trim()
            }
            className="
              grid
              h-12
              w-12
              shrink-0
              place-items-center
              rounded-full
              bg-gradient-to-br
              from-[#e09566]
              to-[#c46f43]
              text-lg
              font-black
              text-[#160b07]
              transition
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {enviando
              ? "…"
              : "↑"}
          </button>
        </form>
      </div>
    </main>
  );
}
