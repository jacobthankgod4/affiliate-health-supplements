import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Heart, ShoppingCart, LogOut, User } from "lucide-react"

export const metadata = {
  title: "Dashboard | Health Vitals",
  description: "Your personal health dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()

  const { data: savedProducts } = await supabase
    .from("saved_products")
    .select("product_id, products(id, name, price, image_url, rating)")
    .eq("user_id", user.id)
    .limit(3)

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("id, quantity, products(id, name, price)")
    .eq("user_id", user.id)

  const cartTotal = cartItems?.reduce((sum, item: any) => sum + (item.products?.price || 0) * item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              Welcome back, {profile?.full_name}!
            </h1>
            <p className="text-lg text-muted-foreground">{user.email}</p>
          </div>
          <form
            action={async () => {
              "use server"
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect("/")
            }}
          >
            <Button variant="outline" type="submit" className="gap-2 bg-transparent">
              <LogOut size={16} />
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Your Profile
              </CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <Link href="/dashboard/profile" className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Shopping Cart Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Shopping Cart
              </CardTitle>
              <CardDescription>Items in your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Items</p>
                  <p className="text-2xl font-bold">{cartItems?.length || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <Link href="/cart" className="mt-4 block">
                <Button size="sm" className="w-full">
                  View Cart
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Newsletter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
              <CardDescription>Stay updated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You're subscribed to our newsletter and will receive updates about new products and health tips.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Products Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart size={20} />
                Saved Products
              </CardTitle>
              <CardDescription>Your favorite supplements</CardDescription>
            </div>
            <Link href="/dashboard/saved-products">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {savedProducts && savedProducts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {savedProducts.map((item: any) => (
                  <div
                    key={item.product_id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition"
                  >
                    <h3 className="font-semibold mb-2">{item.products?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">${item.products?.price}</p>
                    {item.products?.rating && (
                      <p className="text-xs text-muted-foreground mb-3">Rating: {item.products.rating}</p>
                    )}
                    <Link href={`/products/${item.product_id}`}>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        View Product
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No saved products yet</p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
