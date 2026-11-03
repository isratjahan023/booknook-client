"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

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

  return (
    <header className="border-b border-[#23452f]/10 bg-[#faf7ef] text-[#23452f]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="BookNook home"
          className="flex items-center gap-2.5"
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
          className="hidden items-center gap-9 md:flex"
        >
          {links.map(({ label, href }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);

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

        <div className="hidden items-center gap-3 md:flex">
          {authLinks}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex size-11 items-center justify-center rounded-md hover:bg-[#e8ebdf] md:hidden"
        >
          {isOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="space-y-2 border-t border-[#23452f]/10 px-5 py-5 md:hidden"
        >
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="block rounded-md px-3 py-3 text-sm font-medium hover:bg-[#e8ebdf]"
            >
              {label}
            </Link>
          ))}

          <div className="flex gap-3 pt-3">{authLinks}</div>
        </nav>
      )}
    </header>
  );
}