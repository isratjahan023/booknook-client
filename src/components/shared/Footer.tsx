import Link from "next/link";
import { ArrowUpRight, BookOpen, Mail } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "𝕏", href: "https://x.com/", ariaLabel: "X" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16 lg:py-16">
          <div>
            <Link
              href="/"
              aria-label="BookNook home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <BookOpen
                  className="size-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span className="font-serif text-3xl font-semibold tracking-tight">
                BookNook
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              A small library with room for your next favorite.
              Discover a story, share a book, and help our community
              keep reading.
            </p>

            <p className="mt-5 font-serif text-lg italic text-muted-foreground">
              Good stories belong to everyone.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">
              Explore BookNook
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-6 flex flex-col items-start gap-4 text-sm text-muted-foreground"
            >
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>

              <Link href="/books" className="hover:text-foreground">
                Browse all books
              </Link>

              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>

              <Link href="/register" className="hover:text-foreground">
                Join the library
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">
              Stay connected
            </h2>

            <a
              href="mailto:hello@booknook.example"
              className="mt-6 inline-flex items-center gap-2 break-all text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              hello@booknook.example
            </a>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel || social.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {social.label}
                  <ArrowUpRight
                    className="size-3"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Discover. Borrow. Share.</p>
        </div>
      </div>
    </footer>
  );
}