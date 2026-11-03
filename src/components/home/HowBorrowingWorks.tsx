import { BookOpen, Library, RotateCcw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Discover a book",
    description:
      "Explore our collection and find a story that sparks your curiosity.",
  },
  {
    number: "02",
    icon: Library,
    title: "Borrow your copy",
    description:
      "Sign in, open the book details, and confirm your borrow.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Read and return",
    description:
      "Enjoy your book, then return it so another reader can discover it.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section
      aria-labelledby="borrowing-heading"
      className="mx-auto max-w-7xl px-5 py-16 lg:px-8"
    >
      <p className="text-xs font-medium tracking-[0.2em] text-[#526448] uppercase">
        How borrowing works
      </p>

      <h2
        id="borrowing-heading"
        className="mt-3 max-w-2xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        A good book is three steps away.
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map(({ number, icon: Icon, title, description }) => (
          <div
            key={number}
            className="border-t border-[#23452f]/20 pt-6"
          >
            <div className="flex items-center justify-between">
              <Icon
                className="size-9 text-[#23452f]"
                strokeWidth={1.4}
                aria-hidden="true"
              />

              <span className="font-serif text-3xl text-[#637367]">
                {number}
              </span>
            </div>

            <h3 className="mt-5 font-serif text-2xl font-semibold">
              {title}
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-7 text-[#637367]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}