-- Run this SQL in Supabase Dashboard → SQL Editor

-- GPA Courses Table
CREATE TABLE gpa_courses (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  courses JSONB NOT NULL DEFAULT '[]',
  scale TEXT NOT NULL DEFAULT '4.0',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Tasks Table
CREATE TABLE calendar_tasks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tasks JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards Table
CREATE TABLE flashcards (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  decks JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  projects JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gpa_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
-- Users can only access their own data

-- GPA Policies
CREATE POLICY "Users can manage own GPA data" ON gpa_courses
  FOR ALL USING (auth.uid() = user_id);

-- Calendar Policies
CREATE POLICY "Users can manage own calendar data" ON calendar_tasks
  FOR ALL USING (auth.uid() = user_id);

-- Flashcards Policies
CREATE POLICY "Users can manage own flashcards data" ON flashcards
  FOR ALL USING (auth.uid() = user_id);

-- Projects Policies
CREATE POLICY "Users can manage own projects data" ON projects
  FOR ALL USING (auth.uid() = user_id);
