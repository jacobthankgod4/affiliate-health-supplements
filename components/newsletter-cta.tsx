import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NewsletterCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-primary/5 border-y border-border">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Get Expert Health Tips Weekly</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Subscribe to our newsletter for science-backed supplement recommendations, wellness tips, and exclusive
          offers.
        </p>
        <Link href="/newsletter-signup">
          <Button size="lg">Subscribe Now</Button>
        </Link>
      </div>
    </section>
  )
}
