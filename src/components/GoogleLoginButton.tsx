"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function GoogleLoginButton({
  isSignup = false,
}: {
  isSignup?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const next = new URLSearchParams(window.location.search).get("next");

    const safeNext =
      next?.startsWith("/") &&
      !next.startsWith("//") &&
      !next.includes("\\")
        ? next
        : "/";

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: isSignup ? "/" : safeNext,
        newUserCallbackURL: isSignup ? "/" : safeNext,
        errorCallbackURL: isSignup ? "/register" : "/login",
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