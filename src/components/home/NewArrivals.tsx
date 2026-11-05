"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { api, type Book } from "@/lib/api";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api<Book[]>("/books?limit=6", {}, false)
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load new arrivals."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-labelledby="arrivals-title"
      className="bg-[#faf7ef] px-5 py-14 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#75815c]">
              Fresh on our shelves
            </p>

            <h2
              id="arrivals-title"
              className="mt-3 font-serif text-4xl font-semibold text-[#23452f]"
            >
              New Arrivals
            </h2>

            <p className="mt-3 text-[#61705e]">
              Discover the latest books shared by our reading community.
            </p>
          </div>

          <Link
            href="/books"
            className="shrink-0 text-sm font-semibold text-[#23452f] underline underline-offset-4"
          >
            See All Books →
          </Link>
        </div>

        {loading ? (
          <div
            role="status"
            className="flex min-h-60 items-center justify-center gap-3"
          >
            <LoaderCircle
              className="size-6 animate-spin"
              aria-hidden="true"
            />
            Loading new arrivals...
          </div>
        ) : error ? (
          <p role="alert" className="mt-8 text-red-700">
            {error}
          </p>
        ) : books.length === 0 ? (
          <p className="mt-8 text-[#61705e]">
            Our shelves are waiting for their first story.
          </p>
        ) : (
          <div
            role="region"
            aria-label="New arrivals bookshelf"
            tabIndex={0}
            className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 focus-visible:outline-2 focus-visible:outline-[#23452f] lg:grid lg:grid-cols-6 lg:gap-6"
          >
            {books.map((book) => (
              <article
                key={book._id}
                className="flex w-40 shrink-0 snap-start flex-col sm:w-44 lg:w-auto lg:min-w-0"
              >
                <Link
                  href={`/books/${book._id}`}
                  aria-label={`View ${book.title}`}
                  className="flex h-64 items-end justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.image}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    className="max-h-full max-w-full rounded-sm object-contain shadow-md"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#75815c]">
                    {book.category}
                  </p>

                  <h3 className="mt-2 line-clamp-2 font-serif text-lg font-semibold leading-snug text-[#23452f]">
                    {book.title}
                  </h3>

                  <p className="mb-4 mt-1 text-xs leading-5 text-[#61705e]">
                    By {book.author}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-auto rounded-lg bg-[#23452f] px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-[#193522]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}