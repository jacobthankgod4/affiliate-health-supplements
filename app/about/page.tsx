import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Target, Heart, Zap } from "lucide-react"

export const metadata = {
  title: "About Us | Health Vitals",
  description: "Learn about Health Vitals and our mission to optimize your health through premium supplements",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
            Optimize Your Health, Elevate Your Life
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            At Health Vitals, we believe that true wellness comes from informed choices and premium-quality supplements.
            We're dedicated to helping you unlock your full potential through science-backed nutrition.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                We're on a mission to democratize access to premium health supplements. Too many people settle for
                mediocre products or feel overwhelmed by conflicting information. We've changed that.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Every product we recommend has been rigorously vetted for quality, efficacy, and purity. We partner only
                with brands that share our commitment to your health and our values of transparency and excellence.
              </p>
              <div className="space-y-3">
                {[
                  "Science-backed formulations",
                  "Third-party tested products",
                  "Transparent sourcing",
                  "Customer-first approach",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8 text-center">
              <div className="text-6xl font-bold text-primary mb-4">50K+</div>
              <p className="text-lg text-muted-foreground mb-6">
                Health-conscious individuals have transformed their wellness journey with us
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Average customer satisfaction: 4.8/5</p>
                <p>Products recommended: 100+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Precision",
                description:
                  "Every recommendation is backed by scientific research and real-world results. We don't guess—we verify.",
              },
              {
                icon: Heart,
                title: "Integrity",
                description:
                  "Your health is our priority. We only recommend products we'd use ourselves and trust with our families.",
              },
              {
                icon: Zap,
                title: "Results",
                description:
                  "We measure success by your transformation. Our goal is to help you feel stronger, sharper, and more vital.",
              },
            ].map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} className="border-0 bg-background hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="text-primary mb-4" size={32} />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose Health Vitals?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Curated Selection",
                description:
                  "We've done the research so you don't have to. Every product is hand-selected from the best brands in the industry.",
              },
              {
                title: "Expert Guidance",
                description:
                  "Our team of nutrition experts and health professionals are here to answer your questions and guide your choices.",
              },
              {
                title: "Quality Assurance",
                description:
                  "All products are third-party tested for purity, potency, and safety. Your health deserves nothing less.",
              },
              {
                title: "Transparent Pricing",
                description:
                  "No hidden fees, no surprises. We believe in fair pricing and honest communication with our customers.",
              },
              {
                title: "Community Support",
                description:
                  "Join thousands of health-conscious individuals sharing their journeys, tips, and success stories.",
              },
              {
                title: "Satisfaction Guarantee",
                description:
                  "Not satisfied? We stand behind every recommendation. Your trust is our most valuable asset.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Transform Your Health?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our curated collection of premium supplements and start your wellness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/newsletter-signup">
              <Button size="lg" variant="outline">
                Join Our Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
