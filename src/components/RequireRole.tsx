import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

/** Gates child routes behind a session + a specific role. */
export default function RequireRole({ role: required }: { role: 'admin' | 'hospital' }) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-bcp-dark">Loading…</div>
    );
  }
  if (!session || role !== required) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
