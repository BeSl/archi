import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { 
  Activity, AlertTriangle, Clock, Sparkles, 
  CheckCircle2, ShieldAlert, Timer, Filter, Loader2
} from 'lucide-react';
import { generateArchitecturalInsight } from '../services/geminiService';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  const [insight, setInsight] = useState<string>("Ожидание данных для анализа...");
  const [loadingAi, setLoadingAi] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const metrics = await api.dashboard.getMetrics();
        setData(metrics);
        
        // Trigger AI after data load
        setLoadingAi(true);
        const context = `APDEX Score: ${metrics.kpi.apdexScore}. Production Bugs: ${metrics.kpi.bugs}. Test Coverage trend shows manual testing decreasing. Velocity is positive.`;
        const result = await generateArchitecturalInsight(context);
        setInsight(result);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
        setLoadingAi(false);
      }
    };

    loadData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 size={40} className="animate-spin text-yellow-500" />
        <p>Загрузка аналитики...</p>
      </div>
    );
  }

  if (!data) return <div>Error loading data</div>;

  return (
    <div className="p-8 space-y-6 h-full overflow-y-auto scrollbar-hide">
      {/* Header & Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Архитектурный Дашборд</h2>
          <p className="text-slate-400 mt-1">Мониторинг качества и производительности 1С систем</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {['week', 'month', 'quarter'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setTimeFilter(t)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            timeFilter === t ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {t === 'week' ? 'Неделя' : t === 'month' ? 'Месяц' : 'Квартал'}
                    </button>
                ))}
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg border border-slate-700">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 to-slate-900 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-4 relative overflow-hidden">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 flex-shrink-0">
            <Sparkles size={24} />
        </div>
        <div className="z-10 max-w-4xl">
            <h4 className="text-indigo-300 font-bold text-sm mb-1 uppercase tracking-wider">AI Architecture Advisor</h4>
            <p className="text-slate-200 text-sm leading-relaxed">
                {loadingAi ? "Анализ телеметрии и логов производительности..." : insight}
            </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="APDEX (Производительность)" value={data.kpi.apdexScore.toString()} trend="-0.02" icon={Activity} color="text-emerald-400" bg="bg-emerald-500/10" />
        <KpiCard title="Ошибки (Prod)" value={data.kpi.bugs.toString()} trend="Critical" icon={ShieldAlert} color="text-red-400" bg="bg-red-500/10" />
        <KpiCard title="Скорость релизов" value={data.kpi.velocity} trend="vs last sprint" icon={Timer} color="text-blue-400" bg="bg-blue-500/10" />
        <KpiCard title="Ср. время Code Review" value={data.kpi.reviewTime} trend="-15%" icon={CheckCircle2} color="text-yellow-400" bg="bg-yellow-500/10" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
        {/* Velocity vs Bugs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                Скорость разработки и Качество
                <span className="text-xs text-slate-500 font-normal ml-auto">Story Points vs Bugs</span>
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data.velocity}>
                    <defs>
                        <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Legend />
                    <Area type="monotone" dataKey="planned" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPlanned)" name="План (SP)" />
                    <Area type="monotone" dataKey="completed" stroke="#eab308" fillOpacity={1} fill="url(#colorCompleted)" name="Факт (SP)" />
                    <Line type="monotone" dataKey="bugs" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} name="Баги" />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Test Coverage Stacked */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                Покрытие кода тестами
                <span className="text-xs text-slate-500 font-normal ml-auto">Unit vs UI vs Manual</span>
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data.coverage} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} 
                        formatter={(value: number) => `${value}%`}
                    />
                    <Legend />
                    <Bar dataKey="unit" stackId="a" fill="#22c55e" name="Unit (Vanessa-ADD)" />
                    <Bar dataKey="ui" stackId="a" fill="#3b82f6" name="UI (Automation)" />
                    <Bar dataKey="manual" stackId="a" fill="#64748b" name="Manual / None" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* APDEX Trend Line */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-72">
         <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} className="text-emerald-500" />
            Динамика производительности (APDEX)
            <div className="ml-auto flex gap-4 text-xs">
                <span className="text-emerald-400 font-bold">Цель: 0.95</span>
                <span className="text-slate-400">Текущий: {data.kpi.apdexScore}</span>
            </div>
        </h3>
        <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data.apdex}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis domain={[0.8, 1]} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                <Line type="stepAfter" dataKey="apdex" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="APDEX" />
                <Line type="monotone" dataKey="responseTime" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Response Time (s)" />
            </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, icon: Icon, color, bg }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between group hover:border-slate-700 transition-all">
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-slate-100">{value}</h4>
            <span className={`text-xs font-medium ${trend.includes('-') || trend === 'Critical' ? 'text-red-400' : 'text-green-400'}`}>
                {trend}
            </span>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
            <Icon size={24} className={color} />
        </div>
    </div>
);

export default Dashboard;
