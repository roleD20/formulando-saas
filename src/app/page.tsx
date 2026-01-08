import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { PartnersSection } from "@/components/landing/partners-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ToolsSection } from "@/components/landing/tools-section"
import { TeamworkSection } from "@/components/landing/teamwork-section"
import { ContentManagementSection } from "@/components/landing/content-management-section"
import { TemplatesSection } from "@/components/landing/templates-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PartnersSection />
      <StatsSection />
      <FeaturesSection />
      <ToolsSection />
      <TeamworkSection />
      <ContentManagementSection />
      <TemplatesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
