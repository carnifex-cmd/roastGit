import dynamic from "next/dynamic";
import { LandingHero } from "@/components/LandingHero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SEODescription } from "@/components/SEODescription";
import { HowItWorks } from "@/components/HowItWorks";
import { ExampleRoast } from "@/components/ExampleRoast";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HomeJsonLd } from "@/components/JsonLd";

const FAQSection = dynamic(
  () => import("@/components/FAQSection").then((mod) => mod.FAQSection),
  { ssr: true }
);

const SecondaryCTA = dynamic(
  () => import("@/components/SecondaryCTA").then((mod) => mod.SecondaryCTA),
  { ssr: true }
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <LandingHero />
        <SEODescription />
        <FeaturesSection />
        <HowItWorks />
        <ExampleRoast />
        <FAQSection />
        <SecondaryCTA />
      </main>
      <Footer />
      <HomeJsonLd />
    </>
  );
}

