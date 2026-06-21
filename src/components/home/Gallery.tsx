import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Award } from 'lucide-react';

// Import images from assets/Awards
import ZubairImg from '../../assets/Awards/Zubair Ali Shah.jpeg';
import ArshiaImg from '../../assets/Awards/Arshia Amraiz.jpeg';
import IshfaqImg from '../../assets/Awards/Ishfaq_Aziz.jpeg';
import BibiImg from '../../assets/Awards/Bibi_Rehma.jpeg';
import AsgharImg from '../../assets/Awards/Muhammad Asghar.jpeg';
import IftikharImg from '../../assets/Awards/Muhammad Iftikhar.jpeg';
import ZohaibImg from '../../assets/Awards/Zohaib Khan.jpeg';
import LuqmanImg from '../../assets/Awards/Muhammad Luqman.jpeg';
import SaifImg from '../../assets/Awards/Saif Ullah.jpeg';
import WaheebImg from '../../assets/Awards/waheeb Khan.jpeg';
import WaleedImg from '../../assets/Awards/waleed Khan.jpeg';

const ALL_AWARDS = [
    {
        name: "Zubair Ali Shah",
        category: "Emerging Male Activist",
        image: ZubairImg
    },
    {
        name: "Arshia Amriaz",
        category: "Emerging Female Activist",
        image: ArshiaImg
    },
    {
        name: "Ishfaq Aziz",
        category: "Dedicated Male Activist",
        image: IshfaqImg
    },
    {
        name: "Bibi Rehma",
        category: "Dedicated Female Activist",
        image: BibiImg
    },
    {
        name: "Muhammad Asghar",
        category: "Professional Blood Activist",
        image: AsgharImg
    },
    {
        name: "Iftikhar Ahmad",
        category: "Active Member Of The Year",
        image: IftikharImg
    },
    {
        name: "Zohaib Khan",
        category: "Best District Coordinator",
        image: ZohaibImg
    },
    {
        name: "Luqman Khan",
        category: "Best Secretary General",
        image: LuqmanImg
    },
    {
        name: "Saif Ullah",
        category: "Best Media Head",
        image: SaifImg
    },
    {
        name: "Waheeb Khan",
        category: "Best Graphics Designer",
        image: WaheebImg
    },
    {
        name: "Waleed Khan",
        category: "Best Content Writer",
        image: WaleedImg
    }
];

export default function Gallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sideAwards = ALL_AWARDS.slice(3, 7);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % ALL_AWARDS.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + ALL_AWARDS.length) % ALL_AWARDS.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]); // Adding currentIndex as dependency to ensure closure has latest state if needed, though functional update handles it

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Visuals</h2>
                        <h3 className="text-4xl md:text-5xl font-semibold text-bcp-dark">
                            Our <span className="text-bcp-red">Awards</span>
                        </h3>
                    </div>
                    <Link to="/gallery" className="hidden md:flex items-center gap-2 text-bcp-red font-semibold hover:text-red-700 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Carousel (Highlights) */}
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-lg aspect-[4/3] group bg-gray-100">
                        <motion.img
                            key={currentIndex}
                            src={ALL_AWARDS[currentIndex].image}
                            alt={ALL_AWARDS[currentIndex].name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark/90 via-bcp-dark/10 to-transparent flex flex-col justify-end p-10">
                            <motion.div
                                key={`content-${currentIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 shadow-lg">
                                    {ALL_AWARDS[currentIndex].category}
                                </div>
                                <h4 className="text-white text-3xl md:text-5xl font-bold mb-2">
                                    {ALL_AWARDS[currentIndex].name}
                                </h4>
                            </motion.div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Pagination Dots Container */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
                            {ALL_AWARDS.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Featured Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {sideAwards.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 aspect-square group bg-gray-100"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                                    <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest mb-1">{item.category}</p>
                                    <h5 className="text-white font-bold text-sm sm:text-base line-clamp-1">{item.name}</h5>
                                </div>
                                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-bcp-red shadow-sm group-hover:bg-bcp-red group-hover:text-white transition-colors duration-300">
                                    <Award className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
