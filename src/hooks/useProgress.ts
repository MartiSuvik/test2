import { useState } from 'react';

export type ProgressStage = 'upload' | 'init' | 'generate' | 'prepare' | 'complete' | 'error';

interface ProgressState {
  stage: ProgressStage;
  progress: number;
  error?: string;
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>({
    stage: 'upload',
    progress: 0
  });

  const updateProgress = (stage: ProgressStage, progress: number, error?: string) => {
    setState({ stage, progress, error });
  };

  const getOverallProgress = (): number => {
    const stageWeights = {
      upload: 0.3,    // 0-30%
      init: 0.1,      // 30-40%
      generate: 0.5,  // 40-90%
      prepare: 0.1,   // 90-100%
      complete: 1,    // 100%
      error: 0        // 0%
    };

    const baseProgress = {
      upload: 0,
      init: 30,
      generate: 40,
      prepare: 90,
      complete: 100,
      error: 0
    };

    return baseProgress[state.stage] + (state.progress * stageWeights[state.stage]);
  };

  return {
    stage: state.stage,
    error: state.error,
    progress: getOverallProgress(),
    updateProgress
  };
}