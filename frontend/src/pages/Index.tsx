
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FeaturedProfiles from "@/components/FeaturedProfiles";
import WhyChooseUs from "@/components/WhyChooseUs";
import SuccessCounter from "@/components/SuccessCounter";
import TrustBadges from "@/components/TrustBadges";
import SuccessStoriesCarousel from "@/components/SuccessStoriesCarousel";
import QuickSignup from "@/components/QuickSignup";
import AppDownload from "@/components/AppDownload";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SearchSection />
      <FeaturedProfiles />
      <WhyChooseUs />
      <SuccessCounter />
      <TrustBadges />
      <SuccessStoriesCarousel />
      <QuickSignup />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Index;
