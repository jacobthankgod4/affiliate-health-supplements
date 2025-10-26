import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Optimize Your Health with Science-Backed Supplements
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Discover premium nootropics, proteins, and vitamins curated by experts. Every product is rigorously
                tested for quality and efficacy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/newsletter-signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Join Newsletter
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Science-backed formulations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Third-party tested</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 lg:h-full min-h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10 text-center px-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-3xl">💊</span>
              </div>
              <p className="text-muted-foreground">Premium Health Supplements</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
