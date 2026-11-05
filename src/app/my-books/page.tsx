"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError, type Book } from "@/lib/api";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);

  const editDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.title = "My Books | BookNook";
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login?next=%2Fmy-books");
      return;
    }

    let cancelled = false;

    api<Book[]>("/books?mine=true")
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch((error) => {
        if (cancelled) return;

        if (error instanceof ApiError && error.status === 401) {
          router.replace("/login?next=%2Fmy-books");
          return;
        }

        setError(
          error instanceof Error ? error.message : "Could not load books."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  function handleError(error: unknown) {
    toast.error(
      error instanceof Error ? error.message : "Request failed."
    );

    if (error instanceof ApiError && error.status === 401) {
      editDialog.current?.close();
      deleteDialog.current?.close();
      router.replace("/login?next=%2Fmy-books");
    }
  }

  async function saveBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected || busy) return;

    const data = new FormData(event.currentTarget);

    const updates = {
      title: String(data.get("title") || "").trim(),
      author: String(data.get("author") || "").trim(),
      category: String(data.get("category") || ""),
      image: String(data.get("image") || "").trim(),
      description: String(data.get("description") || "").trim(),
      totalCopies: Number(data.get("totalCopies")),
    };

    setBusy(true);

    try {
      await api(`/books/${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      const refreshed = await api<Book[]>("/books?mine=true");
      setBooks(refreshed);

      editDialog.current?.close();
      toast.success("Book updated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function deleteBook() {
    if (!selected || busy) return;

    setBusy(true);

    try {
      await api(`/books/${selected._id}`, {
        method: "DELETE",
      });

      setBooks((current) =>
        current.filter((book) => book._id !== selected._id)
      );

      deleteDialog.current?.close();
      toast.success("Book deleted successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#23452f]/20 bg-white px-4 py-3 outline-none focus:border-[#23452f]";

  if (isPending || !session || loading) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center gap-3"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
        Loading your books...
      </div>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <Toaster richColors position="top-center" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-4xl font-semibold">My Books</h1>

          <Link
            href="/add-book"
            className="rounded-xl bg-[#23452f] px-5 py-3 text-sm text-white"
          >
            Add a Book
          </Link>
        </div>

        {error ? (
          <p role="alert" className="mt-8 text-red-700">
            {error}
          </p>
        ) : books.length === 0 ? (
          <p className="mt-8">You have not added any books yet.</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#23452f]/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#e8ebdf]">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Available / Total</th>
                  <th className="p-4">Actions</th>
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
                          className="h-20 w-14 rounded object-contain"
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

                    <td className="p-4">
                      {book.availableCopies} / {book.totalCopies}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(book);
                            editDialog.current?.showModal();
                          }}
                          className="rounded-lg border border-[#23452f]/20 px-4 py-2 hover:bg-[#e8ebdf]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelected(book);
                            deleteDialog.current?.showModal();
                          }}
                          className="rounded-lg border border-red-200 px-4 py-2 text-red-700 hover:bg-red-50"
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

      <dialog
        ref={editDialog}
        aria-labelledby="edit-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-[#faf7ef] p-6 text-[#23452f] backdrop:bg-black/40"
      >
        <h2 id="edit-title" className="font-serif text-2xl font-semibold">
          Edit Book
        </h2>

        {selected && (
          <form
            key={selected._id}
            onSubmit={saveBook}
            className="mt-5 space-y-4"
          >
            <label className="block text-sm">
              Book title
              <input
                name="title"
                defaultValue={selected.title}
                required
                maxLength={200}
                className={inputClass}
              />
            </label>

            <label className="block text-sm">
              Author
              <input
                name="author"
                defaultValue={selected.author}
                required
                maxLength={150}
                className={inputClass}
              />
            </label>

            <label className="block text-sm">
              Category
              <select
                name="category"
                defaultValue={selected.category}
                className={inputClass}
              >
                {["Fiction", "Science", "History", "Kids", "Others"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="block text-sm">
              Image URL
              <input
                name="image"
                type="url"
                defaultValue={selected.image}
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
                defaultValue={selected.totalCopies}
                required
                min={Math.max(
                  1,
                  selected.totalCopies - selected.availableCopies
                )}
                max={10000}
                step={1}
                className={inputClass}
              />
            </label>

            <label className="block text-sm">
              Description
              <textarea
                name="description"
                defaultValue={selected.description}
                required
                maxLength={5000}
                rows={4}
                className={inputClass}
              />
            </label>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => editDialog.current?.close()}
                className="flex-1 rounded-xl border px-4 py-3 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-xl bg-[#23452f] px-4 py-3 text-white disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </dialog>

      <dialog
        ref={deleteDialog}
        aria-labelledby="delete-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#faf7ef] p-6 text-[#23452f] backdrop:bg-black/40"
      >
        <h2 id="delete-title" className="font-serif text-2xl font-semibold">
          Delete this book?
        </h2>

        <p className="mt-3">
          “{selected?.title}” will be permanently removed.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => deleteDialog.current?.close()}
            className="flex-1 rounded-xl border px-4 py-3 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={deleteBook}
            className="flex-1 rounded-xl bg-red-700 px-4 py-3 text-white disabled:opacity-50"
          >
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </dialog>
    </main>
  );
}