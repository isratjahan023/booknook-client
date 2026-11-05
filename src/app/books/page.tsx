"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Book } from "@/lib/api";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "All Books | BookNook";

    api<Book[]>("/books", {}, false)
      .then(setBooks)
      .catch((error) =>
        setError(
          error instanceof Error ? error.message : "Could not load books."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-serif text-4xl font-semibold">All Books</h1>
        <p className="mt-3 text-[#61705e]">
          Find your next read in our community library.
        </p>

        {loading ? (
          <div role="status" className="flex items-center gap-3 py-16">
            <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
            Loading books...
          </div>
        ) : error ? (
          <p role="alert" className="mt-8 text-red-700">
            {error}
          </p>
        ) : books.length === 0 ? (
          <p className="mt-8">No books yet. Be the first to share one!</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#23452f]/10 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
<div className="h-72 w-full overflow-hidden bg-[#eeeee5]">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={book.image}
    alt={`${book.title} cover`}
    loading="lazy"
    className="h-full w-full object-cover"
  />
</div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#75815c]">
                    {book.category}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">
                    {book.title}
                  </h2>
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
      </div>
    </main>
  );
}