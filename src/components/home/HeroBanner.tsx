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
      className="border-b border-[#23452f]/15"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          rewind
          className="booknook-hero"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.eyebrow}>
              <div className="grid items-center gap-10 px-5 pt-10 pb-16 sm:px-12 lg:grid-cols-2 lg:gap-8 lg:pt-12">
                <div className="min-w-0">
                  <p className="mb-5 text-xs font-medium tracking-[0.2em] text-[#526448] uppercase">
                    {slide.eyebrow}
                  </p>

                  {index === 0 ? (
                    <h1 className="font-serif text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                      {slide.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <em className="block">{slide.ending}</em>
                    </h1>
                  ) : (
                    <h2 className="font-serif text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                      {slide.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <em className="block">{slide.ending}</em>
                    </h2>
                  )}

                  <p className="mt-6 max-w-md text-sm leading-7 text-[#637367] sm:text-base">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className={`${buttonVariants()} mt-7 h-11 gap-3 bg-[#23452f] px-6 text-[#faf7ef] hover:bg-[#193522]`}
                  >
                    Browse Books
                    <ArrowUpRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <div className="relative mx-auto w-full max-w-md self-end">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 top-8 rounded-t-full bg-[#35482d]"
                  />

                  <div className="relative aspect-square">
                    <Image
                      src="/images/hero-reader.png"
                      alt="A smiling reader enjoying an open book"
                      fill
                      sizes="(max-width: 1023px) 90vw, 448px"
                      className="object-contain object-bottom"
                    />
                  </div>

        
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}