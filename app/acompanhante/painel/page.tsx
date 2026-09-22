"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

type PerfilAcompanhante = {
  nome_artistico: string | null;
  telefone: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  status: string | null;
  plano: string | null;
};

export default function PainelAcompanhantePage() {
  const router = useRouter();

  const [perfil, setPerfil] =
    useState<PerfilAcompanhante | null>(null);

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState("");

  useEffect(() => {
    async function carregarPainel() {
      const supabase =
        createClient();

      /* =========================
         VERIFICAR USUÁRIO
      ========================= */

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        router.replace("/login");
        return;
      }

      setEmail(
        user.email || ""
      );

      /* =========================
         VERIFICAR ROLE
      ========================= */

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (
        profileError ||
        !profile
      ) {
        setErro(
          "Não foi possível localizar sua conta."
        );

        setLoading(false);
        return;
      }

      if (
        profile.role !==
        "acompanhante"
      ) {
        router.replace(
          "/profissionais"
        );

        return;
      }

      /* =========================
         BUSCAR PERFIL
      ========================= */

      const {
        data: acompanhante,
        error: acompanhanteError,
      } =
        await supabase
          .from(
            "acompanhante_profiles"
          )
          .select(`
            nome_artistico,
            telefone,
            bairro,
            cidade,
            estado,
            status,
            plano
          `)
          .eq("id", user.id)
          .single();

      if (
        acompanhanteError
      ) {
        console.log(
          acompanhanteError
        );

        setErro(
          "Seu cadastro existe, mas não foi possível carregar os dados do perfil."
        );

        setLoading(false);
        return;
      }

      setPerfil(
        acompanhante
      );

      setLoading(false);
    }

    carregarPainel();

  }, [router]);

  async function sair() {
    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  function nomePlano(
    plano: string | null
  ) {
    if (
      plano === "comfort"
    ) {
      return "Comfort";
    }

    if (
      plano === "black"
    ) {
      return "Black";
    }

    return "X";
  }

  function nomeStatus(
    status: string | null
  ) {
    if (
      status === "aprovado"
    ) {
      return "Perfil aprovado";
    }

    if (
      status === "rejeitado"
    ) {
      return "Perfil não aprovado";
    }

    if (
      status === "suspenso"
    ) {
      return "Perfil suspenso";
    }

    return "Perfil em análise";
  }

  if (loading) {
    return (
      <main className="dashboardPage">
        <div className="dashboardLoading">
          <span className="loginLoader" />

          <p>
            Carregando seu painel...
          </p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="dashboardPage">
        <div className="dashboardError">
          <span className="eyebrow">
            AIFOD
          </span>

          <h1>
            Não foi possível carregar
            seu perfil
          </h1>

          <p>
            {erro}
          </p>

          <button
            type="button"
            className="dashboardPrimaryButton"
            onClick={sair}
          >
            Sair da conta
          </button>
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
              ÁREA DA ACOMPANHANTE
            </span>

            <h1>
              Olá,{" "}
              <em>
                {perfil?.nome_artistico ||
                  "bem-vinda"}
              </em>
            </h1>

            <p>
              Gerencie seu perfil e acompanhe
              o status da sua conta.
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


        {/* STATUS */}

        <section className="dashboardStatusCard">

          <div className="dashboardStatusIcon">
            ✦
          </div>

          <div>
            <small>
              STATUS DA CONTA
            </small>

            <strong>
              {nomeStatus(
                perfil?.status ||
                  null
              )}
            </strong>

            {perfil?.status ===
            "aprovado" ? (
              <p>
                Seu perfil está ativo
                na plataforma.
              </p>
            ) : (
              <p>
                Seu cadastro está aguardando
                análise antes de aparecer
                publicamente.
              </p>
            )}
          </div>

          <span
            className={`dashboardStatusBadge ${
              perfil?.status ===
              "aprovado"
                ? "approved"
                : "pending"
            }`}
          >
            {perfil?.status ===
            "aprovado"
              ? "APROVADO"
              : "PENDENTE"}
          </span>

        </section>


        {/* RESUMO */}

        <section className="dashboardGrid">

          <article className="dashboardCard">
            <small>
              PERFIL
            </small>

            <h2>
              {perfil?.nome_artistico ||
                "Sem nome"}
            </h2>

            <p>
              {email}
            </p>
          </article>


          <article className="dashboardCard">
            <small>
              CATEGORIA
            </small>

            <h2>
              {nomePlano(
                perfil?.plano ||
                  null
              )}
            </h2>

            <p>
              Categoria atual do seu perfil.
            </p>
          </article>


          <article className="dashboardCard">
            <small>
              LOCALIZAÇÃO
            </small>

            <h2>
              {perfil?.bairro ||
                "Não informado"}
            </h2>

            <p>
              {perfil?.cidade || ""}
              {perfil?.estado
                ? ` • ${perfil.estado}`
                : ""}
            </p>
          </article>

        </section>


        {/* AÇÕES */}

        <section className="dashboardActions">

          <div className="dashboardSectionTitle">
            <span className="eyebrow">
              MEU PERFIL
            </span>

            <h2>
              Complete sua presença
            </h2>
          </div>


          <div className="dashboardActionsGrid">

            <button
              type="button"
              className="dashboardActionCard"
            >
              <span>
                01
              </span>

              <div>
                <strong>
                  Editar perfil
                </strong>

                <small>
                  Nome, descrição e
                  informações públicas.
                </small>
              </div>

              <b>
                →
              </b>
            </button>


            <button
              type="button"
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
                  Adicione e organize
                  suas fotos.
                </small>
              </div>

              <b>
                →
              </b>
            </button>


            <button
              type="button"
              className="dashboardActionCard"
            >
              <span>
                03
              </span>

              <div>
                <strong>
                  Localização
                </strong>

                <small>
                  Atualize cidade
                  e bairro.
                </small>
              </div>

              <b>
                →
              </b>
            </button>


            <button
              type="button"
              className="dashboardActionCard"
            >
              <span>
                04
              </span>

              <div>
                <strong>
                  Disponibilidade
                </strong>

                <small>
                  Configure quando
                  seu perfil está disponível.
                </small>
              </div>

              <b>
                →
              </b>
            </button>

          </div>
        </section>


        <div className="dashboardBack">
          <Link href="/">
            ← Voltar para o AiFod
          </Link>
        </div>

      </div>
    </main>
  );
}