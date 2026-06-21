import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { workAlbums } from './Work';
import { galleryPhoto } from '../lib/stockPhotos';

export default function WorkDetail() {
  const { id } = useParams();
  const album = workAlbums.find(a => a.id === Number(id));
  
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Album not found</h2>
          <Link to="/events" className="text-bcp-red hover:underline">Back to Work</Link>
        </div>
      </div>
    );
  }

  // Themed gallery photos (rotates through the curated set per album).
  const albumImages = Array.from({ length: album.imageCount }).map((_, i) => ({
    id: i,
    src: galleryPhoto(album.id + i, 1200),
    thumbnail: galleryPhoto(album.id + i, 400),
  }));

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % albumImages.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + albumImages.length) % albumImages.length);
    }
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="inline-flex items-center gap-2 text-gray-500 hover:text-bcp-red transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Work
        </Link>
        
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-red-50 text-bcp-red rounded-full text-sm font-semibold mb-4">
            {album.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-bcp-dark mb-4">{album.title}</h1>
          <div className="flex gap-4 text-gray-500">
            <span>{album.date}</span>
            <span>•</span>
            <span>{album.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedImageIndex(idx)}
            >
              <img 
                src={img.thumbnail} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slideshow Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <div className="max-w-5xl w-full max-h-[80vh] px-16" onClick={e => e.stopPropagation()}>
              <img 
                src={albumImages[selectedImageIndex].src} 
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-center text-white/70 mt-4">
                {selectedImageIndex + 1} / {albumImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
