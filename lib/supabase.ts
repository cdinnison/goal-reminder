import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const updateUser = async (
  userId: string,
  data: Partial<{
    name: string;
    goal: string;
    motivation: string;
    time_zone: string;
    city: string;
    subscription_status: string;
  }>
) => {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
};