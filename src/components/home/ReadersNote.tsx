import { BookOpen } from "lucide-react";

export default function ReadersNote() {
  return (
    <section
      aria-labelledby="readers-note-heading"
      className="bg-[#23452f] text-[#faf7ef]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_2fr] lg:px-8">
        <div>
          <BookOpen
            className="mb-4 size-9 text-[#d4dabc]"
            strokeWidth={1.3}
            aria-hidden="true"
          />

          <h2
            id="readers-note-heading"
            className="font-serif text-4xl font-medium italic"
          >
            Reader’s Note
          </h2>

          <div
            aria-hidden="true"
            className="mt-4 h-px w-12 bg-[#c5a367]"
          />
        </div>

        <div className="border-l border-[#faf7ef]/25 pl-6 md:pl-10">
          <p className="font-serif text-3xl leading-snug sm:text-4xl">
            Make a little room for reading.
          </p>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#d4dabc]">
            A quiet moment. A few more pages. A story that stays
            with you. Find your next little escape at BookNook.
          </p>
        </div>
      </div>
    </section>
  );
}