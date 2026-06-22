import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function AdminLogin() {
  const { signIn, session, role, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Redirect once we know the role IS admin. Waiting for roleLoading avoids the
  // race where the gate bounced a genuine admin before their role had loaded.
  useEffect(() => {
    if (session && !roleLoading && role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [session, role, roleLoading, navigate]);

  // Derived (not stored in state): signed in, role resolved, but not an admin.
  const accessDenied = attempted && !!session && !roleLoading && role !== 'admin';
  const message =
    error ??
    (accessDenied
      ? 'Signed in, but this account does not have admin access. Ask an administrator to grant the admin role.'
      : null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setAttempted(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setError(error);
    // On success the effect above redirects once the admin role resolves.
  }

  return (
    <div className="min-h-screen bg-bcp-dark flex items-center justify-center p-4">
      <form onSubmit={handle} className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-bcp-red mb-4">
            <Droplet className="w-7 h-7 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-bcp-dark">Admin Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Blood Chain Pakistan — Command Center</p>
        </div>

        {message && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm text-center">{message}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className={`w-full ${busy ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-bold py-3 rounded-xl transition-colors`}
        >
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
