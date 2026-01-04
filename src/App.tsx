import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { VisualizerPage } from './pages/VisualizerPage';
import { LearnPage } from './pages/LearnPage';
import { Github, Terminal, Play, BookOpen } from 'lucide-react';
import clsx from 'clsx';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9]">
        {/* Header */}
        <header className="flex-none h-14 border-b border-[#30363d] flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Terminal size={24} className="text-[#58a6ff]" />
              <h1 className="text-lg font-semibold">Claude Code Algorithm</h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1f2428]'
                  )
                }
              >
                <Play size={16} />
                Visualizer
              </NavLink>
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1f2428]'
                  )
                }
              >
                <BookOpen size={16} />
                Learn
              </NavLink>
            </nav>
          </div>

          <a
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
          >
            <Github size={20} />
          </a>
        </header>

        {/* Main content */}
        <Routes>
          <Route path="/" element={<VisualizerPage />} />
          <Route path="/learn" element={<LearnPage />} />
        </Routes>

        {/* Footer */}
        <footer className="flex-none h-8 border-t border-[#30363d] flex items-center justify-center px-4">
          <p className="text-xs text-[#8b949e]">
            Educational visualization of Claude Code's agentic loop algorithm
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
