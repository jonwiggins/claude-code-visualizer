import { useState, useCallback, useEffect } from 'react';
import { FlowCanvas } from '../components/FlowCanvas';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { SandboxPanel } from '../components/SandboxPanel';
import { PlaybackControls } from '../components/PlaybackControls';
import { ExecutionLog } from '../components/ExecutionLog';
import { DetailPanel } from '../components/DetailPanel';
import { GripVertical } from 'lucide-react';

export function VisualizerPage() {
  // Sidebar resizing state
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
