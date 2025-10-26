import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, Zap, Share2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Affiliate Dashboard",
  description: "Track your affiliate performance and earnings",
}

export default async function AffiliateDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's affiliate clicks
  const { data: userClicks } = await supabase
    .from("affiliate_clicks")
    .select("id, product_id, created_at, conversion, revenue, products(id, name, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch products for reference
  const { data: products } = await supabase.from("products").select("id, name, category, price")

  // Calculate stats
  const totalClicks = userClicks?.length || 0
  const totalConversions = userClicks?.filter((c: any) => c.conversion).length || 0
  const totalRevenue = userClicks?.reduce((sum: number, c: any) => sum + (c.revenue || 0), 0) || 0
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0"

  // Group clicks by product
  const clicksByProduct: Record<string, { count: number; conversions: number; revenue: number }> = {}
  userClicks?.forEach((click: any) => {
    const productId = click.product_id
    if (!clicksByProduct[productId]) {
      clicksByProduct[productId] = { count: 0, conversions: 0, revenue: 0 }
    }
    clicksByProduct[productId].count++
    if (click.conversion) clicksByProduct[productId].conversions++
    if (click.revenue) clicksByProduct[productId].revenue += click.revenue
  })

  const topProducts = Object.entries(clicksByProduct)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([productId, stats]) => {
      const product = products?.find((p: any) => p.id === productId)
      return { product, ...stats }
    })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Affiliate Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your referral performance and earnings</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap size={16} />
                  Total Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalClicks}</div>
                <p className="text-xs text-muted-foreground">Affiliate link clicks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp size={16} />
                  Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalConversions}</div>
                <p className="text-xs text-muted-foreground">{conversionRate}% conversion rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={16} />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total commission</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Share2 size={16} />
                  Avg. Per Click
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${totalClicks > 0 ? (totalRevenue / totalClicks).toFixed(2) : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Revenue per click</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Your Top Products
              </CardTitle>
              <CardDescription>Products with the most clicks from your referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map(({ product, count, conversions, revenue }, index) => (
                    <div
                      key={product?.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</div>
                        <div>
                          <p className="font-semibold">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">{product?.category}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-8 text-right">
                        <div>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{conversions}</p>
                          <p className="text-xs text-muted-foreground">conversions</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">${revenue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">earnings</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No referral data yet. Start sharing products!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Your latest affiliate clicks and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userClicks && userClicks.length > 0 ? (
                  userClicks.slice(0, 10).map((click: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                      <div>
                        <p className="font-medium">{click.products?.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(click.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-4">
                        {click.conversion && (
                          <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                            Converted
                          </span>
                        )}
                        {click.revenue && <span className="text-sm font-semibold">${click.revenue.toFixed(2)}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No referrals yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
