"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


type Perfil = {
  nome_artistico: string | null;
  telefone: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  plano: string | null;
  status: string | null;
  idade: number | null;
  descricao_curta: string | null;
  sobre: string | null;
  disponibilidade: string | null;
  foto_capa: string | null;
};


type Foto = {
  id: string;
  url: string;
  storage_path: string | null;
  ordem: number;
};


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


export default function PerfilAcompanhantePage() {

  const router =
    useRouter();


  const [
    userId,
    setUserId,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    salvando,
    setSalvando,
  ] =
    useState(false);


  const [
    enviandoFoto,
    setEnviandoFoto,
  ] =
    useState(false);


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


  const [
    nomeArtistico,
    setNomeArtistico,
  ] =
    useState("");


  const [
    telefone,
    setTelefone,
  ] =
    useState("");


  const [
    idade,
    setIdade,
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
    descricaoCurta,
    setDescricaoCurta,
  ] =
    useState("");


  const [
    sobre,
    setSobre,
  ] =
    useState("");


  const [
    disponibilidade,
    setDisponibilidade,
  ] =
    useState("");


  const [
    plano,
    setPlano,
  ] =
    useState("x");


  const [
    status,
    setStatus,
  ] =
    useState("pendente");


  const [
    fotoCapa,
    setFotoCapa,
  ] =
    useState<string | null>(
      null
    );


  const [
    fotos,
    setFotos,
  ] =
    useState<Foto[]>([]);


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
        profile?.role !==
        "acompanhante"
      ) {

        router.replace(
          "/cliente"
        );

        return;
      }


      setUserId(
        user.id
      );


      /*
        PERFIL
      */

      const {
        data,
        error,
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
            plano,
            status,
            idade,
            descricao_curta,
            sobre,
            disponibilidade,
            foto_capa
          `)
          .eq(
            "id",
            user.id
          )
          .single();


      if (error) {

        setErro(
          "Não foi possível carregar seu perfil."
        );

        setLoading(false);

        return;
      }


      if (data) {

        const perfil =
          data as Perfil;


        setNomeArtistico(
          perfil.nome_artistico ||
            ""
        );


        setTelefone(
          perfil.telefone ||
            ""
        );


        setIdade(
          perfil.idade
            ? String(
                perfil.idade
              )
            : ""
        );


        setBairro(
          perfil.bairro ||
            ""
        );


        setCidade(
          perfil.cidade ||
            ""
        );


        setEstado(
          perfil.estado ||
            ""
        );


        setDescricaoCurta(
          perfil.descricao_curta ||
            ""
        );


        setSobre(
          perfil.sobre ||
            ""
        );


        setDisponibilidade(
          perfil.disponibilidade ||
            ""
        );


        setPlano(
          perfil.plano ||
            "x"
        );


        setStatus(
          perfil.status ||
            "pendente"
        );


        setFotoCapa(
          perfil.foto_capa
        );

      }


      await carregarFotos(
        user.id
      );


      setLoading(false);

    }


    carregar();

  }, [router]);


  async function carregarFotos(
    id: string
  ) {

    const supabase =
      createClient();


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "profile_photos"
        )
        .select(`
          id,
          url,
          storage_path,
          ordem
        `)
        .eq(
          "acompanhante_id",
          id
        )
        .order(
          "ordem",
          {
            ascending: true,
          }
        );


    if (!error) {

      setFotos(
        data || []
      );

    }

  }


  /*
    SALVAR PERFIL
  */

  async function salvarPerfil() {

    if (
      !userId ||
      salvando
    ) {
      return;
    }


    setMessage("");
    setErro("");


    if (
      !nomeArtistico.trim()
    ) {

      setErro(
        "Informe seu nome de exibição."
      );

      return;
    }


    if (
      idade &&
      (
        Number(idade) < 18 ||
        Number(idade) > 99
      )
    ) {

      setErro(
        "Informe uma idade válida."
      );

      return;
    }


    if (
      !cidade.trim() ||
      !estado
    ) {

      setErro(
        "Informe sua cidade e estado."
      );

      return;
    }


    setSalvando(true);


    const supabase =
      createClient();


    const {
      error,
    } =
      await supabase
        .from(
          "acompanhante_profiles"
        )
        .update({

          nome_artistico:
            nomeArtistico.trim(),

          telefone:
            telefone.trim(),

          idade:
            idade
              ? Number(
                  idade
                )
              : null,

          bairro:
            bairro.trim(),

          cidade:
            cidade.trim(),

          estado,

          descricao_curta:
            descricaoCurta.trim(),

          sobre:
            sobre.trim(),

          disponibilidade:
            disponibilidade.trim(),

          updated_at:
            new Date()
              .toISOString(),

        })
        .eq(
          "id",
          userId
        );


    if (error) {

      console.error(error);

      setErro(
        "Não foi possível salvar as alterações."
      );

      setSalvando(false);

      return;
    }


    setMessage(
      "Perfil atualizado com sucesso."
    );


    setSalvando(false);

  }


  /*
    UPLOAD DAS FOTOS
  */

  async function enviarFotos(
    event:
      ChangeEvent<HTMLInputElement>
  ) {

    const arquivos =
      event.target.files;


    if (
      !arquivos ||
      arquivos.length === 0 ||
      !userId
    ) {
      return;
    }


    if (
      fotos.length +
        arquivos.length >
      8
    ) {

      setErro(
        "Você pode adicionar no máximo 8 fotos."
      );

      event.target.value =
        "";

      return;
    }


    setErro("");
    setMessage("");

    setEnviandoFoto(
      true
    );


    const supabase =
      createClient();


    try {

      for (
        let i = 0;
        i < arquivos.length;
        i++
      ) {

        const arquivo =
          arquivos[i];


        if (
          !arquivo.type.startsWith(
            "image/"
          )
        ) {
          continue;
        }


        if (
          arquivo.size >
          8 * 1024 * 1024
        ) {

          setErro(
            "Cada foto pode ter no máximo 8 MB."
          );

          continue;
        }


        const extensao =
          arquivo.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "jpg";


        const nomeArquivo =
          `${crypto.randomUUID()}.${extensao}`;


        const caminho =
          `${userId}/${nomeArquivo}`;


        /*
          STORAGE
        */

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "acompanhantes"
            )
            .upload(
              caminho,
              arquivo,
              {
                cacheControl:
                  "3600",

                upsert:
                  false,
              }
            );


        if (uploadError) {

          console.error(
            uploadError
          );

          setErro(
            uploadError.message
          );

          continue;
        }


        /*
          URL PÚBLICA
        */

        const {
          data:
            publicUrlData,
        } =
          supabase.storage
            .from(
              "acompanhantes"
            )
            .getPublicUrl(
              caminho
            );


        const url =
          publicUrlData.publicUrl;


        /*
          BANCO
        */

        const ordem =
          fotos.length + i;


        const {
          error:
            insertError,
        } =
          await supabase
            .from(
              "profile_photos"
            )
            .insert({

              acompanhante_id:
                userId,

              url,

              storage_path:
                caminho,

              ordem,

            });


        if (insertError) {

          console.error(
            insertError
          );


          await supabase.storage
            .from(
              "acompanhantes"
            )
            .remove([
              caminho,
            ]);


          setErro(
            insertError.message
          );

          continue;
        }


        /*
          PRIMEIRA FOTO
          VIRA CAPA
        */

        if (
          !fotoCapa &&
          fotos.length === 0 &&
          i === 0
        ) {

          const {
            error:
              capaError,
          } =
            await supabase
              .from(
                "acompanhante_profiles"
              )
              .update({
                foto_capa:
                  url,
              })
              .eq(
                "id",
                userId
              );


          if (
            !capaError
          ) {

            setFotoCapa(
              url
            );

          }

        }

      }


      await carregarFotos(
        userId
      );


      setMessage(
        "Fotos adicionadas com sucesso."
      );

    } finally {

      setEnviandoFoto(
        false
      );


      event.target.value =
        "";

    }

  }


  /*
    DEFINIR FOTO DE CAPA
  */

  async function definirCapa(
    foto: Foto
  ) {

    const supabase =
      createClient();


    setErro("");
    setMessage("");


    const {
      error,
    } =
      await supabase
        .from(
          "acompanhante_profiles"
        )
        .update({

          foto_capa:
            foto.url,

        })
        .eq(
          "id",
          userId
        );


    if (error) {

      setErro(
        "Não foi possível alterar a foto de capa."
      );

      return;
    }


    setFotoCapa(
      foto.url
    );


    setMessage(
      "Foto de capa atualizada."
    );

  }


  /*
    EXCLUIR FOTO
  */

  async function excluirFoto(
    foto: Foto
  ) {

    const confirmou =
      window.confirm(
        "Deseja realmente excluir esta foto?"
      );


    if (!confirmou) {
      return;
    }


    const supabase =
      createClient();


    setErro("");
    setMessage("");


    if (
      foto.storage_path
    ) {

      const {
        error:
          storageError,
      } =
        await supabase.storage
          .from(
            "acompanhantes"
          )
          .remove([
            foto.storage_path,
          ]);


      if (
        storageError
      ) {

        console.error(
          storageError
        );

      }

    }


    const {
      error,
    } =
      await supabase
        .from(
          "profile_photos"
        )
        .delete()
        .eq(
          "id",
          foto.id
        );


    if (error) {

      setErro(
        "Não foi possível excluir a foto."
      );

      return;
    }


    const restantes =
      fotos.filter(
        (item) =>
          item.id !==
          foto.id
      );


    /*
      SE APAGOU A CAPA
    */

    if (
      fotoCapa ===
      foto.url
    ) {

      const novaCapa =
        restantes[0]?.url ||
        null;


      const {
        error:
          capaError,
      } =
        await supabase
          .from(
            "acompanhante_profiles"
          )
          .update({

            foto_capa:
              novaCapa,

          })
          .eq(
            "id",
            userId
          );


      if (
        !capaError
      ) {

        setFotoCapa(
          novaCapa
        );

      }

    }


    setFotos(
      restantes
    );


    setMessage(
      "Foto excluída."
    );

  }


  function nomePlano() {

    if (
      plano ===
      "comfort"
    ) {
      return "Comfort";
    }


    if (
      plano ===
      "black"
    ) {
      return "Black";
    }


    return "X";

  }


  function nomeStatus() {

    if (
      status ===
      "aprovado"
    ) {
      return "Perfil aprovado";
    }


    if (
      status ===
      "rejeitado"
    ) {
      return "Perfil não aprovado";
    }


    if (
      status ===
      "suspenso"
    ) {
      return "Perfil suspenso";
    }


    return "Em análise";

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
            Carregando seu perfil...
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

            <Link
              href="/acompanhante/painel"
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-medium
                text-white/35
                transition
                hover:text-white/70
              "
            >
              ← Voltar ao painel
            </Link>


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
                MEU PERFIL
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
                Seu perfil,{" "}

                <span
                  className="
                    text-[#e09566]
                  "
                >
                  do seu jeito.
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
                Mantenha suas informações e
                fotos sempre atualizadas.
              </p>

            </div>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-2
              md:justify-end
            "
          >

            <span
              className="
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                px-4
                py-2.5
                text-[9px]
                font-bold
                text-white/50
              "
            >
              {nomeStatus()}
            </span>


            <span
              className="
                rounded-full
                border
                border-[#d2a86b]/20
                bg-[#d2a86b]/[0.06]
                px-4
                py-2.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.12em]
                text-[#d2a86b]
              "
            >
              {nomePlano()}
            </span>

          </div>

        </header>


        {/* ERRO */}

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
              text-red-200/75
            "
          >
            {erro}
          </div>

        )}


        {/* SUCESSO */}

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
              text-emerald-200/75
            "
          >
            {message}
          </div>

        )}


        {/* =========================
            FOTOS
        ========================= */}

        <section
          className="
            mb-5
            rounded-[26px]
            border
            border-white/[0.07]
            bg-white/[0.02]
            p-5
            sm:p-7
          "
        >

          <div
            className="
              mb-6
              flex
              items-end
              justify-between
              gap-5
            "
          >

            <div>

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#c46f43]
                "
              >
                GALERIA
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
                Suas fotos
              </h2>

            </div>


            <span
              className="
                text-[10px]
                text-white/30
              "
            >
              {fotos.length}/8
            </span>

          </div>


          <div
            className="
              grid
              grid-cols-2
              gap-3
              md:grid-cols-3
              lg:grid-cols-4
            "
          >

            {fotos.map(
              (foto) => (

                <article
                  key={
                    foto.id
                  }
                  className={`
                    group
                    relative
                    aspect-[4/5]
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-[#17120f]

                    ${
                      fotoCapa ===
                      foto.url
                        ? "border-[#e09566]/60"
                        : "border-white/[0.08]"
                    }
                  `}
                >

                  <img
                    src={
                      foto.url
                    }
                    alt="Foto do perfil"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />


                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-transparent
                      to-transparent
                    "
                  />


                  {fotoCapa ===
                    foto.url && (

                    <span
                      className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        bg-[#e09566]
                        px-2.5
                        py-1.5
                        text-[7px]
                        font-black
                        tracking-[0.12em]
                        text-[#160b07]
                      "
                    >
                      CAPA
                    </span>

                  )}


                  <div
                    className="
                      absolute
                      bottom-3
                      left-3
                      right-3
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                    "
                  >

                    {fotoCapa !==
                      foto.url && (

                      <button
                        type="button"
                        onClick={() =>
                          definirCapa(
                            foto
                          )
                        }
                        className="
                          min-h-9
                          flex-1
                          rounded-full
                          border
                          border-white/15
                          bg-black/60
                          px-3
                          text-[8px]
                          font-bold
                          text-white/75
                          backdrop-blur-md
                          transition
                          hover:bg-black/80
                        "
                      >
                        Usar como capa
                      </button>

                    )}


                    <button
                      type="button"
                      onClick={() =>
                        excluirFoto(
                          foto
                        )
                      }
                      className="
                        min-h-9
                        rounded-full
                        border
                        border-red-300/15
                        bg-black/60
                        px-3
                        text-[8px]
                        font-bold
                        text-red-200/70
                        backdrop-blur-md
                        transition
                        hover:bg-red-400/10
                      "
                    >
                      Excluir
                    </button>

                  </div>

                </article>

              )
            )}


            {/* ADICIONAR */}

            {fotos.length < 8 && (

              <label
                className="
                  flex
                  aspect-[4/5]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-dashed
                  border-[#e09566]/25
                  bg-[#c46f43]/[0.035]
                  px-4
                  text-center
                  transition
                  hover:border-[#e09566]/45
                  hover:bg-[#c46f43]/[0.06]
                "
              >

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={
                    enviarFotos
                  }
                  disabled={
                    enviandoFoto
                  }
                  className="
                    hidden
                  "
                />


                {enviandoFoto ? (

                  <div
                    className="
                      h-7
                      w-7
                      animate-spin
                      rounded-full
                      border-2
                      border-white/10
                      border-t-[#e09566]
                    "
                  />

                ) : (

                  <span
                    className="
                      text-4xl
                      font-light
                      text-[#e09566]
                    "
                  >
                    +
                  </span>

                )}


                <strong
                  className="
                    text-[10px]
                    text-white/65
                  "
                >
                  {enviandoFoto
                    ? "Enviando..."
                    : "Adicionar fotos"}
                </strong>


                <small
                  className="
                    text-[8px]
                    leading-4
                    text-white/25
                  "
                >
                  JPG, PNG ou WEBP
                  <br />
                  até 8 MB
                </small>

              </label>

            )}

          </div>

        </section>


        {/* =========================
            FORMULÁRIO
        ========================= */}

        <section
          className="
            rounded-[26px]
            border
            border-white/[0.07]
            bg-white/[0.02]
            p-5
            sm:p-7
          "
        >

          <div
            className="
              mb-7
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
              PERFIL PÚBLICO
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
              Suas informações
            </h2>

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >


            {/* NOME */}

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
                Nome de exibição
              </span>


              <input
                type="text"
                value={
                  nomeArtistico
                }
                onChange={
                  (event) =>
                    setNomeArtistico(
                      event.target.value
                    )
                }
                placeholder="Ex.: Júlia"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* IDADE */}

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
                Idade
              </span>


              <input
                type="number"
                min="18"
                max="99"
                value={
                  idade
                }
                onChange={
                  (event) =>
                    setIdade(
                      event.target.value
                    )
                }
                placeholder="25"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* TELEFONE */}

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
                Telefone
              </span>


              <input
                type="tel"
                value={
                  telefone
                }
                onChange={
                  (event) =>
                    setTelefone(
                      event.target.value
                    )
                }
                placeholder="(81) 99999-9999"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* BAIRRO */}

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
                Bairro
              </span>


              <input
                type="text"
                value={
                  bairro
                }
                onChange={
                  (event) =>
                    setBairro(
                      event.target.value
                    )
                }
                placeholder="Piedade"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* CIDADE */}

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
                Cidade
              </span>


              <input
                type="text"
                value={
                  cidade
                }
                onChange={
                  (event) =>
                    setCidade(
                      event.target.value
                    )
                }
                placeholder="Jaboatão dos Guararapes"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* ESTADO */}

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
                className="
                  min-h-12
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#120e0c]
                  px-4
                  text-sm
                  text-white/85
                  outline-none
                  transition
                  focus:border-[#e09566]/45
                "
              >

                <option value="">
                  Selecione
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


            {/* FRASE */}

            <label
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
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
                  Frase do card
                </span>


                <small
                  className="
                    text-[8px]
                    text-white/25
                  "
                >
                  {descricaoCurta.length}/120
                </small>

              </div>


              <input
                type="text"
                maxLength={120}
                value={
                  descricaoCurta
                }
                onChange={
                  (event) =>
                    setDescricaoCurta(
                      event.target.value
                    )
                }
                placeholder="Uma frase curta para aparecer no seu card"
                className="
                  min-h-12
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
                "
              />

            </label>


            {/* SOBRE */}

            <label
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
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
                  Sobre mim
                </span>


                <small
                  className="
                    text-[8px]
                    text-white/25
                  "
                >
                  {sobre.length}/1200
                </small>

              </div>


              <textarea
                rows={6}
                maxLength={1200}
                value={
                  sobre
                }
                onChange={
                  (event) =>
                    setSobre(
                      event.target.value
                    )
                }
                placeholder="Conte um pouco sobre você..."
                className="
                  resize-y
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#120e0c]
                  p-4
                  text-sm
                  leading-6
                  text-white/85
                  outline-none
                  transition
                  placeholder:text-white/20
                  focus:border-[#e09566]/45
                "
              />

            </label>


            {/* DISPONIBILIDADE */}

            <label
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
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
                Disponibilidade
              </span>


              <textarea
                rows={3}
                maxLength={300}
                value={
                  disponibilidade
                }
                onChange={
                  (event) =>
                    setDisponibilidade(
                      event.target.value
                    )
                }
                placeholder="Ex.: Disponível à noite e aos finais de semana."
                className="
                  resize-y
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#120e0c]
                  p-4
                  text-sm
                  leading-6
                  text-white/85
                  outline-none
                  transition
                  placeholder:text-white/20
                  focus:border-[#e09566]/45
                "
              />

            </label>

          </div>


          {/* RODAPÉ */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-6
              border-t
              border-white/[0.06]
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <span
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-white/25
                "
              >
                CATEGORIA
              </span>


              <strong
                className="
                  mt-1
                  block
                  text-lg
                  text-[#d2a86b]
                "
              >
                {nomePlano()}
              </strong>


              <p
                className="
                  mt-1
                  text-[9px]
                  text-white/25
                "
              >
                A categoria é definida
                pela administração.
              </p>

            </div>


            <button
              type="button"
              onClick={
                salvarPerfil
              }
              disabled={
                salvando
              }
              className="
                min-h-12
                rounded-full
                bg-gradient-to-r
                from-[#e09566]
                to-[#c46f43]
                px-7
                text-[10px]
                font-black
                text-[#160b07]
                transition
                hover:-translate-y-0.5
                disabled:cursor-wait
                disabled:opacity-50
              "
            >
              {salvando
                ? "Salvando..."
                : "Salvar alterações"}
            </button>

          </div>

        </section>


        {/* PERFIL PÚBLICO */}

        {status ===
          "aprovado" && (

          <div
            className="
              mt-7
              flex
              justify-center
            "
          >

            <Link
              href={
                `/perfil/${userId}`
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#e09566]/20
                bg-[#c46f43]/[0.05]
                px-5
                py-3
                text-[10px]
                font-bold
                text-[#e09566]
                transition
                hover:bg-[#c46f43]/10
              "
            >
              Ver meu perfil público
              <span>
                ↗
              </span>
            </Link>

          </div>

        )}


      </div>

    </main>
  );
}