"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Plano =
  | "x"
  | "comfort"
  | "black";

type Localizacao = {
  cidade: string;
  bairro: string | null;
  total: number;
};

export default function ExperienceCards() {
  const supabase = createClient();
  const router = useRouter();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [planoSelecionado, setPlanoSelecionado] =
    useState<Plano | null>(null);

  const [localizacoes, setLocalizacoes] =
    useState<Localizacao[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState("");

  async function abrirLocalizacoes(
    plano: Plano
  ) {
    setPlanoSelecionado(plano);
    setModalOpen(true);
    setLoading(true);
    setErro("");
    setLocalizacoes([]);

    const {
      data,
      error,
    } =
      await supabase.rpc(
        "get_available_locations",
        {
          p_plano: plano,
        }
      );

    if (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar as localizações."
      );

      setLoading(false);

      return;
    }

    setLocalizacoes(
      (data || []) as Localizacao[]
    );

    setLoading(false);
  }

  function fecharModal() {
    setModalOpen(false);
  }

  function escolherCidade(
    cidade: string
  ) {
    if (!planoSelecionado) {
      return;
    }

    const params =
      new URLSearchParams();

    params.set(
      "plano",
      planoSelecionado
    );

    params.set(
      "cidade",
      cidade
    );

    router.push(
      `/profissionais?${params.toString()}`
    );
  }

  function escolherBairro(
    cidade: string,
    bairro: string
  ) {
    if (!planoSelecionado) {
      return;
    }

    const params =
      new URLSearchParams();

    params.set(
      "plano",
      planoSelecionado
    );

    params.set(
      "cidade",
      cidade
    );

    params.set(
      "bairro",
      bairro
    );

    router.push(
      `/profissionais?${params.toString()}`
    );
  }

  const cidades =
    Array.from(
      new Set(
        localizacoes
          .map(
            (item) =>
              item.cidade
          )
          .filter(Boolean)
      )
    );

  return (
    <>
      <div className="categoryGrid">

        {/* X */}
        <button
          type="button"
          className="categoryCard xCard categoryCardButton"
          onClick={() =>
            abrirLocalizacoes("x")
          }
        >
          <div className="cardTop">
            <span>01</span>

            <small>
              DESCOMPLICADO
            </small>
          </div>

          <div className="categoryMain">
            <span className="categoryMiniTitle">
              COMEÇAR
            </span>

            <h3>X</h3>

            <p>
              Perfis para quem busca algo
              mais leve, acessível e direto.
              Uma forma simples de descobrir
              novas conexões e experiências.
            </p>
          </div>

          <div className="cardBottom">
            <span>
              Conhecer X
            </span>

            <b>→</b>
          </div>
        </button>


        {/* COMFORT */}
        <button
          type="button"
          className="categoryCard comfortCard categoryCardButton"
          onClick={() =>
            abrirLocalizacoes(
              "comfort"
            )
          }
        >
          <div className="cardTop">
            <span>02</span>

            <small>
              DESEJADO
            </small>
          </div>

          <div className="categoryMain">
            <span className="categoryMiniTitle">
              MAIS PRESENÇA
            </span>

            <h3>
              Comfort
            </h3>

            <p>
              Uma seleção mais refinada,
              com perfis de maior destaque
              e presença marcante.
            </p>
          </div>

          <div className="cardBottom">
            <span>
              Descobrir Comfort
            </span>

            <b>→</b>
          </div>
        </button>


        {/* BLACK */}
        <button
          type="button"
          className="categoryCard blackCard categoryCardButton"
          onClick={() =>
            abrirLocalizacoes(
              "black"
            )
          }
        >
          <div className="shine" />

          <div className="cardTop">
            <span>03</span>

            <small>
              EXCLUSIVO
            </small>
          </div>

          <div className="categoryMain">
            <span className="categoryMiniTitle blackMiniTitle">
              EXPERIÊNCIA PREMIUM
            </span>

            <h3>
              Black
            </h3>

            <p>
              O nível mais exclusivo do
              AiFod. Perfis premium e uma
              seleção mais criteriosa.
            </p>
          </div>

          <div className="cardBottom">
            <span>
              Acessar Black
            </span>

            <b>→</b>
          </div>
        </button>

      </div>


      {/* MODAL DE LOCALIZAÇÃO */}
      {modalOpen && (
        <div
          className="locationModalOverlay"
          onClick={fecharModal}
        >
          <section
            className="locationModal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              className="locationModalClose"
              onClick={fecharModal}
              aria-label="Fechar"
            >
              ×
            </button>

            <div className="locationModalHeader">
              <span className="eyebrow">
                ESCOLHA SUA LOCALIZAÇÃO
              </span>

              <h2>
                Onde você quer encontrar?
              </h2>

              <p>
                Escolha uma cidade para ver
                todos os bairros ou selecione
                um bairro específico.
              </p>
            </div>


            {loading && (
              <div className="locationLoading">
                <span className="loginLoader" />

                <p>
                  Buscando localizações...
                </p>
              </div>
            )}


            {!loading && erro && (
              <div className="registerMessage">
                {erro}
              </div>
            )}


            {!loading &&
              !erro &&
              cidades.length === 0 && (
                <div className="locationEmpty">
                  <strong>
                    Ainda não há perfis disponíveis
                    nesta categoria.
                  </strong>

                  <p>
                    Novas localizações aparecerão
                    aqui conforme os perfis forem
                    disponibilizados.
                  </p>
                </div>
              )}


            {!loading &&
              cidades.map(
                (cidade) => {

                  const bairros =
                    localizacoes.filter(
                      (item) =>
                        item.cidade ===
                          cidade &&
                        item.bairro
                    );

                  const totalCidade =
                    localizacoes
                      .filter(
                        (item) =>
                          item.cidade ===
                          cidade
                      )
                      .reduce(
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
                    <div
                      className="locationCity"
                      key={cidade}
                    >
                      <button
                        type="button"
                        className="locationCityButton"
                        onClick={() =>
                          escolherCidade(
                            cidade
                          )
                        }
                      >
                        <div>
                          <small>
                            CIDADE
                          </small>

                          <strong>
                            {cidade}
                          </strong>
                        </div>

                        <span>
                          Todos os bairros
                          {" "}
                          <b>→</b>
                        </span>
                      </button>


                      {bairros.length >
                        0 && (
                        <div className="locationNeighborhoods">

                          {bairros.map(
                            (item) => (
                              <button
                                key={`${cidade}-${item.bairro}`}
                                type="button"
                                onClick={() =>
                                  escolherBairro(
                                    cidade,
                                    item.bairro!
                                  )
                                }
                              >
                                <div>
                                  <strong>
                                    {item.bairro}
                                  </strong>

                                  <small>
                                    {item.total}{" "}
                                    {Number(
                                      item.total
                                    ) === 1
                                      ? "perfil"
                                      : "perfis"}
                                  </small>
                                </div>

                                <b>
                                  →
                                </b>
                              </button>
                            )
                          )}

                        </div>
                      )}

                      <small className="locationCityTotal">
                        {totalCidade}{" "}
                        {totalCidade === 1
                          ? "perfil disponível"
                          : "perfis disponíveis"}
                      </small>

                    </div>
                  );
                }
              )}
          </section>
        </div>
      )}
    </>
  );
}