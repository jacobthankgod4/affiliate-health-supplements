import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCatalog } from "@/components/product-catalog"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Products | Health Vitals",
  description:
    "Browse our curated collection of premium health supplements including nootropics, proteins, and vitamins.",
}

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1">
        <ProductCatalog initialProducts={products || []} />
      </div>
      <Footer />
    </main>
  )
}
