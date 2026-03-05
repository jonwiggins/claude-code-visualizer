import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVisualizerStore } from '../store';

export function useScenarioFromUrl() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentScenario = useVisualizerStore((s) => s.currentScenario);
  const selectScenario = useVisualizerStore((s) => s.selectScenario);
  const scenarios = useVisualizerStore((s) => s.scenarios);

  // On mount: read scenario from URL (skip if already selected)
  useEffect(() => {
    const scenarioId = searchParams.get('scenario');
    if (
      scenarioId &&
      scenarioId !== currentScenario?.id &&
      scenarios.some((s) => s.id === scenarioId)
    ) {
      selectScenario(scenarioId);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On scenario change: update URL
  useEffect(() => {
    if (currentScenario) {
      setSearchParams({ scenario: currentScenario.id }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [currentScenario, setSearchParams]);
}
