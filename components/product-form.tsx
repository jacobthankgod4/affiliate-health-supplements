"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface Product {
  id?: string
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

interface ProductFormProps {
  initialProduct?: Product
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialProduct?.image_url || null)
  const [formData, setFormData] = useState<Product>(
    initialProduct || {
      name: "",
      description: "",
      category: "Nootropics",
      price: 0,
      affiliate_link: "",
      image_url: "",
      rating: 4.5,
      review_count: 0,
      is_featured: false,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number.parseFloat(value)
            : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image_url: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = initialProduct?.id ? `/api/products/${initialProduct.id}` : "/api/products/create"
      const method = initialProduct?.id ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        alert("Error saving product")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error saving product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="mt-2 space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Product preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-lg hover:bg-destructive/90"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="Nootropics">Nootropics</option>
                <option value="Proteins">Proteins</option>
                <option value="Vitamins">Vitamins</option>
              </select>
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="review_count">Review Count</Label>
              <Input
                id="review_count"
                name="review_count"
                type="number"
                value={formData.review_count}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="affiliate_link">Affiliate Link</Label>
            <Input
              id="affiliate_link"
              name="affiliate_link"
              value={formData.affiliate_link}
              onChange={handleChange}
              placeholder="https://affiliate.example.com/product"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Mark as Featured Product
            </Label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {initialProduct?.id ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
