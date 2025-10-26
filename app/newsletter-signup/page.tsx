import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsletterForm } from "@/components/newsletter-form"

export const metadata = {
  title: "Subscribe to Our Newsletter | Health Vitals",
  description: "Get weekly health tips, supplement recommendations, and exclusive offers delivered to your inbox.",
}

export default function NewsletterSignupPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Join Our Community</h1>
            <p className="text-lg text-muted-foreground">
              Get science-backed health tips, supplement recommendations, and exclusive offers delivered weekly.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
