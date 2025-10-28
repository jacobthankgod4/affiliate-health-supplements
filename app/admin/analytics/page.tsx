import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, TrendingUp, BarChart3, Users, Zap, Upload } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Analytics | Admin",
  description: "View affiliate performance analytics",
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/admin/login")
  }

  // Fetch analytics data
  const { data: clicks } = await supabase
    .from("affiliate_clicks")
    .select("product_id, created_at, user_id, conversion, revenue")
    .order("created_at", { ascending: false })

  const { data: products } = await supabase.from("products").select("id, name, category")

  // Calculate stats
  const clicksByProduct: Record<string, { count: number; conversions: number; revenue: number }> = {}
  const clicksByDate: Record<string, number> = {}
  let totalConversions = 0
  let totalRevenue = 0

  clicks?.forEach((click: any) => {
    // By product
    if (!clicksByProduct[click.product_id]) {
      clicksByProduct[click.product_id] = { count: 0, conversions: 0, revenue: 0 }
    }
    clicksByProduct[click.product_id].count++
    if (click.conversion) {
      clicksByProduct[click.product_id].conversions++
      totalConversions++
    }
    if (click.revenue) {
      clicksByProduct[click.product_id].revenue += click.revenue
      totalRevenue += click.revenue
    }

    // By date
    const date = new Date(click.created_at).toLocaleDateString()
    clicksByDate[date] = (clicksByDate[date] || 0) + 1
  })

  const topProducts = Object.entries(clicksByProduct)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([productId, stats]) => {
      const product = products?.find((p: any) => p.id === productId)
      return { product, ...stats }
    })

  const conversionRate = clicks && clicks.length > 0 ? ((totalConversions / clicks.length) * 100).toFixed(2) : "0"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track affiliate performance and conversions</p>
          </div>
          <Button 
            onClick={async () => {
              await fetch('/api/sheets/sync', { method: 'POST', body: JSON.stringify({ type: 'analytics' }) })
              alert('Data synced to Google Sheets!')
            }}
            className="gap-2"
          >
            <Upload size={16} />
            Sync to Sheets
          </Button>
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
                <div className="text-3xl font-bold">{clicks?.length || 0}</div>
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
                  <BarChart3 size={16} />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total affiliate revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} />
                  Unique Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Object.keys(clicksByProduct).length}</div>
                <p className="text-xs text-muted-foreground">Products with clicks</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Top Performing Products
              </CardTitle>
              <CardDescription>Products ranked by click volume</CardDescription>
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
                          <p className="text-xs text-muted-foreground">revenue</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No click data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Clicks</CardTitle>
              <CardDescription>Latest affiliate link clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clicks && clicks.length > 0 ? (
                  clicks.slice(0, 10).map((click: any, index: number) => {
                    const product = products?.find((p: any) => p.id === click.product_id)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                        <div>
                          <p className="font-medium">{product?.name}</p>
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
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">No recent clicks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
