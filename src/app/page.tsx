"use cache";

import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { CreateCountdownForm } from "@/components/create-countdown-form";

export default async function HomePage() {
  cacheLife("max");
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Count down to what matters
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create a countdown, get a shareable link, and watch time fly together.
        </p>
      </div>
      <Suspense fallback={<div className="h-[400px] w-full max-w-lg" />}>
        <CreateCountdownForm />
      </Suspense>
    </div>
  );
}
