import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'health'
    const limit = parseInt(searchParams.get('limit') || '20')

    // AliExpress API integration
    const aliexpressParams = {
      app_key: process.env.ALIEXPRESS_APP_KEY,
      method: 'aliexpress.affiliate.product.query',
      sign_method: 'md5',
      timestamp: Date.now().toString(),
      format: 'json',
      v: '2.0',
      category_ids: category === 'health' ? '66' : '1420',
      page_size: limit.toString(),
      fields: 'product_id,product_title,product_main_image_url,target_sale_price,commission_rate,sale_price'
    }

    // In production, implement proper AliExpress API signing
    const mockProducts = Array.from({ length: limit }, (_, i) => ({
      product_id: `ae_${Date.now()}_${i}`,
      product_title: `Health Supplement ${i + 1}`,
      product_main_image_url: '/placeholder.jpg',
      target_sale_price: (Math.random() * 50 + 10).toFixed(2),
      commission_rate: '0.05',
      sale_price: (Math.random() * 60 + 15).toFixed(2)
    }))

    // Sync to local database
    const supabase = await createClient()
    for (const product of mockProducts) {
      await supabase.from('products').upsert({
        id: product.product_id,
        name: product.product_title,
        price: parseFloat(product.target_sale_price),
        image_url: product.product_main_image_url,
        category: category,
        affiliate_url: `https://aliexpress.com/item/${product.product_id}`,
        source: 'aliexpress'
      }, { onConflict: 'id' })
    }

    return NextResponse.json({
      products: mockProducts,
      synced: true,
      source: 'aliexpress'
    })
  } catch (error) {
    console.error('AliExpress API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}