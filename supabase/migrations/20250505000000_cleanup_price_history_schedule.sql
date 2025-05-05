
-- Create a cron job to run the cleanup-price-history function daily at 4:00 UTC
-- This runs an hour before the price update job to ensure clean data
SELECT cron.schedule(
  'cleanup-price-history-daily',
  '0 4 * * *',  -- Run at 4:00 UTC every day
  $$
  SELECT
    net.http_post(
      url:='https://ijowbyywruipnsyzomqw.supabase.co/functions/v1/cleanup-price-history',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqb3dieXl3cnVpcG5zeXpvbXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMjkzMDUsImV4cCI6MjA1NzcwNTMwNX0.mCrVq9Ktcj2GcHSNqHl8wPB93GeAHGaYrKgMOs0X1Wo"}'::jsonb,
      body:='{}'::jsonb
    ) AS request_id;
  $$
);
