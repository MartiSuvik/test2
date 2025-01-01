import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthButton() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <button
      onClick={user ? logout : signInWithGoogle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      {user ? (
        <>
          <LogOut className="w-4 h-4" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          Sign in with Google
        </>
      )}
    </button>
  );
}