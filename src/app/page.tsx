export default function Home() {
  return (
    <main className="flex-1 bg-[#faf7ef] text-[#23452f]">
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="mb-5 text-xs font-medium tracking-[0.25em] uppercase">
          Your community library
        </p>

        <h1 className="max-w-2xl font-serif text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          A new chapter.
          <br />
          A little escape.
          <br />
          All <em>yours.</em>
        </h1>

        <p className="mt-6 max-w-md text-base leading-7 text-[#637367]">
          Find a story to get lost in. Borrow a book, share a
          favorite, and make room for your next chapter.
        </p>
      </section>
    </main>
  );
}