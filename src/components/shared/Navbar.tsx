"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Menu, X, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

const privateLinks = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending, error: sessionError } =
    authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const user = session?.user;
  const links = user
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  function closeMenu() {
    setIsOpen(false);
  }

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    setError("");
    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError(result.error.message || "Could not log out.");
        return;
      }

      closeMenu();
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const authLinks = (
    <>
      <Link
        href="/login"
        onClick={closeMenu}
        className={`${buttonVariants({
          variant: "outline",
        })} border-[#23452f] bg-transparent text-[#23452f] hover:bg-[#e8ebdf]`}
      >
        Login
      </Link>

      <Link
        href="/register"
        onClick={closeMenu}
        className={`${buttonVariants()} bg-[#23452f] text-[#faf7ef] hover:bg-[#193522]`}
      >
        Register
      </Link>
    </>
  );

  function renderAccount() {
    if (isPending) {
      return (
        <span role="status" className="text-sm">
          Loading account...
        </span>
      );
    }

    if (sessionError) {
      return (
        <span role="alert" className="text-sm text-red-700">
          Unable to load account. Refresh to retry.
        </span>
      );
    }

    if (!user) {
      return authLinks;
    }

    return (
      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#23452f] [&::-webkit-details-marker]:hidden">
          {user.image ? (
            // Profile URLs can use different image hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={`${user.name}'s profile`}
              referrerPolicy="no-referrer"
              className="size-10 rounded-full border border-[#23452f]/20 object-cover"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-[#e8ebdf]">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
          )}
          <span className="sr-only">Open account menu</span>
        </summary>

        <div className="absolute right-0 z-50 mt-3 w-60 rounded-xl border border-[#23452f]/15 bg-[#faf7ef] p-3 shadow-lg">
          <p className="break-words px-3 py-2 font-semibold">
            {user.name}
          </p>

          <Link
            href="/profile"
            onClick={(event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              closeMenu();
            }}
            className="block rounded-md px-3 py-2 text-sm hover:bg-[#e8ebdf]"
          >
            My Profile
          </Link>

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </details>
    );
  }

  return (
    <header className="relative z-40 border-b border-[#23452f]/10 bg-[#faf7ef] text-[#23452f]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="BookNook home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <BookOpen
            className="size-9"
            strokeWidth={1.4}
            aria-hidden="true"
          />
          <span className="font-serif text-3xl font-semibold tracking-tight">
            BookNook
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex"
        >
          {links.map(({ label, href }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-[#b58a45]"
                    : "border-transparent hover:border-[#b58a45]/50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {renderAccount()}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex size-11 items-center justify-center rounded-md hover:bg-[#e8ebdf] lg:hidden"
        >
          {isOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="px-5 pb-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="space-y-2 border-t border-[#23452f]/10 px-5 py-5 lg:hidden"
        >
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              aria-current={isActive(href) ? "page" : undefined}
              className={`block rounded-md px-3 py-3 text-sm font-medium hover:bg-[#e8ebdf] ${
                isActive(href) ? "bg-[#e8ebdf]" : ""
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="flex justify-end gap-3 pt-3">
            {renderAccount()}
          </div>
        </nav>
      )}
    </header>
  );
}