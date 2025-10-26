import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { productId } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if already saved
    const { data: existingSave } = await supabase
      .from("saved_products")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existingSave) {
      // Remove from saved
      const { error: deleteError } = await supabase.from("saved_products").delete().eq("id", existingSave.id)

      if (deleteError) throw deleteError
      return NextResponse.json({ saved: false })
    } else {
      // Add to saved
      const { error: insertError } = await supabase
        .from("saved_products")
        .insert([{ user_id: user.id, product_id: productId }])

      if (insertError) throw insertError
      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error("Save product error:", error)
    return NextResponse.json({ error: "Failed to toggle saved product" }, { status: 500 })
  }
}
