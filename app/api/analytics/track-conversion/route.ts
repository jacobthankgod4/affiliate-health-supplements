import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { clickId, revenue } = await request.json()

    const { error } = await supabase.from("affiliate_clicks").update({ conversion: true, revenue }).eq("id", clickId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Conversion tracking error:", error)
    return NextResponse.json({ error: "Failed to track conversion" }, { status: 500 })
  }
}
