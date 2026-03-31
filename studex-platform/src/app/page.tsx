import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import JensenStack from "@/components/sections/JensenStack";
import ProductOfferings from "@/components/sections/ProductOfferings";
import AIConsultants from "@/components/sections/AIConsultants";
import DevHub from "@/components/sections/DevHub";
import Footer from "@/components/sections/Footer";
import NeonRain from "@/components/sections/NeonRain";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-cyber-black overflow-hidden">
      <NeonRain />
      <Navbar />
      <Hero />
      <div id="stack">
        <JensenStack />
      </div>
      <div id="pricing">
        <ProductOfferings />
      </div>
      <div id="consultants">
        <AIConsultants />
      </div>
      <div id="devhub">
        <DevHub />
      </div>
      <Footer />
    </main>
  );
}
