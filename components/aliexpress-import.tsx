"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download } from 'lucide-react'

export function AliExpressImport() {
  const [category, setCategory] = useState('health')
  const [limit, setLimit] = useState(20)
  const [isImporting, setIsImporting] = useState(false)
  const [lastImport, setLastImport] = useState<any>(null)

  const importProducts = async () => {
    setIsImporting(true)
    try {
      const response = await fetch(`/api/aliexpress/products?category=${category}&limit=${limit}`)
      const data = await response.json()
      
      if (data.products) {
        setLastImport(data)
        alert(`Imported ${data.products.length} products from AliExpress`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import products')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download size={20} />
          AliExpress Product Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="health">Health & Beauty</option>
            <option value="sports">Sports & Entertainment</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        <div>
          <Label htmlFor="limit">Number of Products</Label>
          <Input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
            min="1"
            max="100"
          />
        </div>

        <Button onClick={importProducts} disabled={isImporting} className="w-full">
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Importing...
            </>
          ) : (
            'Import Products'
          )}
        </Button>

        {lastImport && (
          <div className="text-sm text-muted-foreground">
            Last import: {lastImport.products.length} products from {lastImport.source}
          </div>
        )}
      </CardContent>
    </Card>
  )
}