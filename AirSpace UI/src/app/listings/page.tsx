"use client";

import { ListingsGrid } from "@/components/Listings/ListingsGrid";
import { Suspense } from "react";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-darkmode">
      <div className="container mx-auto lg:max-w-screen-xl px-4 py-32">
        <h1 className="text-white sm:text-40 text-30 font-medium mb-12 pt-8">
          Available Air Rights Listings
        </h1>
        <Suspense fallback={<div className="text-white text-center py-20">Loading listings...</div>}>
          <ListingsGrid />
        </Suspense>
      </div>
    </main>
  );
} 