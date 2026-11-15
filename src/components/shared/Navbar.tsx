"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookOpen, Menu, X, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

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
  const headerRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const {
    data: session,
    isPending,
    error: sessionError,
  } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const user = session?.user;
  const links = user
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  function closeAccountMenus() {
    headerRef.current
      ?.querySelectorAll("details[open]")
      .forEach((details) => details.removeAttribute("open"));
  }

  function closeMenu() {
    closeAccountMenus();
    setIsOpen(false);
  }

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setError("");
    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError(result.error.message || "Could not log out.");
        return;
      }

      closeMenu();
      router.replace("/");
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
        })} rounded-full`}
      >
        Login
      </Link>

      <Link
        href="/register"
        onClick={closeMenu}
        className={`${buttonVariants()} rounded-full`}
      >
        Register
      </Link>
    </>
  );

  function renderAccount() {
    if (isPending) {
      return (
        <span
          role="status"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          Loading account...
        </span>
      );
    }

    if (sessionError) {
      return (
        <span
          role="alert"
          className="max-w-44 text-xs text-destructive"
        >
          Unable to load account. Refresh to retry.
        </span>
      );
    }

    if (!user) {
      return authLinks;
    }

    return (
      <details
        className="relative"
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;

          if (
            !nextTarget ||
            !event.currentTarget.contains(nextTarget as Node)
          ) {
            event.currentTarget.removeAttribute("open");
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();

            event.currentTarget.removeAttribute("open");
            event.currentTarget.querySelector("summary")?.focus();
          }
        }}
      >
        <summary className="flex cursor-pointer list-none items-center rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={`${user.name || "User"}'s profile`}
              referrerPolicy="no-referrer"
              width={40}
              height={40}
              className="size-10 rounded-full border border-border object-cover"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
          )}

          <span className="sr-only">Open account options</span>
        </summary>

        <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
          <div className="mb-2 border-b border-border px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Your account
            </p>

            <p className="mt-1 break-words text-sm font-semibold">
              {user.name || "Reader"}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <UserRound className="size-4" aria-hidden="true" />
            My Profile
          </Link>

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </details>
    );
  }

  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          closeMenu();
          mobileButtonRef.current?.focus();
        }
      }}
      className="relative z-40 border-b border-border bg-background text-foreground"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="BookNook home"
          className="flex shrink-0 items-center gap-2 sm:gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <BookOpen
              className="size-6"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>

          <span className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            BookNook
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {links.map(({ label, href }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {renderAccount()}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            ref={mobileButtonRef}
            type="button"
            onClick={() => {
              closeAccountMenus();
              setIsOpen((previous) => !previous);
            }}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {isOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-7xl px-5 pb-3 lg:px-8">
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        </div>
      )}

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!isOpen}
        className="border-t border-border px-4 py-4 sm:px-6 lg:hidden"
      >
        <div className="space-y-1">
          {links.map(({ label, href }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
          {renderAccount()}
        </div>
      </nav>
    </header>
  );
}