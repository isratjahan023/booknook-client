import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function ReadersNote() {
  return (
    <section
      aria-labelledby="readers-note-heading"
      className="bg-background px-6 pb-16 sm:px-10 lg:px-12 lg:pb-24"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#23452f] px-7 py-12 text-[#faf7ef] sm:px-10 lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 right-10 size-80 rounded-full border border-white/10"
        />

        <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-[#d4dabc]">
              <BookOpen
                className="size-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Reader’s note
              </p>
            </div>

            <h2
              id="readers-note-heading"
              className="mt-6 max-w-xl font-serif text-4xl font-medium leading-[1.12] sm:text-5xl"
            >
              A little less scrolling.
              <br />
              <em>A few more pages.</em>
            </h2>
          </div>

          <div className="border-t border-white/20 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="max-w-sm text-base leading-8 text-[#d4dabc]">
              You don’t need a perfect reading routine. Just a quiet
              moment and a book you want to come back to.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#faf7ef] px-6 py-3 text-sm font-semibold text-[#23452f] transition-colors hover:bg-[#e8eddf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Find your next chapter
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}