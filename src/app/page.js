import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QRCreatorDemo from "@/components/landing/QRCreatorDemo";
import QRTypes from "@/components/landing/QRTypes";
import DesignFeatures from "@/components/landing/DesignFeatures";
import DynamicQR from "@/components/landing/DynamicQR";
import Analytics from "@/components/landing/Analytics";
import Templates from "@/components/landing/Templates";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <QRCreatorDemo />
      <QRTypes />
      <DesignFeatures />
      <DynamicQR />
      <Analytics />
      <Templates />
      <UseCases />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
