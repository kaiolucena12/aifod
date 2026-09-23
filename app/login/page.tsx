"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [message, setMessage] = useState("");

  async function redirecionarUsuario(
    userId: string
  ) {
    const supabase = createClient();

    const { data: profile, error } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (error || !profile) {
      console.error(
        "Erro ao localizar perfil:",
        error
      );

      await supabase.auth.signOut();

      setMessage(
        "Não foi possível identificar seu perfil."
      );

      setLoading(false);
      setChecking(false);

      return;
    }

    /*
      ACOMPANHANTE
    */
    if (
      profile.role ===
      "acompanhante"
    ) {
      router.replace(
        "/acompanhante/painel"
      );

      return;
    }

    /*
      CLIENTE

      IMPORTANTE:
      o cliente vai primeiro para
      o dashboard /cliente.

      Lá ele poderá escolher:
      X, Comfort ou Black.
    */
    if (
      profile.role ===
      "cliente"
    ) {
      router.replace(
        "/cliente"
      );

      return;
    }

    /*
      ADMIN
    */
    if (
      profile.role ===
      "admin"
    ) {
      router.replace(
        "/admin"
      );

      return;
    }

    await supabase.auth.signOut();

    setMessage(
      "Tipo de conta não reconhecido."
    );

    setLoading(false);
    setChecking(false);
  }

  /*
    Verifica se o usuário
    já está autenticado.
  */
  useEffect(() => {
    async function verificarSessao() {
      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {
        await redirecionarUsuario(
          user.id
        );

        return;
      }

      setChecking(false);
    }

    verificarSessao();
  }, []);

  async function entrar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage(
        "Informe seu e-mail."
      );

      return;
    }

    if (!senha) {
      setMessage(
        "Informe sua senha."
      );

      return;
    }

    setLoading(true);

    const supabase =
      createClient();

    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email: email.trim(),
          password: senha,
        });

    if (error) {
      console.error(error);

      if (
        error.message
          .toLowerCase()
          .includes(
            "email not confirmed"
          )
      ) {
        setMessage(
          "Confirme seu e-mail antes de entrar."
        );
      } else {
        setMessage(
          "E-mail ou senha incorretos."
        );
      }

      setLoading(false);

      return;
    }

    if (!data.user) {
      setMessage(
        "Não foi possível acessar sua conta."
      );

      setLoading(false);

      return;
    }

    await redirecionarUsuario(
      data.user.id
    );
  }

  if (checking) {
    return (
      <main className="clientRegisterPage">
        <section className="clientRegisterCard">

          <div className="loginChecking">

            <span className="loginLoader" />

            <p>
              Verificando sua conta...
            </p>

          </div>

        </section>
      </main>
    );
  }

  return (
    <main className="clientRegisterPage">

      <section className="clientRegisterCard">

        <div className="clientRegisterIntro">

          <span className="eyebrow">
            BEM-VINDO AO AIFOD
          </span>

          <h1>
            Entre na sua conta
          </h1>

          <p>
            Acesse sua conta para continuar
            sua experiência no AiFod.
          </p>

        </div>

        <form
          className="clientRegisterForm"
          onSubmit={entrar}
        >

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

          <label>
            Senha

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              autoComplete="current-password"
              required
            />

          </label>

          <div className="loginOptions">

            <Link href="/recuperar-senha">
              Esqueci minha senha
            </Link>

          </div>

          <button
            type="submit"
            className="clientRegisterSubmit"
            disabled={loading}
          >

            {loading
              ? "Entrando..."
              : "Entrar"}

          </button>

        </form>

        {message && (
          <div className="registerMessage">
            {message}
          </div>
        )}

        <div className="loginRegisterArea">

          <p>
            Ainda não possui conta?
          </p>

          <div className="loginRegisterChoices">

            <Link
              href="/cadastro/cliente"
              className="loginRegisterChoice"
            >
              Quero me cadastrar como cliente
            </Link>

            <Link
              href="/cadastro/acompanhante"
              className="loginRegisterChoice"
            >
              Quero criar meu perfil
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}