import React, { useState, useEffect } from 'react';
import { Mail, BarChart2, Award, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Developer } from '../types';

const DeveloperTeam: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
        try {
            setLoading(true);
            const data = await api.team.getAll();
            setDevelopers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadTeam();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-100 mb-8">Команда Разработки</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map(dev => (
            <div key={dev.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center hover:border-slate-600 transition-all">
                <div className="relative mb-4">
                    <img src={dev.avatar} alt={dev.name} className="w-20 h-20 rounded-full border-2 border-slate-700" />
                    <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-slate-900 ${dev.efficiency > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100">{dev.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{dev.role}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <div className="bg-slate-950 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-slate-200">{dev.activeTasks}</div>
                        <div className="text-xs text-slate-500">Активных задач</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-slate-200">{dev.efficiency}%</div>
                        <div className="text-xs text-slate-500">Эффективность</div>
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors">
                        <Mail size={16} />
                        Написать
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors">
                        <BarChart2 size={16} />
                        KPI
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTeam;
