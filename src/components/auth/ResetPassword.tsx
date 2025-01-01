import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
      setError('');
    } catch (err) {
      setError('Failed to reset password');
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg"
              required
            />
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {message && (
          <p className="text-green-600 text-sm">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}