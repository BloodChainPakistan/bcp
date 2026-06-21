import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import galleryImg8 from '../../assets/gallery/ABC_3439.webp'; // Fallback to available assets
import galleryImg9 from '../../assets/gallery/ABC_3469.webp';
import galleryImg10 from '../../assets/gallery/ABC_3478.webp';
import galleryImg11 from '../../assets/gallery/DSC_0042.webp';
import galleryImg12 from '../../assets/gallery/DSC_0043.webp';

const campaigns = [
    { tag: 'Flagship', title: 'Annual Blood Conferences', desc: 'National-level conferences bringing together blood activists, medical professionals, and policymakers.', img: galleryImg8 },
    { tag: 'Awareness', title: 'Wall of Thalassemia', desc: 'Awareness drives highlighting the importance of premarital screening and carrier detection.', img: galleryImg9 },
    { tag: 'Outreach', title: 'Provincial & District Conferences', desc: 'Localized events to strengthen blood activism networks across all provinces.', img: galleryImg10 },
    { tag: 'Seasonal', title: 'Rehmat-e-Ramzan Campaign', desc: 'Special Ramadan blood donation drives promoting the spirit of giving.', img: galleryImg11 },
    { tag: 'Education', title: 'Blood Training Sessions (BTS)', desc: 'Educational workshops to train new blood activists with professional knowledge.', img: galleryImg12 },
];

export default function Campaigns() {
    return (
        <section className="py-32 bg-bcp-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Our Work</h2>
                        <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark">
                            Campaigns & <span className="text-bcp-red">Initiatives</span>
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {campaigns.map((camp, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-48 bg-bcp-dark">
                                <img src={camp.img} alt={camp.title} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                                <div className="absolute top-4 left-4 bg-bcp-red text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {camp.tag}
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h4 className="text-xl font-bold text-bcp-dark mb-4">{camp.title}</h4>
                                <p className="text-gray-600 mb-8 flex-grow">{camp.desc}</p>
                                <Link to="/events" className="text-bcp-red font-semibold flex items-center gap-2 hover:text-red-700 transition-colors mt-auto">
                                    Explore More <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
