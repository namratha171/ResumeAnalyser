/*
  # Resume Analysis System Schema

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key) - Unique identifier for each resume
      - `user_id` (uuid) - Reference to authenticated user
      - `file_name` (text) - Original filename of uploaded resume
      - `file_content` (text) - Extracted text content from resume
      - `ats_score` (integer) - Overall ATS compatibility score (0-100)
      - `analysis_data` (jsonb) - Detailed analysis results
      - `created_at` (timestamptz) - Timestamp of upload
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `resumes` table
    - Add policy for authenticated users to insert their own resumes
    - Add policy for authenticated users to read their own resumes
    - Add policy for authenticated users to delete their own resumes

  3. Important Notes
    - The `analysis_data` JSONB field will store:
      * Detected sections (contact, experience, education, skills)
      * Missing critical elements
      * Formatting issues
      * Keyword analysis
      * Recommendations for improvement
    - ATS score is calculated based on multiple factors affecting compatibility
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_content text NOT NULL,
  ats_score integer DEFAULT 0,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
