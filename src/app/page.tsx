import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import HeroBanner from "@/components/home/HeroBanner";
import NewArrivals from "@/components/home/NewArrivals";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";
import ReadersNote from "@/components/home/ReadersNote";

export default function Home() {
  return (
    <main className="min-w-0 flex-1 bg-[#faf7ef] text-[#23452f]">
      <Suspense
        fallback={
          <div
            role="status"
            className="flex min-h-[550px] items-center justify-center gap-3"
          >
            <LoaderCircle
              className="size-6 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>Loading your next chapter…</span>
          </div>
        }
      >
        <HeroBanner />
      </Suspense>

      <NewArrivals />
      <HowBorrowingWorks />
      <ReadersNote />
    </main>
  );
}