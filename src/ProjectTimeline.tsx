import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Upload, Share2, Calendar, Clock, Edit2, Check, X } from "lucide-react";
import { saveData, loadData } from "./db";

const TRANSLATIONS = {
  EN: {
    title: "Project Timeline",
    addProject: "Add Project",
    projectName: "Project name...",
    startDate: "Start Date",
    endDate: "End Date",
    color: "Color",
    status: "Status",
    notStarted: "Not Started",
    inProgress: "In Progress",
    completed: "Completed",
    create: "Add",
    cancel: "Cancel",
    export: "Export",
    import: "Import",
    share: "Share Link",
    reset: "Reset All",
    days: "days",
    daysLeft: "days left",
    overdue: "overdue",
    progress: "Progress",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    noProjects: "No projects yet. Add one above to get started.",
    savedLocally: "Data is saved in your browser (survives refresh).",
    linkCopied: "Share link copied! Anyone can view your timeline.",
    clearConfirm: "Delete all projects? This cannot be undone.",
  },
  粵: {
    title: "項目時間表",
    addProject: "新增項目",
    projectName: "項目名稱...",
    startDate: "開始日期",
    endDate: "結束日期",
    color: "顏色",
    status: "狀態",
    notStarted: "未開始",
    inProgress: "進行中",
    completed: "已完成",
    create: "新增",
    cancel: "取消",
    export: "匯出",
    import: "匯入",
    share: "分享連結",
    reset: "全部清除",
    days: "日",
    daysLeft: "日剩餘",
    overdue: "逾期",
    progress: "進度",
    delete: "刪除",
    edit: "編輯",
    save: "儲存",
    noProjects: "未有項目。新增一個開始使用！",
    savedLocally: "數據已儲存於瀏覽器（重新整理後仍然保留）。",
    linkCopied: "分享連結已複製！任何人都可以查看你嘅時間表。",
    clearConfirm: "刪除所有項目？此操作無法復原。",
  },
};

type ProjectStatus = "not-started" | "in-progress" | "completed";

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  status: ProjectStatus;
  createdAt: number;
}

