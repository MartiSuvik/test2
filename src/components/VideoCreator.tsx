import React, { useState } from 'react';
import { EffectGrid } from './EffectGrid';
import { VideoConfig } from './VideoConfig';
import { effects } from '../data/effects';
import type { Effect } from '../data/effects';
import type { VideoConfig as VideoConfigType } from '../types/video';

const steps = ['Select Effect', 'Configure Video'] as const;
type Step = typeof steps[number];

export function VideoCreator() {
  const [currentStep, setCurrentStep] = useState<Step>('Select Effect');
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [config, setConfig] = useState<VideoConfigType>({
    duration: 5,
    aspectRatio: '16:9',
  });

  const handleEffectSelect = (effect: Effect) => {
    setSelectedEffect(effect);
    setCurrentStep('Configure Video');
  };

  const handleBack = () => {
    if (currentStep === 'Configure Video') {
      setCurrentStep('Select Effect');
      setSelectedEffect(null);
      setImageFile(null);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'Select Effect':
        return (
          <EffectGrid
            effects={effects}
            selectedEffect={selectedEffect}
            onSelectEffect={handleEffectSelect}
          />
        );
      case 'Configure Video':
        return (
          <VideoConfig
            config={config}
            onChange={setConfig}
            onBack={handleBack}
            imageFile={imageFile}
            onImageSelect={setImageFile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 && (
                <div className="w-16 h-0.5 bg-gray-200">
                  <div
                    className={`h-full bg-blue-600 transition-all ${
                      steps.indexOf(currentStep) > index ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : steps.indexOf(currentStep) > steps.indexOf(step)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
            </React.Fragment>
          ))}
        </nav>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-900">{currentStep}</h2>
        </div>
      </div>

      {renderStep()}
    </div>
  );
}
