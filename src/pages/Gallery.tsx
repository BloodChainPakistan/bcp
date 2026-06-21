import { motion } from 'motion/react';
import { Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import all images from assets/Awards
import ZubairImg from '../assets/Awards/Zubair Ali Shah.jpeg';
import ArshiaImg from '../assets/Awards/Arshia Amraiz.jpeg';
import IshfaqImg from '../assets/Awards/Ishfaq_Aziz.jpeg';
import BibiImg from '../assets/Awards/Bibi_Rehma.jpeg';
import AsgharImg from '../assets/Awards/Muhammad Asghar.jpeg';
import IftikharImg from '../assets/Awards/Muhammad Iftikhar.jpeg';
import ZohaibImg from '../assets/Awards/Zohaib Khan.jpeg';
import LuqmanImg from '../assets/Awards/Muhammad Luqman.jpeg';
import SaifImg from '../assets/Awards/Saif Ullah.jpeg';
import WaheebImg from '../assets/Awards/waheeb Khan.jpeg';
import WaleedImg from '../assets/Awards/waleed Khan.jpeg';

const allAwards = [
    {
        category: "Emerging Male Activist Of The Year",
        name: "Zubair Ali Shah",
        image: ZubairImg,
    },
    {
        category: "Emerging Female Activist Of The Year",
        name: "Arshia Amriaz",
        image: ArshiaImg,
    },
    {
        category: "Dedicated Male Activist Of The Year",
        name: "Ishfaq Aziz",
        image: IshfaqImg,
    },
    {
        category: "Dedicated Female Activist Of The Year",
        name: "Bibi Rehma",
        image: BibiImg,
    },
    {
        category: "Professional Blood Activist Of The Year",
        name: "Muhammad Asghar",
        image: AsgharImg,
    },
    {
        category: "Active Member Of The Year",
        name: "Iftikhar Ahmad",
        image: IftikharImg,
    },
    {
        category: "Best District Coordinator OF the Year",
        name: "Zohaib Khan",
        image: ZohaibImg,
    },
    {
        category: "Best Secretary General Of The Year",
        name: "Luqman Khan",
        image: LuqmanImg,
    },
    {
        category: "Best Media Head Of the Year",
        name: "Saif Ullah",
        image: SaifImg,
    },
    {
        category: "Best Graphics Designer Of the Year",
        name: "Waheeb Khan",
        image: WaheebImg,
    },
    {
        category: "Best Content Writer of the year",
        name: "Waleed Khan",
        image: WaleedImg,
    }
];

export default function GalleryPage() {
    return (
        <div className="pt-24 pb-32 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-bcp-red transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <h1 className="text-5xl md:text-6xl font-bold text-bcp-dark">
                            Annual <span className="text-bcp-red">Awards</span>
                        </h1>
                        <p className="text-gray-500 mt-4 text-lg max-w-2xl">
                            Celebrating the exceptional commitment and dedication of our members across Pakistan.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-bcp-red">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-bcp-dark">{allAwards.length}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Recognitions</div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {allAwards.map((award, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group border border-gray-100"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img 
                                    src={award.image} 
                                    alt={award.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark/80 via-transparent to-transparent opacity-60" />
                                <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-bcp-red shadow-lg group-hover:bg-bcp-red group-hover:text-white transition-colors duration-300">
                                    <Award className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="inline-block px-3 py-1 bg-red-50 text-bcp-red text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                                    {award.category}
                                </div>
                                <h2 className="text-2xl font-bold text-bcp-dark group-hover:text-bcp-red transition-colors duration-300">
                                    {award.name}
                                </h2>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
