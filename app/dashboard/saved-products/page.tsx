import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"

export const metadata = {
  title: "Saved Products | Dashboard",
  description: "Your saved favorite products",
}

export default async function SavedProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: savedProducts } = await supabase
    .from("saved_products")
    .select("id, product_id, products(id, name, description, price, image_url, rating, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-2">
            <Heart size={32} />
            Saved Products
          </h1>
          <p className="text-lg text-muted-foreground">Your favorite supplements and health products</p>
        </div>

        {savedProducts && savedProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((item: any) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition">
                {item.products?.image_url && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{item.products?.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.products?.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${item.products?.price}</span>
                    {item.products?.rating && (
                      <span className="text-sm text-muted-foreground">Rating: {item.products.rating}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/products/${item.product_id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Product
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Saved Products</h2>
              <p className="text-muted-foreground mb-6">Start saving your favorite products to view them here</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
