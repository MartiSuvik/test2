import React, { useState } from 'react';
import { Wand2, History } from 'lucide-react';
import { VideoCreator } from './components/VideoCreator';
import { VideoHistory } from './components/VideoHistory';
import { AuthButton } from './components/AuthButton';
import { useAuth } from './hooks/useAuth';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';

type Tab = 'create' | 'history';

function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<Tab>('create');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <Wand2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Image to Video
          </h1>
          <p className="text-lg text-gray-600">
            Transform your images into stunning videos with AI
          </p>
        </div>

        {authMode === 'signin' ? <SignInForm /> : <SignUpForm />}
        
        <p className="mt-4 text-sm text-gray-600">
          {authMode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Image to Video
            </h1>
          </div>
          <AuthButton />
        </div>

        <div className="mb-8">
          <nav className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm transition-colors relative
                ${activeTab === 'create' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              Create Video
              {activeTab === 'create' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2
                ${activeTab === 'history' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <History className="w-4 h-4" />
              History
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </nav>
        </div>

        {activeTab === 'create' ? <VideoCreator /> : <VideoHistory />}
      </div>
    </div>
  );
}

export default App;
