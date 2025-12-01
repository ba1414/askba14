import React, { useState, useEffect } from "react";
import { Plus, Check, ChevronLeft, ChevronRight, Trash2, Circle, X } from "lucide-react";
import { saveData, loadData } from "./db";

const TRANSLATIONS = {
  EN: {
    title: "Calendar & Reminders",
    addTask: "New Reminder",
    add: "Add Task",
    cancel: "Cancel",
    pending: "Pending",
    completed: "Completed",
    projects: "Projects",
    tasks: "Reminders",
    noTasks: "No Reminders",
    today: "Today",
  },
  粵: {
    title: "行事曆與提醒事項",
    addTask: "新提醒事項",
    add: "新增事項",
    cancel: "取消",
    pending: "待辦",
    completed: "已完成",
    projects: "項目",
    tasks: "提醒事項",
    noTasks: "沒有提醒事項",
    today: "今天",
  },
};

interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  status: string;
}

const GlassCard = ({ children, className = "", hoverEffect = false }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
  <div className={`
    relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)]
    bg-[var(--surface)] backdrop-blur-xl shadow-xl
    ${hoverEffect ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--primary)]/10' : ''}
    ${className}
  `}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

export default function CalendarMinimal({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Load tasks and projects from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const savedTasks = await loadData('calendar', 'tasks', []);
      const savedProjects = await loadData('projects', 'projects', []);
      setTasks(savedTasks);
      setProjects(savedProjects);
      setIsLoaded(true);
    })();
  }, []);

  // Save tasks to IndexedDB (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveData('calendar', 'tasks', tasks);
    }
  }, [tasks, isLoaded]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      date: selectedDate.toISOString().split('T')[0],
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);
  
  // Check if a project is active on a given date
  const getProjectsForDate = (dateStr: string) => {
    return projects.filter(p => {
      const start = new Date(p.startDate).toISOString().split('T')[0];
      const end = new Date(p.endDate).toISOString().split('T')[0];
      return dateStr >= start && dateStr <= end;
    });
  };

  const dayProjects = getProjectsForDate(selectedDateStr);
  const completedCount = dayTasks.filter(t => t.completed).length;

  return (
    <div className="col-span-full w-full max-w-7xl mx-auto animate-fade-in" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif" }}>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Column: Calendar (macOS Calendar Style) */}
        <GlassCard className="lg:col-span-8 flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-[var(--border-subtle)]">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[34px] font-bold text-[var(--text)] tracking-tight">
                {currentDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", { month: 'long' })}
              </h2>
              <span className="text-[34px] font-normal text-[var(--text-muted)]">
                {currentDate.getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 text-[var(--text)] hover:bg-[var(--border-subtle)] rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={goToToday} 
                className="px-4 py-1.5 text-[15px] font-medium text-[var(--bg)] bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-full transition-colors shadow-lg shadow-[var(--primary)]/20"
              >
                {t.today}
              </button>
              <button onClick={nextMonth} className="p-2 text-[var(--text)] hover:bg-[var(--border-subtle)] rounded-full transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 px-8 pb-8 pt-4">
            <div className="grid grid-cols-7 mb-4">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="text-center text-[12px] font-semibold text-[var(--text-muted)] tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 h-full auto-rows-fr gap-y-2">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const hasTasks = tasks.some((t) => t.date === dateStr && !t.completed);
                const dayProjectsList = getProjectsForDate(dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className="relative flex flex-col items-center justify-start pt-2 group outline-none"
                  >
                    <span
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-full text-[19px] transition-all duration-200
                        ${isToday && isSelected 
                          ? "bg-[var(--secondary)] text-[var(--bg)] font-bold shadow-lg shadow-[var(--secondary)]/30" // Today Selected
                          : isSelected
                            ? "bg-[var(--border-subtle)] text-[var(--text)] font-semibold shadow-md border border-[var(--secondary)]/50" // Normal Selected
                            : isToday
                              ? "text-[var(--secondary)] font-bold" // Today Unselected
                              : "text-[var(--text)] group-hover:bg-[var(--border-subtle)]" // Normal
                        }
                      `}
                    >
                      {day}
                    </span>
                    <div className="flex gap-1 mt-1.5 h-1.5">
                      {hasTasks && !isSelected && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[var(--secondary)]' : 'bg-[var(--text-muted)]'}`} />
                      )}
                      {dayProjectsList.slice(0, 2).map((proj, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Right Column: Reminders */}
        <GlassCard className="lg:col-span-4 flex flex-col">
          <div className="p-6 border-b border-[var(--border-subtle)]">
            <h3 className="text-[22px] font-bold text-[var(--text)] mb-1">
              {t.tasks}
            </h3>
            <p className="text-[15px] text-[var(--text-muted)]">
              {selectedDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {dayTasks.length === 0 && dayProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60">
                <div className="w-20 h-20 bg-[var(--border-subtle)] rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <Check size={32} className="text-[var(--text)]" />
                </div>
                <p className="text-[17px] font-medium text-[var(--text)] mb-1">{t.noTasks}</p>
                <p className="text-[15px] text-[var(--text-muted)]">Enjoy your free time!</p>
                
                <button 
                  onClick={() => setIsAdding(true)}
                  className="mt-6 px-6 py-2.5 bg-[var(--primary)] text-[var(--bg)] rounded-full font-medium text-sm hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/20"
                >
                  + {t.addTask}
                </button>
              </div>
            ) : (
              <div className="bg-[var(--surface)]/50 rounded-xl overflow-hidden shadow-sm border border-[var(--border-subtle)]">
                {dayTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`
                      group flex items-center gap-3 p-3.5 hover:bg-[var(--border-subtle)] transition-colors
                      ${index !== dayTasks.length - 1 || dayProjects.length > 0 ? 'border-b border-[var(--border-subtle)]' : ''}
                    `}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                        ${task.completed
                          ? "bg-[var(--secondary)] border-[var(--secondary)]"
                          : "border-[var(--text-muted)] hover:border-[var(--secondary)]"
                        }
                      `}
                    >
                      {task.completed && <Check size={12} className="text-[var(--bg)]" strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-[15px] ${task.completed ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"}`}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[var(--primary)] p-1 hover:bg-[var(--primary)]/10 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {dayProjects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className={`
                      px-3.5 py-3 border-l-[4px] border-[var(--primary)] hover:bg-[var(--border-subtle)] transition-colors
                      ${index !== dayProjects.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}
                    `}
                  >
                    <p className="text-[15px] font-medium text-[var(--text)]">{project.name}</p>
                    <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
                      {new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)]">
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--bg)] py-3.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-[var(--primary)]/20"
              >
                <Plus size={20} strokeWidth={2.5} />
                {t.addTask}
              </button>
            ) : (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addTask();
                      }
                      if (e.key === 'Escape') {
                        setIsAdding(false);
                        setNewTaskTitle("");
                      }
                    }}
                    placeholder={t.addTask}
                    className="w-full bg-[var(--surface)] text-[var(--text)] px-4 py-3.5 rounded-xl border border-[var(--border-subtle)] outline-none text-[16px] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)]"
                  />
                  {newTaskTitle && (
                    <button 
                      onClick={() => setNewTaskTitle("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      <X size={16} /> 
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsAdding(false); setNewTaskTitle(""); }}
                    className="flex-1 py-3 text-[var(--text-muted)] font-medium hover:bg-[var(--border-subtle)] rounded-xl transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={() => { addTask(); setIsAdding(false); }}
                    disabled={!newTaskTitle.trim()}
                    className="flex-1 py-3 bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--bg)] font-semibold rounded-xl shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all"
                  >
                    {t.add}
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
