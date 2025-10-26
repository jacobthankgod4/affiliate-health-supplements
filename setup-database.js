const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabase() {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists public.profiles (
          id uuid primary key references auth.users(id) on delete cascade,
          email text not null,
          name text,
          is_admin boolean default false,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        
        alter table public.profiles enable row level security;
      `
    })
    
    if (profilesError) console.error('Profiles error:', profilesError)
    else console.log('✅ Profiles table created')
    
  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase()