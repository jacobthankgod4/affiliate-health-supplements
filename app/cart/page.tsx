"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Trash2, Loader2, ShoppingCart } from "lucide-react"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadCart = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase
          .from("cart_items")
          .select("id, quantity, products(id, name, price, image_url)")
          .eq("user_id", user.id)

        if (error) throw error
        setCartItems(data || [])
      } catch (error) {
        console.error("Failed to load cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [supabase, router])

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", cartItemId)

      if (error) throw error

      setCartItems(cartItems.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (cartItemId: string) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

      if (error) throw error

      setCartItems(cartItems.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/products">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft size={16} />
            Continue Shopping
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-2">
            <ShoppingCart size={32} />
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {item.products?.image_url && (
                        <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.products.image_url || "/placeholder.svg"}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.products?.name}</h3>
                        <p className="text-2xl font-bold mb-4">${item.products?.price}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              disabled={isUpdating}
                              className="w-16 text-center bg-muted/50"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="ml-auto"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(cartTotal * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
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
