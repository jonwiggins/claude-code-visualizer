import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useVisualizerStore } from '../store';
import clsx from 'clsx';

export function PlaybackControls() {
  const {
    playbackState,
    currentStep,
    currentScenario,
    playbackSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setPlaybackSpeed,
  } = useVisualizerStore();

  const totalSteps = currentScenario?.steps.length ?? 0;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const speeds = [
    { label: '0.5x', value: 2000 },
    { label: '1x', value: 1000 },
    { label: '2x', value: 500 },
    { label: '4x', value: 250 },
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#8b949e]">Playback</span>
        <span className="text-sm text-[#c9d1d9]">
          Step {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#30363d] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[#58a6ff] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={reset}
          disabled={!currentScenario}
          className="p-2 rounded-lg hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={stepBackward}
          disabled={!currentScenario || currentStep <= 0}
          className="p-2 rounded-lg hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Step Back"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={playbackState === 'playing' ? pause : play}
          disabled={!currentScenario}
          className={clsx(
            'p-3 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
            playbackState === 'playing'
              ? 'bg-[#f85149] hover:bg-[#f85149]/80'
              : 'bg-[#238636] hover:bg-[#238636]/80',
          )}
          title={playbackState === 'playing' ? 'Pause' : 'Play'}
        >
          {playbackState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={stepForward}
          disabled={!currentScenario || currentStep >= totalSteps - 1}
          className="p-2 rounded-lg hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Step Forward"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Speed selector */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <span className="text-xs text-[#8b949e] mr-2">Speed:</span>
        {speeds.map((speed) => (
          <button
            key={speed.value}
            onClick={() => setPlaybackSpeed(speed.value)}
            className={clsx(
              'px-2 py-1 text-xs rounded transition-colors',
              playbackSpeed === speed.value
                ? 'bg-[#58a6ff] text-white'
                : 'bg-[#30363d] hover:bg-[#3d444d]',
            )}
          >
            {speed.label}
          </button>
        ))}
      </div>
    </div>
  );
}
