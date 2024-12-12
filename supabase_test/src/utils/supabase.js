import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqidqrqcwnptczzmhdwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaWRxcnFjd25wdGN6em1oZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTA4MjksImV4cCI6MjA0OTUyNjgyOX0.ahANrBL_lrvMdXWVLMhP_h-1GvUzOwzZay7x3zP2wFI';

export const supabase = createClient(supabaseUrl, supabaseKey)