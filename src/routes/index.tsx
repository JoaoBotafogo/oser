import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Fleet } from "@/components/landing/Fleet";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Technology } from "@/components/landing/Technology";
import { Security } from "@/components/landing/Security";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OSER | Mobilidade executiva e transporte para eventos" },
      {
        name: "description",
        content:
          "Transporte executivo, traslados de aeroporto e eventos com motoristas profissionais, frota premium e acompanhamento em tempo real.",
      },
      { property: "og:title", content: "OSER | Mobilidade executiva no seu ritmo" },
      {
        property: "og:description",
        content:
          "Transporte executivo, eventos e deslocamentos com conforto, segurança e gestão inteligente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <Fleet />
        <HowItWorks />
        <Technology />
        <Security />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
