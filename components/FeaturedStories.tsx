"use client";

import { useState } from "react";


const stories = [
  {
    name: "Marina",
    city: "Recife",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1300&q=90",
    ],
  },

  {
    name: "Camila",
    city: "Aracaju",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1300&q=90",
    ],
  },

  {
    name: "Lívia",
    city: "Recife",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1300&q=90",
    ],
  },

  {
    name: "Isabela",
    city: "Boa Viagem",
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1300&q=90",
    ],
  },

  {
    name: "Bianca",
    city: "Olinda",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1300&q=90",
    ],
  },

  {
    name: "Sophia",
    city: "Piedade",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=90",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1300&q=90",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1300&q=90",
    ],
  },
];


export default function FeaturedStories() {

  const [active, setActive] =
    useState<number | null>(null);

  const [photo, setPhoto] =
    useState(0);


  const close = () => {

    setActive(null);

    setPhoto(0);

  };


  const next = () => {

    if (
      active === null
    ) {
      return;
    }


    const current =
      stories[active];


    if (
      photo <
      current.photos.length - 1
    ) {

      setPhoto(
        photo + 1
      );

    } else if (
      active <
      stories.length - 1
    ) {

      setActive(
        active + 1
      );

      setPhoto(0);

    } else {

      close();

    }

  };


  const prev = () => {

    if (
      active === null
    ) {
      return;
    }


    if (
      photo > 0
    ) {

      setPhoto(
        photo - 1
      );

    } else if (
      active > 0
    ) {

      setActive(
        active - 1
      );

      setPhoto(
        stories[
          active - 1
        ].photos.length - 1
      );

    }

  };


  return (
    <>

      {/* ========================================
          DESTAQUES
      ======================================== */}

      <section
        className="
          border-b
          border-white/[0.05]
          bg-[#0b0908]
          px-4
          py-6
          sm:px-6
          lg:px-10
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
          "
        >

          {/* TÍTULO */}

          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >

            <div>

              <span
                className="
                  block
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.24em]
                  text-[#c46f43]
                "
              >
                DESTAQUES
              </span>


              <strong
                className="
                  mt-1
                  block
                  text-[13px]
                  font-semibold
                  text-[#f8f1e8]
                "
              >
                Perfis em evidência
              </strong>

            </div>


            <span
              className="
                hidden
                text-[8px]
                uppercase
                tracking-[0.14em]
                text-white/25
                sm:block
              "
            >
              toque para abrir
            </span>

          </div>


          {/* STORIES */}

          <div
            className="
              flex
              items-start
              gap-5
              overflow-x-auto
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {stories.map(
              (story, index) => (

                <button
                  key={
                    story.name
                  }
                  type="button"
                  onClick={() => {

                    setActive(
                      index
                    );

                    setPhoto(0);

                  }}
                  className="
                    group
                    flex
                    w-[76px]
                    shrink-0
                    flex-col
                    items-center
                    bg-transparent
                    p-0
                    text-center
                    outline-none
                  "
                >

                  {/* CÍRCULO EXTERNO */}

                  <span
                    className="
                      block
                      h-[76px]
                      w-[76px]
                      shrink-0
                      rounded-full
                      bg-gradient-to-br
                      from-[#f0aa78]
                      via-[#c46f43]
                      to-[#8d432e]
                      p-[2px]
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  >

                    {/* CÍRCULO PRETO ENTRE BORDA E FOTO */}

                    <span
                      className="
                        block
                        h-full
                        w-full
                        rounded-full
                        bg-[#0b0908]
                        p-[3px]
                      "
                    >

                      {/* FOTO */}

                      <span
                        className="
                          block
                          h-full
                          w-full
                          overflow-hidden
                          rounded-full
                        "
                      >

                        <img
                          src={
                            story.image
                          }
                          alt={
                            story.name
                          }
                          className="
                            block
                            h-full
                            w-full
                            rounded-full
                            object-cover
                          "
                        />

                      </span>

                    </span>

                  </span>


                  {/* NOME */}

                  <strong
                    className="
                      mt-2
                      block
                      w-full
                      truncate
                      text-[10px]
                      font-semibold
                      text-white/80
                    "
                  >
                    {story.name}
                  </strong>


                  {/* CIDADE */}

                  <small
                    className="
                      mt-[2px]
                      block
                      w-full
                      truncate
                      text-[8px]
                      text-white/30
                    "
                  >
                    {story.city}
                  </small>

                </button>

              )
            )}

          </div>

        </div>

      </section>


      {/* ========================================
          STORY ABERTO
      ======================================== */}

      {active !== null && (

        <div
          className="
            fixed
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-black/90
            p-3
            backdrop-blur-lg
          "
          onClick={
            close
          }
        >

          <div
            className="
              relative
              h-[min(88vh,780px)]
              w-full
              max-w-[430px]
              overflow-hidden
              rounded-[26px]
              border
              border-white/10
              bg-[#100d0b]
              shadow-[0_40px_120px_rgba(0,0,0,0.8)]
            "
            onClick={
              (event) =>
                event.stopPropagation()
            }
          >


            {/* FOTO PRINCIPAL */}

            <img
              src={
                stories[
                  active
                ].photos[
                  photo
                ]
              }
              alt={
                stories[
                  active
                ].name
              }
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />


            {/* ESCURECIMENTO */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-b
                from-black/60
                via-transparent
                to-black/75
              "
            />


            {/* BARRAS */}

            <div
              className="
                absolute
                left-4
                right-4
                top-4
                z-30
                flex
                gap-1
              "
            >

              {stories[
                active
              ].photos.map(
                (_, index) => (

                  <span
                    key={
                      index
                    }
                    className={`
                      h-[2px]
                      flex-1
                      rounded-full

                      ${
                        index <=
                        photo
                          ? "bg-white"
                          : "bg-white/25"
                      }
                    `}
                  />

                )
              )}

            </div>


            {/* CABEÇALHO STORY */}

            <div
              className="
                absolute
                left-4
                right-4
                top-8
                z-30
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >

                {/* MINI FOTO REDONDA */}

                <img
                  src={
                    stories[
                      active
                    ].image
                  }
                  alt=""
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    border
                    border-white/30
                    object-cover
                  "
                />


                <span
                  className="
                    min-w-0
                  "
                >

                  <strong
                    className="
                      block
                      truncate
                      text-[11px]
                      font-semibold
                      text-white
                    "
                  >
                    {
                      stories[
                        active
                      ].name
                    }
                  </strong>


                  <small
                    className="
                      block
                      truncate
                      text-[8px]
                      text-white/50
                    "
                  >
                    {
                      stories[
                        active
                      ].city
                    }
                    {" · destaque"}
                  </small>

                </span>

              </div>


              {/* FECHAR */}

              <button
                type="button"
                onClick={
                  close
                }
                aria-label="Fechar"
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-black/30
                  text-2xl
                  font-light
                  text-white
                  backdrop-blur
                "
              >
                ×
              </button>

            </div>


            {/* ANTERIOR */}

            <button
              type="button"
              onClick={
                prev
              }
              aria-label="Anterior"
              className="
                absolute
                left-3
                top-1/2
                z-30
                grid
                h-10
                w-10
                -translate-y-1/2
                place-items-center
                rounded-full
                bg-black/35
                text-3xl
                font-light
                text-white/80
                backdrop-blur-md
                transition
                hover:bg-black/60
              "
            >
              ‹
            </button>


            {/* PRÓXIMO */}

            <button
              type="button"
              onClick={
                next
              }
              aria-label="Próximo"
              className="
                absolute
                right-3
                top-1/2
                z-30
                grid
                h-10
                w-10
                -translate-y-1/2
                place-items-center
                rounded-full
                bg-black/35
                text-3xl
                font-light
                text-white/80
                backdrop-blur-md
                transition
                hover:bg-black/60
              "
            >
              ›
            </button>


            {/* BOTÃO INFERIOR */}

            <div
              className="
                absolute
                bottom-5
                left-5
                right-5
                z-30
              "
            >

              <button
                type="button"
                className="
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/30
                  text-[10px]
                  font-bold
                  text-white
                  backdrop-blur-xl
                  transition
                  hover:bg-white
                  hover:text-[#160b07]
                "
              >
                Ver perfil
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}