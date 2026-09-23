import FeaturedStories from "@/components/FeaturedStories";
import ExperienceCards from "@/components/ExperienceCards";


export default function Home() {
  return (
    <>

      <FeaturedStories />


      {/* ========================================
          HERO
      ======================================== */}

      <section
        className="
          relative
          block
          overflow-hidden
          border-b
          border-white/10
          bg-[radial-gradient(circle_at_78%_28%,rgba(151,66,38,0.12),transparent_28%),linear-gradient(180deg,#0d0a09_0%,#0b0908_100%)]
          font-[Arial,Helvetica,sans-serif]
        "
      >

        {/* GRID SUTIL DE FUNDO */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.15]
            [background-image:linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(180deg,transparent,black_24%,black_76%,transparent)]
          "
        />


        {/* GLOW ESQUERDO */}

        <div
          className="
            pointer-events-none
            absolute
            left-[-170px]
            top-[34%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[rgba(117,34,22,0.16)]
            blur-[70px]
          "
        />


        {/* GLOW DIREITO */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-110px]
            top-[18%]
            h-[270px]
            w-[270px]
            rounded-full
            bg-[rgba(205,120,72,0.10)]
            blur-[70px]
          "
        />


        {/* CONTAINER */}

        <div
          className="
            relative
            z-[2]
            mx-auto
            grid
            w-[calc(100%-24px)]
            min-w-0
            grid-cols-1
            items-center
            gap-[28px]
            pb-[44px]
            pt-[38px]

            min-[621px]:w-[min(1180px,calc(100%-40px))]
            min-[621px]:gap-[30px]
            min-[621px]:pb-[48px]
            min-[621px]:pt-[46px]

            min-[981px]:grid-cols-[minmax(0,1fr)_360px]
            min-[981px]:gap-[clamp(38px,5vw,64px)]
            min-[981px]:pb-[56px]
            min-[981px]:pt-[52px]
          "
        >


          {/* ========================================
              TEXTO
          ======================================== */}

          <div
            className="
              w-full
              min-w-0
              max-w-[720px]
              justify-self-center
              text-center

              min-[981px]:max-w-[660px]
              min-[981px]:justify-self-start
              min-[981px]:text-left
            "
          >

            <span
              className="
                mb-[14px]
                inline-block
                max-w-full
                text-[10px]
                font-black
                leading-[1.4]
                tracking-[0.17em]
                text-[#e09566]
              "
            >
              DESEJO • TENTAÇÃO • EXCLUSIVIDADE
            </span>


            <h1
              className="
                mx-auto
                m-0
                w-full
                max-w-[640px]
                [font-size:clamp(40px,12vw,50px)]
                font-bold
                leading-[0.96]
                tracking-[-0.055em]
                text-[#fffaf5]

                min-[621px]:[font-size:clamp(48px,5vw,72px)]
                min-[621px]:leading-[0.95]
                min-[621px]:tracking-[-0.06em]

                min-[981px]:mx-0
              "
            >
              Tem vontades que{" "}

              <span
                className="
                  block
                  max-w-full
                  bg-[linear-gradient(90deg,#efb384,#d27e4f,#a95134)]
                  bg-clip-text
                  not-italic
                  text-transparent
                "
              >
                não foram feitas para esperar.
              </span>

            </h1>


            <p
              className="
                mx-auto
                mt-[19px]
                w-full
                max-w-[570px]
                text-[13px]
                leading-[1.65]
                text-[#9f958c]

                min-[621px]:mt-[22px]
                min-[621px]:text-[14px]
                min-[621px]:leading-[1.7]

                min-[981px]:mx-0
              "
            >
              Perfis que despertam curiosidade,
              encontros que começam na química e
              experiências que podem transformar
              sua noite em algo inesquecível.
            </p>


            {/*
              SEM BOTÃO AQUI.

              O uso começa apenas por:
              X / Comfort / Black
            */}

          </div>


          {/* ========================================
              FOTO
          ======================================== */}

          <div
            className="
              relative
              flex
              w-full
              min-w-0
              justify-center

              min-[981px]:justify-end
            "
          >

            <div
              className="
                relative
                h-[380px]
                w-[min(100%,390px)]
                overflow-hidden
                rounded-[72px_72px_18px_18px]
                border
                border-white/[0.08]
                bg-[#17110e]
                shadow-[0_28px_70px_rgba(0,0,0,0.38),0_0_60px_rgba(145,65,37,0.06)]

                max-[390px]:h-[340px]
                max-[390px]:rounded-[60px_60px_16px_16px]

                min-[621px]:h-[500px]
                min-[621px]:w-[min(100%,470px)]

                min-[981px]:h-[440px]
                min-[981px]:w-[360px]
                min-[981px]:rounded-[105px_105px_22px_22px]
              "
            >

              <img
                src="/image/hero.jfif"
                alt="Experiência premium"
                className="
                  h-full
                  w-full
                  object-cover
                  object-[center_32%]
                  saturate-[0.76]
                  contrast-[1.03]
                  brightness-[0.70]
                "
              />


              {/* OVERLAY */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[linear-gradient(180deg,rgba(10,8,7,0.03),rgba(10,8,7,0.07)_46%,rgba(10,8,7,0.62)),linear-gradient(90deg,rgba(10,8,7,0.14),transparent_48%)]
                "
              />


              {/* SELO */}

              <div
                className="
                  absolute
                  right-[14px]
                  top-[14px]
                  z-[3]
                  flex
                  items-center
                  gap-[9px]
                  rounded-[12px]
                  border
                  border-white/10
                  bg-[rgba(13,10,8,0.60)]
                  px-3
                  py-[10px]
                  backdrop-blur-[14px]

                  min-[621px]:right-4
                  min-[621px]:top-4
                "
              >

                <span
                  className="
                    text-[#d99365]
                  "
                >
                  ✦
                </span>


                <div>

                  <small
                    className="
                      mb-[2px]
                      block
                      text-[7px]
                      tracking-[0.11em]
                      text-[#8f847b]
                    "
                  >
                    SELEÇÃO
                  </small>


                  <strong
                    className="
                      block
                      text-[10px]
                      text-white
                    "
                  >
                    Premium
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CATEGORIAS
      ======================================== */}

      <section
        className="
          bg-[linear-gradient(180deg,#0b0908,#100c0a)]
          py-[58px]
          pb-[68px]
          font-[Arial,Helvetica,sans-serif]

          min-[621px]:pb-[92px]
          min-[621px]:pt-[78px]
        "
      >

        <div
          className="
            mx-auto
            w-[calc(100%-24px)]

            min-[621px]:w-[min(1180px,calc(100%-40px))]
          "
        >


          {/* INTRO */}

          <div
            className="
              mx-auto
              mb-[26px]
              max-w-[760px]
              text-center

              min-[621px]:mb-[38px]
            "
          >

            <span
              className="
                mb-[10px]
                inline-block
                text-[10px]
                font-black
                leading-[1.4]
                tracking-[0.17em]
                text-[#e09566]
              "
            >
              ESCOLHA SUA EXPERIÊNCIA
            </span>


            <h2
              className="
                m-0
                text-[36px]
                font-bold
                leading-[0.98]
                tracking-[-0.052em]
                text-[#fff7f1]

                max-[390px]:text-[32px]

                min-[621px]:[font-size:clamp(40px,5vw,60px)]
              "
            >
              Três níveis.
              <br />

              <span
                className="
                  not-italic
                  text-[#c8794f]
                "
              >
                Uma experiência para cada desejo.
              </span>

            </h2>


            <p
              className="
                mx-auto
                mt-[17px]
                max-w-[550px]
                text-[12px]
                leading-[1.65]
                text-[#887e75]

                min-[621px]:text-[14px]
              "
            >
              Do mais descomplicado ao mais exclusivo,
              encontre o estilo que combina com o momento
              que você quer viver.
            </p>

          </div>


          {/* X / COMFORT / BLACK */}

          <ExperienceCards />

        </div>

      </section>

    </>
  );
}