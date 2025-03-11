import HeroSection from "@/components/HeroSection";
import LearnFromBestSection from "@/components/LearnFromBestSection";
import MediaFeaturesSection from "@/components/MediaFeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqIntroSection from "@/components/FaqIntroSection";
import FaqSection from "@/components/FaqSection";
import FooterFormSection from "@/components/FooterFormSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LearnFromBestSection />
      <MediaFeaturesSection />
      <TestimonialsSection />
      <FaqIntroSection />
      <FaqSection />
      <FooterFormSection />
      <Footer />
    </>
  );
}
