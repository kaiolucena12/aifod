"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/client";


const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];


export default function CadastroAcompanhantePage() {

  const [
    nome,
    setNome,
  ] =
    useState("");


  const [
    nomeArtistico,
    setNomeArtistico,
  ] =
    useState("");


  const [
    cpf,
    setCpf,
  ] =
    useState("");


  const [
    telefone,
    setTelefone,
  ] =
    useState("");


  const [
    bairro,
    setBairro,
  ] =
    useState("");


  const [
    cidade,
    setCidade,
  ] =
    useState("");


  const [
    estado,
    setEstado,
  ] =
    useState("");


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
    confirmarSenha,
    setConfirmarSenha,
  ] =
    useState("");


  const [
    maiorDeIdade,
    setMaiorDeIdade,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    sucesso,
    setSucesso,
  ] =
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


  function formatTelefone(
    value: string
  ) {

    const numbers =
      value
        .replace(/\D/g, "")
        .slice(0, 11);


    if (
      numbers.length <= 10
    ) {

      return numbers
        .replace(
          /^(\d{2})(\d)/,
          "($1) $2"
        )
        .replace(
          /(\d{4})(\d)/,
          "$1-$2"
        );

    }


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


    const telefoneLimpo =
      telefone.replace(
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
        "Informe seu nome completo."
      );

      return;
    }


    if (
      !nomeArtistico.trim()
    ) {

      setMessage(
        "Informe seu nome de exibição."
      );

      return;
    }


    if (
      cpfLimpo.length !== 11
    ) {

      setMessage(
        "Informe um CPF válido."
      );

      return;
    }


    if (
      telefoneLimpo.length < 10
    ) {

      setMessage(
        "Informe um telefone válido."
      );

      return;
    }


    if (
      !bairro.trim()
    ) {

      setMessage(
        "Informe seu bairro."
      );

      return;
    }


    if (
      !cidade.trim()
    ) {

      setMessage(
        "Informe sua cidade."
      );

      return;
    }


    if (
      !estado
    ) {

      setMessage(
        "Informe seu estado."
      );

      return;
    }


    if (
      !email.trim()
    ) {

      setMessage(
        "Informe seu e-mail."
      );

      return;
    }


    if (
      senha.length < 8
    ) {

      setMessage(
        "Sua senha precisa ter pelo menos 8 caracteres."
      );

      return;
    }


    if (
      senha !==
      confirmarSenha
    ) {

      setMessage(
        "As senhas não são iguais."
      );

      return;
    }


    if (
      !maiorDeIdade
    ) {

      setMessage(
        "É necessário confirmar que você tem 18 anos ou mais."
      );

      return;
    }


    setLoading(
      true
    );


    const supabase =
      createClient();


    /*
      CALLBACK
    */

    const redirectTo =
      `${window.location.origin}` +
      `/auth/callback?next=/login`;


    /*
      CRIAR USUÁRIO
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


    /*
      ERRO
    */

    if (error) {

      console.error(
        "Erro cadastro:",
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


      setLoading(
        false
      );


      return;
    }


    /*
      SEM CONFIRMAÇÃO DE EMAIL
    */

    if (
      data.session
    ) {

      window.location.href =
        "/login";

      return;
    }


    /*
      COM CONFIRMAÇÃO
    */

    setSucesso(
      true
    );


    setMessage(
      "Cadastro realizado com sucesso. Confira seu e-mail para confirmar sua conta."
    );


    setLoading(
      false
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
          max-w-[760px]
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


          {/* TOPO */}

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
                CADASTRO DE ACOMPANHANTE
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
                Crie seu{" "}

                <span
                  className="
                    text-[#e09566]
                  "
                >
                  perfil.
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
                Preencha suas informações
                para começar a criar sua
                presença dentro do AiFod.
              </p>

            </div>

          </div>


          {/* FORM */}

          <form
            onSubmit={
              cadastrarAcompanhante
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
                placeholder="Seu nome completo"
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


            {/* NOME ARTÍSTICO */}

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
                Nome de exibição
              </span>


              <input
                type="text"
                placeholder="Como você quer aparecer"
                value={
                  nomeArtistico
                }
                onChange={
                  (event) =>
                    setNomeArtistico(
                      event.target.value
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
                  text-white/25
                "
              >
                Esse será o nome mostrado
                publicamente no seu perfil.
              </small>

            </label>


            {/* CPF */}

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

            </label>


            {/* TELEFONE */}

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
                Telefone
              </span>


              <input
                type="tel"
                placeholder="(81) 99999-9999"
                value={
                  telefone
                }
                onChange={
                  (event) =>
                    setTelefone(
                      formatTelefone(
                        event.target.value
                      )
                    )
                }
                autoComplete="tel"
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* LOCALIZAÇÃO */}

            <div
              className="
                md:col-span-2
                mt-2
                border-t
                border-white/[0.06]
                pt-6
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
                LOCALIZAÇÃO
              </span>

            </div>


            {/* BAIRRO */}

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
                Bairro
              </span>


              <input
                type="text"
                placeholder="Ex.: Piedade"
                value={
                  bairro
                }
                onChange={
                  (event) =>
                    setBairro(
                      event.target.value
                    )
                }
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* CIDADE */}

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
                Cidade
              </span>


              <input
                type="text"
                placeholder="Ex.: Recife"
                value={
                  cidade
                }
                onChange={
                  (event) =>
                    setCidade(
                      event.target.value
                    )
                }
                required
                className={
                  fieldClass
                }
              />

            </label>


            {/* ESTADO */}

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
                Estado
              </span>


              <select
                value={
                  estado
                }
                onChange={
                  (event) =>
                    setEstado(
                      event.target.value
                    )
                }
                required
                className={
                  fieldClass
                }
              >

                <option value="">
                  Selecione seu estado
                </option>


                {estados.map(
                  (uf) => (

                    <option
                      key={
                        uf
                      }
                      value={
                        uf
                      }
                    >
                      {uf}
                    </option>

                  )
                )}

              </select>

            </label>


            {/* CONTA */}

            <div
              className="
                md:col-span-2
                mt-2
                border-t
                border-white/[0.06]
                pt-6
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
                SUA CONTA
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


            {/* 18+ */}

            <label
              className="
                md:col-span-2
                flex
                cursor-pointer
                items-start
                gap-3
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-4
              "
            >

              <input
                type="checkbox"
                checked={
                  maiorDeIdade
                }
                onChange={
                  (event) =>
                    setMaiorDeIdade(
                      event.target.checked
                    )
                }
                required
                className="
                  mt-0.5
                  h-4
                  w-4
                  accent-[#c46f43]
                "
              />


              <div>

                <strong
                  className="
                    block
                    text-[11px]
                    font-semibold
                    text-white/75
                  "
                >
                  Confirmo que tenho
                  18 anos ou mais.
                </strong>


                <p
                  className="
                    mt-1
                    text-[9px]
                    leading-4
                    text-white/30
                  "
                >
                  O cadastro de acompanhante
                  é permitido somente para
                  pessoas adultas.
                </p>

              </div>

            </label>


            {/* MENSAGEM */}

            {message && (

              <div
                className={`
                  md:col-span-2
                  rounded-2xl
                  border
                  px-5
                  py-4
                  text-[11px]
                  leading-5

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
                md:col-span-2
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
              "
            >

              {loading
                ? "Criando perfil..."
                : "Criar meu perfil"}

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
              Já possui conta?{" "}

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