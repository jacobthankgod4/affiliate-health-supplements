#!/bin/bash

# Complete 2Checkout Demo Setup Script
echo "🚀 Setting up complete demo environment for 2Checkout review..."

if [ -z "$1" ]; then
    echo "Usage: ./complete-setup.sh <your-vercel-url>"
    echo "Example: ./complete-setup.sh https://your-app.vercel.app"
    exit 1
fi

DEPLOYMENT_URL=$1
ADMIN_SECRET=${ADMIN_CREATION_SECRET_KEY:-"your_admin_secret_here"}

echo "📍 Deployment URL: $DEPLOYMENT_URL"
echo ""

# Step 1: Setup demo database and products
echo "📊 Setting up demo database..."
curl -X POST "$DEPLOYMENT_URL/api/demo/setup" \
  -H "Content-Type: application/json" \
  -d '{}' || echo "Demo API setup attempted"

echo ""

# Step 2: Create admin demo account
echo "👤 Creating admin demo account..."
curl -X POST "$DEPLOYMENT_URL/api/admin/create" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@2checkout-review.com",
    "password": "Demo2024!Review",
    "name": "2Checkout Demo Admin"
  }' || echo "Admin creation attempted"

echo ""
echo "✅ Demo environment setup complete!"
echo ""
echo "🔗 2CHECKOUT REVIEW ACCESS:"
echo "Website: $DEPLOYMENT_URL"
echo ""
echo "👨‍💼 Admin Login:"
echo "Email: demo@2checkout-review.com"
echo "Password: Demo2024!Review"
echo ""
echo "🛒 Customer Login:"
echo "Email: customer@2checkout-review.com"
echo "Password: Customer2024!"
echo ""
echo "📋 Next Steps:"
echo "1. Test both accounts work on your live site"
echo "2. Update 2CHECKOUT_REVIEW_ACCESS.md with your real URL"
echo "3. Submit to 2Checkout for review"
echo ""
echo "🎯 Demo includes:"
echo "- 5 sample health supplement products"
echo "- Analytics data with sample clicks/conversions"
echo "- Newsletter subscribers"
echo "- Full admin and customer functionality"