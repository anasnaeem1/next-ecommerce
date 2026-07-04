
import AboutHero from "../../components/About/AboutHero";
import BrandStory from "../../components/About/BrandStory";
import StatsSection from "../../components/About/StatsSection";
import WhyChooseUs from "../../components/About/WhyChooseUs";
import ValuesSection from "../../components/About/ValuesSection";
import AboutCTA from "../../components/About/AboutCTA";

export default function AboutPage() {
  return (
    <main className="bg-[#FAF9F7]">
      <AboutHero />
      <BrandStory />
      <StatsSection />
      <WhyChooseUs />
      <ValuesSection />
      <AboutCTA />
    </main>
  );
}
