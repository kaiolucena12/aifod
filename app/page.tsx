import Link from "next/link";
import FeaturedStories from "@/components/FeaturedStories";

export default function Home() {
  return (
    <>
      <FeaturedStories />

      {/* HERO */}
      <section className="hero premiumHero">
        <div className="heroGlow heroGlowLeft" />
        <div className="heroGlow heroGlowRight" />

        <div className="container premiumHeroGrid">
          {/* TEXTO */}
          <div className="premiumHeroContent">
            <span className="eyebrow">
              DESEJO • TENTAÇÃO • EXCLUSIVIDADE
            </span>

            <h1>
              Tem vontades que{" "}
              <em>não foram feitas para esperar.</em>
            </h1>

            <p>
              Perfis que despertam curiosidade, encontros que começam na química
              e experiências que podem transformar sua noite em algo inesquecível.
            </p>

            <div className="heroActions">
              <Link
                href="/profissionais"
                className="heroButton"
              >
                Descobrir quem está por perto <b>↗</b>
              </Link>
            </div>
          </div>

          {/* IMAGEM HERO */}
          <div className="premiumHeroVisual">
            <div className="heroImageFrame">
              <img
                src="/image/hero.jfif"
                alt="Experiência premium"
                className="heroEditorialImage"
              />

              <div className="heroImageOverlay" />

              {/* SELO PREMIUM */}
              <div className="heroImageBadge heroImageBadgeTop">
                <span>✦</span>

                <div>
                  <small>SELEÇÃO</small>
                  <strong>Premium</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="categoriesSection">
        <div className="container">
          <div className="sectionIntro">
            <span className="eyebrow">
              ESCOLHA SUA EXPERIÊNCIA
            </span>

            <h2>
              Três níveis.
              <br />
              <em>Uma experiência para cada desejo.</em>
            </h2>

            <p className="sectionIntroText">
              Do mais descomplicado ao mais exclusivo, encontre o estilo que
              combina com o momento que você quer viver.
            </p>
          </div>

          <div className="categoryGrid">
            {/* X */}
            <Link
              href="/profissionais?plano=x"
              className="categoryCard xCard"
            >
              <div className="cardTop">
                <span>01</span>
                <small>DESCOMPLICADO</small>
              </div>

              <div className="categoryMain">
                <span className="categoryMiniTitle">
                  COMEÇAR
                </span>

                <h3>X</h3>

                <p>
                  Perfis para quem busca algo mais leve, acessível e direto.
                  Uma forma simples de descobrir novas conexões e viver novas
                  experiências.
                </p>
              </div>

              <div className="cardBottom">
                <span>Conhecer X</span>
                <b>→</b>
              </div>
            </Link>

            {/* COMFORT */}
            <Link
              href="/profissionais?plano=comfort"
              className="categoryCard comfortCard"
            >
              <div className="cardTop">
                <span>02</span>
                <small>DESEJADO</small>
              </div>

              <div className="categoryMain">
                <span className="categoryMiniTitle">
                  MAIS PRESENÇA
                </span>

                <h3>Comfort</h3>

                <p>
                  Uma seleção mais refinada, com perfis de maior destaque,
                  presença marcante e uma experiência pensada para quem quer
                  algo além do comum.
                </p>
              </div>

              <div className="cardBottom">
                <span>Descobrir Comfort</span>
                <b>→</b>
              </div>
            </Link>

            {/* BLACK */}
            <Link
              href="/profissionais?plano=black"
              className="categoryCard blackCard"
            >
              <div className="shine" />

              <div className="cardTop">
                <span>03</span>
                <small>EXCLUSIVO</small>
              </div>

              <div className="categoryMain">
                <span className="categoryMiniTitle blackMiniTitle">
                  EXPERIÊNCIA PREMIUM
                </span>

                <h3>Black</h3>

                <p>
                  O nível mais exclusivo do AiFod. Perfis premium, seleção
                  criteriosa e uma experiência criada para quem não procura
                  apenas mais, mas algo realmente extraordinário.
                </p>
              </div>

              <div className="cardBottom">
                <span>Acessar Black</span>
                <b>→</b>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FECHAMENTO */}
      <section className="homeFinalCta">
        <div className="container homeFinalCtaInner">
          <span className="eyebrow">
            SUA PRÓXIMA EXPERIÊNCIA
          </span>

          <h2>
            Talvez o que você procura
            <em> esteja a um clique de distância.</em>
          </h2>

          <Link
            href="/profissionais"
            className="heroButton"
          >
            Explorar perfis <b>↗</b>
          </Link>
        </div>
      </section>
    </>
  );
}