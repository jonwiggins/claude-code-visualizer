import { useVisualizerStore } from './store';

describe('useVisualizerStore', () => {
  beforeEach(() => {
    useVisualizerStore.setState(useVisualizerStore.getInitialState());
  });

  it('initializes with algorithm-overview selected and fully expanded', () => {
    const state = useVisualizerStore.getState();
    expect(state.currentScenario).not.toBeNull();
    expect(state.currentScenario!.id).toBe('algorithm-overview');
    expect(state.scenarios.length).toBeGreaterThan(0);
    expect(state.currentStep).toBe(state.currentScenario!.steps.length - 1);
    expect(state.playbackState).toBe('finished');
    expect(state.playbackSpeed).toBe(1000);
  });

  it('selects a scenario by id', () => {
    const state = useVisualizerStore.getState();
    // Select a non-overview scenario
    const scenario = state.scenarios.find((s) => s.id === 'simple-read')!;

    state.selectScenario(scenario.id);

    const updated = useVisualizerStore.getState();
    expect(updated.currentScenario).not.toBeNull();
    expect(updated.currentScenario!.id).toBe('simple-read');
    expect(updated.currentStep).toBe(-1);
    expect(updated.playbackState).toBe('idle');
  });

  it('selects algorithm-overview fully expanded', () => {
    const state = useVisualizerStore.getState();

    // First select a different scenario
    state.selectScenario('simple-read');
    // Then select overview
    useVisualizerStore.getState().selectScenario('algorithm-overview');

    const updated = useVisualizerStore.getState();
    expect(updated.currentScenario!.id).toBe('algorithm-overview');
    expect(updated.currentStep).toBe(updated.currentScenario!.steps.length - 1);
    expect(updated.playbackState).toBe('finished');
  });
});
