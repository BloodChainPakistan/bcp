import { motion } from 'motion/react';
import {
    BloodActivismIcon,
    ThalassemiaIcon,
    AwarenessIcon,
    LeadershipIcon
} from './HomeIllustrations';

const focusAreas = [
    { title: 'Blood Activism', desc: 'Actively mobilizing volunteers, educating communities, and building donor networks to ensure safe and accessible blood for every patient in need.', Icon: BloodActivismIcon },
    { title: 'Thalassemia Prevention', desc: 'Working to eliminate Thalassemia through premarital screening, community awareness, and patient support.', Icon: ThalassemiaIcon },
    { title: 'Safe Blood Awareness', desc: 'Educating communities on safe blood practices, dispelling myths, and promoting donor culture.', Icon: AwarenessIcon },
    { title: 'Youth Leadership', desc: 'Channeling youth energy into meaningful volunteering to drive real change across the nation.', Icon: LeadershipIcon },
];

export default function FocusAreas() {
    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Our Focus</h2>
                    <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark mb-6">Core Areas of Impact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {focusAreas.map((area, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_18px_40px_-18px_rgba(3,25,30,0.35)] transition-all border border-gray-100 hover:border-bcp-red/40"
                        >
                            <div className="w-full mb-8 relative rounded-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                <area.Icon />
                            </div>
                            <h4 className="text-xl font-bold text-bcp-dark mb-4 transition-colors group-hover:text-bcp-red">{area.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{area.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
