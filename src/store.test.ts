import { useVisualizerStore } from './store';

describe('useVisualizerStore', () => {
  beforeEach(() => {
    useVisualizerStore.setState(useVisualizerStore.getInitialState());
  });

  it('initializes with correct defaults', () => {
    const state = useVisualizerStore.getState();
    expect(state.currentScenario).toBeNull();
    expect(state.scenarios.length).toBeGreaterThan(0);
    expect(state.currentStep).toBe(-1);
    expect(state.playbackState).toBe('idle');
    expect(state.playbackSpeed).toBe(1000);
  });

  it('selects a scenario by id', () => {
    const state = useVisualizerStore.getState();
    const firstScenario = state.scenarios[0];

    state.selectScenario(firstScenario.id);

    const updated = useVisualizerStore.getState();
    expect(updated.currentScenario).not.toBeNull();
    expect(updated.currentScenario!.id).toBe(firstScenario.id);
    expect(updated.currentStep).toBe(-1);
    expect(updated.playbackState).toBe('idle');
  });
});
