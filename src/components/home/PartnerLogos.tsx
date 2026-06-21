import { Link } from 'react-router-dom';
import { Handshake } from 'lucide-react';
import { motion } from 'motion/react';

// Inline SVG partner logos — no external image dependency
const partners = [
    {
        name: 'Red Crescent',
        logo: (
            <svg viewBox="0 0 130 60" className="h-10 w-auto" aria-label="Red Crescent">
                {/* Crescent carved from two circles */}
                <circle cx="26" cy="30" r="17" fill="#D62B2B" />
                <circle cx="32" cy="27" r="14" fill="#F9FAFB" />
                {/* Star */}
                <path d="M40 22 l1.3 3.9 4.1 0 -3.3 2.5 1.2 3.9 -3.3-2.4 -3.3 2.4 1.2-3.9 -3.3-2.5 4.1 0Z" fill="#D62B2B" />
                <text x="52" y="27" fontSize="11" fontWeight="700" fill="#D62B2B" fontFamily="sans-serif">Red</text>
                <text x="52" y="41" fontSize="11" fontWeight="700" fill="#D62B2B" fontFamily="sans-serif">Crescent</text>
            </svg>
        )
    },
    {
        name: 'WHO',
        logo: (
            <svg viewBox="0 0 120 60" className="h-10 w-auto" aria-label="WHO">
                <circle cx="30" cy="30" r="22" fill="none" stroke="#00A2CC" strokeWidth="3" />
                <path d="M8 30 Q20 10 30 30 Q40 50 52 30" stroke="#00A2CC" strokeWidth="2.5" fill="none" />
                <path d="M8 30 Q20 50 30 30 Q40 10 52 30" stroke="#00A2CC" strokeWidth="2.5" fill="none" />
                <line x1="8" y1="30" x2="52" y2="30" stroke="#00A2CC" strokeWidth="2" />
                <line x1="30" y1="8" x2="30" y2="52" stroke="#00A2CC" strokeWidth="2" />
                <text x="60" y="25" fontSize="16" fontWeight="900" fill="#00A2CC" fontFamily="sans-serif">WHO</text>
                <text x="60" y="40" fontSize="8" fill="#555" fontFamily="sans-serif">World Health</text>
                <text x="60" y="50" fontSize="8" fill="#555" fontFamily="sans-serif">Organization</text>
            </svg>
        )
    },
    {
        name: 'UNICEF',
        logo: (
            <svg viewBox="0 0 120 60" className="h-10 w-auto" aria-label="UNICEF">
                <circle cx="30" cy="30" r="22" fill="#009EDB" />
                <text x="30" y="35" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif" textAnchor="middle">UNICEF</text>
                <text x="65" y="25" fontSize="15" fontWeight="900" fill="#009EDB" fontFamily="sans-serif">UNICEF</text>
                <text x="65" y="42" fontSize="9" fill="#555" fontFamily="sans-serif">For every child</text>
            </svg>
        )
    },
    {
        name: 'Govt of Pakistan',
        logo: (
            <svg viewBox="0 0 130 60" className="h-10 w-auto" aria-label="Govt of Pakistan">
                <rect x="5" y="10" width="40" height="40" rx="4" fill="#01411C" />
                <text x="25" y="36" fontSize="20" fill="white" textAnchor="middle" fontFamily="serif">☪</text>
                <text x="52" y="26" fontSize="10" fontWeight="700" fill="#01411C" fontFamily="sans-serif">Government</text>
                <text x="52" y="38" fontSize="10" fontWeight="700" fill="#01411C" fontFamily="sans-serif">of Pakistan</text>
            </svg>
        )
    },
    {
        name: 'Safe Blood',
        logo: (
            <svg viewBox="0 0 120 60" className="h-10 w-auto" aria-label="Safe Blood">
                <path d="M30 10 C30 10 14 28 14 38 A16 16 0 0 0 46 38 C46 28 30 10 30 10Z" fill="#D62B2B" />
                <path d="M22 38 Q25 44 30 46 Q35 44 38 38" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="54" y="28" fontSize="13" fontWeight="800" fill="#D62B2B" fontFamily="sans-serif">SAFE</text>
                <text x="54" y="44" fontSize="13" fontWeight="800" fill="#D62B2B" fontFamily="sans-serif">BLOOD</text>
            </svg>
        )
    },
    {
        name: 'Thalassemia Society',
        logo: (
            <svg viewBox="0 0 140 60" className="h-10 w-auto" aria-label="Thalassemia Society">
                <circle cx="28" cy="30" r="22" fill="#10B981" opacity="0.15" />
                <path d="M18 30 C18 22 22 16 28 16 C34 16 38 22 38 30 C38 38 34 44 28 44 C22 44 18 38 18 30Z" fill="none" stroke="#10B981" strokeWidth="2.5" />
                <path d="M22 25 C28 22 34 25 28 32 C22 25 28 22 34 25" stroke="#10B981" strokeWidth="2" fill="none" />
                <text x="56" y="26" fontSize="11" fontWeight="700" fill="#10B981" fontFamily="sans-serif">Thalassemia</text>
                <text x="56" y="42" fontSize="11" fontWeight="700" fill="#10B981" fontFamily="sans-serif">Foundation</text>
            </svg>
        )
    },
    {
        name: 'Medical Colleges',
        logo: (
            <svg viewBox="0 0 130 60" className="h-10 w-auto" aria-label="Medical Colleges">
                <rect x="10" y="8" width="40" height="44" rx="3" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                <line x1="30" y1="16" x2="30" y2="44" stroke="#3B82F6" strokeWidth="2.5" />
                <line x1="16" y1="30" x2="44" y2="30" stroke="#3B82F6" strokeWidth="2.5" />
                <text x="58" y="26" fontSize="11" fontWeight="700" fill="#3B82F6" fontFamily="sans-serif">Medical</text>
                <text x="58" y="42" fontSize="11" fontWeight="700" fill="#3B82F6" fontFamily="sans-serif">Colleges</text>
            </svg>
        )
    },
    {
        name: 'NGO Network',
        logo: (
            <svg viewBox="0 0 130 60" className="h-10 w-auto" aria-label="NGO Network">
                <circle cx="20" cy="30" r="10" fill="none" stroke="#FF9505" strokeWidth="2.5" />
                <circle cx="45" cy="20" r="10" fill="none" stroke="#FF9505" strokeWidth="2.5" />
                <circle cx="45" cy="40" r="10" fill="none" stroke="#FF9505" strokeWidth="2.5" />
                <line x1="30" y1="30" x2="35" y2="22" stroke="#FF9505" strokeWidth="2" />
                <line x1="30" y1="30" x2="35" y2="38" stroke="#FF9505" strokeWidth="2" />
                <text x="62" y="26" fontSize="12" fontWeight="700" fill="#FF9505" fontFamily="sans-serif">NGO</text>
                <text x="62" y="42" fontSize="12" fontWeight="700" fill="#FF9505" fontFamily="sans-serif">Network</text>
            </svg>
        )
    },
];

