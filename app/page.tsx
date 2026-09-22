import Link from "next/link";
import FeaturedStories from "@/components/FeaturedStories";
import ExperienceCards from "@/components/ExperienceCards";

export default function Home() {
  return (
    <>
      <FeaturedStories />

      {/* ========================================
          HERO
      ======================================== */}
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
                Descobrir quem está por perto
                <b>↗</b>
              </Link>
            </div>
          </div>

          {/* IMAGEM */}
          <div className="premiumHeroVisual">
            <div className="heroImageFrame">
              <img
                src="/image/hero.jfif"
                alt="Experiência premium"
                className="heroEditorialImage"
              />

              <div className="heroImageOverlay" />

              {/* SELO */}
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

      {/* ========================================
          CATEGORIAS
      ======================================== */}
      <section className="categoriesSection">
        <div className="container">
          <div className="sectionIntro">
            <span className="eyebrow">
              ESCOLHA SUA EXPERIÊNCIA
            </span>

            <h2>
              Três níveis.
              <br />

              <em>
                Uma experiência para cada desejo.
              </em>
            </h2>

            <p className="sectionIntroText">
              Do mais descomplicado ao mais exclusivo,
              encontre o estilo que combina com o momento
              que você quer viver.
            </p>
          </div>

          {/* CARDS + MODAL DE LOCALIZAÇÃO */}
          <ExperienceCards />
        </div>
      </section>
    </>
  );
}