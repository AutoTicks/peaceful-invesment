import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingServices from "@/components/landing/LandingServices";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      <LandingHero />
      <LandingFeatures />
      <LandingServices />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingCTA />
      <Footer />
    </div>
  );
};

export default Index;