"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CadastroAcompanhantePage() {
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [maiorDeIdade, setMaiorDeIdade] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  function formatCPF(value: string) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 11);

    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
      );
  }

  function formatTelefone(value: string) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 11);

    return numbers
      .replace(
        /^(\d{2})(\d)/,
        "($1) $2"
      )
      .replace(
        /(\d{5})(\d)/,
        "$1-$2"
      );
  }

  async function cadastrarAcompanhante(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const cpfLimpo =
      cpf.replace(/\D/g, "");

    const telefoneLimpo =
      telefone.replace(/\D/g, "");

    /* =========================
       VALIDAÇÕES
    ========================= */

    if (!nome.trim()) {
      setMessage(
        "Informe seu nome completo."
      );
      return;
    }

    if (!nomeArtistico.trim()) {
      setMessage(
        "Informe seu nome de exibição."
      );
      return;
    }

    if (cpfLimpo.length !== 11) {
      setMessage(
        "Informe um CPF válido."
      );
      return;
    }

    if (telefoneLimpo.length < 10) {
      setMessage(
        "Informe um telefone válido."
      );
      return;
    }

    if (!bairro.trim()) {
      setMessage(
        "Informe seu bairro."
      );
      return;
    }

    if (!cidade.trim()) {
      setMessage(
        "Informe sua cidade."
      );
      return;
    }

    if (!estado) {
      setMessage(
        "Informe seu estado."
      );
      return;
    }

    if (!email.trim()) {
      setMessage(
        "Informe seu e-mail."
      );
      return;
    }

    if (senha.length < 8) {
      setMessage(
        "Sua senha precisa ter pelo menos 8 caracteres."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setMessage(
        "As senhas não são iguais."
      );
      return;
    }

    if (!maiorDeIdade) {
      setMessage(
        "É necessário confirmar que você tem 18 anos ou mais."
      );
      return;
    }

    setLoading(true);

    /* =========================
       CALLBACK APÓS CONFIRMAR EMAIL
    ========================= */

    const redirectTo =
      `${window.location.origin}` +
      `/auth/callback?next=/login`;

    /* =========================
       CRIAR USUÁRIO
    ========================= */

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),

        password: senha,

        options: {
          emailRedirectTo:
            redirectTo,

          data: {
            role:
              "acompanhante",

            full_name:
              nome.trim(),

            nome_artistico:
              nomeArtistico.trim(),

            cpf:
              cpfLimpo,

            telefone:
              telefoneLimpo,

            bairro:
              bairro.trim(),

            cidade:
              cidade.trim(),

            estado,
          },
        },
      });

    /* =========================
       ERRO
    ========================= */

    if (error) {
      console.error(
        "Erro cadastro:",
        error
      );

      const errorMessage =
        error.message.toLowerCase();

      if (
        errorMessage.includes(
          "already"
        ) ||
        errorMessage.includes(
          "registered"
        )
      ) {
        setMessage(
          "Este e-mail já possui cadastro."
        );
      } else {
        setMessage(
          error.message ||
            "Não foi possível criar sua conta."
        );
      }

      setLoading(false);

      return;
    }

    console.log(
      "Acompanhante criada:",
      data.user?.id
    );

    /* =========================
       SEM CONFIRMAÇÃO DE EMAIL
    ========================= */

    if (data.session) {
      window.location.href =
        "/login";

      return;
    }

    /* =========================
       COM CONFIRMAÇÃO DE EMAIL
    ========================= */

    setMessage(
      "Cadastro realizado com sucesso. Confira seu e-mail para confirmar sua conta."
    );

    setLoading(false);
  }

  return (
    <main className="clientRegisterPage">
      <section className="clientRegisterCard">

        {/* CABEÇALHO */}

        <div className="clientRegisterIntro">
          <span className="eyebrow">
            CADASTRO DE ACOMPANHANTE
          </span>

          <h1>
            Crie seu perfil
          </h1>

          <p>
            Comece seu cadastro para criar
            sua presença dentro do AiFod.
          </p>
        </div>

        {/* FORMULÁRIO */}

        <form
          className="clientRegisterForm"
          onSubmit={
            cadastrarAcompanhante
          }
        >

          {/* NOME */}

          <label>
            Nome completo

            <input
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              autoComplete="name"
              required
            />
          </label>

          {/* NOME DE EXIBIÇÃO */}

          <label>
            Nome de exibição

            <input
              type="text"
              placeholder="Como você quer aparecer"
              value={nomeArtistico}
              onChange={(e) =>
                setNomeArtistico(
                  e.target.value
                )
              }
              required
            />
          </label>

          {/* CPF */}

          <label>
            CPF

            <input
              type="text"
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) =>
                setCpf(
                  formatCPF(
                    e.target.value
                  )
                )
              }
              required
            />
          </label>

          {/* TELEFONE */}

          <label>
            Telefone

            <input
              type="tel"
              placeholder="(81) 99999-9999"
              value={telefone}
              onChange={(e) =>
                setTelefone(
                  formatTelefone(
                    e.target.value
                  )
                )
              }
              autoComplete="tel"
              required
            />
          </label>

          {/* BAIRRO */}

          <label>
            Bairro

            <input
              type="text"
              placeholder="Ex.: Piedade"
              value={bairro}
              onChange={(e) =>
                setBairro(
                  e.target.value
                )
              }
              required
            />
          </label>

          {/* CIDADE + ESTADO */}

          <div className="registerTwoColumns">

            <label>
              Cidade

              <input
                type="text"
                placeholder="Ex.: Jaboatão dos Guararapes"
                value={cidade}
                onChange={(e) =>
                  setCidade(
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Estado

              <select
                value={estado}
                onChange={(e) =>
                  setEstado(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  UF
                </option>

                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>

            </label>
          </div>

          {/* EMAIL */}

          <label>
            E-mail

            <input
              type="email"
              placeholder="seuemail@gmail.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              autoComplete="email"
              required
            />
          </label>

          {/* SENHA */}

          <label>
            Senha

            <input
              type="password"
              placeholder="Mínimo de 8 caracteres"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {/* CONFIRMAR SENHA */}

          <label>
            Confirmar senha

            <input
              type="password"
              placeholder="Digite sua senha novamente"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(
                  e.target.value
                )
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {/* 18+ */}

          <label className="ageConfirmation">
            <input
              type="checkbox"
              checked={
                maiorDeIdade
              }
              onChange={(e) =>
                setMaiorDeIdade(
                  e.target.checked
                )
              }
              required
            />

            <span>
              Confirmo que tenho 18 anos
              ou mais.
            </span>
          </label>

          {/* BOTÃO */}

          <button
            type="submit"
            className="clientRegisterSubmit"
            disabled={loading}
          >
            {loading
              ? "Criando perfil..."
              : "Criar meu perfil"}
          </button>

        </form>

        {/* MENSAGEM */}

        {message && (
          <div className="registerMessage">
            {message}
          </div>
        )}

        {/* LOGIN */}

        <p className="registerTerms">
          Já possui conta?{" "}

          <Link href="/login">
            Entrar
          </Link>
        </p>

      </section>
    </main>
  );
}