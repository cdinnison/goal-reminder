CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  name text,
  goal text,
  motivation text,
  time_zone text,
  city text,
  subscription_status text NOT NULL DEFAULT 'trial',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);