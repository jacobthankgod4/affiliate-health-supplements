import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { LogOut, Package, Users, BarChart3, Plus, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Admin Dashboard | Health Vitals",
  description: "Manage products, users, and analytics",
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    redirect("/admin/login")
  }

  // Fetch dashboard stats
  const [productsResult, usersResult, subscribersResult, clicksResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
    supabase.from("affiliate_clicks").select("id", { count: "exact" }),
  ])

  const productCount = productsResult.count || 0
  const userCount = usersResult.count || 0
  const subscriberCount = subscribersResult.count || 0
  const totalClicks = clicksResult.count || 0

  // Fetch recent products
  const { data: recentProducts } = await supabase
    .from("products")
    .select("id, name, category, price, is_featured")
    .order("created_at", { ascending: false })
    .limit(5)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit" className="gap-2 bg-transparent">
              <LogOut size={16} />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount}</div>
                <p className="text-xs text-muted-foreground">Products in catalog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriberCount}</div>
                <p className="text-xs text-muted-foreground">Active subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affiliate Clicks</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClicks}</div>
                <p className="text-xs text-muted-foreground">Total tracked clicks</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Product Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Add, edit, or remove products</CardDescription>
                </div>
                <Link href="/admin/products">
                  <Button size="sm" className="gap-2">
                    <Plus size={16} />
                    Manage
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentProducts && recentProducts.length > 0 ? (
                    recentProducts.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No products yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View performance metrics</CardDescription>
                </div>
                <Link href="/admin/analytics">
                  <Button size="sm" className="gap-2">
                    <BarChart3 size={16} />
                    View
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Clicks</span>
                    <span className="font-bold">{totalClicks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Click Rate</span>
                    <span className="font-bold">{productCount > 0 ? (totalClicks / productCount).toFixed(1) : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Products</span>
                    <span className="font-bold">{productCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <Link href="/admin/products/new">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
