"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/client";


export default function CadastroClientePage() {

  const [nome, setNome] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [sucesso, setSucesso] =
    useState(false);


  function formatCPF(
    value: string
  ) {

    const numbers =
      value
        .replace(/\D/g, "")
        .slice(0, 11);


    return numbers
      .replace(
        /(\d{3})(\d)/,
        "$1.$2"
      )
      .replace(
        /(\d{3})(\d)/,
        "$1.$2"
      )
      .replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
      );

  }


  async function cadastrarCliente(
    event:
      FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setMessage("");
    setSucesso(false);


    const cpfLimpo =
      cpf.replace(
        /\D/g,
        ""
      );


    /*
      VALIDAÇÕES
    */

    if (
      !nome.trim()
    ) {

      setMessage(
        "Digite seu nome."
      );

      return;
    }


    if (
      cpfLimpo.length !== 11
    ) {

      setMessage(
        "Digite um CPF válido."
      );

      return;
    }


    if (
      !email.trim()
    ) {

      setMessage(
        "Digite seu e-mail."
      );

      return;
    }


    if (
      senha.length < 8
    ) {

      setMessage(
        "A senha precisa ter pelo menos 8 caracteres."
      );

      return;
    }


    if (
      senha !== confirmarSenha
    ) {

      setMessage(
        "As senhas não são iguais."
      );

      return;
    }


    setLoading(true);


    const supabase =
      createClient();


    /*
      CALLBACK

      Após confirmação do e-mail,
      o cliente vai para o login.
    */

    const redirectTo =
      `${window.location.origin}` +
      `/auth/callback?next=/login`;


    /*
      CRIAR CONTA
    */

    const {
      data,
      error,
    } =
      await supabase.auth.signUp({

        email:
          email.trim(),

        password:
          senha,

        options: {

          emailRedirectTo:
            redirectTo,

          data: {

            role:
              "cliente",

            full_name:
              nome.trim(),

            cpf:
              cpfLimpo,

          },

        },

      });


    /*
      ERRO
    */

    if (error) {

      console.error(
        "Erro no cadastro:",
        error
      );


      const errorMessage =
        error.message
          .toLowerCase();


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

      } else if (
        errorMessage.includes(
          "database error"
        )
      ) {

        setMessage(
          "Não foi possível concluir o cadastro. Verifique se o CPF ou e-mail já estão cadastrados."
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


    /*
      CONFIRMAÇÃO DE EMAIL DESATIVADA
    */

    if (
      data.session
    ) {

      window.location.href =
        "/cliente";

      return;
    }


    /*
      CONFIRMAÇÃO DE EMAIL ATIVADA
    */

    setSucesso(true);

    setMessage(
      "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro."
    );

    setLoading(false);

  }


  /*
    CLASSES REUTILIZÁVEIS
  */

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


  const labelClass = `
    flex
    flex-col
    gap-2
  `;


  const labelTextClass = `
    text-[9px]
    font-bold
    uppercase
    tracking-[0.1em]
    text-white/45
  `;


  return (

    <main
      className="
        min-h-screen
        bg-[#0b0908]
        px-4
        py-8
        text-[#f8f1e8]
        sm:px-6
        md:py-12
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-[680px]
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
            shadow-[0_35px_100px_rgba(0,0,0,0.35)]
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
              py-8
              sm:px-9
              sm:py-10
            "
          >

            {/* BRILHO */}

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
                CADASTRO DE CLIENTE
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
                Crie sua{" "}

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
                  max-w-lg
                  text-[12px]
                  leading-6
                  text-white/40
                "
              >
                Entre para explorar perfis,
                descobrir novas experiências
                e acompanhar suas conexões.
              </p>

            </div>

          </div>


          {/* FORMULÁRIO */}

          <form
            onSubmit={
              cadastrarCliente
            }
            className="
              grid
              grid-cols-1
              gap-5
              px-6
              py-8
              sm:px-9
              md:grid-cols-2
            "
          >


            {/* NOME */}

            <label
              className={`
                ${labelClass}
                md:col-span-2
              `}
            >

              <span
                className={
                  labelTextClass
                }
              >
                Nome completo
              </span>


              <input
                type="text"
                placeholder="Digite seu nome"
                value={
                  nome
                }
                onChange={
                  (event) =>
                    setNome(
                      event.target.value
                    )
                }
                autoComplete="name"
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* CPF */}

            <label
              className={`
                ${labelClass}
                md:col-span-2
              `}
            >

              <span
                className={
                  labelTextClass
                }
              >
                CPF
              </span>


              <input
                type="text"
                inputMode="numeric"
                maxLength={14}
                placeholder="000.000.000-00"
                value={
                  cpf
                }
                onChange={
                  (event) =>
                    setCpf(
                      formatCPF(
                        event.target.value
                      )
                    )
                }
                required
                className={
                  fieldClass
                }
              />


              <small
                className="
                  text-[8px]
                  leading-4
                  text-white/25
                "
              >
                Seu CPF é utilizado para
                identificação da conta.
              </small>

            </label>


            {/* DADOS DE ACESSO */}

            <div
              className="
                mt-2
                border-t
                border-white/[0.06]
                pt-6
                md:col-span-2
              "
            >

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#c46f43]
                "
              >
                DADOS DE ACESSO
              </span>

            </div>


            {/* EMAIL */}

            <label
              className={`
                ${labelClass}
                md:col-span-2
              `}
            >

              <span
                className={
                  labelTextClass
                }
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
              className={
                labelClass
              }
            >

              <span
                className={
                  labelTextClass
                }
              >
                Senha
              </span>


              <input
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={
                  senha
                }
                onChange={
                  (event) =>
                    setSenha(
                      event.target.value
                    )
                }
                autoComplete="new-password"
                minLength={8}
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* CONFIRMAR SENHA */}

            <label
              className={
                labelClass
              }
            >

              <span
                className={
                  labelTextClass
                }
              >
                Confirmar senha
              </span>


              <input
                type="password"
                placeholder="Digite novamente"
                value={
                  confirmarSenha
                }
                onChange={
                  (event) =>
                    setConfirmarSenha(
                      event.target.value
                    )
                }
                autoComplete="new-password"
                minLength={8}
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* TERMOS */}

            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-4
                md:col-span-2
              "
            >

              <p
                className="
                  text-[9px]
                  leading-5
                  text-white/35
                "
              >
                Ao criar sua conta, você
                concorda com os{" "}

                <Link
                  href="/termos"
                  className="
                    font-semibold
                    text-[#e09566]
                    transition
                    hover:text-[#f1ae84]
                  "
                >
                  Termos de Uso
                </Link>

                {" "}e com a{" "}

                <Link
                  href="/privacidade"
                  className="
                    font-semibold
                    text-[#e09566]
                    transition
                    hover:text-[#f1ae84]
                  "
                >
                  Política de Privacidade
                </Link>

                .
              </p>

            </div>


            {/* MENSAGEM */}

            {message && (

              <div
                className={`
                  rounded-2xl
                  border
                  px-5
                  py-4
                  text-[11px]
                  leading-5
                  md:col-span-2

                  ${
                    sucesso
                      ? `
                        border-emerald-400/15
                        bg-emerald-400/[0.05]
                        text-emerald-200/75
                      `
                      : `
                        border-red-400/15
                        bg-red-400/[0.05]
                        text-red-200/75
                      `
                  }
                `}
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
                mt-2
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
                md:col-span-2
              "
            >

              {loading
                ? "Criando conta..."
                : "Criar minha conta"}

            </button>

          </form>


          {/* LOGIN */}

          <div
            className="
              border-t
              border-white/[0.06]
              px-6
              py-6
              text-center
              sm:px-9
            "
          >

            <p
              className="
                text-[10px]
                text-white/35
              "
            >
              Já possui uma conta?{" "}

              <Link
                href="/login"
                className="
                  font-bold
                  text-[#e09566]
                  transition
                  hover:text-[#f2b28b]
                "
              >
                Entrar
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>

  );
}