"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface CheckoutProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export function PaymentCheckout({ items }: CheckoutProps) {
  const [customerInfo, setCustomerInfo] = useState({
    'first-name': '',
    'last-name': '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerInfo })
      })
      
      const data = await response.json()
      if (data.checkoutUrl) {
        // Create form and submit to 2Checkout
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.checkoutUrl
        
        Object.entries(data.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value as string
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout - ${total.toFixed(2)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={customerInfo['first-name']}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, 'first-name': e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={customerInfo['last-name']}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, 'last-name': e.target.value }))}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <Button onClick={handleCheckout} disabled={isProcessing} className="w-full">
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Pay ${total.toFixed(2)} with 2Checkout
        </Button>
      </CardContent>
    </Card>
  )
}