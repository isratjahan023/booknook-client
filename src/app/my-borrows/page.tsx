"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError, type Borrow } from "@/lib/api";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My Borrows | BookNook";
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login?next=%2Fmy-borrows");
      return;
    }

    let cancelled = false;

    api<Borrow[]>("/borrows")
      .then((data) => {
        if (!cancelled) setBorrows(data);
      })
      .catch((error) => {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login?next=%2Fmy-borrows");
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Could not load borrowed books."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  async function returnBook(id: string) {
    if (returningId) return;

    setReturningId(id);

    try {
      await api(`/borrows/${id}`, {
        method: "DELETE",
      });

      setBorrows((current) =>
        current.filter((borrow) => borrow._id !== id)
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not return book."
      );

      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login?next=%2Fmy-borrows");
      }
    } finally {
      setReturningId(null);
    }
  }

  function dateLabel(value: string) {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (isPending || !session || loading) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center gap-3"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
        Loading borrowed books...
      </div>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <Toaster richColors position="top-center" />

      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl font-semibold">My Borrows</h1>

        <p className="mt-3 text-[#61705e]">
          Keep track of your reads and return them for the next reader.
        </p>

        {error ? (
          <p role="alert" className="mt-8 text-red-700">
            {error}
          </p>
        ) : borrows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#23452f]/10 bg-white p-8">
            <p>You have no borrowed books.</p>
            <Link
              href="/books"
              className="mt-4 inline-block rounded-xl bg-[#23452f] px-5 py-3 text-sm text-white"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#23452f]/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#e8ebdf]">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Borrow Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.map((borrow) => (
                  <tr
                    key={borrow._id}
                    className="border-t border-[#23452f]/10"
                  >
                    <td className="p-4">
                      <div className="flex min-w-48 items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={borrow.bookImage}
                          alt={`${borrow.bookTitle} cover`}
                          className="h-20 w-14 rounded object-contain"
                        />

                        <Link
                          href={`/books/${borrow.bookId}`}
                          className="font-semibold hover:underline"
                        >
                          {borrow.bookTitle}
                        </Link>
                      </div>
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {dateLabel(borrow.borrowDate)}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {dateLabel(borrow.returnDate)}
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        disabled={returningId !== null}
                        onClick={() => returnBook(borrow._id)}
                        className="whitespace-nowrap rounded-xl bg-[#23452f] px-4 py-3 text-white hover:bg-[#193522] disabled:opacity-50"
                      >
                        {returningId === borrow._id
                          ? "Returning..."
                          : "Return Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}