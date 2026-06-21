import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import PartnerLogos from '../components/home/PartnerLogos';
import { themePhoto } from '../lib/stockPhotos';

const categories = [
  "All",
  "Annual Blood Conferences",
  "Blood Donation Camps",
  "Magazine",
  "Volunteer Meetups",
  "Awareness Activities"
];

export const workAlbums = [
  { id: 1, category: "Annual Blood Conferences", title: "National Blood Conference 2023", date: "Oct 2023", location: "Islamabad", cover: "/src/assets/gallery/DSC_0072.webp", imageCount: 12 },
  { id: 2, category: "Blood Donation Camps", title: "University Donation Drive", date: "Nov 2023", location: "Lahore", cover: themePhoto('bloodDonationArm', 800), imageCount: 8 },
  { id: 3, category: "Volunteer Meetups", title: "Annual Volunteer Gathering", date: "Dec 2023", location: "Karachi", cover: themePhoto('communityGroup', 800), imageCount: 15 },
  { id: 4, category: "Awareness Activities", title: "News Coverage on Thalassemia", date: "Jan 2024", location: "National TV", cover: themePhoto('labTestTubes', 800), imageCount: 5 },
  { id: 5, category: "Magazine", title: "BCP Quarterly Magazine Launch", date: "Feb 2024", location: "Peshawar", cover: themePhoto('volunteersHands', 800), imageCount: 20 },
  { id: 6, category: "Blood Donation Camps", title: "Emergency Blood Camp", date: "Mar 2024", location: "Quetta", cover: themePhoto('nursePatient', 800), imageCount: 10 },
];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredAlbums = activeCategory === "All"
    ? workAlbums
    : workAlbums.filter(album => album.category === activeCategory);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-bcp-dark mb-6">Our Work</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Moments of impact, dedication, and community from across Pakistan.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === category
                ? 'bg-bcp-red text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white border border-gray-100"
            >
              <Link to={`/events/${album.id}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-bcp-red">
                    {album.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {album.imageCount} Photos
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-bcp-dark mb-2 group-hover:text-bcp-red transition-colors">{album.title}</h3>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{album.date}</span>
                    <span>{album.location}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <PartnerLogos />
    </div>
  );
}
