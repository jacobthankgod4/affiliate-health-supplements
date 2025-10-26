import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/product-form"

export const metadata = {
  title: "Edit Product | Admin",
  description: "Edit product details",
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Force admin access for jacob@waidemobility.org during testing
  if (user.email !== 'jacob@waidemobility.org') {
    redirect("/")
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
    redirect("/admin/products")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Edit Product</h1>
          <ProductForm initialProduct={product} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
