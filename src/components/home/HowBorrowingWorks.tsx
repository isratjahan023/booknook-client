import { BookOpen, Library, RotateCcw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Find your next read",
    description:
      "Follow your curiosity through fiction, science, history and more. Find the book that feels right for you.",
  },
  {
    number: "02",
    icon: Library,
    title: "Make it yours for a while",
    description:
      "Sign in, open the book details and confirm your borrow. Your reading list is waiting in My Borrows.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Pass the story on",
    description:
      "Finished your last chapter? Return your copy so another reader can discover something wonderful.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section
      aria-labelledby="borrowing-heading"
      className="border-t border-border bg-background px-6 py-16 sm:px-10 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              A bookshelf we share
            </p>

            <h2
              id="borrowing-heading"
              className="mt-4 max-w-xl font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
            >
              Your next chapter,
              <br />
              <em>in three simple steps.</em>
            </h2>
          </div>

          <p className="max-w-md text-base leading-8 text-muted-foreground lg:ml-auto">
            Good books deserve more than one reader. Discover something
            you love, enjoy it, and keep the story moving.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <article
              key={number}
              className="rounded-3xl border border-border bg-card p-7 text-card-foreground lg:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Icon
                    className="size-6"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="font-serif text-4xl text-muted-foreground/60"
                >
                  {number}
                </span>
              </div>

              <h3 className="mt-7 font-serif text-2xl font-semibold leading-tight">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}