import FAQAccordion from "../../components/home/FAQAccordion";
import Footer from "../../components/Footer";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import WhySecrelo from "../../components/home/WhySecrelo";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <HowItWorks />
      <WhySecrelo />
      <FAQAccordion />
      <Footer />
    </div>
  );
}
