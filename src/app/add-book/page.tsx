"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Add Book | BookNook";
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?next=%2Fadd-book");
    }
  }, [isPending, session, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const imageFile = values.get("image");

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      toast.error("Please select a book image.");
      return;
    }

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)
    ) {
      toast.error("Select a JPG, PNG or WebP image.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!key) {
      toast.error("Image upload key is missing. Add the ImgBB API key.");
      return;
    }

    setSaving(true);

    try {
      const uploadBody = new FormData();
      uploadBody.append("image", imageFile);

      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          body: uploadBody,
        }
      );

      const upload = await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        !upload.success ||
        !upload.data?.url
      ) {
        throw new Error("Image upload failed. Please try again.");
      }

      await api("/books", {
        method: "POST",
        body: JSON.stringify({
          title: String(values.get("title") || "").trim(),
          author: String(values.get("author") || "").trim(),
          category: String(values.get("category") || ""),
          description: String(values.get("description") || "").trim(),
          totalCopies: Number(values.get("totalCopies")),
          image: upload.data.url,
        }),
      });

      toast.success("Book added successfully!");
      form.reset();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Please log in again.");
        router.replace("/login?next=%2Fadd-book");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Could not add book."
      );
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center gap-3"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
        Loading...
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#23452f]/20 bg-white px-4 py-3 outline-none focus:border-[#23452f] focus:ring-2 focus:ring-[#23452f]/10";

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-12 text-[#23452f]">
      <Toaster richColors position="top-center" />

      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest">
          Share a story
        </p>

        <h1 className="mt-3 font-serif text-4xl font-semibold">
          Add a book
        </h1>

        <p className="mt-3 text-[#61705e]">
          Give another reader a chance to discover a book you love.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-[#23452f]/10 bg-white p-6 sm:p-8"
        >
          <div>
            <label htmlFor="title">Book title</label>
            <input
              id="title"
              name="title"
              required
              maxLength={200}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="author">Author name</label>
            <input
              id="author"
              name="author"
              required
              maxLength={150}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {["Fiction", "Science", "History", "Kids", "Others"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label htmlFor="totalCopies">Total copies</label>
              <input
                id="totalCopies"
                name="totalCopies"
                type="number"
                required
                min={1}
                max={10000}
                step={1}
                defaultValue={1}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="image">Book image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#61705e]">
              JPG, PNG or WebP. Maximum 5 MB.
            </p>
          </div>

          <div>
            <label htmlFor="description">Short description</label>
            <textarea
              id="description"
              name="description"
              required
              maxLength={5000}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="userName">Your name</label>
              <input
                id="userName"
                value={session.user.name}
                readOnly
                className={`${inputClass} bg-stone-50`}
              />
            </div>

            <div>
              <label htmlFor="userEmail">Your email</label>
              <input
                id="userEmail"
                value={session.user.email}
                readOnly
                className={`${inputClass} bg-stone-50`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#23452f] px-5 py-3 font-medium text-[#faf7ef] hover:bg-[#193522] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Uploading and saving..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}