"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError, type Book } from "@/lib/api";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];
const loginUrl = "/login?next=%2Fmy-books";

type BookModal = {
  type: "edit" | "delete";
  book: Book;
} | null;

export default function MyBooksPage() {
  const router = useRouter();
  const {
    data: session,
    isPending,
    error: sessionError,
  } = authClient.useSession();

  const userId = session?.user.id;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [modal, setModal] = useState<BookModal>(null);
  const [busy, setBusy] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  useEffect(() => {
    if (isPending || sessionError) return;

    if (!userId) {
      router.replace(loginUrl);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError("");
    setBooks([]);

    async function loadBooks() {
      try {
        const data = await api<Book[]>("/books?mine=true");

        if (!cancelled) {
          setBooks(data);
        }
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 401) {
          router.replace(loginUrl);
          return;
        }

        const message =
          err instanceof Error ? err.message : "Could not load your books.";

        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      cancelled = true;
    };
  }, [userId, isPending, sessionError, retry, router]);

  // Open the dialog after the selected book's form has rendered.
  useEffect(() => {
    const dialog = dialogRef.current;

    if (modal && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [modal]);

  function closeModal() {
    if (requestInProgress.current) return;

    dialogRef.current?.close();
    setModal(null);
  }

  function handleRequestError(err: unknown) {
    toast.error(
      err instanceof Error ? err.message : "Request failed. Please try again."
    );

    if (err instanceof ApiError && err.status === 401) {
      dialogRef.current?.close();
      setModal(null);
      router.replace(loginUrl);
    }
  }

  async function saveBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!modal || modal.type !== "edit" || requestInProgress.current) {
      return;
    }

    const selected = modal.book;
    const formData = new FormData(event.currentTarget);

    const updates = {
      title: String(formData.get("title") || "").trim(),
      author: String(formData.get("author") || "").trim(),
      category: String(formData.get("category") || ""),
      image: String(formData.get("image") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      totalCopies: Number(formData.get("totalCopies")),
    };

    if (
      !updates.title ||
      !updates.author ||
      !updates.image ||
      !updates.description
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!categories.includes(updates.category)) {
      toast.error("Please choose a valid category.");
      return;
    }

    try {
      const imageUrl = new URL(updates.image);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        toast.error("Please enter a valid HTTP or HTTPS image URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    const borrowedCopies = Math.max(
      0,
      selected.totalCopies - selected.availableCopies
    );
    const minimumCopies = Math.max(1, borrowedCopies);

    if (
      !Number.isInteger(updates.totalCopies) ||
      updates.totalCopies < minimumCopies ||
      updates.totalCopies > 10000
    ) {
      toast.error(
        `Total copies must be a whole number between ${minimumCopies} and 10000.`
      );
      return;
    }

    requestInProgress.current = true;
    setBusy(true);

    try {
      await api(`/books/${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      dialogRef.current?.close();
      setModal(null);
      toast.success("Book updated successfully!");

      // Reload authoritative copy counts from the server.
      setRetry((current) => current + 1);
    } catch (err) {
      handleRequestError(err);
    } finally {
      requestInProgress.current = false;
      setBusy(false);
    }
  }

  async function deleteBook() {
    if (!modal || modal.type !== "delete" || requestInProgress.current) {
      return;
    }

    const bookId = modal.book._id;

    requestInProgress.current = true;
    setBusy(true);

    try {
      await api(`/books/${bookId}`, {
        method: "DELETE",
      });

      setBooks((current) => current.filter((book) => book._id !== bookId));

      dialogRef.current?.close();
      setModal(null);
      toast.success("Book deleted successfully!");
    } catch (err) {
      handleRequestError(err);
    } finally {
      requestInProgress.current = false;
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#23452f]/20 bg-white px-4 py-3 outline-none focus:border-[#23452f]";

  const secondaryButton =
    "rounded-xl border border-[#23452f]/20 px-4 py-3 text-sm font-medium hover:bg-[#e8ebdf] disabled:opacity-50";

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <Toaster richColors position="top-center" />

      {sessionError ? (
        <div className="mx-auto max-w-xl py-16 text-center">
          <h1 className="font-serif text-3xl font-semibold">
            Unable to load your account
          </h1>

          <p role="alert" className="mt-4 text-red-700">
            Please refresh the page and try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`${secondaryButton} mt-6`}
          >
            Refresh Page
          </button>
        </div>
      ) : isPending || !userId || loading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-[50vh] items-center justify-center gap-3"
        >
          <span
            aria-hidden="true"
            className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent"
          />
          Loading your books...
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-semibold">My Books</h1>
              <p className="mt-2 text-sm text-[#61705e]">
                Manage the books you have added to BookNook.
              </p>
            </div>

            <Link
              href="/add-book"
              className="rounded-xl bg-[#23452f] px-5 py-3 text-sm font-medium text-white hover:bg-[#193522]"
            >
              Add a Book
            </Link>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-white p-6">
              <p role="alert" className="text-red-700">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRetry((current) => current + 1)}
                className={`${secondaryButton} mt-4`}
              >
                Try Again
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#23452f]/10 bg-white px-6 py-14 text-center">
              <h2 className="font-serif text-2xl font-semibold">
                Your bookshelf is waiting
              </h2>
              <p className="mt-3 text-[#61705e]">
                You have not added any books yet.
              </p>
              <Link
                href="/add-book"
                className="mt-6 inline-block rounded-xl bg-[#23452f] px-5 py-3 text-sm text-white hover:bg-[#193522]"
              >
                Add Your First Book
              </Link>
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-[#23452f]/10 bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Books you added, with edit and delete actions
                </caption>
                <thead className="bg-[#e8ebdf]">
                  <tr>
                    <th scope="col" className="p-4">
                      Book
                    </th>
                    <th scope="col" className="p-4">
                      Category
                    </th>
                    <th scope="col" className="whitespace-nowrap p-4">
                      Available / Total
                    </th>
                    <th scope="col" className="p-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="border-t border-[#23452f]/10"
                    >
                      <td className="p-4">
                        <div className="flex min-w-48 items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={book.image}
                            alt={`${book.title} cover`}
                            loading="lazy"
                            className="h-20 w-14 shrink-0 rounded bg-[#faf7ef] object-contain"
                          />

                          <div>
                            <Link
                              href={`/books/${book._id}`}
                              className="font-semibold hover:underline"
                            >
                              {book.title}
                            </Link>
                            <p className="mt-1 text-[#61705e]">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">{book.category}</td>

                      <td className="whitespace-nowrap p-4">
                        {book.availableCopies} / {book.totalCopies}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={`Edit ${book.title}`}
                            onClick={() => setModal({ type: "edit", book })}
                            className="rounded-lg border border-[#23452f]/20 px-4 py-2 hover:bg-[#e8ebdf] disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            aria-label={`Delete ${book.title}`}
                            onClick={() => setModal({ type: "delete", book })}
                            className="rounded-lg border border-red-200 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {modal && (
        <dialog
          ref={dialogRef}
          aria-labelledby="book-modal-title"
          aria-describedby={
            modal.type === "delete" ? "delete-description" : undefined
          }
          onCancel={(event) => {
            event.preventDefault();
            closeModal();
          }}
          className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl bg-[#faf7ef] p-6 text-[#23452f] shadow-xl backdrop:bg-black/50"
        >
          <h2
            id="book-modal-title"
            className="font-serif text-2xl font-semibold"
          >
            {modal.type === "edit" ? "Edit Book" : "Delete this book?"}
          </h2>

          {modal.type === "edit" ? (
            <form onSubmit={saveBook} className="mt-5">
              <fieldset disabled={busy} className="space-y-4">
                <label className="block text-sm">
                  Book title
                  <input
                    name="title"
                    defaultValue={modal.book.title}
                    required
                    maxLength={200}
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm">
                  Author
                  <input
                    name="author"
                    defaultValue={modal.book.author}
                    required
                    maxLength={150}
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm">
                  Category
                  <select
                    name="category"
                    defaultValue={modal.book.category}
                    required
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  Image URL
                  <input
                    name="image"
                    type="url"
                    defaultValue={modal.book.image}
                    required
                    maxLength={2000}
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm">
                  Total copies
                  <input
                    name="totalCopies"
                    type="number"
                    defaultValue={modal.book.totalCopies}
                    required
                    min={Math.max(
                      1,
                      modal.book.totalCopies - modal.book.availableCopies
                    )}
                    max={10000}
                    step={1}
                    className={inputClass}
                  />
                  <span className="mt-2 block text-xs text-[#61705e]">
                    Total copies cannot be lower than the number currently
                    borrowed.
                  </span>
                </label>

                <label className="block text-sm">
                  Description
                  <textarea
                    name="description"
                    defaultValue={modal.book.description}
                    required
                    maxLength={5000}
                    rows={4}
                    className={inputClass}
                  />
                </label>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`${secondaryButton} flex-1`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#23452f] px-4 py-3 text-sm font-medium text-white hover:bg-[#193522] disabled:opacity-50"
                  >
                    {busy ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </fieldset>
            </form>
          ) : (
            <>
              <p id="delete-description" className="mt-3 leading-relaxed">
                &ldquo;{modal.book.title}&rdquo; will be permanently removed.
                This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  autoFocus
                  disabled={busy}
                  onClick={closeModal}
                  className={`${secondaryButton} flex-1`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={deleteBook}
                  className="flex-1 rounded-xl bg-red-700 px-4 py-3 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
                >
                  {busy ? "Deleting..." : "Delete Book"}
                </button>
              </div>
            </>
          )}
        </dialog>
      )}
    </main>
  );
}