"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroClientePage() {
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function formatCPF(value: string) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 11);

    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  async function cadastrarCliente(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!nome.trim()) {
      setMessage("Digite seu nome.");
      return;
    }

    if (cpfLimpo.length !== 11) {
      setMessage("Digite um CPF válido.");
      return;
    }

    if (!email.trim()) {
      setMessage("Digite seu e-mail.");
      return;
    }

    if (senha.length < 8) {
      setMessage(
        "A senha precisa ter pelo menos 8 caracteres."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setMessage(
        "As senhas não são iguais."
      );
      return;
    }

    setLoading(true);

    const redirectTo =
      `${window.location.origin}` +
      `/auth/callback?next=/profissionais`;

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),

        password: senha,

        options: {
          emailRedirectTo: redirectTo,

          data: {
            role: "cliente",
            full_name: nome.trim(),
            cpf: cpfLimpo,
          },
        },
      });

    if (error) {
      console.error(error);

      const errorMessage =
        error.message.toLowerCase();

      if (
        errorMessage.includes("already") ||
        errorMessage.includes("registered")
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
      "Usuário criado:",
      data.user?.id
    );

    /*
      Se confirmação de e-mail estiver
      desativada no Supabase, haverá sessão
      imediatamente.
    */
    if (data.session) {
      window.location.href =
        "/profissionais";

      return;
    }

    /*
      Se confirmação de e-mail estiver ativa.
    */
    setMessage(
      "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro."
    );

    setLoading(false);
  }

  return (
    <main className="clientRegisterPage">
      <section className="clientRegisterCard">

        <div className="clientRegisterIntro">
          <span className="eyebrow">
            CADASTRO DE CLIENTE
          </span>

          <h1>
            Crie sua conta
          </h1>

          <p>
            Entre para explorar perfis,
            salvar favoritos e descobrir
            novas experiências.
          </p>
        </div>

        <form
          className="clientRegisterForm"
          onSubmit={cadastrarCliente}
        >
          {/* NOME */}
          <label>
            Nome completo

            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              autoComplete="name"
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
              placeholder="Digite novamente sua senha"
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

          {/* BOTÃO */}
          <button
            type="submit"
            className="clientRegisterSubmit"
            disabled={loading}
          >
            {loading
              ? "Criando conta..."
              : "Criar minha conta"}
          </button>
        </form>

        {message && (
          <div className="registerMessage">
            {message}
          </div>
        )}

        <p className="registerTerms">
          Ao continuar, você concorda com os
          Termos de Uso e a Política de Privacidade.
        </p>

      </section>
    </main>
  );
}