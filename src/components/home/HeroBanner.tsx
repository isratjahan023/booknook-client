"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "YOUR COMMUNITY LIBRARY",
    title: "Meet your",
    emphasis: "next read.",
    description:
      "A quiet escape. A fresh perspective. A story that stays with you. Find your next favorite on our community bookshelf.",
    image: "/images/hero-reader.png",
    imageAlt: "A smiling reader enjoying an open green book",
    label: "A little escape",
    note: "One good book can change your whole day.",
    background: "#e3e9d8",
    accent: "#b5c39a",
  },
  {
    eyebrow: "A LITTLE CURIOSITY GOES A LONG WAY",
    title: "Follow your",
    emphasis: "curiosity.",
    description:
      "From imagined worlds to remarkable discoveries, explore books that give you something new to think about.",
    image: "/images/hero-discover.png",
    imageAlt: "A reader choosing a green book from a bookshelf",
    label: "Something to discover",
    note: "Your next chapter might surprise you.",
    background: "#eee3d3",
    accent: "#cdb28e",
  },
  {
    eyebrow: "GOOD STORIES BRING US TOGETHER",
    title: "Great stories.",
    emphasis: "Better shared.",
    description:
      "Borrow a book, enjoy every chapter, then return it for the next reader. Give the stories you love another life.",
    image: "/images/hero-share.png",
    imageAlt: "A smiling reader holding three books against her chest",
    label: "Pass the story on",
    note: "A shared bookshelf. A world of possibilities.",
    background: "#e5e8dd",
    accent: "#afbea3",
  },
];

export default function HeroBanner() {
  return (
    <section
      aria-label="Discover BookNook"
      className="overflow-hidden border-b border-[#23452f]/10 bg-[#faf7ef] text-[#23452f]"
    >
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        rewind
        speed={650}
        a11y={{
          prevSlideMessage: "Previous story",
          nextSlideMessage: "Next story",
          paginationBulletMessage: "Go to story {{index}}",
        }}
        className="booknook-hero-v2"
      >
        {slides.map((slide, index) => {
          const Heading = index === 0 ? "h1" : "h2";

          return (
            <SwiperSlide key={slide.image}>
              <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-24 pt-10 sm:px-10 md:grid-cols-2 md:gap-6 md:pb-24 md:pt-12 lg:gap-12 lg:px-12">
                <div className="relative z-10 min-w-0 md:py-8">
                  <div className="mb-6 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-8 shrink-0 bg-[#9a7946]"
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#647151] sm:text-xs">
                      {slide.eyebrow}
                    </p>
                  </div>

                  <Heading className="font-serif text-[clamp(2.8rem,5.4vw,5.2rem)] font-medium leading-[1.04] tracking-tight">
                    <span className="block">{slide.title}</span>
                    <em className="mt-1 block text-[#627650]">
                      {slide.emphasis}
                    </em>
                  </Heading>

                  <p className="mt-6 max-w-[440px] text-base leading-8 text-[#66705e] lg:mt-8 lg:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-5 lg:mt-10">
                    <Link
                      href="/books"
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#23452f] px-7 py-3.5 text-sm font-semibold text-[#faf7ef] transition-colors hover:bg-[#193522] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#23452f]"
                    >
                      Browse Books
                      <ArrowUpRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>

                    <Link
                      href="/add-book"
                      className="inline-flex items-center gap-2 py-3 text-sm font-semibold text-[#23452f] underline-offset-4 hover:underline"
                    >
                      Share a book
                      <ArrowRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>

                  <div className="mt-9 flex items-center gap-4 text-xs text-[#75806a] lg:mt-12">
                    <span className="font-semibold tracking-[0.15em] text-[#23452f]">
                      0{index + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-12 bg-[#23452f]/20"
                    />
                    <span>Discover. Borrow. Share.</span>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[520px] min-w-0">
                  <div
                    className="relative isolate aspect-[5/6] overflow-hidden rounded-t-[46%] rounded-b-[24px]"
                    style={{ backgroundColor: slide.background }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-[6%] rounded-t-full rounded-b-[18px] border border-white/60"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute -right-12 top-1/3 size-60 rounded-full opacity-35 blur-3xl"
                      style={{ backgroundColor: slide.accent }}
                    />

                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1280px) 520px, (min-width: 768px) 45vw, 90vw"
                      className="object-contain object-bottom px-3 pt-7 sm:px-5"
                    />
                  </div>

                  <div className="relative z-10 mx-4 -mt-5 rounded-2xl border border-[#23452f]/10 bg-[#fffdf7] px-5 py-4 shadow-[0_12px_35px_-20px_rgba(35,69,47,0.35)] sm:mx-7">
                    <p className="font-serif text-lg font-semibold">
                      {slide.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#69735f]">
                      {slide.note}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .booknook-hero-v2 {
          --swiper-theme-color: #23452f;
          --swiper-navigation-size: 14px;
        }

        .booknook-hero-v2 .swiper-button-prev,
        .booknook-hero-v2 .swiper-button-next {
          top: auto;
          bottom: 20px;
          margin-top: 0;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(35, 69, 47, 0.2);
          border-radius: 50%;
          background: #faf7ef;
          color: #23452f;
          transition: background 180ms ease;
        }

        .booknook-hero-v2 .swiper-button-prev {
          left: 24px;
        }

        .booknook-hero-v2 .swiper-button-next {
          right: 24px;
        }

        .booknook-hero-v2 .swiper-button-prev:hover,
        .booknook-hero-v2 .swiper-button-next:hover {
          background: #e3e9d8;
        }

        .booknook-hero-v2 .swiper-button-prev svg,
        .booknook-hero-v2 .swiper-button-next svg {
          width: 14px;
          height: 14px;
        }

        .booknook-hero-v2 .swiper-pagination {
          bottom: 31px;
          left: 50%;
          width: auto;
          transform: translateX(-50%);
        }

        .booknook-hero-v2 .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          background: #23452f;
          opacity: 0.25;
          transition: width 180ms ease, opacity 180ms ease;
        }

        .booknook-hero-v2 .swiper-pagination-bullet-active {
          width: 25px;
          border-radius: 999px;
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .booknook-hero-v2 .swiper-wrapper {
            transition-duration: 0ms !important;
          }
        }
      `}</style>
    </section>
  );
}