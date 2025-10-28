import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import ProductsList from "./products-list"
import { AliExpressImport } from "@/components/aliexpress-import"

export const metadata = {
  title: "Manage Products | Admin",
  description: "Add, edit, and delete products",
}

export default async function ProductsManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) redirect("/")

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </div>
          </div>
          <Link href="/admin/products/new">
            <Button className="gap-2"><Plus size={16} />Add Product</Button>
          </Link>
        </div>
      </header>
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <AliExpressImport />
          </div>
          <ProductsList products={products || []} />
        </div>
      </main>
    </div>
  )
}
