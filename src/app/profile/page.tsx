"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    document.title = "My Profile | BookNook";
  }, []);

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/login?next=%2Fprofile");
    }
  }, [session, isPending, error, router]);

  if (error) {
    return (
      <main className="min-h-[60vh] px-5 py-16 text-center">
        <p role="alert" className="text-red-700">
          Could not load your profile. Please refresh and try again.
        </p>
      </main>
    );
  }

  if (isPending || !session) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] items-center justify-center gap-3"
      >
        <span className="size-6 animate-spin rounded-full border-2 border-[#23452f] border-t-transparent" />
        Loading profile...
      </div>
    );
  }

  const { user } = session;

  return (
    <main className="min-h-[70vh] bg-[#faf7ef] px-5 py-16 text-[#23452f]">
      <div className="mx-auto max-w-lg rounded-3xl border border-[#23452f]/10 bg-white p-8 text-center">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={`${user.name}'s profile`}
            referrerPolicy="no-referrer"
            className="mx-auto size-24 rounded-full border border-[#23452f]/15 object-cover"
          />
        ) : (
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#e8ebdf]">
            <UserRound className="size-10" aria-hidden="true" />
          </div>
        )}

        <h1 className="mt-5 font-serif text-3xl font-semibold">
          {user.name}
        </h1>

        <p className="mt-2 break-all text-[#61705e]">{user.email}</p>

        <p className="mt-5 text-sm">
          Your little corner of the BookNook community.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/my-books"
            className="rounded-xl bg-[#23452f] px-5 py-3 text-sm text-white"
          >
            My Books
          </Link>

          <Link
            href="/my-borrows"
            className="rounded-xl border border-[#23452f] px-5 py-3 text-sm"
          >
            My Borrows
          </Link>
        </div>
      </div>
    </main>
  );
}