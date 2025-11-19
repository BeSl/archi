import React from 'react';
import { Settings as SettingsIcon, Server, Shield, Bell, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <SettingsIcon size={32} className="text-yellow-500"/> 
          Настройки системы
      </h2>

      <div className="max-w-4xl space-y-8">
          {/* CI/CD Integration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Server size={20} className="text-blue-400"/>
                  Интеграция CI/CD
              </h3>
              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm text-slate-400 mb-1">Сервер сборок (Jenkins/GitLab)</label>
                          <input type="text" defaultValue="https://gitlab.company.com" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-yellow-500 outline-none"/>
                      </div>
                      <div>
                          <label className="block text-sm text-slate-400 mb-1">Access Token</label>
                          <input type="password" defaultValue="glpat-xxxxxxxxxxxxx" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-yellow-500 outline-none"/>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <input type="checkbox" id="auto-deploy" className="rounded bg-slate-950 border-slate-700 text-yellow-500"/>
                      <label htmlFor="auto-deploy" className="text-sm text-slate-300">Разрешить авто-деплой на тестовые контуры</label>
                  </div>
              </div>
          </div>

          {/* Analysis & AI */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-indigo-400"/>
                  Анализ кода и AI
              </h3>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm text-slate-400 mb-1">SonarQube URL</label>
                      <input type="text" defaultValue="http://sonar.company.local:9000" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-yellow-500 outline-none"/>
                  </div>
                  <div>
                      <label className="block text-sm text-slate-400 mb-1">Gemini API Key</label>
                      <input type="password" placeholder="AIzaSy..." className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-yellow-500 outline-none"/>
                  </div>
                  <div className="text-xs text-slate-500 italic">
                      Ключ используется для генерации Release Notes и автоматического ревью кода.
                  </div>
              </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-green-400"/>
                  Уведомления
              </h3>
              <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300 text-sm">Ошибки сборки (Build Failed)</span>
                      <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300 text-sm">Новое Code Review назначено мне</span>
                      <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300 text-sm">Успешный деплой на Prod</span>
                      <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="flex justify-end">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Save size={18} />
                  Сохранить настройки
              </button>
          </div>
      </div>
    </div>
  );
};

export default Settings;