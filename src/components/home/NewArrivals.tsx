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
      className="px-5 py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-medium uppercase tracking-widest text-[#75815c]">
          Fresh on our shelves
        </p>

        <h2
          id="arrivals-title"
          className="mt-3 font-serif text-4xl font-semibold"
        >
          New Arrivals
        </h2>

        <p className="mt-3 max-w-xl text-[#61705e]">
          Discover the latest books shared by our reading community.
        </p>

        {loading ? (
          <div
            role="status"
            className="flex min-h-48 items-center justify-center gap-3"
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
          <p className="mt-8 rounded-2xl border border-[#23452f]/10 bg-white p-8">
            Our shelves are waiting for their first story.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#23452f]/10 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.image}
                  alt={`${book.title} cover`}
                  loading="lazy"
                  className="h-64 w-full bg-[#eeeee5] object-contain p-5"
                />

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#75815c]">
                    {book.category}
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    {book.title}
                  </h3>

                  <p className="mb-6 mt-2 text-sm text-[#61705e]">
                    By {book.author}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-auto rounded-xl bg-[#23452f] px-4 py-3 text-center text-sm font-medium text-white hover:bg-[#193522]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-9 text-center">
          <Link
            href="/books"
            className="inline-block rounded-xl border border-[#23452f] px-6 py-3 text-sm font-medium hover:bg-[#e8ebdf]"
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
}