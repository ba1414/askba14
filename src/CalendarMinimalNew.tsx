import React, { useState, useEffect } from "react";
import { Plus, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "Calendar & Tasks",
    addTask: "Add a task...",
    add: "Add",
    pending: "pending",
    completed: "completed",
  },
  粵: {
    title: "行事曆與任務",
    addTask: "新增任務...",
    add: "新增",
    pending: "待辦",
    completed: "已完成",
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
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('ba14_calendar_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ Loaded calendar tasks:', parsed.length);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Failed to load tasks:', error);
    }
    return [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem('ba14_calendar_tasks', JSON.stringify(tasks));
      console.log('💾 Saved calendar tasks:', tasks.length);
    } catch (error) {
      console.error('❌ Failed to save tasks:', error);
    }
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

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);
  const pendingCount = dayTasks.filter((t) => !t.completed).length;
  const completedCount = dayTasks.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-4 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">
          {lang === "EN" ? "Organize your schedule and track tasks" : "整理你嘅時間表同追蹤任務"}
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Calendar Card - Larger bento box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#252525] dark:to-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-2xl p-6 shadow-sm">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0]">
              {currentDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <ChevronLeft size={20} className="text-[#6B6B6B] dark:text-[#9B9B9B]" strokeWidth={2} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A] rounded-lg transition-all"
              >
                <ChevronRight size={20} className="text-[#6B6B6B] dark:text-[#9B9B9B]" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#9B9B9B] dark:text-[#6B6B6B] pb-2 uppercase tracking-wider">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const hasTasks = tasks.some((t) => t.date === dateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 text-sm rounded-xl relative font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-lg scale-105"
                      : isToday
                      ? "bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#007AFF] dark:text-[#0A84FF] font-semibold"
                      : "hover:bg-[#F9FAFB] dark:hover:bg-[#252525] text-[#0F0F0F] dark:text-[#F0F0F0]"
                  }`}
                >
                  {day}
                  {hasTasks && !isSelected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks Card - Smaller bento box */}
        <div className="lg:col-span-1 bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-2xl p-6 shadow-sm flex flex-col max-h-[600px]">
          {/* Selected Date */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2">
              {selectedDate.toLocaleDateString(lang === "EN" ? "en-US" : "zh-HK", {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 bg-[#FEF3C7] dark:bg-[#3F3F1F] text-[#92400E] dark:text-[#FDE68A] rounded-md font-medium">
                {pendingCount} {t.pending}
              </span>
              <span className="px-2 py-1 bg-[#D1FAE5] dark:bg-[#1F3F2F] text-[#065F46] dark:text-[#6EE7B7] rounded-md font-medium">
                {completedCount} {t.completed}
              </span>
            </div>
          </div>

          {/* Add Task */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTask();
                  }
                }}
                placeholder={t.addTask}
                className="flex-1 px-3 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
              />
              <button
                onClick={() => addTask()}
                disabled={!newTaskTitle.trim()}
                className="p-2.5 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-lg hover:bg-[#0051D5] dark:hover:bg-[#409CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {dayTasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center py-12">
                <div>
                  <p className="text-sm text-[#9B9B9B] dark:text-[#6B6B6B] mb-1">
                    {lang === "EN" ? "No tasks" : "未有任務"}
                  </p>
                  <p className="text-xs text-[#BFBFBF] dark:text-[#5B5B5B]">
                    {lang === "EN" ? "Add a task to get started" : "新增任務開始"}
                  </p>
                </div>
              </div>
            ) : (
              dayTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 p-3 bg-[#F9FAFB] dark:bg-[#1A1A1A] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#252525] transition-all"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${
                      task.completed
                        ? "bg-[#007AFF] dark:bg-[#0A84FF] border-[#007AFF] dark:border-[#0A84FF]"
                        : "border-[#E5E7EB] dark:border-[#323232] hover:border-[#007AFF] dark:hover:border-[#0A84FF]"
                    }`}
                  >
                    {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                  </button>
                  <span
                    className={`flex-1 text-sm transition-all ${
                      task.completed
                        ? "line-through text-[#9B9B9B] dark:text-[#6B6B6B]"
                        : "text-[#0F0F0F] dark:text-[#F0F0F0]"
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#3F1F1F] rounded transition-all"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
