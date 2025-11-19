import React, { useState, useEffect } from 'react';
import { Server, Database, GitCommit, RefreshCw, Power, Copy, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Repository } from '../types';

const RepositoryList: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepos = async () => {
    setLoading(true);
    try {
        const data = await api.repositories.getAll();
        setRepos(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-100">Хранилища Конфигураций</h2>
            <p className="text-slate-400 mt-1">Список подключенных баз разработки (1C Storage)</p>
        </div>
        <button 
            onClick={loadRepos}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
            Обновить статусы
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
            <Loader2 size={40} className="animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {repos.map(repo => (
                <div key={repo.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <Database size={24} className="text-yellow-500" />
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${
                            repo.status === 'Online' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            repo.status === 'Syncing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                            {repo.status}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-1">{repo.name}</h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-950 p-2 rounded border border-slate-800/50 font-mono">
                        <Server size={12} />
                        <span className="truncate">{repo.address}</span>
                        <button className="ml-auto hover:text-white" title="Copy">
                            <Copy size={12} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Версия</span>
                            <span className="text-slate-200 font-mono">{repo.version}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Ветка</span>
                            <div className="flex items-center gap-1 text-blue-400">
                                <GitCommit size={14} />
                                <span>{repo.branch}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Активность</span>
                            <span className="text-slate-400">{repo.lastCommit}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors">
                            История
                        </button>
                        <button className="flex-1 bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-500 border border-yellow-600/20 py-2 rounded text-sm transition-colors">
                            Захватить
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
