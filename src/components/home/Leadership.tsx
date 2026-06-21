import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

import sanaImg from '../../assets/team/CoreCabinet/Sana Ur Rehman.jpeg';
import qandeelImg from '../../assets/team/CoreCabinet/Qandeel Saleem.jpeg';
import arsalImg from '../../assets/team/CoreCabinet/Arsal Imran.jpeg';
import saifImg from '../../assets/team/CoreCabinet/Saif Ullah.jpeg';
import arshiaImg from '../../assets/team/CoreCabinet/Arshia Amraiz.jpeg';
import ayeshaImg from '../../assets/team/CoreCabinet/Ayesha Javaid.jpeg';
import harnainImg from '../../assets/team/CoreCabinet/Harnain Ayub.jpeg';
import masoodImg from '../../assets/team/CoreCabinet/Masood Khan.jpeg';
import jehanImg from '../../assets/team/CoreCabinet/Jehan Badshah.jpeg';

import Luqman from "../../assets/team/Bogs/Dr Luqman Hakeem.jpeg"
import Afaq from "../../assets/team/Bogs/Afaq Karim.JPG"
import Rehan from "../../assets/team/Bogs/engr Rehan Khan.jpeg"
import Kamran from "../../assets/team/Bogs/Engr Kamran Khan.JPG"
import Waqas from "../../assets/team/Bogs/Muhammad Waqas Blood Wala.jpeg"
import Ibadullah from "../../assets/team/Bogs/IbadUllah Jan.jpeg"
import Saeed from "../../assets/team/Bogs/Saeed Anwar.jpeg"
import Usman from "../../assets/team/Bogs/Usman Ali.jpeg"
import Sajjad from "../../assets/team/Bogs/Sajjad Saeed.jpeg"


const bogMembers = [
    { name: 'Dr Luqman Hakim', role: 'Founder', img: Luqman },
    { name: 'Engr Rehan Khan', role: 'Co Founder', img: Rehan },
    { name: 'Afaq Karim', role: 'Member', img: Afaq },
    { name: 'Engr Kamran Khan', role: 'Member', img: Kamran },
    { name: 'Ibadullah Jan', role: 'Member', img: Ibadullah },
    { name: 'Muhamad Waqas Bloodwala', role: 'Member', img: Waqas },
    { name: 'Saeed Anwar', role: 'Member', img: Saeed },
    { name: 'Usman Ali', role: 'Member', img: Usman },
    { name: 'Sajjad Saeed', role: 'Member', img: Sajjad },
];

const coreCabinet = [
    { name: 'Sana Ur Rehman', role: 'Country Governor', img: sanaImg },
    { name: 'Qandeel Saleem', role: 'Secretary General', img: qandeelImg },
    { name: 'Arsal Imran', role: 'Director Media and Communication', img: arsalImg },
    { name: 'Saif Ullah', role: 'Assistant Director Media and Communication', img: saifImg },
    { name: 'Arshia Amraiz', role: 'Director Communications and Liaisons', img: arshiaImg },
    { name: 'Ayesha Javaid', role: 'Director Donor Database and Volunteer Management', img: ayeshaImg },
    { name: 'Harnain Ayub', role: 'Assistant Director Donor Database and Volunteer Management', img: harnainImg },
    { name: 'Masood Khan', role: 'Director Training and Development', img: masoodImg },
    { name: 'Jehan Badshah', role: 'Director Thalassemia Prevention', img: jehanImg },
];

// Bundled photos keyed by name, so DB-driven members still show their picture
// (the seeded rows have no photo_url; admin uploads override this).
const photoByName: Record<string, string> = Object.fromEntries(
    [...bogMembers, ...coreCabinet].map((m) => [m.name, m.img]),
);


const MemberCard = ({ member, hidden = false }: { member: typeof bogMembers[0]; hidden?: boolean }) => (
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

export default function Leadership() {
    const [bog, setBog] = useState(bogMembers);
    const [core, setCore] = useState(coreCabinet);

    useEffect(() => {
        let active = true;
        (async () => {
            const { data } = await supabase
                .from('team_members')
                .select('name, role, photo_url, group_name')
                .eq('is_current', true)
                .eq('is_published', true)
                .order('sort_order', { ascending: true });
            if (!active || !data || data.length === 0) return; // keep hardcoded fallback
            const pick = (g: string) =>
                data
                    .filter((m) => m.group_name === g)
                    .map((m) => ({ name: m.name as string, role: (m.role as string) ?? '', img: (m.photo_url as string) || photoByName[m.name as string] || '' }));
            const dbBog = pick('bog');
            const dbCore = pick('core_cabinet');
            if (dbBog.length) setBog(dbBog);
            if (dbCore.length) setCore(dbCore);
        })();
        return () => {
            active = false;
        };
    }, []);

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
                    <motion.div
                        className="flex gap-8 w-max"
                        animate={{ x: [0, -2000] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
                    >
                        {[...bog, ...bog].map((member, idx) => (
                            <MemberCard key={idx} member={member} hidden={idx >= bog.length} />
                        ))}
                    </motion.div>
                </div>

                {/* Core Cabinet Row — scrolls right */}
                <p className="text-center text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 mt-12">Core Cabinet</p>
                <div className="relative w-full overflow-hidden mb-16">
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <motion.div
                        className="flex gap-8 w-max"
                        animate={{ x: [-2000, 0] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
                    >
                        {[...core, ...core].map((member, idx) => (
                            <MemberCard key={idx} member={member} hidden={idx >= core.length} />
                        ))}
                    </motion.div>
                </div>

                <div className="text-center">
                    {/* <Link to="/about" className="inline-flex items-center gap-2 bg-bcp-dark hover:bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all">
                        View Whole Team <ArrowRight className="w-5 h-5" />
                    </Link> */}
                </div>
            </div>
        </section>
    );
}
