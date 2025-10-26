"use client"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number | null
}

export default function ProductsManagementClientPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          redirect("/admin/login")
          return
        }

        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

        if (!profile?.is_admin) {
          redirect("/admin/login")
          return
        }

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (productsError) {
          setError("Failed to fetch products.")
          console.error("Error fetching products:", productsError)
        } else {
          setProducts(productsData || [])
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
        if (response.ok) {
          setProducts(products.filter((product) => product.id !== id))
        } else {
          alert("Failed to delete product.")
        }
      } catch (err) {
        alert("An error occurred while deleting the product.")
        console.error("Error deleting product:", err)
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading products...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products from your catalog</p>
            </div>
          </div>
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus size={16} />
              Add Product
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">Category: {product.category}</span>
                          <span className="font-medium">${product.price}</span>
                          <span className="text-muted-foreground">Rating: {product.rating || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" onClick={() => console.log('Edit clicked for product:', product.id, 'URL:', `/admin/products/${product.id}/edit`)}>
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No products yet</p>
                  <Link href="/admin/products/new">
                    <Button>Add Your First Product</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
