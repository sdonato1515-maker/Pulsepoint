import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

if (!supabase) {
  console.warn('SUPABASE_URL / SUPABASE_SERVICE_KEY not set — running in-memory only (data will not persist across restarts)')
}
