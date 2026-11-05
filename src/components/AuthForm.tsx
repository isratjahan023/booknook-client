"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({
  mode,
}: {
  mode: "signup" | "login";
}) {
  const isSignup = mode === "signup";
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const password = String(formData.get("password") || "");

    if (
      isSignup &&
      (password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password))
    ) {
      setError(
        "Password must contain at least 6 characters, one uppercase letter and one lowercase letter."
      );
      return;
    }

    if (isSignup && !name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const result = isSignup
        ? await authClient.signUp.email({
            name,
            email,
            password,
            image,
          })
        : await authClient.signIn.email({
            email,
            password,
          });

      if (result.error) {
        setError(
          `${result.error.message || "Request failed. Please try again."} (Status: ${
            result.error.status || "unknown"
          })`
        );
        return;
      }

      if (!result.data) {
        setError("No account/session data received. Please try again.");
        return;
      }

      if (isSignup) {
        // Registration must lead to the Login page.
        // End any automatically created session first.
        const signOutResult = await authClient.signOut();

        if (signOutResult.error) {
          setError(
            "Account created, but the automatic session could not be cleared. Please try logging in."
          );
          return;
        }

        router.push("/login?registered=1");
        router.refresh();
        return;
      }

      setSuccess("Login successful! Redirecting...");
      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Could not complete the request. Check the client terminal for the server error."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#d6dfd5] bg-white px-4 py-3 text-[#183d30] outline-none focus:border-[#285943] focus:ring-2 focus:ring-[#285943]/20";

  const labelClass = "text-sm font-medium text-[#183d30]";

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#faf7ef] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#dce3d7] bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold tracking-widest text-[#58725b]">
          BOOKNOOK
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#183d30]">
          {isSignup ? "Create your account" : "Welcome back, reader."}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#667168]">
          {isSignup
            ? "Join our library to share books and discover your next read."
            : "Log in to continue your reading journey."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="image" className={labelClass}>
                  Photo URL
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  required
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              maxLength={128}
              className={inputClass}
            />

            {isSignup && (
              <p className="mt-2 text-xs leading-5 text-[#667168]">
                Minimum 6 characters, including one uppercase and one
                lowercase letter.
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#234d3b] px-5 py-3 font-medium text-white transition hover:bg-[#183d30] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isSignup ? "Register" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#667168]">
          {isSignup ? "Already have an account? " : "New to BookNook? "}
          <Link
            href={isSignup ? "/login" : "/register"}
            className="font-semibold text-[#234d3b] underline underline-offset-4"
          >
            {isSignup ? "Log in" : "Register"}
          </Link>
        </p>
      </div>
    </section>
  );
}