import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvtllfouvnycpgkolzbj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGxsZm91dm55Y3Bna29semJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDM4NjMsImV4cCI6MjA3ODY3OTg2M30.Jh5jD0qElQDik0it_TSYPQO1Off8TZGZkREjxH_eIfM'

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
