"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Search } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  affiliate_link: string
  image_url?: string
  rating?: number
  review_count?: number
  is_featured?: boolean
}

interface ProductCatalogProps {
  initialProducts: Product[]
}

const CATEGORIES = ["All", "Nootropics", "Proteins", "Vitamins"]

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [initialProducts, searchQuery, selectedCategory])

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Our Premium Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover scientifically-formulated supplements designed to optimize your health and performance. Each
            product is carefully selected for quality, efficacy, and purity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {initialProducts.length} products
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const handleAffiliateClick = async () => {
    try {
      await fetch("/api/affiliate/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }

    window.open(product.affiliate_link, "_blank")
  }

  const categoryEmojis: Record<string, string> = {
    Nootropics: "🧠",
    Proteins: "💪",
    Vitamins: "🌿",
  }

  const emoji = categoryEmojis[product.category] || "💊"

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
      {product.image_url && (
        <button
          onClick={handleAffiliateClick}
          className="relative w-full h-48 bg-muted overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </button>
      )}

      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{emoji}</div>
          {product.is_featured && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Featured
            </span>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Category Badge */}
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {product.category}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating || 0) ? "fill-primary text-primary" : "text-muted"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</div>
        </div>

        <Button onClick={handleAffiliateClick} className="w-full mt-4">
          Buy Now
        </Button>
      </CardContent>
    </Card>
  )
}
