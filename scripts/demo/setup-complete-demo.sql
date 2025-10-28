-- Complete Demo Database Setup for 2Checkout Review
-- Run this script in Supabase SQL Editor to set up everything

-- Create demo products
INSERT INTO products (id, name, price, category, description, image_url, affiliate_url, created_at) VALUES
('demo-omega3', 'Premium Omega-3 Fish Oil', 29.99, 'Vitamins', 'High-quality omega-3 supplement for heart and brain health', '/placeholder.jpg', 'https://example.com/omega3', NOW()),
('demo-protein', 'Whey Protein Powder', 49.99, 'Proteins', 'Premium whey protein for muscle building and recovery', '/placeholder.jpg', 'https://example.com/protein', NOW()),
('demo-nootropic', 'Brain Boost Nootropic', 39.99, 'Nootropics', 'Advanced cognitive enhancement supplement', '/placeholder.jpg', 'https://example.com/nootropic', NOW()),
('demo-vitamin-d', 'Vitamin D3 5000 IU', 19.99, 'Vitamins', 'High-potency vitamin D3 for immune support', '/placeholder.jpg', 'https://example.com/vitamin-d', NOW()),
('demo-creatine', 'Pure Creatine Monohydrate', 24.99, 'Proteins', 'Micronized creatine for strength and power', '/placeholder.jpg', 'https://example.com/creatine', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- Create demo admin profile (will be created via API)
-- Admin: demo@2checkout-review.com / Demo2024!Review

-- Create demo customer profile (will be created via API) 
-- Customer: customer@2checkout-review.com / Customer2024!

-- Create demo affiliate clicks for analytics
INSERT INTO affiliate_clicks (product_id, user_id, ip_address, user_agent, referrer, utm_source, utm_medium, utm_campaign, conversion, revenue, created_at) VALUES
('demo-omega3', NULL, '192.168.1.1', 'Mozilla/5.0 Demo Browser', 'https://google.com', 'google', 'organic', 'health-search', true, 29.99, NOW() - INTERVAL '7 days'),
('demo-protein', NULL, '192.168.1.2', 'Mozilla/5.0 Demo Browser', 'https://facebook.com', 'facebook', 'social', 'fitness-ads', false, 0, NOW() - INTERVAL '5 days'),
('demo-nootropic', NULL, '192.168.1.3', 'Mozilla/5.0 Demo Browser', 'https://instagram.com', 'instagram', 'social', 'brain-health', true, 39.99, NOW() - INTERVAL '3 days'),
('demo-vitamin-d', NULL, '192.168.1.4', 'Mozilla/5.0 Demo Browser', 'https://youtube.com', 'youtube', 'video', 'wellness-content', false, 0, NOW() - INTERVAL '2 days'),
('demo-creatine', NULL, '192.168.1.5', 'Mozilla/5.0 Demo Browser', 'https://reddit.com', 'reddit', 'social', 'fitness-community', true, 24.99, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Create demo newsletter subscribers
INSERT INTO newsletter_subscribers (email, created_at) VALUES
('subscriber1@example.com', NOW() - INTERVAL '10 days'),
('subscriber2@example.com', NOW() - INTERVAL '8 days'),
('subscriber3@example.com', NOW() - INTERVAL '6 days'),
('healthfan@example.com', NOW() - INTERVAL '4 days'),
('fitnesslover@example.com', NOW() - INTERVAL '2 days')
ON CONFLICT (email) DO NOTHING;

-- Demo complete
SELECT 'Demo database setup complete! Ready for 2Checkout review.' as status;