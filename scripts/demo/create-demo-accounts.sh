#!/bin/bash

# 2Checkout Demo Accounts Setup Script
echo "Creating demo accounts for 2Checkout review..."

# Get the deployment URL
if [ -z "$1" ]; then
    echo "Usage: ./create-demo-accounts.sh <your-vercel-url>"
    echo "Example: ./create-demo-accounts.sh https://your-app.vercel.app"
    exit 1
fi

DEPLOYMENT_URL=$1
ADMIN_SECRET=${ADMIN_CREATION_SECRET_KEY:-"your_admin_secret_here"}

echo "Deployment URL: $DEPLOYMENT_URL"

# Create admin demo account
echo "Creating admin demo account..."
curl -X POST "$DEPLOYMENT_URL/api/admin/create" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@2checkout-review.com",
    "password": "Demo2024!Review",
    "name": "2Checkout Demo Admin"
  }'

echo ""
echo "Admin account created successfully!"
echo ""

# Note: Customer account will be created through normal signup
echo "Customer demo account should be created through the signup page:"
echo "Email: customer@2checkout-review.com"
echo "Password: Customer2024!"
echo "Name: 2Checkout Demo Customer"
echo ""

echo "Demo accounts setup complete!"
echo ""
echo "=== 2CHECKOUT REVIEW ACCESS ==="
echo "Website: $DEPLOYMENT_URL"
echo ""
echo "Admin Login:"
echo "Email: demo@2checkout-review.com"
echo "Password: Demo2024!Review"
echo ""
echo "Customer Login:"
echo "Email: customer@2checkout-review.com"
echo "Password: Customer2024!"
echo ""
echo "See 2CHECKOUT_REVIEW_ACCESS.md for complete instructions"