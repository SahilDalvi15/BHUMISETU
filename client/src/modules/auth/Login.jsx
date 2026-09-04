import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const demoAccounts = [
    { id: 'admin_nat', label: 'National Administrator' },
    { id: 'off_state_mh', label: 'State Officer (MH)' },
    { id: 'off_dist_thn', label: 'District Officer (THN)' },
    { id: 'field_01', label: 'Field Verifier' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-green-700 p-3 rounded-full">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          BHUMISETU
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          National Land Acquisition & Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-green-700">
          <div className="mb-6 bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-200">
            <strong>Prototype Demo Access:</strong> Please select a demo role below to continue.
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Select Demo Role
              </label>
              <div className="mt-1">
                <select
                  id="username"
                  name="username"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a role...</option>
                  {demoAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || !username}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-xs text-center text-gray-500">
              Government of India • Ministry of Rural Development • Department of Land Resources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
