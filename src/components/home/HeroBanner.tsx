"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonVariants } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "Your community library",
    lines: ["A new chapter.", "A little escape."],
    ending: "All yours.",
    description:
      "Find a story to get lost in. Borrow a book, share a favorite, and make room for your next chapter.",
  },
  {
    eyebrow: "Follow your curiosity",
    lines: ["Big questions.", "Fresh perspectives."],
    ending: "Start here.",
    description:
      "Explore science, travel through history, or discover a world of fiction. Your next read is waiting.",
  },
  {
    eyebrow: "Good stories bring us together",
    lines: ["Borrow a book.", "Find a new world."],
    ending: "Pass it on.",
    description:
      "Enjoy a book for a little while, then return it for another reader to discover. Keep the stories moving.",
  },
];

export default function HeroBanner() {
  return (
    <section
      aria-label="Discover BookNook"
      className="relative isolate overflow-hidden border-b border-[#23452f]/15 bg-[#faf7ef] text-[#23452f]"
    >
      {/* Full-width background on every screen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <Image
          src="/images/hero-bookshelf.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Extra softness on smaller screens */}
        <div className="absolute inset-0 bg-[#faf7ef]/40 lg:bg-transparent" />
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        rewind
        className="booknook-hero relative z-10 w-full min-w-0"
      >
        {slides.map((slide, index) => {
          const Heading = index === 0 ? "h1" : "h2";

          return (
            <SwiperSlide key={slide.eyebrow}>
              <div className="mx-auto grid w-full max-w-[1600px] min-w-0 items-center gap-8 px-12 pt-10 pb-14 sm:px-16 md:grid-cols-[48%_52%] md:gap-0 md:pt-6 md:pb-12 lg:px-20">
                {/* Text */}
                <div className="relative z-20 min-w-0 py-4 md:pr-4 lg:py-12 lg:pr-8">
                  <p className="mb-5 text-xs font-medium tracking-[0.16em] text-[#405444] uppercase">
                    {slide.eyebrow}
                  </p>

                  <Heading className="font-serif text-[clamp(2.5rem,4.8vw,5.5rem)] leading-[1.05] font-semibold tracking-tight">
                    {slide.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}

                    <em className="block">{slide.ending}</em>
                  </Heading>

                  <p className="mt-6 max-w-md text-sm leading-7 text-[#405444] lg:text-base">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className={`${buttonVariants()} mt-7 h-12 gap-3 bg-[#23452f]! px-6 text-[#faf7ef]! hover:bg-[#193522]!`}
                  >
                    Browse Books
                    <ArrowUpRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* Reader and responsive green backdrop */}
                <div className="relative mx-auto aspect-square w-full max-w-[520px] self-end md:max-w-none md:aspect-[1/1.12]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[2%] bottom-0 top-[8%] rounded-t-full bg-[#aeb98e]/80"
                  />

                  <Image
                    src="/images/hero-reader.png"
                    alt="A smiling reader enjoying an open book"
                    fill
                    sizes="(min-width: 1600px) 750px, (min-width: 768px) 52vw, 90vw"
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}