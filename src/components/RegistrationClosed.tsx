import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

/** Shown when an admin has turned a registration feature off via feature flags. */
export default function RegistrationClosed({ title }: { title: string }) {
  return (
    <div className="bg-bcp-light min-h-screen flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-md">
        <div className="w-14 h-14 bg-bcp-light text-bcp-red rounded-full flex items-center justify-center mx-auto mb-5">
          <Info className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-bcp-dark mb-3">{title} is currently closed</h1>
        <p className="text-gray-600 mb-6">
          This registration is temporarily unavailable. Please check back soon, or reach out and we’ll help.
        </p>
        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
      </div>
    </div>
  );
}
