import React from "react";
import Hero from "@/components/Home/Hero";
import Work from "@/components/Home/work";
import Platform from "@/components/Home/platform";
import Portfolio from "@/components/Home/portfolio";
import Upgrade from "@/components/Home/upgrade";
import Perks from "@/components/Home/perks";
import AirRightPrices from "@/components/Home/AirRightPrices";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "CrypGo",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <AirRightPrices />
      <Portfolio />
      {/* <Work />
      <Upgrade />
      <Perks /> */}
    </main>
  );
}
