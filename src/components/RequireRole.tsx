import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

/** Gates child routes behind a session + a specific role. */
export default function RequireRole({ role: required }: { role: 'admin' | 'hospital' }) {
  const { session, role, loading, roleLoading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-bcp-dark">Loading…</div>
    );
  }
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  // Logged in but the role isn't the required one. Don't bounce yet if we're
  // still fetching it from the DB right after login — that race would kick a
  // genuine admin back to the login screen. Wait for the lookup to resolve.
  if (role !== required) {
    if (roleLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-bcp-dark">Loading…</div>
      );
    }
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
