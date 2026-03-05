import { useState, useCallback, useEffect } from 'react';
import { FlowCanvas } from '../components/FlowCanvas';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { SandboxPanel } from '../components/SandboxPanel';
import { PlaybackControls } from '../components/PlaybackControls';
import { ExecutionLog } from '../components/ExecutionLog';
import { DetailPanel } from '../components/DetailPanel';
import { MobileDrawer } from '../components/MobileDrawer';
import { GripVertical, List, SlidersHorizontal } from 'lucide-react';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useScenarioFromUrl } from '../hooks/useScenarioFromUrl';

export function VisualizerPage() {
  useScenarioFromUrl();
  const isMobile = useIsMobile();

  // Mobile drawer state
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  // Sidebar resizing state (desktop only)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(340);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [resizingSide, setResizingSide] = useState<'left' | 'right' | null>(null);

  const startResizingLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResizingSide('left');
  }, []);

  const startResizingRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setResizingSide('right');
  }, []);

  const stopResizing = useCallback(() => {
    setResizingSide(null);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (resizingSide === 'left') {
        const newWidth = e.clientX;
        setLeftSidebarWidth(Math.max(280, Math.min(500, newWidth)));
      } else if (resizingSide === 'right') {
        const newWidth = window.innerWidth - e.clientX;
        setRightSidebarWidth(Math.max(280, Math.min(600, newWidth)));
      }
    },
    [resizingSide],
  );

  useEffect(() => {
    if (resizingSide) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizingSide, resize, stopResizing]);

  if (isMobile) {
    return (
      <div className="flex-1 relative min-h-0">
        {/* Full-width canvas */}
        <div className="h-full p-2">
          <FlowCanvas />
        </div>

        {/* Floating buttons */}
        <button
          onClick={() => setLeftDrawerOpen(true)}
          className="absolute bottom-4 left-4 z-30 p-3 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-full shadow-lg transition-colors"
          aria-label="Open scenarios"
        >
          <List size={20} />
        </button>
        <button
          onClick={() => setRightDrawerOpen(true)}
          className="absolute bottom-4 right-4 z-30 p-3 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-full shadow-lg transition-colors"
          aria-label="Open controls"
        >
          <SlidersHorizontal size={20} />
        </button>

        {/* Drawers */}
        <MobileDrawer
          open={leftDrawerOpen}
          onClose={() => setLeftDrawerOpen(false)}
          side="left"
          title="Scenarios"
        >
          <ScenarioPicker />
          <SandboxPanel />
        </MobileDrawer>

        <MobileDrawer
          open={rightDrawerOpen}
          onClose={() => setRightDrawerOpen(false)}
          side="right"
          title="Controls"
        >
          <PlaybackControls />
          <ExecutionLog />
          <DetailPanel />
        </MobileDrawer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left sidebar - Scenarios & Sandbox (resizable) */}
      <aside
        className="flex-none border-r border-[#30363d] p-4 overflow-auto space-y-4"
        style={{ width: leftSidebarWidth }}
      >
        <ScenarioPicker />
        <SandboxPanel />
      </aside>

      {/* Left resize handle */}
      <div
        className="flex-none w-1 bg-[#30363d] hover:bg-[#58a6ff] cursor-col-resize flex items-center justify-center group transition-colors"
        onMouseDown={startResizingLeft}
        style={{
          backgroundColor: resizingSide === 'left' ? '#58a6ff' : undefined,
        }}
      >
        <div className="absolute p-1 rounded bg-[#30363d] group-hover:bg-[#58a6ff] transition-colors">
          <GripVertical size={12} className="text-[#8b949e] group-hover:text-white" />
        </div>
      </div>

      {/* Center - Flow Canvas */}
      <main className="flex-1 p-4 min-w-0">
        <FlowCanvas />
      </main>

      {/* Right resize handle */}
      <div
        className="flex-none w-1 bg-[#30363d] hover:bg-[#58a6ff] cursor-col-resize flex items-center justify-center group transition-colors"
        onMouseDown={startResizingRight}
        style={{
          backgroundColor: resizingSide === 'right' ? '#58a6ff' : undefined,
        }}
      >
        <div className="absolute p-1 rounded bg-[#30363d] group-hover:bg-[#58a6ff] transition-colors">
          <GripVertical size={12} className="text-[#8b949e] group-hover:text-white" />
        </div>
      </div>

      {/* Right sidebar - Controls, Log, Details (resizable) */}
      <aside
        className="flex-none border-l border-[#30363d] p-4 overflow-auto space-y-4"
        style={{ width: rightSidebarWidth }}
      >
        <PlaybackControls />
        <ExecutionLog />
        <DetailPanel />
      </aside>
    </div>
  );
}
