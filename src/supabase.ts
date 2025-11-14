import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aitkrvmjvycbmljsolle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdGtydm1qdnljYm1sanNvbGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTQ2MjEsImV4cCI6MjA3ODY5MDYyMX0.FomfWRHdBaJnwmchEc1NyQ7E4tj5wzIGk2y9MHLctJI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // GPA
  async saveGPACourses(userId: string, courses: any, scale: string) {
    const { error } = await supabase
      .from('gpa_courses')
      .upsert({ 
        user_id: userId, 
        courses, 
        scale,
        updated_at: new Date().toISOString() 
      })
    if (error) console.error('Save GPA error:', error)
    return !error
  },
  
  async loadGPACourses(userId: string) {
    const { data } = await supabase
      .from('gpa_courses')
      .select('courses, scale')
      .eq('user_id', userId)
      .single()
    return data || { courses: [], scale: '4.0' }
  },

  // Calendar
  async saveCalendarTasks(userId: string, tasks: any[]) {
    const { error } = await supabase
      .from('calendar_tasks')
      .upsert({ 
        user_id: userId, 
        tasks, 
        updated_at: new Date().toISOString() 
      })
    if (error) console.error('Save calendar error:', error)
    return !error
  },
  
  async loadCalendarTasks(userId: string) {
    const { data } = await supabase
      .from('calendar_tasks')
      .select('tasks')
      .eq('user_id', userId)
      .single()
    return data?.tasks || []
  },

  // Flashcards
  async saveFlashcards(userId: string, decks: any[]) {
    const { error } = await supabase
      .from('flashcards')
      .upsert({ 
        user_id: userId, 
        decks, 
        updated_at: new Date().toISOString() 
      })
    if (error) console.error('Save flashcards error:', error)
    return !error
  },
  
  async loadFlashcards(userId: string) {
    const { data } = await supabase
      .from('flashcards')
      .select('decks')
      .eq('user_id', userId)
      .single()
    return data?.decks || []
  },

  // Projects
  async saveProjects(userId: string, projects: any[]) {
    const { error } = await supabase
      .from('projects')
      .upsert({ 
        user_id: userId, 
        projects, 
        updated_at: new Date().toISOString() 
      })
    if (error) console.error('Save projects error:', error)
    return !error
  },
  
  async loadProjects(userId: string) {
    const { data } = await supabase
      .from('projects')
      .select('projects')
      .eq('user_id', userId)
      .single()
    return data?.projects || []
  },
}
