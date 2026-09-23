"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


export default function LoginPage() {

  const router =
    useRouter();


  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    senha,
    setSenha,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    checking,
    setChecking,
  ] =
    useState(true);


  const [
    message,
    setMessage,
  ] =
    useState("");


  async function redirecionarUsuario(
    userId: string
  ) {

    const supabase =
      createClient();


    const {
      data: profile,
      error,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          userId
        )
        .single();


    if (
      error ||
      !profile
    ) {

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
    VERIFICA SESSÃO EXISTENTE
  */

  useEffect(() => {

    async function verificarSessao() {

      const supabase =
        createClient();


      const {
        data: {
          user,
        },
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


  /*
    LOGIN
  */

  async function entrar(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    setMessage("");


    if (
      !email.trim()
    ) {

      setMessage(
        "Informe seu e-mail."
      );

      return;
    }


    if (
      !senha
    ) {

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

          email:
            email.trim(),

          password:
            senha,

        });


    if (error) {

      console.error(
        error
      );


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


    if (
      !data.user
    ) {

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


  const fieldClass = `
    min-h-12
    w-full
    rounded-xl
    border
    border-white/[0.08]
    bg-[#120e0c]
    px-4
    text-sm
    text-white/85
    outline-none
    transition
    placeholder:text-white/20
    focus:border-[#e09566]/45
    focus:ring-1
    focus:ring-[#e09566]/10
  `;


  /*
    VERIFICANDO SESSÃO
  */

  if (checking) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#0b0908]
          px-4
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
              text-[11px]
              text-white/35
            "
          >
            Verificando sua conta...
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
        md:py-14
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-[560px]
        "
      >


        {/* VOLTAR */}

        <Link
          href="/"
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            text-[10px]
            text-white/35
            transition
            hover:text-white/70
          "
        >
          ← Voltar
        </Link>


        {/* CARD */}

        <section
          className="
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.08]
            bg-[#120e0c]
            shadow-[0_35px_100px_rgba(0,0,0,0.38)]
          "
        >


          {/* CABEÇALHO */}

          <div
            className="
              relative
              overflow-hidden
              border-b
              border-white/[0.06]
              px-6
              py-9
              sm:px-9
              sm:py-11
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-[#c46f43]/10
                blur-3xl
              "
            />


            <div
              className="
                relative
                z-10
              "
            >

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-[#c46f43]
                "
              >
                BEM-VINDO AO AIFOD
              </span>


              <h1
                className="
                  mt-3
                  text-[42px]
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.055em]
                  text-[#fff7f0]
                  sm:text-5xl
                "
              >
                Entre na sua{" "}

                <span
                  className="
                    text-[#e09566]
                  "
                >
                  conta.
                </span>

              </h1>


              <p
                className="
                  mt-4
                  max-w-md
                  text-[12px]
                  leading-6
                  text-white/40
                "
              >
                Acesse sua conta para
                continuar sua experiência
                no AiFod.
              </p>

            </div>

          </div>


          {/* FORM */}

          <form
            onSubmit={
              entrar
            }
            className="
              flex
              flex-col
              gap-5
              px-6
              py-8
              sm:px-9
            "
          >


            {/* EMAIL */}

            <label
              className="
                flex
                flex-col
                gap-2
              "
            >

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-white/45
                "
              >
                E-mail
              </span>


              <input
                type="email"
                placeholder="seuemail@gmail.com"
                value={
                  email
                }
                onChange={
                  (event) =>
                    setEmail(
                      event.target.value
                    )
                }
                autoComplete="email"
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* SENHA */}

            <label
              className="
                flex
                flex-col
                gap-2
              "
            >

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-white/45
                "
              >
                Senha
              </span>


              <input
                type="password"
                placeholder="Digite sua senha"
                value={
                  senha
                }
                onChange={
                  (event) =>
                    setSenha(
                      event.target.value
                    )
                }
                autoComplete="current-password"
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* ESQUECI A SENHA */}

            <div
              className="
                flex
                justify-end
              "
            >

              <Link
                href="/recuperar-senha"
                className="
                  text-[9px]
                  font-semibold
                  text-[#e09566]
                  transition
                  hover:text-[#f2b28b]
                "
              >
                Esqueci minha senha
              </Link>

            </div>


            {/* MENSAGEM */}

            {message && (

              <div
                className="
                  rounded-2xl
                  border
                  border-red-400/15
                  bg-red-400/[0.05]
                  px-5
                  py-4
                  text-[11px]
                  leading-5
                  text-red-200/75
                "
              >
                {message}
              </div>

            )}


            {/* BOTÃO */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                mt-1
                min-h-14
                rounded-full
                bg-gradient-to-r
                from-[#e09566]
                to-[#c46f43]
                px-7
                text-[11px]
                font-black
                tracking-[0.03em]
                text-[#160b07]
                shadow-[0_15px_40px_rgba(196,111,67,0.18)]
                transition
                hover:-translate-y-0.5
                disabled:cursor-wait
                disabled:opacity-50
              "
            >

              {loading
                ? "Entrando..."
                : "Entrar"}

            </button>

          </form>


          {/* CADASTROS */}

          <div
            className="
              border-t
              border-white/[0.06]
              px-6
              py-7
              sm:px-9
            "
          >

            <p
              className="
                text-center
                text-[10px]
                text-white/35
              "
            >
              Ainda não possui conta?
            </p>


            <div
              className="
                mt-4
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >

              {/* CLIENTE */}

              <Link
                href="/cadastro/cliente"
                className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.02]
                  p-4
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#e09566]/25
                  hover:bg-[#c46f43]/[0.04]
                "
              >

                <span
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-[#c46f43]
                  "
                >
                  CLIENTE
                </span>


                <strong
                  className="
                    mt-2
                    block
                    text-[12px]
                    text-white/75
                  "
                >
                  Criar minha conta
                </strong>


                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-white/30
                  "
                >
                  Quero explorar perfis
                  e descobrir experiências.
                </p>


                <span
                  className="
                    mt-4
                    block
                    text-sm
                    text-[#e09566]
                    transition
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </Link>


              {/* ACOMPANHANTE */}

              <Link
                href="/cadastro/acompanhante"
                className="
                  group
                  rounded-2xl
                  border
                  border-[#d2a86b]/10
                  bg-[#d2a86b]/[0.025]
                  p-4
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#d2a86b]/25
                  hover:bg-[#d2a86b]/[0.05]
                "
              >

                <span
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-[#d2a86b]
                  "
                >
                  PERFIL
                </span>


                <strong
                  className="
                    mt-2
                    block
                    text-[12px]
                    text-white/75
                  "
                >
                  Criar meu perfil
                </strong>


                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-white/30
                  "
                >
                  Quero criar minha presença
                  dentro da plataforma.
                </p>


                <span
                  className="
                    mt-4
                    block
                    text-sm
                    text-[#d2a86b]
                    transition
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>

  );
}