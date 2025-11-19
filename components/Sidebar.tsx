import React from 'react';
import { LayoutDashboard, GitBranch, Users, ListTodo, Box, FileCode2, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
    { path: '/releases', icon: Box, label: 'Релизы' },
    { path: '/repos', icon: GitBranch, label: 'Хранилища' },
    { path: '/reviews', icon: FileCode2, label: 'Код-ревью' },
    { path: '/team', icon: Users, label: 'Команда' },
    { path: '/tasks', icon: ListTodo, label: 'Задачи' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
            <span className="text-slate-900 font-bold text-lg">1C</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">Architect<span className="text-yellow-500">.Hub</span></h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-yellow-500/10 text-yellow-500 font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? 'text-yellow-500' : 'text-slate-500 group-hover:text-slate-300'} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link 
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors w-full rounded-lg ${isActive('/settings') ? 'bg-slate-800 text-white' : ''}`}
        >
          <Settings size={20} />
          <span>Настройки</span>
        </Link>
        <div className="mt-4 text-xs text-slate-600 text-center">
            v2.4.0 | Powered by Gemini
        </div>
      </div>
    </div>
  );
};

export default Sidebar;