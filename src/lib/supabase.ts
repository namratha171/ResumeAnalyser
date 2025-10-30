import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_content: string;
  ats_score: number;
  analysis_data: AnalysisData;
  created_at: string;
  updated_at: string;
}

export interface AnalysisData {
  sections: {
    contact: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  missingElements: string[];
  formattingIssues: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
  recommendations: string[];
  scores: {
    formatting: number;
    content: number;
    keywords: number;
    overall: number;
  };
}
