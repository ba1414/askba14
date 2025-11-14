import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Upload, Share2, Calendar, Clock } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "Project Timeline",
    addProject: "Add Project",
    projectName: "Project name...",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Status",
    notStarted: "Not Started",
    inProgress: "In Progress",
    completed: "Completed",
    create: "Create",
    cancel: "Cancel",
    export: "Export Data",
    import: "Import Data",
    share: "Share",
    days: "days",
    daysLeft: "days left",
    overdue: "overdue",
    progress: "Progress",
    delete: "Delete",
    noProjects: "No projects yet. Create one to get started!",
    copyLink: "Copy Share Link",
    linkCopied: "Link copied!",
  },
  粵: {
    title: "項目時間表",
    addProject: "新增項目",
    projectName: "項目名稱...",
    startDate: "開始日期",
    endDate: "結束日期",
    status: "狀態",
    notStarted: "未開始",
    inProgress: "進行中",
    completed: "已完成",
    create: "建立",
    cancel: "取消",
    export: "匯出數據",
    import: "匯入數據",
    share: "分享",
    days: "日",
    daysLeft: "日剩餘",
    overdue: "逾期",
    progress: "進度",
    delete: "刪除",
    noProjects: "未有項目。新增一個開始使用！",
    copyLink: "複製分享連結",
    linkCopied: "已複製連結！",
  },
};

type ProjectStatus = "not-started" | "in-progress" | "completed";

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  createdAt: number;
}

export default function ProjectTimeline({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem("ba14_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ Loaded projects:', parsed.length);
        return parsed;
      }
    } catch (error) {
      console.error("❌ Failed to load projects:", error);
    }
    return [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "not-started" as ProjectStatus,
  });
  const [showCopied, setShowCopied] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ba14_projects", JSON.stringify(projects));
      console.log('💾 Saved projects:', projects.length);
    } catch (error) {
      console.error("❌ Failed to save projects:", error);
    }
  }, [projects]);

  const addProject = () => {
    if (!newProject.name.trim() || !newProject.startDate || !newProject.endDate) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      status: newProject.status,
      createdAt: Date.now(),
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", startDate: "", endDate: "", status: "not-started" });
    setShowAddForm(false);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
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
    const url = `${window.location.origin}${window.location.pathname}?import=${encoded}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Check for import parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importData = params.get("import");
    if (importData) {
      try {
        const decoded = JSON.parse(atob(importData));
        setProjects(decoded);
        window.history.replaceState({}, "", window.location.pathname);
      } catch (error) {
        console.error("Failed to import shared data");
      }
    }
  }, []);

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
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F0F0F] dark:text-[#F0F0F0] mb-4">
          {t.title}
        </h1>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] transition-colors flex items-center gap-2"
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
          {showCopied && (
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2">
              {t.linkCopied}
            </span>
          )}
        </div>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-[#E8E8E8] dark:border-[#2F2F2F]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t.projectName}
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
              />
              <input
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                className="flex-1 px-4 py-2 bg-[#F3F4F6] dark:bg-[#2A2A2A] rounded-lg border-none outline-none text-[#1F1F1F] dark:text-[#E8E8E8]"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addProject}
              className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] transition-colors"
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
        <div className="text-center py-12 text-[#6B6B6B] dark:text-[#9B9B9B]">
          {t.noProjects}
        </div>
      ) : (
        <div className="space-y-4">
          {projects
            .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
            .map((project) => {
              const progress = calculateProgress(project);
              const daysLeft = getDaysLeft(project.endDate);

              return (
                <div
                  key={project.id}
                  className="p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-[#E8E8E8] dark:border-[#2F2F2F]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2">
                        {project.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {daysLeft > 0 ? `${daysLeft} ${t.daysLeft}` : daysLeft < 0 ? `${Math.abs(daysLeft)} ${t.days} ${t.overdue}` : t.completed}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-[#6B6B6B] dark:text-[#9B9B9B]">{t.progress}</span>
                      <span className="font-medium text-[#0F0F0F] dark:text-[#F0F0F0]">{progress}%</span>
                    </div>
                    <div className="h-2 bg-[#E8E8E8] dark:bg-[#2F2F2F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="flex gap-2">
                    {(["not-started", "in-progress", "completed"] as ProjectStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(project.id, status)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          project.status === status
                            ? getStatusColor(status)
                            : "bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#E8E8E8] dark:hover:bg-[#323232]"
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
