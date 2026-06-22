import { motion } from 'motion/react';
import { useTeam } from '../../lib/useTeam';
import type { TeamMember } from '../../lib/teamData';

const MemberCard = ({ member, hidden = false }: { member: TeamMember; hidden?: boolean }) => (
    <div className="text-center group w-64 shrink-0" aria-hidden={hidden}>
        <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
            {member.img ? (
                <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-bcp-light text-bcp-red text-5xl font-bold">{member.name.charAt(0)}</div>
            )}
        </div>
        <h4 className="text-xl font-bold text-bcp-dark mb-1">{member.name}</h4>
        <p className="text-bcp-red font-medium">{member.role}</p>
    </div>
);

const SkeletonCard = () => (
    <div className="text-center w-64 shrink-0">
        <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-5 w-32 mx-auto mb-2 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-24 mx-auto rounded bg-gray-100 animate-pulse" />
    </div>
);

/** A horizontally-scrolling marquee of member cards (or skeletons while loading). */
function MarqueeRow({ members, loading, animateX }: { members: TeamMember[]; loading: boolean; animateX: [number, number] }) {
    if (loading) {
        return (
            <div className="flex gap-8 w-max">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }
    if (members.length === 0) return null;
    return (
        <motion.div
            className="flex gap-8 w-max"
            animate={{ x: animateX }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
        >
            {[...members, ...members].map((member, idx) => (
                <MemberCard key={idx} member={member} hidden={idx >= members.length} />
            ))}
        </motion.div>
    );
}

export default function Leadership() {
    const { bog, core, loading } = useTeam();

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Our Leadership</h2>
                    <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark mb-6">
                        The People Behind <span className="text-bcp-red">Our Mission</span>
                    </h3>
                    <p className="text-gray-600 text-lg">
                        Meet the dedicated individuals driving our mission forward across the nation.
                    </p>
                </div>

                {/* BOG Row — scrolls left */}
                <p className="text-center text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Board of Governance</p>
                <div className="relative w-full overflow-hidden mb-4">
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <MarqueeRow members={bog ?? []} loading={loading} animateX={[0, -2000]} />
                </div>

                {/* Core Cabinet Row — scrolls right */}
                <p className="text-center text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 mt-12">Core Cabinet</p>
                <div className="relative w-full overflow-hidden mb-16">
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <MarqueeRow members={core ?? []} loading={loading} animateX={[-2000, 0]} />
                </div>
            </div>
        </section>
    );
}
