-- Remove Mailchimp integration - drop mailchimp_id column
ALTER TABLE newsletter_subscribers DROP COLUMN IF EXISTS mailchimp_id;

-- Newsletter subscribers are now managed entirely in Supabase
-- For future email sending, integrate with services like Resend, SendGrid, or Brevo