export default function ProjectTimeline({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    startDate: "",
    endDate: "",
    color: "#1F6FEB",
    status: "not-started" as ProjectStatus,
  });
  const [editProject, setEditProject] = useState({
    name: "",
    startDate: "",
    endDate: "",
    color: "#1F6FEB",
  });
  const [showCopied, setShowCopied] = useState(false);

  // Load projects from IndexedDB on mount
  useEffect(() => {
    (async () => {
      // Try to load from URL first (shared link)
      const params = new URLSearchParams(window.location.search);
      const sharedData = params.get("timeline");
      
      if (sharedData) {
        try {
          const decoded = JSON.parse(atob(sharedData));
          setProjects(decoded);
          setIsLoaded(true);
          // Clean URL after loading
          window.history.replaceState({}, "", window.location.pathname);
          return;
        } catch (error) {
          console.error("Failed to load shared timeline");
        }
      }
      
      // Otherwise load from IndexedDB
      const savedProjects = await loadData('projects', 'list', []);
      setProjects(savedProjects);
      setIsLoaded(true);
    })();
  }, []);

  // Save projects to IndexedDB (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveData('projects', 'list', projects);
    }
  }, [projects, isLoaded]);

  const addProject = () => {
    if (!newProject.name.trim() || !newProject.startDate || !newProject.endDate) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      color: newProject.color,
      status: newProject.status,
      createdAt: Date.now(),
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", startDate: "", endDate: "", color: "#1F6FEB", status: "not-started" });
    setShowAddForm(false);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditProject({
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      color: project.color,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setProjects(projects.map((p) =>
      p.id === editingId
        ? { ...p, ...editProject }
        : p
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const updateStatus = (id: string, status: ProjectStatus) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const calculateProgress = (project: Project) => {
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = Date.now();

    if (project.status === "completed") return 100;
    if (project.status === "not-started") return 0;
    if (now < start) return 0;
    if (now > end) return 100;

    return Math.min(100, Math.round(((now - start) / (end - start)) * 100));
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ba14-projects-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setProjects(imported);
      } catch (error) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  const shareData = () => {
    const encoded = btoa(JSON.stringify(projects));
    const url = `${window.location.origin}${window.location.pathname}?timeline=${encoded}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 3000);
  };

  const resetAll = () => {
    if (confirm(t.clearConfirm)) {
      setProjects([]);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return t.completed;
      case "in-progress":
        return t.inProgress;
      default:
        return t.notStarted;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">{t.savedLocally}</p>
      </div>
        
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          {t.addProject}
        </button>
        <button
          onClick={exportData}
          className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#383838] transition-colors flex items-center gap-2"
        >
          <Download size={18} />
          {t.export}
        </button>
        <label className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#383838] transition-colors flex items-center gap-2 cursor-pointer">
          <Upload size={18} />
          {t.import}
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>
        <button
          onClick={shareData}
          className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#383838] transition-colors flex items-center gap-2"
        >
          <Share2 size={18} />
          {t.share}
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 border border-[#E8E8E8] dark:border-[#2F2F2F] text-[#6B6B6B] dark:text-[#9B9B9B] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A] transition-colors"
        >
          {t.reset}
        </button>
        {showCopied && (
          <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2 animate-pulse">
            {t.linkCopied}
          </span>
        )}
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-[#E8E8E8] dark:border-[#2F2F2F]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder={t.projectName}
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
            />
            <input
              type="date"
              value={newProject.startDate}
              onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
            />
            <input
              type="date"
              value={newProject.endDate}
              onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
            />
            <input
              type="color"
              value={newProject.color}
              onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
              className="h-10 w-full bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={addProject}
              className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] transition-colors font-medium"
            >
              {t.create}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#383838] transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-lg text-[#6B6B6B] dark:text-[#9B9B9B] mb-2">{t.noProjects}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .map((project) => {
              const isEditing = editingId === project.id;
              const daysLeft = getDaysLeft(project.endDate);

              return (
                <div
                  key={project.id}
                  className="p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-[#E8E8E8] dark:border-[#2F2F2F]"
                >
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={editProject.name}
                          onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                          className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
                          placeholder={t.projectName}
                        />
                        <input
                          type="date"
                          value={editProject.startDate}
                          onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })}
                          className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
                        />
                        <input
                          type="date"
                          value={editProject.endDate}
                          onChange={(e) => setEditProject({ ...editProject, endDate: e.target.value })}
                          className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
                        />
                        <input
                          type="color"
                          value={editProject.color}
                          onChange={(e) => setEditProject({ ...editProject, color: e.target.value })}
                          className="h-10 w-full bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1.5 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] flex items-center gap-1.5 text-sm"
                        >
                          <Check size={16} />
                          {t.save}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#383838] flex items-center gap-1.5 text-sm"
                        >
                          <X size={16} />
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-md flex-shrink-0 border border-black/10"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] truncate">
                          {project.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6B6B] dark:text-[#9B9B9B] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(project.startDate).toLocaleDateString()} → {new Date(project.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {daysLeft > 0 ? `${daysLeft} ${t.daysLeft}` : daysLeft < 0 ? `${Math.abs(daysLeft)} ${t.days} ${t.overdue}` : t.completed}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {(["not-started", "in-progress", "completed"] as ProjectStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(project.id, status)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              project.status === status
                                ? getStatusColor(status)
                                : "bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#E8E8E8] dark:hover:bg-[#323232]"
                            }`}
                            title={getStatusLabel(status)}
                          >
                            {status === "not-started" ? "⏸" : status === "in-progress" ? "▶" : "✓"}
                          </button>
                        ))}
                        <button
                          onClick={() => startEdit(project)}
                          className="p-1.5 text-[#6B6B6B] dark:text-[#9B9B9B] hover:text-[#007AFF] dark:hover:text-[#007AFF] hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A] rounded-lg"
                          title={t.edit}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title={t.delete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
