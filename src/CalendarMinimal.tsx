import React, { useState, useEffect } from "react";
import { Plus, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Minimal Calendar + To-Do - ChatGPT style
 * No decorations, flat design
 */

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem('calendar_tasks');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calendar_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-[#202124] dark:text-[#E3E3E3] mb-6">{t.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#2A2A2A] rounded-lg">
              <ChevronLeft size={20} className="text-[#5F6368] dark:text-[#9AA0A6]" />
            </button>
            <div className="text-lg font-medium text-[#202124] dark:text-[#E3E3E3]">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#2A2A2A] rounded-lg">
              <ChevronRight size={20} className="text-[#5F6368] dark:text-[#9AA0A6]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6] py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDateStr;
              const hasTasks = tasks.some((t) => t.date === dateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 text-sm rounded-lg relative ${
                    isSelected
                      ? "bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124]"
                      : "hover:bg-[#F8F9FA] dark:hover:bg-[#2A2A2A] text-[#202124] dark:text-[#E3E3E3]"
                  }`}
                >
                  {day}
                  {hasTasks && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1A73E8] dark:bg-[#8AB4F8]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div className="mb-4 flex items-center gap-4 text-sm text-[#5F6368] dark:text-[#9AA0A6]">
            <span>{pendingCount} {t.pending}</span>
            <span>{completedCount} {t.completed}</span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder={t.addTask}
              className="flex-1 px-3 py-2 bg-[#F8F9FA] dark:bg-[#2A2A2A] border border-[#E5E5E5] dark:border-[#3C3C3C] rounded-lg text-sm text-[#202124] dark:text-[#E3E3E3] placeholder-[#5F6368] dark:placeholder-[#9AA0A6] focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]"
            />
            <button
              onClick={addTask}
              disabled={!newTaskTitle.trim()}
              className="px-4 py-2 bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] rounded-lg text-sm font-medium hover:bg-[#1765CC] dark:hover:bg-[#669DF6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.add}
            </button>
          </div>

          <div className="space-y-2">
            {dayTasks.length === 0 ? (
              <div className="text-center py-12 text-[#5F6368] dark:text-[#9AA0A6] text-sm">
                No tasks for this day
              </div>
            ) : (
              dayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-lg group"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-[#1A73E8] dark:bg-[#8AB4F8] border-[#1A73E8] dark:border-[#8AB4F8]"
                        : "border-[#E5E5E5] dark:border-[#3C3C3C]"
                    }`}
                  >
                    {task.completed && <Check size={12} className="text-white dark:text-[#202124]" />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      task.completed
                        ? "line-through text-[#5F6368] dark:text-[#9AA0A6]"
                        : "text-[#202124] dark:text-[#E3E3E3]"
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#D93025] dark:hover:text-[#F28B82] rounded"
                  >
                    <X size={16} />
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
