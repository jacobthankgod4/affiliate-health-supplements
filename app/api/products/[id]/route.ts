import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Force admin access for jacob@waidemobility.org during testing
  if (user.email !== 'jacob@waidemobility.org') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { name, description, category, price, affiliate_link, image_url, rating, review_count, is_featured } =
    await request.json()

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      category,
      price,
      affiliate_link,
      image_url,
      rating,
      review_count,
      is_featured,
    })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Force admin access for jacob@waidemobility.org during testing
  if (user.email !== 'jacob@waidemobility.org') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
