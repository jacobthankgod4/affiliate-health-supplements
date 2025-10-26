export function generateUTMParams(productId: string, source = "health-vitals") {
  const timestamp = Date.now()
  return {
    utm_source: source,
    utm_medium: "affiliate",
    utm_campaign: `product_${productId}`,
    utm_content: `click_${timestamp}`,
  }
}

export function buildAffiliateLink(baseLink: string, productId: string, userId?: string): string {
  const params = generateUTMParams(productId)
  const url = new URL(baseLink)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  if (userId) {
    url.searchParams.append("ref", userId)
  }

  return url.toString()
}
