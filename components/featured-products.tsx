import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Nootropic Stack",
    category: "Nootropics",
    price: "$49.99",
    rating: 4.8,
    reviews: 324,
    description: "Enhanced cognitive function and mental clarity",
    image: "🧠",
  },
  {
    id: 2,
    name: "Whey Protein Isolate",
    category: "Proteins",
    price: "$39.99",
    rating: 4.9,
    reviews: 512,
    description: "Pure, fast-absorbing muscle recovery",
    image: "💪",
  },
  {
    id: 3,
    name: "Complete Vitamin Complex",
    category: "Vitamins",
    price: "$29.99",
    rating: 4.7,
    reviews: 287,
    description: "Daily nutritional support and immunity boost",
    image: "🌿",
  },
]

export function FeaturedProducts() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked supplements trusted by thousands of health-conscious individuals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{product.image}</div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {product.category}
                  </span>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{product.price}</div>
                </div>
                <Link href="/products" className="mt-4">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
