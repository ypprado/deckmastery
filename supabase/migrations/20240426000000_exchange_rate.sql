
-- Create config table for storing key-value pairs
create table if not exists public.config (
  key text primary key,
  value numeric,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable pgnet for cron jobs to call edge functions
create extension if not exists pg_net with schema extensions;

-- Set up the cron job to update exchange rates 3 times per day
select cron.schedule(
  'update-exchange-rate',
  '0 */8 * * *', -- Run every 8 hours
  $$
  select
    net.http_post(
      url:='https://ijowbyywruipnsyzomqw.supabase.co/functions/v1/get-exchange-rate',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqb3dieXl3cnVpcG5zeXpvbXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMjkzMDUsImV4cCI6MjA1NzcwNTMwNX0.mCrVq9Ktcj2GcHSNqHl8wPB93GeAHGaYrKgMOs0X1Wo"}'::jsonb,
      body:='{"isUpdate": true}'::jsonb
    ) as request_id;
  $$
);
