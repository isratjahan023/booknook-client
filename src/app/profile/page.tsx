"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");

  useEffect(() => {
    document.title = "My Profile | BookNook";

    const params = new URLSearchParams(window.location.search);

    if (params.has("error") || params.get("google") === "error") {
      setConnectError(
        "Could not connect Google. Sign in again with your BookNook password, then choose the Google account with the same email."
      );
    }
  }, []);

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/login?next=%2Fprofile");
    }
  }, [session, isPending, error, router]);

  async function connectGoogle() {
    if (connecting || !session) return;

    setConnecting(true);
    setConnectError("");

    try {
      const result = await authClient.linkSocial({
        provider: "google",
        callbackURL: new URL("/profile", window.location.origin).href,
        errorCallbackURL: new URL(
          "/profile?google=error",
          window.location.origin
        ).href,
      });

      if (result.error) {
        setConnectError(
          result.error.message || "Could not connect Google. Please try again."
        );
        setConnecting(false);
      }
    } catch {
      setConnectError("Could not connect Google. Please try again.");
      setConnecting(false);
    }
  }

  if (error) {
    return (
      <main className="min-h-[60vh] px-5 py-16 text-center">
        <p role="alert" className="text-red-700 dark:text-red-400">
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
        <span className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading profile...
      </div>
    );
  }

  const { user } = session;

  return (
    <main className="min-h-[70vh] bg-background px-5 py-16 text-foreground">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center text-card-foreground">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={`${user.name}'s profile`}
            referrerPolicy="no-referrer"
            className="mx-auto size-24 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-10" aria-hidden="true" />
          </div>
        )}

        <h1 className="mt-5 font-serif text-3xl font-semibold">
          {user.name}
        </h1>

        <p className="mt-2 break-all text-muted-foreground">
          {user.email}
        </p>

        <p className="mt-5 text-sm">
          Your little corner of the BookNook community.
        </p>

        <div className="mt-7 rounded-2xl border border-border p-5">
          <h2 className="font-semibold">Connect your Google account</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose the Google account with the same email shown above.
            Once connected, you can use Google to sign in.
          </p>

          <button
            type="button"
            onClick={connectGoogle}
            disabled={connecting}
            className="mt-4 w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connecting ? "Connecting..." : "Connect Google"}
          </button>

          {connectError && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-700 dark:text-red-400"
            >
              {connectError}
            </p>
          )}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/my-books"
            className="rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground"
          >
            My Books
          </Link>

          <Link
            href="/my-borrows"
            className="rounded-xl border border-border px-5 py-3 text-sm"
          >
            My Borrows
          </Link>
        </div>
      </div>
    </main>
  );
}