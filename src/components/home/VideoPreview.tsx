import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import introVideo from '../../assets/BCP_INtro_video.mp4';

export default function VideoPreview() {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-24 relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900 group"
            >
                <video
                    src={introVideo}
                    controls
                    className="w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-bcp-red/80 rounded-full flex items-center justify-center shadow-lg shadow-bcp-red/50">
                        <Play className="w-10 h-10 text-white fill-current ml-2" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
