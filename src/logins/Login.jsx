import React from 'react';

export default function Login({ onLogin, onSwitchToSignUp }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <div className="space-y-4 text-sm">
          {[
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' }
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                name={name}
                type={type}
                placeholder={label}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={onLogin}            // always swaps to map
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Log In
          </button>
        </div>
        {onSwitchToSignUp && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </div>
  );
}