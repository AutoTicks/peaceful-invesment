import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DownloadSection from "@/components/DownloadSection";
import InstallGuide from "@/components/InstallGuide";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <InstallGuide />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
