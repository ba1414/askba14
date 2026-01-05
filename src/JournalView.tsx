import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { db, auth, storage } from './firebase';
import { Send, Trash2, Lock, PenLine, Clock, AlertTriangle, Bold, Italic, Highlighter, Paperclip, FileText, Image as ImageIcon, X } from 'lucide-react';
import { AppleEmoji } from './components/AppleEmoji';

interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

interface JournalEntry {
  id: string;
  content: string; // HTML content
  timestamp: Timestamp;
  attachments?: Attachment[];
}

export default function JournalView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Admin Status (Local Storage)
  useEffect(() => {
    const isUnlocked = localStorage.getItem("journal_admin") === "true";
    if (isUnlocked) {
      setIsAdmin(true);
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(err => {
          console.error("Auto-signin failed", err);
        });
      }
    }
    setLoading(false);
  }, []);

  const handleUnlock = async () => {
    const code = prompt("Enter Admin Code:");
    if (code === "ba14") {
      try {
        setErrorMsg(null);
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
        setIsAdmin(true);
        localStorage.setItem("journal_admin", "true");
      } catch (error: any) {
        console.error("Auth failed:", error);
        alert(`Could not sign in: ${error.message}`);
        setIsAdmin(true);
        localStorage.setItem("journal_admin", "true");
      }
    }
  };

  // Subscribe to Journal Entries
  useEffect(() => {
    const q = query(
      collection(db, "journal_entries"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(fetchedEntries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Editor Functions ---
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const isImage = file.type.startsWith('image/');
    
    // Optimistic UI update (optional, but let's just wait for upload for simplicity)
    setIsSubmitting(true); // Block submit while uploading
    
    try {
      const storageRef = ref(storage, `journal_attachments/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setAttachments(prev => [...prev, {
        type: isImage ? 'image' : 'file',
        url,
        name: file.name
      }]);
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console.");
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorRef.current || !isAdmin) return;
    
    const content = editorRef.current.innerHTML;
    if (!content.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      await addDoc(collection(db, "journal_entries"), {
        content,
        attachments,
        timestamp: serverTimestamp(),
        authorEmail: auth.currentUser?.email || "anonymous",
        secretCode: "ba14" 
      });
      
      // Reset Editor
      if (editorRef.current) editorRef.current.innerHTML = "";
      setAttachments([]);
    } catch (error: any) {
      console.error("Error posting entry:", error);
      if (error.code === 'permission-denied') {
        setErrorMsg("Permission denied. Check Firestore rules.");
      } else {
        setErrorMsg(`Failed to post: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin || !window.confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "journal_entries", id));
    } catch (error: any) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete: " + error.message);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div 
          onClick={handleUnlock}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-black text-white dark:bg-white dark:text-black shadow-xl mb-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <AppleEmoji emoji="✍️" className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-black dark:text-white mb-3 tracking-tight">
          My Journal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          Live Updates
        </p>
      </div>

      {/* Admin Input Area */}
      {isAdmin && (
        <div className="mb-12 animate-fade-in">
          <form onSubmit={handlePost} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-3xl blur opacity-50"></div>
            <div className="relative bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/10">
              
              {/* Error Warning */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Bold">
                  <Bold size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Italic">
                  <Italic size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button type="button" onClick={() => execCommand('backColor', 'yellow')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Highlight">
                  <Highlighter size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Attach File">
                  <Paperclip size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                />
              </div>

              {/* Editor */}
              <div 
                ref={editorRef}
                contentEditable
                className="w-full bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-white min-h-[120px] outline-none prose dark:prose-invert max-w-none mb-4"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        // Optional: Submit on Enter? No, better to allow new lines.
                    }
                }}
              />

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {attachments.map((att, i) => (
                    <div key={i} className="relative group">
                      {att.type === 'image' ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                          <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center p-2 text-center">
                          <FileText size={20} className="text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-500 truncate w-full">{att.name}</span>
                        </div>
                      )}
                      <button 
                        onClick={() => removeAttachment(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(false);
                    localStorage.removeItem("journal_admin");
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider flex items-center gap-1"
                >
                  <Lock size={12} />
                  Lock
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                  {isSubmitting ? "Posting..." : (
                    <>
                      Post Update <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Entries Feed (Chat Style) */}
      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading thoughts...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No entries yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex flex-col items-start animate-slide-in-from-bottom-4">
              
              {/* Date Header (Optional, could group by date) */}
              <div className="self-center mb-4">
                <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider bg-[var(--color-surface-secondary)] px-3 py-1 rounded-full">
                  {formatDate(entry.timestamp)}
                </span>
              </div>

              {/* Bubble */}
              <div className="relative max-w-[90%] md:max-w-[80%] self-start group">
                <div className="bg-[var(--color-bg-elevated)] rounded-2xl rounded-tl-sm p-5 shadow-sm border border-[var(--color-border-primary)] text-[17px] leading-relaxed text-[var(--color-text-primary)]">
                  
                  {/* HTML Content */}
                  <div 
                    className="prose dark:prose-invert max-w-none mb-3 break-words"
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />

                  {/* Attachments Grid */}
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {entry.attachments.map((att, i) => (
                        <a 
                          key={i} 
                          href={att.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`block overflow-hidden rounded-xl border border-[var(--color-border-primary)] transition-transform hover:scale-[1.02] ${att.type === 'image' ? 'col-span-2 md:col-span-1' : 'col-span-2'}`}
                        >
                          {att.type === 'image' ? (
                            <img src={att.url} alt="attachment" className="w-full h-48 object-cover" />
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-secondary)]">
                              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{att.name}</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">PDF Document</p>
                              </div>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Delete Button (Hover) */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="absolute -right-10 top-2 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
