import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { TrustSection } from "@/components/trust-section"
import { NewsletterCTA } from "@/components/newsletter-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <TrustSection />
      <NewsletterCTA />
      <Footer />
    </main>
  )
}
