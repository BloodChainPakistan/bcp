import type { DonorStatus } from '../../types/database';

const BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
  active: 'bg-blue-100 text-blue-700',
  inactive: 'bg-gray-100 text-gray-500',
};

export function StatusBadge({ status }: { status: DonorStatus | string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${BADGE[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

/** Detects a "table not created yet" error so we can prompt for `db push`. */
export function isMissingTable(error: string | null): boolean {
  if (!error) return false;
  return /does not exist|schema cache|find the table/i.test(error);
}

export function MigrationNotice() {
  return (
    <div className="m-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
      <p className="font-semibold mb-1">This section needs a database update.</p>
      <p className="text-sm">
        Run <code className="bg-yellow-100 px-1.5 py-0.5 rounded">npx supabase db push</code> to enable it
        (applies the Content CMS migration).
      </p>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-bcp-dark">{title}</h1>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}
