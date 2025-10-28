import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Create customer demo account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'customer@2checkout-review.com',
      password: 'Customer2024!',
      options: {
        data: {
          full_name: '2Checkout Demo Customer'
        }
      }
    })

    if (authError && !authError.message.includes('already registered')) {
      throw authError
    }

    // Add demo products
    const demoProducts = [
      {
        name: 'Premium Omega-3 Fish Oil',
        price: 29.99,
        category: 'Vitamins',
        description: 'High-quality omega-3 supplement for heart and brain health',
        image_url: '/placeholder.jpg',
        affiliate_url: 'https://example.com/omega3'
      },
      {
        name: 'Whey Protein Powder',
        price: 49.99,
        category: 'Proteins',
        description: 'Premium whey protein for muscle building and recovery',
        image_url: '/placeholder.jpg',
        affiliate_url: 'https://example.com/protein'
      },
      {
        name: 'Brain Boost Nootropic',
        price: 39.99,
        category: 'Nootropics',
        description: 'Advanced cognitive enhancement supplement',
        image_url: '/placeholder.jpg',
        affiliate_url: 'https://example.com/nootropic'
      }
    ]

    await supabase.from('products').upsert(demoProducts, { onConflict: 'name' })

    return NextResponse.json({
      success: true,
      message: 'Demo environment ready for 2Checkout review',
      accounts: {
        admin: 'demo@2checkout-review.com',
        customer: 'customer@2checkout-review.com'
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Demo setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}