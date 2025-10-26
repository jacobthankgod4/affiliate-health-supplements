-- Add image_url column to products table
ALTER TABLE public.products ADD COLUMN image_url TEXT;

-- Update existing products with image URLs
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Alpha Brain - Nootropic Stack';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Optimind - Mental Performance';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Mind Lab Pro - Universal Nootropic';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Optimum Nutrition Gold Standard Whey';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Isopure Zero Carb Protein';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'MuscleTech Nitro-Tech Protein';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Nature Made Multivitamin';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Vitamin D3 5000 IU';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Omega-3 Fish Oil';
UPDATE public.products SET image_url = '/placeholder.svg?height=300&width=300' WHERE name = 'Magnesium Glycinate';
