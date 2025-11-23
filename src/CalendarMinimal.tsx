import React, { useState, useEffect } from "react";
import { Plus, Check, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "Calendar",
    addTask: "New Reminder",
    add: "Add",
    tasks: "Reminders",
    noTasks: "No Reminders",
    today: "Today",
  },
  粵: {
    title: "日曆",
    addTask: "新提醒事項",
    add: "新增",
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

export default function CalendarMinimal({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem('calendar_tasks');
      if (saved) setTasks(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);
  const completedCount = dayTasks.filter(t => t.completed).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif" }}>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        
        {/* Left Column: Calendar */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#1C1C1E] rounded-[18px] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[28px] font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                {currentDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", { month: 'long' })}
              </h2>
              <span className="text-[28px] font-normal text-[#86868B]">
                {currentDate.getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-2 text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={22} />
              </button>
              <button onClick={goToToday} className="px-3 py-1 text-[15px] font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-md transition-colors">
                {t.today}
              </button>
              <button onClick={nextMonth} className="p-2 text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 px-6 pb-6">
            <div className="grid grid-cols-7 mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="text-center text-[11px] font-semibold text-[#86868B] tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 h-full auto-rows-fr">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDateStr;
                const isToday = dateStr === todayStr;
                const hasTasks = tasks.some((t) => t.date === dateStr && !t.completed);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className="relative flex flex-col items-center justify-start pt-2 group outline-none"
                  >
                    <span
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-full text-[17px] transition-all duration-200
                        ${isToday && isSelected 
                          ? "bg-[#FF3B30] text-white font-semibold shadow-md" // Today Selected: Red Circle
                          : isSelected
                            ? "bg-[#1D1D1F] dark:bg-white text-white dark:text-black font-semibold shadow-md" // Normal Selected: Black/White Circle
                            : isToday
                              ? "text-[#FF3B30] font-semibold" // Today Unselected: Red Text
                              : "text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:bg-black/5 dark:group-hover:bg-white/10" // Normal
                        }
                      `}
                    >
                      {day}
                    </span>
                    {hasTasks && !isSelected && (
                      <div className={`mt-1 w-1 h-1 rounded-full ${isToday ? 'bg-[#FF3B30]' : 'bg-[#8E8E93]'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reminders */}
        <div className="lg:col-span-4 flex flex-col bg-[#F2F2F7] dark:bg-[#000000] rounded-[18px] overflow-hidden border border-black/5 dark:border-white/10">
          <div className="p-6 bg-white dark:bg-[#1C1C1E] border-b border-black/5 dark:border-white/5">
            <h3 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white mb-1">
              {t.tasks}
            </h3>
            <p className="text-[15px] text-[#86868B]">
              {selectedDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#F2F2F7] dark:bg-[#000000]">
            {dayTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#86868B] opacity-60">
                <Check size={32} className="mb-2" />
                <p className="text-sm font-medium">{t.noTasks}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm">
                {dayTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`
                      group flex items-center gap-3 p-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors
                      ${index !== dayTasks.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''}
                    `}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`
                        flex-shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all
                        ${task.completed
                          ? "bg-[#007AFF] border-[#007AFF]"
                          : "border-[#C6C6C8] dark:border-[#48484A] hover:border-[#007AFF]"
                        }
                      `}
                    >
                      {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-[15px] ${task.completed ? "text-[#86868B] line-through" : "text-[#1D1D1F] dark:text-white"}`}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[#FF3B30] p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-[#1C1C1E] border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2 bg-[#767680]/10 dark:bg-[#767680]/20 px-3 py-2 rounded-lg">
              <Plus size={18} className="text-[#86868B]" />
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder={t.addTask}
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#1D1D1F] dark:text-white placeholder-[#86868B]"
              />
              {newTaskTitle && (
                <button onClick={addTask} className="text-[#007AFF] font-semibold text-[13px]">
                  {t.add}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
