import { motion } from 'motion/react';
import {
    BloodDropIllustration,
    VolunteersIllustration,
    MapIllustration,
    CampaignIllustration,
    EventsIllustration
} from './HomeIllustrations';

const stats = [
    { label: 'Total Blood Units', value: '14,000+', Illustration: BloodDropIllustration },
    { label: 'Active Volunteers', value: '5,000+', Illustration: VolunteersIllustration },
    { label: 'Cities Covered', value: '50+', Illustration: MapIllustration },
    { label: 'Awareness Campaigns', value: '600+', Illustration: CampaignIllustration },
    { label: 'National Events', value: '30+', Illustration: EventsIllustration },
];

export default function QuickStats() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-center"
                    >
                        <div className="mx-auto w-32 h-32 mb-6 relative">
                            <stat.Illustration />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark mb-3">
                            {stat.value}
                        </h3>
                        <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
