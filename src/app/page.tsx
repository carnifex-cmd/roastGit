import { LandingHero } from "@/components/LandingHero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ExampleRoast } from "@/components/ExampleRoast";
import { FAQSection } from "@/components/FAQSection";
import { SecondaryCTA } from "@/components/SecondaryCTA";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingHero />
      <FeaturesSection />
      <HowItWorks />
      <ExampleRoast />
      <FAQSection />
      <SecondaryCTA />
      <Footer />
    </>
  );
}
