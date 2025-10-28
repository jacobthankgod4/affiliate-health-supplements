"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number | null
}

export default function ProductsList({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) setProducts(products.filter(p => p.id !== id))
    else alert("Failed to delete")
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Link href="/admin/products/new">
            <Button>Add Your First Product</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
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
                  <Button variant="outline" size="sm"><Edit2 size={16} /></Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
