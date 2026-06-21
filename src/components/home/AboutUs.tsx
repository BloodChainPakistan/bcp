import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import magazinePdf from '../../assets/Magazine.pdf';

export default function AboutUs() {
    return (
        <section className="py-24 bg-bcp-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-bcp-red font-bold text-xs tracking-widest mb-8">
                            EST. SEPTEMBER 2018
                        </div>
                        <h2 className="text-5xl md:text-7xl font-semibold text-bcp-dark leading-tight">
                            <span className="font-script font-normal text-6xl md:text-8xl">A chain of </span> <span className="text-bcp-red">Hope</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            Blood Chain Pakistan is a non-profitable welfare organization having a group of energetic volunteers across the country working to solve blood availability problems since September 21, 2018.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            From training leaders to mobilizing donors, we are on the ground, bridging the gap between donors and patients, and bringing professionalism to blood welfare across Pakistan.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-bcp-dark rounded-[2rem] p-10 md:p-12"
                    >
                        <h3 className="text-bcp-red text-sm font-bold tracking-widest uppercase mb-6">Vision</h3>
                        <h4 className="text-4xl font-semibold text-white mb-6">
                            Safe blood for <span className="text-bcp-red">everyone</span>
                        </h4>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Safe blood should be available to everyone without any discrimination and suffering — to decrease morbidity and mortality across Pakistan.
                        </p>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-bcp-red rounded-[2rem] p-10 md:p-12"
                    >
                        <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Mission</h3>
                        <h4 className="text-4xl font-semibold text-white mb-6">
                            Professional blood activism
                        </h4>
                        <p className="text-white/90 text-lg leading-relaxed">
                            Working on blood availability by promoting and practicing blood activism in a professional way — so no one should suffer due to unavailability of blood.
                        </p>
                    </motion.div>
                </div>

                {/* About Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 flex flex-wrap justify-center gap-6"
                >
                    <Link to="/about" className="bg-bcp-dark hover:bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2">
                        More About Us <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                        href={magazinePdf}
                        download="BloodChainPakistan_Magazine.pdf"
                        className="bg-white hover:bg-gray-50 text-bcp-dark border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-sm"
                    >
                        Download Brochure
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
