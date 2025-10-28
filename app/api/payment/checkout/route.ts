import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo } = await request.json()
    
    if (!items?.length || !customerInfo) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    
    // 2Checkout integration
    const checkoutData = {
      merchant: process.env.TWOCHECKOUT_MERCHANT_CODE,
      'tco-currency': 'USD',
      'tco-amount': total.toFixed(2),
      'return-url': `${request.nextUrl.origin}/payment/success`,
      'cancel-url': `${request.nextUrl.origin}/payment/cancel`,
      ...customerInfo,
      ...items.reduce((acc: any, item: any, index: number) => ({
        ...acc,
        [`c_prod_${index + 1}`]: item.name,
        [`c_price_${index + 1}`]: item.price,
        [`c_qty_${index + 1}`]: item.quantity,
      }), {})
    }

    // Save order to database
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('orders').insert({
        user_id: user.id,
        items: JSON.stringify(items),
        total_amount: total,
        status: 'pending',
        payment_provider: '2checkout'
      })
    }

    return NextResponse.json({
      checkoutUrl: 'https://sandbox.2checkout.com/checkout/purchase',
      formData: checkoutData
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}