import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { type = 'analytics' } = await request.json()
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const supabase = await createClient()

    if (type === 'analytics') {
      const { data: analytics } = await supabase
        .from('affiliate_clicks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      const values = [
        ['Date', 'Product', 'Clicks', 'Conversions', 'Revenue'],
        ...analytics?.map(row => [
          new Date(row.created_at).toLocaleDateString(),
          row.product_name || 'Unknown',
          '1',
          row.converted ? '1' : '0',
          row.revenue || '0'
        ]) || []
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: 'Analytics!A1',
        valueInputOption: 'RAW',
        requestBody: { values }
      })
    }

    return NextResponse.json({ success: true, synced: type })
  } catch (error) {
    console.error('Sheets sync error:', error)
    return NextResponse.json({ error: 'Failed to sync with Google Sheets' }, { status: 500 })
  }
}