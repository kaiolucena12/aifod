export default function TailwindTestPage() {
  return (
    <main className="min-h-screen bg-[#0b0908] px-6 py-20 text-[#f8f1e8]">
      <div className="mx-auto max-w-3xl">

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c46f43]">
          AIFOD
        </span>

        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
          Tailwind está
          <span className="text-[#e09566]">
            {" "}funcionando.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
          A partir daqui vamos migrar o projeto sem perder
          o visual atual.
        </p>

        <button
          type="button"
          className="
            mt-10
            rounded-full
            bg-gradient-to-r
            from-[#e09566]
            to-[#c46f43]
            px-7
            py-3
            text-sm
            font-bold
            text-[#160b07]
            transition
            hover:-translate-y-1
          "
        >
          Teste do Tailwind
        </button>

      </div>
    </main>
  );
}