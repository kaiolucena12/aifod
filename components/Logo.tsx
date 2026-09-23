import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="AiFod - início"
      className="
        inline-flex
        h-[72px]
        items-center
        gap-[7px]

        min-[621px]:h-[88px]
        min-[621px]:gap-[9px]

        min-[981px]:gap-[12px]
      "
    >
      {/* CÍRCULO DOURADO */}

      <span
        className="
          relative
          flex
          h-[54px]
          w-[54px]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          bg-[linear-gradient(135deg,#f6db91_0%,#d6aa4e_35%,#9f6a22_70%,#efca70_100%)]
          p-[3px]
          shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_0_25px_rgba(214,170,78,0.25)]

          max-[390px]:h-[48px]
          max-[390px]:w-[48px]

          min-[621px]:h-[62px]
          min-[621px]:w-[62px]
          min-[621px]:p-[4px]

          min-[981px]:h-[68px]
          min-[981px]:w-[68px]
        "
      >
        {/* FUNDO ESCURO INTERNO */}

        <span
          className="
            absolute
            h-[48px]
            w-[48px]
            rounded-full
            bg-[#0b0908]

            max-[390px]:h-[42px]
            max-[390px]:w-[42px]

            min-[621px]:h-[54px]
            min-[621px]:w-[54px]

            min-[981px]:h-[60px]
            min-[981px]:w-[60px]
          "
        />

        {/* SÍMBOLO */}

        <img
          src="/image/logo-symbol.png"
          alt=""
          className="
            relative
            z-[2]
            h-[44px]
            w-[38px]
            object-contain

            max-[390px]:h-[39px]
            max-[390px]:w-[34px]

            min-[621px]:h-[50px]
            min-[621px]:w-[43px]

            min-[981px]:h-[55px]
            min-[981px]:w-[48px]
          "
        />
      </span>

      {/* WORDMARK */}

      <span
        className="
          relative
          isolate
          flex
          items-center
        "
      >
        {/* BRILHO */}

        <span
          className="
            pointer-events-none
            absolute
            left-[-7px]
            top-1/2
            -z-[1]
            h-[44px]
            w-[50px]
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(circle,rgba(255,230,190,0.22)_0%,rgba(255,215,160,0.10)_42%,rgba(255,255,255,0.03)_65%,transparent_78%)]
            blur-[5px]

            min-[621px]:left-[-10px]
            min-[621px]:h-[54px]
            min-[621px]:w-[62px]
          "
        />

        <img
          src="/image/logo-wordmark.png"
          alt="AiFod"
          className="
            relative
            block
            h-auto
            w-[88px]
            object-contain
            [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.20))_drop-shadow(0_3px_8px_rgba(0,0,0,0.45))]

            max-[390px]:w-[76px]

            min-[621px]:w-[102px]

            min-[981px]:w-[112px]
          "
        />
      </span>
    </Link>
  );
}