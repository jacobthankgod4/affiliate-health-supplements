import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user (optional - for authenticated tracking)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("affiliate_clicks").insert({
      product_id: productId,
      user_id: user?.id || null,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    })

    if (error) {
      console.error("Error tracking click:", error)
      // Don't fail the request - just log the error
      return NextResponse.json({ message: "Click tracked" }, { status: 200 })
    }

    return NextResponse.json({ message: "Click tracked" }, { status: 200 })
  } catch (error) {
    console.error("Affiliate tracking error:", error)
    return NextResponse.json({ message: "Click tracked" }, { status: 200 })
  }
}
