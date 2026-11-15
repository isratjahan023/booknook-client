"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function getSafeDestination() {
  const next = new URLSearchParams(window.location.search).get("next");

  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(next)
  ) {
    return "/";
  }

  try {
    const target = new URL(next, window.location.origin);

    if (target.origin !== window.location.origin) {
      return "/";
    }

    if (/^\/(?:login|register)(?:\/|$)/i.test(target.pathname)) {
      return "/";
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export default function GoogleLoginButton({
  isSignup = false,
}: {
  isSignup?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    if (loading) return;

    setLoading(true);
    setError("");

    const destination = getSafeDestination();

    // Use the same destination for existing and new Google users.
    const callbackURL = new URL(
      destination,
      window.location.origin
    ).href;

    const errorURL = new URL(
      isSignup ? "/register" : "/login",
      window.location.origin
    );

    if (destination !== "/") {
      errorURL.searchParams.set("next", destination);
    }

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: errorURL.href,
      });

      if (result.error) {
        setError(result.error.message || "Google login failed.");
        setLoading(false);
      }
    } catch {
      setError("Could not start Google login. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#23452f]/15" />
        <span className="text-xs text-[#667168]">or</span>
        <span className="h-px flex-1 bg-[#23452f]/15" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full rounded-xl border border-[#23452f]/25 bg-white px-5 py-3 font-medium text-[#23452f] hover:bg-[#e8ebdf] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Connecting to Google..." : "Continue with Google"}
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}