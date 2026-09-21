import Link from "next/link";
import FeaturedStories from "@/components/FeaturedStories";

export default function Home() {
  return (
    <>
      <FeaturedStories />

      <section className="hero">
        <div className="heroGlow heroGlowLeft" /><div className="heroGlow heroGlowRight" />
        <div className="container heroInner">
          <span className="eyebrow">EXPERIÊNCIAS • PRESENÇA • CONEXÃO</span>
          <h1>Viva momentos que <em>merecem ser lembrados.</em></h1>
          <p>Descubra perfis selecionados para eventos, experiências e companhia social com estilo, liberdade e discrição.</p>
          <Link href="/profissionais" className="heroButton">Explorar perfis <b>↗</b></Link>
        </div>
      </section>

      <section className="categoriesSection">
        <div className="container">
          <div className="sectionIntro"><span className="eyebrow">ESCOLHA SUA EXPERIÊNCIA</span><h2>Três universos. Um só lugar.</h2></div>
          <div className="categoryGrid">
            <Link href="/profissionais?plano=x" className="categoryCard xCard">
              <div className="cardTop"><span>01</span><small>ESSENCIAL</small></div>
              <div><h3>X</h3><p>Direto ao ponto. Uma seleção para quem quer descobrir novas conexões e experiências.</p></div>
              <div className="cardBottom"><span>Explorar X</span><b>→</b></div>
            </Link>
            <Link href="/profissionais?plano=comfort" className="categoryCard comfortCard">
              <div className="cardTop"><span>02</span><small>EXPERIÊNCIA</small></div>
              <div><h3>Comfort</h3><p>Para quem valoriza presença, conversa, estilo e uma experiência mais cuidadosa.</p></div>
              <div className="cardBottom"><span>Explorar Comfort</span><b>→</b></div>
            </Link>
            <Link href="/profissionais?plano=black" className="categoryCard blackCard">
              <div className="shine" /><div className="cardTop"><span>03</span><small>EXCLUSIVO</small></div>
              <div><h3>Black</h3><p>A curadoria mais exclusiva do AiFod, com perfis em evidência e apresentação premium.</p></div>
              <div className="cardBottom"><span>Entrar no Black</span><b>→</b></div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
