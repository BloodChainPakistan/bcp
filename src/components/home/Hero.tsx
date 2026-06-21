import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, Users, Handshake, Droplet, HeartPulse } from 'lucide-react';

const STATS = [
  { value: '10K+', label: 'Registered Donors' },
  { value: '50+', label: 'Cities Covered' },
  { value: '24/7', label: 'Emergency Response' },
];

export default function Hero() {
  return (
    <section className="relative bg-white text-bcp-dark overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-bcp-red/10 blur-3xl" />
        <div className="absolute top-24 -right-32 w-[26rem] h-[26rem] rounded-full bg-bcp-orange/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(3,25,30,0.06) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, #000 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-bcp-red font-semibold text-sm mb-8 ring-1 ring-bcp-red/15">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-bcp-red opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-bcp-red" />
            </span>
            <Droplet className="h-4 w-4 fill-current" />
            <span>Saving Lives Across Pakistan</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-8">
            Together For{' '}
            <span className="text-bcp-red font-script">A Cause</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Every drop counts, every hand matters, a single cause that connects us all. Join us, because together, we are stronger than any crisis.
          </p>

          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-3">
            <Link to="/register-requester" className="btn btn-primary whitespace-nowrap">
              <HeartPulse className="h-5 w-5" /> Request Blood
            </Link>
            <Link to="/register-donor" className="btn btn-dark whitespace-nowrap">
              <Heart className="h-5 w-5" /> Become a Donor
            </Link>
            <Link to="/register-member" className="btn btn-dark whitespace-nowrap">
              <Users className="h-5 w-5" /> Become a Volunteer
            </Link>
            <Link to="/register-partner" className="btn btn-outline whitespace-nowrap">
              <Handshake className="h-5 w-5" /> Become a Partner
            </Link>
          </div>

          {/* Trust / stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-bcp-dark">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
