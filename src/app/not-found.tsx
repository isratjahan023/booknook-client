import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf7ef] px-5 text-center text-[#23452f]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em]">
        Page not found
      </p>

      <h1 className="mt-4 font-serif text-8xl font-semibold">404</h1>

      <h2 className="mt-4 font-serif text-3xl">
        This chapter is missing.
      </h2>

      <p className="mt-3 max-w-md text-[#61705e]">
        The page you are looking for may have moved. Your next read
        is still waiting on our shelves.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-[#23452f] px-6 py-3 font-medium text-white hover:bg-[#193522]"
      >
        Back to Home
      </Link>
    </main>
  );
}