// Duplicate for seamless loop
const tickerItems = [...partners, ...partners];

export default function PartnerLogos() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-bcp-red font-bold tracking-widest uppercase mb-3 text-sm">Our Partners</p>
                    <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark">
                        Trusted by <span className="text-bcp-red">Leading Networks</span>
                    </h3>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        We collaborate with hospitals, health authorities, and humanitarian organizations to keep safe blood within reach for every patient.
                    </p>
                </motion.div>
            </div>

            {/* Auto-play ticker (pauses on hover so logos are readable) */}
            <div className="relative w-full overflow-hidden mb-20">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

                <div className="partner-ticker flex gap-12 items-center w-max">
                    {tickerItems.map((partner, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-center px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:shadow-md hover:border-bcp-red/30 hover:-translate-y-1 transition-all duration-300 shrink-0 h-20 min-w-[160px]"
                        >
                            {partner.logo}
                        </div>
                    ))}
                </div>

                {/* Keyframe animation injected as a style tag */}
                <style>{`
          @keyframes ticker-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .partner-ticker {
            animation: ticker-scroll 32s linear infinite;
          }
          .partner-ticker:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .partner-ticker { animation: none; flex-wrap: wrap; justify-content: center; }
          }
        `}</style>
            </div>

            {/* CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-bcp-light rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-left max-w-xl">
                            <h4 className="text-3xl font-bold text-bcp-dark mb-4">Support Our Cause</h4>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Join our network of partners and help us make safe blood available to every corner of Pakistan. Together, we can save lives.
                            </p>
                        </div>
                        <Link to="/register-partner" className="btn btn-primary btn-lg shrink-0">
                            <Handshake className="w-6 h-6" /> Become a Partner
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Handshake className="w-64 h-64 text-bcp-red" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
