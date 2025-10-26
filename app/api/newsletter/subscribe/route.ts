import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json()

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid email provided" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.status === "subscribed") {
        return NextResponse.json({ message: "This email is already subscribed" }, { status: 409 })
      }

      // Resubscribe if previously unsubscribed
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "subscribed", updated_at: new Date().toISOString() })
        .eq("email", email)

      if (updateError) {
        console.error("Error resubscribing:", updateError)
        return NextResponse.json({ message: "Failed to resubscribe. Please try again." }, { status: 500 })
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
        email,
        status: "subscribed",
      })

      if (insertError) {
        console.error("Error inserting subscriber:", insertError)
        return NextResponse.json({ message: "Failed to subscribe. Please try again." }, { status: 500 })
      }
    }

    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 201 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ message: "An error occurred. Please try again later." }, { status: 500 })
  }
}
