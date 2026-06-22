import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTeam } from '../../lib/useTeam';
import type { TeamMember } from '../../lib/teamData';

// One card (w-64 = 256px) + gap-8 (32px) = 288px scroll step.
const STEP = 288;
// At or below this count the row is shown statically (no movement / no controls).
const MIN_TO_MOVE = 4;

const MemberCard = ({ member }: { member: TeamMember }) => (
    <div className="text-center group w-64 shrink-0">
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

/**
 * Team row.
 * - loading → skeletons
 * - 1..MIN_TO_MOVE members → static centered row (no movement, no controls)
 * - more than MIN_TO_MOVE → swipeable slider with prev/next arrows that also
 *   gently auto-advances (paused while the user is hovering/touching it).
 */
function TeamSlider({ members, loading }: { members: TeamMember[]; loading: boolean }) {
    const scroller = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const movable = members.length > MIN_TO_MOVE;

    useEffect(() => {
        if (!movable || paused) return;
        const id = setInterval(() => {
            const el = scroller.current;
            if (!el) return;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
            el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + STEP, behavior: 'smooth' });
        }, 3000);
        return () => clearInterval(id);
    }, [movable, paused, members.length]);

    if (loading) {
        return (
            <div className="flex gap-8 justify-center px-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    if (members.length === 0) {
        return <p className="text-center text-gray-400 py-8">No members to show yet.</p>;
    }

    // Few members → static, centered, no movement.
    if (!movable) {
        return (
            <div className="flex flex-wrap gap-8 justify-center">
                {members.map((m, i) => <MemberCard key={i} member={m} />)}
            </div>
        );
    }

    const nudge = (dir: number) => scroller.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' });

    return (
        <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
        >
            <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="Previous"
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-bcp-dark hover:bg-bcp-red hover:text-white transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            <div
                ref={scroller}
                className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-14 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {members.map((m, i) => (
                    <div key={i} className="snap-center shrink-0">
                        <MemberCard member={m} />
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="Next"
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-bcp-dark hover:bg-bcp-red hover:text-white transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
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

                <p className="text-center text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Board of Governance</p>
                <div className="mb-12">
                    <TeamSlider members={bog ?? []} loading={loading} />
                </div>

                <p className="text-center text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 mt-12">Core Cabinet</p>
                <div className="mb-4">
                    <TeamSlider members={core ?? []} loading={loading} />
                </div>
            </div>
        </section>
    );
}
