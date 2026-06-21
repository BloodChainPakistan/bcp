import { Link } from 'react-router-dom';
import { Home, Droplet } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-bcp-light min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-bcp-red mb-8">
          <Droplet className="w-8 h-8 fill-current" />
        </div>
        <p className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Error 404</p>
        <h1 className="text-5xl md:text-6xl font-semibold text-bcp-dark mb-6">
          Page not <span className="text-bcp-red">found</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          The page you're looking for doesn't exist or may have moved. Let's get you back to safety.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-bcp-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-bcp-red/30"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
