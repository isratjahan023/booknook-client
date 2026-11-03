import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#23452f]/15 bg-[#faf7ef] text-[#23452f]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
          >
            <BookOpen
              className="size-8"
              strokeWidth={1.4}
              aria-hidden="true"
            />

            <span className="font-serif text-3xl font-semibold tracking-tight">
              BookNook
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-[#637367]">
            A small online library to discover, borrow, and
            share your next favorite book.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold">
            Explore the library
          </h2>

          <nav
            aria-label="Footer navigation"
            className="mt-4 flex flex-col items-start gap-3 text-sm"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>

            <Link href="/books" className="hover:underline">
              All Books
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold">
            Stay connected
          </h2>

          <a
            href="mailto:hello@booknook.example"
            className="mt-4 inline-flex items-center gap-2 text-sm break-all hover:underline"
          >
            <Mail
              className="size-4 shrink-0"
              aria-hidden="true"
            />
            hello@booknook.example
          </a>

          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Instagram
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="hover:underline"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#23452f]/15 px-5 py-5 text-center text-xs text-[#637367]">
        © 2026 BookNook. All rights reserved.
      </div>
    </footer>
  );
}