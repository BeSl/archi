import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, CheckCircle2, Clock, FileText, Cpu, GitMerge, PlayCircle, XCircle, Loader2, Plus, Layers, Database, FileJson } from 'lucide-react';
import { PIPELINE_STATUSES } from '../constants';
import { Release, ReleaseStatus, Task } from '../types';
import { generateReleaseNotes } from '../services/geminiService';
import { api } from '../services/api';

const ReleaseBoard: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRelease, setNewRelease] = useState<Partial<Release>>({
      projectName: '',
      version: '',
      codename: '',
      deadline: '',
      status: ReleaseStatus.PLANNING,
      metadataObjects: [],
      externalResources: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [releasesData, tasksData] = await Promise.all([
        api.releases.getAll(),
        api.releases.getTasks()
      ]);
      setReleases(releasesData);
      setTasks(tasksData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotes = async (release: Release) => {
    setLoadingNotes(true);
    const generated = await generateReleaseNotes(release, tasks);
    setNotes(generated);
    setLoadingNotes(false);
  };

  const handleCreateRelease = async () => {
      if(!newRelease.version || !newRelease.projectName) return;

      const releaseToCreate: Release = {
          id: `rel-${Date.now()}`,
          projectName: newRelease.projectName || 'New Project',
          version: newRelease.version || '1.0.0',
          codename: newRelease.codename || 'New Release',
          deadline: newRelease.deadline || new Date().toISOString().split('T')[0],
          status: ReleaseStatus.PLANNING,
          progress: 0,
          description: 'Новый релиз',
          metadataObjects: [],
          externalResources: []
      };

      try {
          await api.releases.create(releaseToCreate);
          setIsCreateModalOpen(false);
          fetchData(); // Refresh list
          setNewRelease({ projectName: '', version: '', codename: '', deadline: '' });
      } catch (error) {
          console.error("Create failed", error);
      }
  };

  const getStatusColor = (status: ReleaseStatus) => {
    switch (status) {
      case ReleaseStatus.DONE: return 'bg-green-500/20 text-green-400 border-green-500/30';
      case ReleaseStatus.DEPLOYMENT: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case ReleaseStatus.TESTING: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-700/30 text-slate-400 border-slate-700';
    }
  };

  const getPipelineStatus = (id: string) => {
    // @ts-ignore
    return PIPELINE_STATUSES[id] || { build: 'pending', test: 'pending', deploy: 'pending' };
  };

  if (loading) {
     return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 size={40} className="animate-spin text-yellow-500" />
        <p>Синхронизация со сборочным сервером...</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
            <h2 className="text-3xl font-bold text-slate-100">Управление Релизами</h2>
            <p className="text-slate-400 mt-1">CI/CD Pipeline & Release Management</p>
        </div>
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-yellow-900/20"
        >
            <Rocket size={18} />
            Создать Релиз
        </button>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        {/* List of Releases */}
        <div className="w-1/2 overflow-y-auto pr-2 space-y-4">
            {releases.map(release => {
                const pipeline = getPipelineStatus(release.id);
                return (
                <div 
                    key={release.id} 
                    onClick={() => { setSelectedRelease(release); setNotes(""); }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                        selectedRelease?.id === release.id 
                        ? 'bg-slate-800 border-yellow-500/50 shadow-md shadow-yellow-900/20' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-xs text-blue-400 font-semibold mb-1">{release.projectName}</div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-slate-200">{release.version}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(release.status)}`}>
                                    {release.status}
                                </span>
                            </div>
                        </div>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar size={14} /> {release.deadline}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                        {/* Mini Pipeline Visualizer */}
                        <PipelineStep label="Build" status={pipeline.build} />
                        <div className="w-4 h-[1px] bg-slate-700"></div>
                        <PipelineStep label="Test" status={pipeline.test} />
                        <div className="w-4 h-[1px] bg-slate-700"></div>
                        <PipelineStep label="Deploy" status={pipeline.deploy} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                        <div className="flex items-center gap-1">
                             <Cpu size={14} />
                             <span>{release.codename}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div 
                                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${release.progress}%` }}
                                ></div>
                            </div>
                            <span>{release.progress}%</span>
                        </div>
                    </div>
                </div>
            )})}
        </div>

        {/* Detail View */}
        <div className="w-1/2 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">
            {selectedRelease ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
                        <div>
                             <div className="text-sm text-blue-400 font-semibold mb-1">{selectedRelease.projectName}</div>
                            <h3 className="text-2xl font-bold text-slate-100 mb-1">Релиз {selectedRelease.version}</h3>
                            <p className="text-slate-400">{selectedRelease.codename}</p>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-900/50">
                            <GitMerge size={14} /> GitLab Pipeline
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Статус</h4>
                            <div className="text-slate-200 flex items-center gap-2">
                                <Clock size={16} className="text-blue-400" /> 
                                {selectedRelease.status}
                            </div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Дедлайн</h4>
                            <div className="text-slate-200 flex items-center gap-2">
                                <Calendar size={16} className="text-red-400" /> 
                                {selectedRelease.deadline}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Objects List */}
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                            <Layers size={18} className="text-yellow-500"/>
                            Измененные метаданные
                        </h4>
                        <div className="bg-slate-950 rounded-lg border border-slate-800 p-1 max-h-40 overflow-y-auto">
                            {selectedRelease.metadataObjects && selectedRelease.metadataObjects.length > 0 ? (
                                <ul className="divide-y divide-slate-800/50">
                                    {selectedRelease.metadataObjects.map((obj, idx) => (
                                        <li key={idx} className="px-3 py-2 text-sm text-slate-300 font-mono flex items-center gap-2">
                                            <Database size={12} className="text-slate-500"/>
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-slate-600 text-sm italic text-center">Нет изменений метаданных</div>
                            )}
                        </div>
                    </div>

                    {/* External Resources List */}
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                            <FileJson size={18} className="text-green-500"/>
                            Внешние отчеты и обработки
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {selectedRelease.externalResources && selectedRelease.externalResources.length > 0 ? (
                                selectedRelease.externalResources.map((res, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-900 rounded text-slate-400">
                                                {res.type === 'Report' ? <FileText size={16}/> : <Cpu size={16}/>}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-200">{res.name}</div>
                                                <div className="text-xs text-slate-500">{res.type} • v{res.version}</div>
                                            </div>
                                        </div>
                                        <button className="text-xs text-blue-400 hover:text-blue-300">Скачать</button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 border border-dashed border-slate-800 rounded-lg text-slate-600 text-sm italic text-center">
                                    Нет внешних файлов
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tasks */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-slate-200">Состав релиза (OneScript Build)</h4>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                {tasks.filter(t => t.releaseId === selectedRelease.id).length} задач
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {tasks.filter(t => t.releaseId === selectedRelease.id).map(task => (
                                <li key={task.id} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                                    <CheckCircle2 size={16} className={task.status === 'Done' ? 'text-green-500' : 'text-slate-600'} />
                                    <span className={`text-sm ${task.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {task.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                                <FileText size={18} /> 
                                Release Notes
                            </h4>
                            <button 
                                onClick={() => handleGenerateNotes(selectedRelease)}
                                disabled={loadingNotes}
                                className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-2"
                            >
                                {loadingNotes ? <Loader2 size={12} className="animate-spin" /> : <Cpu size={12} />}
                                {loadingNotes ? 'Generating...' : 'Auto-Generate'}
                            </button>
                        </div>
                        
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 font-mono whitespace-pre-wrap min-h-[150px] shadow-inner">
                            {notes || (
                                <span className="text-slate-600 italic flex items-center gap-2">
                                    <Cpu size={16} /> Нажмите "Auto-Generate", чтобы создать описание...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <Rocket size={48} className="text-slate-800" />
                    <p>Выберите релиз для управления пайплайном</p>
                </div>
            )}
        </div>
      </div>

      {/* Create Release Modal */}
      {isCreateModalOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-96 shadow-2xl">
                  <h3 className="text-xl font-bold text-slate-100 mb-4">Новый релиз</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs text-slate-400 mb-1">Имя проекта</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm" 
                              placeholder="Напр: ERP 2.0"
                              value={newRelease.projectName}
                              onChange={e => setNewRelease({...newRelease, projectName: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs text-slate-400 mb-1">Версия</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm" 
                              placeholder="1.0.0"
                              value={newRelease.version}
                              onChange={e => setNewRelease({...newRelease, version: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs text-slate-400 mb-1">Кодовое имя</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm" 
                              placeholder="Winter Update"
                              value={newRelease.codename}
                              onChange={e => setNewRelease({...newRelease, codename: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs text-slate-400 mb-1">Дедлайн</label>
                          <input 
                              type="date" 
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm"
                              value={newRelease.deadline}
                              onChange={e => setNewRelease({...newRelease, deadline: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                      >
                          Отмена
                      </button>
                      <button 
                        onClick={handleCreateRelease}
                        className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-medium"
                      >
                          Создать
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const PipelineStep: React.FC<{ label: string, status: string }> = ({ label, status }) => {
    let icon, color, bg;
    if (status === 'success') {
        icon = <CheckCircle2 size={12} />; color = 'text-green-400'; bg = 'bg-green-500/10 border-green-500/20';
    } else if (status === 'failed') {
        icon = <XCircle size={12} />; color = 'text-red-400'; bg = 'bg-red-500/10 border-red-500/20';
    } else if (status === 'running') {
        icon = <Loader2 size={12} className="animate-spin" />; color = 'text-blue-400'; bg = 'bg-blue-500/10 border-blue-500/20';
    } else {
        icon = <PlayCircle size={12} />; color = 'text-slate-500'; bg = 'bg-slate-800 border-slate-700';
    }

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${bg} ${color}`}>
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </div>
    );
};

export default ReleaseBoard;