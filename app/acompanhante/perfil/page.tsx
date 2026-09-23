"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

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
  "AC", "AL", "AP", "AM",
  "BA", "CE", "DF", "ES",
  "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR",
  "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];


export default function PerfilAcompanhantePage() {

  const router =
    useRouter();

  const [userId, setUserId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [enviandoFoto, setEnviandoFoto] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [erro, setErro] =
    useState("");


  const [
    nomeArtistico,
    setNomeArtistico,
  ] = useState("");

  const [
    telefone,
    setTelefone,
  ] = useState("");

  const [
    idade,
    setIdade,
  ] = useState("");

  const [
    bairro,
    setBairro,
  ] = useState("");

  const [
    cidade,
    setCidade,
  ] = useState("");

  const [
    estado,
    setEstado,
  ] = useState("");

  const [
    descricaoCurta,
    setDescricaoCurta,
  ] = useState("");

  const [
    sobre,
    setSobre,
  ] = useState("");

  const [
    disponibilidade,
    setDisponibilidade,
  ] = useState("");

  const [
    plano,
    setPlano,
  ] = useState("x");

  const [
    status,
    setStatus,
  ] = useState("pendente");

  const [
    fotoCapa,
    setFotoCapa,
  ] = useState<string | null>(
    null
  );

  const [fotos, setFotos] =
    useState<Foto[]>([]);


  useEffect(() => {

    async function carregar() {

      const supabase =
        createClient();


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
          perfil.nome_artistico || ""
        );

        setTelefone(
          perfil.telefone || ""
        );

        setIdade(
          perfil.idade
            ? String(
                perfil.idade
              )
            : ""
        );

        setBairro(
          perfil.bairro || ""
        );

        setCidade(
          perfil.cidade || ""
        );

        setEstado(
          perfil.estado || ""
        );

        setDescricaoCurta(
          perfil.descricao_curta ||
            ""
        );

        setSobre(
          perfil.sobre || ""
        );

        setDisponibilidade(
          perfil.disponibilidade ||
            ""
        );

        setPlano(
          perfil.plano || "x"
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

      setErro(
        error.message
      );

      setSalvando(false);

      return;
    }


    setMessage(
      "Perfil atualizado com sucesso."
    );

    setSalvando(false);
  }


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

      event.target.value = "";

      return;
    }


    setErro("");
    setMessage("");
    setEnviandoFoto(true);


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

          setErro(
            uploadError.message
          );

          continue;
        }


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
          publicUrlData
            .publicUrl;


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
         * PRIMEIRA FOTO
         * VIRA CAPA
         */

        if (
          !fotoCapa &&
          fotos.length === 0 &&
          i === 0
        ) {

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


          setFotoCapa(
            url
          );

        }

      }


      await carregarFotos(
        userId
      );


      setMessage(
        "Fotos adicionadas com sucesso."
      );

    } finally {

      setEnviandoFoto(false);

      event.target.value =
        "";

    }

  }


  async function definirCapa(
    foto: Foto
  ) {

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


    if (
      foto.storage_path
    ) {

      await supabase.storage
        .from(
          "acompanhantes"
        )
        .remove([
          foto.storage_path,
        ]);

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
          item.id !== foto.id
      );


    if (
      fotoCapa ===
      foto.url
    ) {

      const novaCapa =
        restantes[0]?.url ||
        null;


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


      setFotoCapa(
        novaCapa
      );

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


  function nomeStatus() {

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

    return "Em análise";
  }


  if (loading) {

    return (
      <main className="companionEditorPage">

        <div className="dashboardLoading">

          <span className="loginLoader" />

          <p>
            Carregando seu perfil...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="companionEditorPage">

      <div className="companionEditorContainer">


        <div className="companionEditorTop">

          <div>

            <Link
              href="/acompanhante/painel"
              className="companionEditorBack"
            >
              ← Voltar ao painel
            </Link>


            <span className="eyebrow">
              MEU PERFIL
            </span>


            <h1>
              Seu perfil,
              <em> do seu jeito.</em>
            </h1>


            <p>
              Mantenha suas informações e
              fotos sempre atualizadas.
            </p>

          </div>


          <div className="companionEditorStatus">

            <span>
              {nomeStatus()}
            </span>

            <strong>
              {nomePlano()}
            </strong>

          </div>

        </div>


        {erro && (

          <div className="companionEditorAlert error">
            {erro}
          </div>

        )}


        {message && (

          <div className="companionEditorAlert success">
            {message}
          </div>

        )}


        {/* FOTOS */}

        <section className="companionEditorSection">

          <div className="companionEditorSectionTitle">

            <div>

              <span className="eyebrow">
                GALERIA
              </span>

              <h2>
                Suas fotos
              </h2>

            </div>


            <span className="companionEditorCounter">
              {fotos.length}/8
            </span>

          </div>


          <div className="companionPhotoGrid">

            {fotos.map(
              (foto) => (

                <article
                  key={foto.id}
                  className={`
                    companionPhotoCard
                    ${
                      fotoCapa ===
                      foto.url
                        ? "cover"
                        : ""
                    }
                  `}
                >

                  <img
                    src={foto.url}
                    alt="Foto do perfil"
                  />


                  {fotoCapa ===
                    foto.url && (

                    <span className="companionCoverBadge">
                      CAPA
                    </span>

                  )}


                  <div className="companionPhotoActions">

                    {fotoCapa !==
                      foto.url && (

                      <button
                        type="button"
                        onClick={() =>
                          definirCapa(
                            foto
                          )
                        }
                      >
                        Usar como capa
                      </button>

                    )}


                    <button
                      type="button"
                      className="delete"
                      onClick={() =>
                        excluirFoto(
                          foto
                        )
                      }
                    >
                      Excluir
                    </button>

                  </div>

                </article>

              )
            )}


            {fotos.length < 8 && (

              <label className="companionPhotoUpload">

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    enviarFotos
                  }
                  disabled={
                    enviandoFoto
                  }
                />


                <span>
                  +
                </span>

                <strong>
                  {enviandoFoto
                    ? "Enviando..."
                    : "Adicionar fotos"}
                </strong>

                <small>
                  JPG, PNG ou WEBP
                </small>

              </label>

            )}

          </div>

        </section>


        {/* INFORMAÇÕES */}

        <section className="companionEditorSection">

          <div className="companionEditorSectionTitle">

            <div>

              <span className="eyebrow">
                PERFIL PÚBLICO
              </span>

              <h2>
                Informações
              </h2>

            </div>

          </div>


          <div className="companionEditorForm">


            <label className="companionField">

              <span>
                Nome de exibição
              </span>

              <input
                type="text"
                value={
                  nomeArtistico
                }
                onChange={(event) =>
                  setNomeArtistico(
                    event.target.value
                  )
                }
                placeholder="Ex.: Júlia"
              />

            </label>


            <label className="companionField">

              <span>
                Idade
              </span>

              <input
                type="number"
                min="18"
                max="99"
                value={
                  idade
                }
                onChange={(event) =>
                  setIdade(
                    event.target.value
                  )
                }
                placeholder="25"
              />

            </label>


            <label className="companionField">

              <span>
                Telefone
              </span>

              <input
                type="tel"
                value={
                  telefone
                }
                onChange={(event) =>
                  setTelefone(
                    event.target.value
                  )
                }
                placeholder="(81) 99999-9999"
              />

            </label>


            <label className="companionField">

              <span>
                Bairro
              </span>

              <input
                type="text"
                value={
                  bairro
                }
                onChange={(event) =>
                  setBairro(
                    event.target.value
                  )
                }
                placeholder="Piedade"
              />

            </label>


            <label className="companionField">

              <span>
                Cidade
              </span>

              <input
                type="text"
                value={
                  cidade
                }
                onChange={(event) =>
                  setCidade(
                    event.target.value
                  )
                }
                placeholder="Jaboatão dos Guararapes"
              />

            </label>


            <label className="companionField">

              <span>
                Estado
              </span>

              <select
                value={
                  estado
                }
                onChange={(event) =>
                  setEstado(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione
                </option>

                {estados.map(
                  (uf) => (

                    <option
                      key={uf}
                      value={uf}
                    >
                      {uf}
                    </option>

                  )
                )}

              </select>

            </label>


            <label className="companionField companionFieldFull">

              <span>
                Frase do card
              </span>

              <input
                type="text"
                maxLength={120}
                value={
                  descricaoCurta
                }
                onChange={(event) =>
                  setDescricaoCurta(
                    event.target.value
                  )
                }
                placeholder="Uma frase curta para aparecer no seu card"
              />

              <small>
                {descricaoCurta.length}/120
              </small>

            </label>


            <label className="companionField companionFieldFull">

              <span>
                Sobre mim
              </span>

              <textarea
                rows={6}
                maxLength={1200}
                value={
                  sobre
                }
                onChange={(event) =>
                  setSobre(
                    event.target.value
                  )
                }
                placeholder="Conte um pouco sobre você..."
              />

              <small>
                {sobre.length}/1200
              </small>

            </label>


            <label className="companionField companionFieldFull">

              <span>
                Disponibilidade
              </span>

              <textarea
                rows={3}
                maxLength={300}
                value={
                  disponibilidade
                }
                onChange={(event) =>
                  setDisponibilidade(
                    event.target.value
                  )
                }
                placeholder="Ex.: Consulte minha disponibilidade pelo perfil."
              />

            </label>

          </div>


          <div className="companionEditorFooter">

            <div>

              <small>
                CATEGORIA
              </small>

              <strong>
                {nomePlano()}
              </strong>

              <p>
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
            >

              {salvando
                ? "Salvando..."
                : "Salvar alterações"}

            </button>

          </div>

        </section>


        {status ===
          "aprovado" && (

          <div className="companionPreview">

            <Link
              href={`/perfil/${userId}`}
            >
              Ver meu perfil público ↗
            </Link>

          </div>

        )}

      </div>

    </main>
  );
}