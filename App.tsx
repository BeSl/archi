import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ReleaseBoard from './components/ReleaseBoard';
import RepositoryList from './components/RepositoryList';
import ReviewHub from './components/ReviewHub';
import DeveloperTeam from './components/DeveloperTeam';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-yellow-500/30">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative bg-grid-slate-900/[0.04]">
            {/* Background Pattern Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/releases" element={<ReleaseBoard />} />
              <Route path="/repos" element={<RepositoryList />} />
              <Route path="/reviews" element={<ReviewHub />} />
              <Route path="/team" element={<DeveloperTeam />} />
              <Route path="/settings" element={<Settings />} />
              {/* Placeholder for Tasks view, redirecting to Dashboard for now as per scope limit */}
              <Route path="/tasks" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;