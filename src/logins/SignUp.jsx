import React, { useState } from 'react';

export default function SignUp({ onSignUp, onSwitchToLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    hometown: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // simulate sign-up → show map
    onSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {[
            { label: 'First Name', name: 'firstName', type: 'text' },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Age', name: 'age', type: 'number' },
            { label: 'Hometown', name: 'hometown', type: 'text' }
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={label}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}