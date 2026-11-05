"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError, type Book } from "@/lib/api";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.title = "Book Details | BookNook";
  }, []);

  useEffect(() => {
    if (isPending) return;

    const loginURL = `/login?next=${encodeURIComponent(`/books/${id}`)}`;

    if (!session) {
      router.replace(loginURL);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError("");

    api<Book>(`/books/${id}`)
      .then((data) => {
        if (!cancelled) {
          setBook(data);
          document.title = `${data.title} | BookNook`;
        }
      })
      .catch((error) => {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          router.replace(loginURL);
          return;
        }

        setError(
          error instanceof Error ? error.message : "Could not load book."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, session, isPending, router]);

  async function confirmBorrow() {
    if (!book || borrowing) return;

    setBorrowing(true);

    try {
      await api("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId: book._id }),
      });

      dialog.current?.close();
      toast.success("Book borrowed successfully!");

      setBook((current) =>
        current
          ? {
              ...current,
              availableCopies: Math.max(0, current.availableCopies - 1),
            }
          : current
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not borrow book."
      );

      if (error instanceof ApiError && error.status === 401) {
        dialog.current?.close();
        router.replace(
          `/login?next=${encodeURIComponent(`/books/${id}`)}`
        );
      }
    } finally {
      setBorrowing(false);
    }
  }

  if (isPending || !session || loading) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center gap-3"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
        Loading book...
      </div>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-[60vh] px-5 py-16 text-center">
        <p role="alert" className="text-red-700">
          {error || "Book not found"}
        </p>
        <Link href="/books" className="mt-5 inline-block underline">
          Back to All Books
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <Toaster richColors position="top-center" />

      <div className="mx-auto max-w-5xl">
        <Link href="/books" className="text-sm underline underline-offset-4">
          Back to All Books
        </Link>

        <div className="mt-6 grid gap-8 rounded-3xl border border-[#23452f]/10 bg-white p-6 md:grid-cols-2 md:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.image}
            alt={`${book.title} cover`}
            className="h-96 w-full rounded-xl bg-[#eeeee5] object-contain p-6"
          />

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#75815c]">
              {book.category}
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold">
              {book.title}
            </h1>

            <p className="mt-3 text-lg">By {book.author}</p>

            <p className="mt-6 whitespace-pre-wrap leading-7 text-[#61705e]">
              {book.description}
            </p>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">Added by</dt>
                <dd>{book.userName}</dd>
                <dd className="break-all text-[#61705e]">
                  {book.userEmail}
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Available copies</dt>
                <dd>
                  {book.availableCopies} of {book.totalCopies}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={book.availableCopies <= 0}
              onClick={() => dialog.current?.showModal()}
              className="mt-8 w-full rounded-xl bg-[#23452f] px-5 py-3 font-medium text-white hover:bg-[#193522] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {book.availableCopies > 0
                ? "Borrow This Book"
                : "Not Available"}
            </button>

            <p className="mt-3 text-xs text-[#61705e]">
              Please return your book within 7 days.
            </p>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="borrow-title"
        onCancel={(event) => {
          if (borrowing) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#faf7ef] p-6 text-[#23452f] shadow-xl backdrop:bg-black/40"
      >
        <h2 id="borrow-title" className="font-serif text-2xl font-semibold">
          Borrow {book.title}
        </h2>

        <p className="mt-3 text-sm text-[#61705e]">
          Confirm your details to borrow this book.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void confirmBorrow();
          }}
          className="mt-5 space-y-4"
        >
          <label className="block text-sm">
            Your name
            <input
              value={session.user.name}
              readOnly
              className="mt-2 w-full rounded-lg border bg-white p-3"
            />
          </label>

          <label className="block text-sm">
            Your email
            <input
              value={session.user.email}
              readOnly
              className="mt-2 w-full rounded-lg border bg-white p-3"
            />
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              disabled={borrowing}
              onClick={() => dialog.current?.close()}
              className="flex-1 rounded-xl border border-[#23452f]/20 px-4 py-3 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={borrowing}
              className="flex-1 rounded-xl bg-[#23452f] px-4 py-3 text-white disabled:opacity-50"
            >
              {borrowing ? "Borrowing..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}