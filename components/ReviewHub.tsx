import React, { useState, useEffect } from 'react';
import { Code2, MessageSquare, ThumbsUp, Wand2, Bug, ShieldAlert, Fingerprint, Activity, Send, Loader2 } from 'lucide-react';
import { MOCK_DEVELOPEPRS } from '../constants';
import { ExtendedCodeReview } from '../types';
import { analyzeCodeSnippet } from '../services/geminiService';
import { api } from '../services/api';

const ReviewHub: React.FC = () => {
  const [reviews, setReviews] = useState<ExtendedCodeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState<ExtendedCodeReview | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await api.reviews.getAll();
            setReviews(data);
            if (data.length > 0 && !activeReview) {
                setActiveReview(data[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadReviews();
  }, []);

  const handleAnalyze = async () => {
    if (!activeReview) return;
    setAnalyzing(true);
    const result = await analyzeCodeSnippet(activeReview);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const handleSendComment = () => {
    if (!activeReview || !newComment.trim()) return;
    
    const comment = {
        id: Date.now().toString(),
        authorName: 'Я (Архитектор)',
        text: newComment,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    const updatedReview = {
        ...activeReview,
        comments: [...activeReview.comments, comment]
    };

    // Update local state
    setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
    setActiveReview(updatedReview);
    setNewComment("");
  };

  const getAuthor = (id: string) => MOCK_DEVELOPEPRS.find(d => d.id === id);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 size={40} className="animate-spin text-yellow-500" />
        <p>Загрузка очереди ревью...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-slate-100">Code Reviews</h2>
            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">Очередь: {reviews.length}</div>
                <button className="text-xs text-yellow-500 hover:text-yellow-400 font-medium">Мои задачи</button>
            </div>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">
            {reviews.map(review => (
                <div 
                    key={review.id}
                    onClick={() => { setActiveReview(review); setAiAnalysis(""); }}
                    className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                        activeReview?.id === review.id ? 'bg-slate-800 border-l-2 border-l-yellow-500' : ''
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-slate-200 truncate w-32 text-sm">{review.objectName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            review.status === 'Approved' ? 'border-green-500 text-green-400' : 
                            'border-yellow-500 text-yellow-400'
                        }`}>{review.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                         <img src={getAuthor(review.authorId)?.avatar} className="w-4 h-4 rounded-full" alt="" />
                         <span className="text-xs text-slate-400">{getAuthor(review.authorId)?.name}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {review.staticAnalysis.bugs > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-900/20 px-1 rounded">
                                <Bug size={10} /> {review.staticAnalysis.bugs}
                            </span>
                        )}
                        {review.staticAnalysis.codeSmells > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-900/20 px-1 rounded">
                                <Fingerprint size={10} /> {review.staticAnalysis.codeSmells}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-950 p-6 overflow-y-auto flex flex-col relative">
        {activeReview ? (
            <div className="max-w-6xl mx-auto w-full space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-1">
                            <Code2 size={24} className="text-blue-400" />
                            {activeReview.objectName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Repo: {activeReview.repositoryId}</span>
                            <span>•</span>
                            <span>{activeReview.timestamp}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-500">
                            <option>Назначить ревьюера...</option>
                            {MOCK_DEVELOPEPRS.map(d => <option key={d.id}>{d.name}</option>)}
                        </select>
                        <button 
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
                        >
                            <Wand2 size={16} />
                            {analyzing ? 'Анализ Gemini...' : 'AI Review'}
                        </button>
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-900/20">
                            <ThumbsUp size={16} />
                            Одобрить
                        </button>
                    </div>
                </div>

                {/* Static Analysis Panel (SonarQube Style) */}
                <div className="grid grid-cols-4 gap-4">
                     <AnalysisCard label="Bugs" value={activeReview.staticAnalysis.bugs} icon={Bug} color="text-red-500" />
                     <AnalysisCard label="Vulnerabilities" value={activeReview.staticAnalysis.vulnerabilities} icon={ShieldAlert} color="text-orange-500" />
                     <AnalysisCard label="Code Smells" value={activeReview.staticAnalysis.codeSmells} icon={Fingerprint} color="text-blue-400" />
                     <AnalysisCard label="Coverage" value={`${activeReview.staticAnalysis.coverage}%`} icon={Activity} color={activeReview.staticAnalysis.coverage > 80 ? "text-green-500" : "text-yellow-500"} />
                </div>

                {/* AI Insight Box */}
                {aiAnalysis && (
                    <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-sm text-indigo-200 animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-indigo-300"><Wand2 size={14}/> Gemini Code Insight</h4>
                        <div className="whitespace-pre-wrap leading-relaxed">{aiAnalysis}</div>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-6 h-[500px]">
                    {/* Code Viewer */}
                    <div className="col-span-2 bg-[#1e1e1e] rounded-lg border border-slate-800 flex flex-col overflow-hidden font-mono text-sm shadow-xl">
                        <div className="flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-slate-700 text-slate-400 text-xs">
                            <span>Diff View</span>
                            <span>UTF-8</span>
                        </div>
                        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                            <pre className="whitespace-pre-wrap">
                                {activeReview.changes.split('\n').map((line, i) => (
                                    <div key={i} className="flex group hover:bg-slate-800/50">
                                        <span className="w-10 text-slate-600 select-none text-right mr-4 border-r border-slate-800 pr-2">{i + 1}</span>
                                        <span className={`flex-1 ${line.trim().startsWith('//') ? 'text-green-600 italic' : 'text-slate-300'} ${line.includes('Запрос в цикле') ? 'bg-red-900/20 decoration-wavy underline decoration-red-500' : ''}`}>
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        </div>
                    </div>

                    {/* Discussion / Comments */}
                    <div className="col-span-1 flex flex-col bg-slate-900 rounded-lg border border-slate-800">
                        <div className="p-3 border-b border-slate-800 font-medium text-slate-300 flex items-center gap-2">
                            <MessageSquare size={16} />
                            Обсуждение ({activeReview.comments.length})
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeReview.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3 animate-in fade-in">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                        {comment.authorName[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-300">{comment.authorName}</span>
                                            <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                                        </div>
                                        <div className="text-sm text-slate-400 bg-slate-800 p-2 rounded-lg rounded-tl-none border border-slate-700">
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeReview.comments.length === 0 && (
                                <div className="text-center text-slate-600 text-sm mt-10">Нет комментариев</div>
                            )}
                        </div>
                        <div className="p-3 border-t border-slate-800">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-sm text-slate-300 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                    placeholder="Написать комментарий..."
                                />
                                <button 
                                    onClick={handleSendComment}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-500 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
                Выберите файл для ревью
            </div>
        )}
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ label: string, value: string | number, icon: any, color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
        <div className={`p-2 rounded-md bg-slate-950 ${color} bg-opacity-10`}>
            <Icon size={18} className={color} />
        </div>
        <div>
            <div className="text-xl font-bold text-slate-200 leading-none">{value}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{label}</div>
        </div>
    </div>
);

export default ReviewHub;