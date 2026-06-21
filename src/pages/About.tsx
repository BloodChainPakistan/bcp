import { motion } from 'motion/react';
import { Target, Eye, ArrowRight, Microscope, Database, Droplet, HeartPulse, Stethoscope, Warehouse, Trash2, Building2, HeartHandshake, Landmark, UserX, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PartnerLogos from '../components/home/PartnerLogos';

// Import BOG Images
import { themePhoto } from '../lib/stockPhotos';
import Luqman from "../assets/team/Bogs/Dr Luqman Hakeem.jpeg"
import Afaq from "../assets/team/Bogs/Afaq Karim.jpg"
import Rehan from "../assets/team/Bogs/engr Rehan Khan.jpeg"
import Kamran from "../assets/team/Bogs/Engr Kamran Khan.jpg"
import Waqas from "../assets/team/Bogs/Muhammad Waqas Blood Wala.jpeg"
import Ibadullah from "../assets/team/Bogs/IbadUllah Jan.jpeg"
import Saeed from "../assets/team/Bogs/Saeed Anwar.jpeg"
import Usman from "../assets/team/Bogs/Usman Ali.jpeg"
import Sajjad from "../assets/team/Bogs/Sajjad Saeed.jpeg"
import Fawad from "../assets/team/Bogs/Fawad Latif.jpeg"
import RehanUllah from "../assets/team/Bogs/Rehan Ullah Tajakzai.jpeg"

// Import Core Cabinet Images
import sanaImg from '../assets/team/CoreCabinet/Sana Ur Rehman.jpeg';
import qandeelImg from '../assets/team/CoreCabinet/Qandeel Saleem.jpeg';
import arsalImg from '../assets/team/CoreCabinet/Arsal Imran.jpeg';
import saifImg from '../assets/team/CoreCabinet/Saif Ullah.jpeg';
import arshiaImg from '../assets/team/CoreCabinet/Arshia Amraiz.jpeg';
import ayeshaImg from '../assets/team/CoreCabinet/Ayesha Javaid.jpeg';
import harnainImg from '../assets/team/CoreCabinet/Harnain Ayub.jpeg';
import masoodImg from '../assets/team/CoreCabinet/Masood Khan.jpeg';
import jehanImg from '../assets/team/CoreCabinet/Jehan Badshah.jpeg';

export default function About() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-bcp-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Working tirelessly to ensure safe blood is available to everyone without discrimination.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bcp-dark p-10 rounded-[2rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Eye className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-bcp-red text-sm font-bold tracking-widest uppercase mb-6 relative z-10">Vision</h3>
            <h4 className="text-4xl font-bold text-white mb-6 relative z-10">
              Safe blood for <span className="text-bcp-red">everyone</span>
            </h4>
            <p className="text-gray-300 text-lg leading-relaxed relative z-10">
              Safe blood should be available to everyone without any discrimination and suffering — to decrease morbidity and mortality across Pakistan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-bcp-red text-white p-10 rounded-[2rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6 relative z-10">Mission</h3>
            <h4 className="text-4xl font-bold text-white mb-6 relative z-10">
              Professional blood activism
            </h4>
            <p className="text-white/90 text-lg leading-relaxed relative z-10">
              Working on blood availability by promoting and practicing blood activism in a professional way — so no one should suffer due to unavailability of blood.
            </p>
          </motion.div>
        </div>

        {/* Problem Statement */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bcp-dark mb-4">The Problem We Are Solving</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Addressing the systemic issues in Pakistan's blood donation ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { text: "Poor Research and Data", Icon: Microscope },
              { text: "Lack of National Data Base for Blood group", Icon: Database },
              { text: "Negligible Blood Donation", Icon: Droplet },
              { text: "Blood Consumptive disorders", Icon: HeartPulse },
              { text: "Doctors related problems", Icon: Stethoscope },
              { text: "Blood bank related problems", Icon: Warehouse },
              { text: "Blood discards", Icon: Trash2 },
              { text: "Burden on cities", Icon: Building2 },
              { text: "Lack of respect for blood donors", Icon: HeartHandshake },
              { text: "No concerns from government", Icon: Landmark },
              { text: "Individual approach", Icon: UserX },
              { text: "Transport issues to blood donors", Icon: Truck },
            ].map((problem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm transition-all hover:shadow-[0_18px_40px_-18px_rgba(3,25,30,0.35)] hover:border-bcp-red/40"
              >
                <div className="mt-1 bg-red-50 p-2 rounded-full text-bcp-red transition-colors group-hover:bg-bcp-red group-hover:text-white">
                  <problem.Icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-gray-800">{problem.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Campaigns & Initiatives (from screenshot) */}
        <div className="hidden mb-24 bg-bcp-light rounded-[3rem] p-8 md:p-16">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-bcp-red font-bold tracking-widest uppercase mb-4 text-sm">Our Work</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-bcp-dark">
                Campaigns & <span className="text-bcp-red">Initiatives</span>
              </h3>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center gap-2 text-bcp-red font-semibold hover:text-red-700 transition-colors">
              Explore Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { tag: 'Flagship', title: 'Annual Blood Conferences', desc: 'National-level conferences bringing together blood activists, medical professionals, and policymakers.', img: themePhoto('communityGroup', 800) },
              { tag: 'Awareness', title: 'Wall of Thalassemia', desc: 'Awareness drives highlighting the importance of premarital screening and carrier detection.', img: themePhoto('labTestTubes', 800) },
              { tag: 'Outreach', title: 'Provincial & District Conferences', desc: 'Localized events to strengthen blood activism networks across all provinces.', img: themePhoto('volunteersHands', 800) },
              { tag: 'Seasonal', title: 'Rehmat-e-Ramzan Campaign', desc: 'Special Ramadan blood donation drives promoting the spirit of giving.', img: themePhoto('ramadanMosque', 800) },
              { tag: 'Education', title: 'Blood Training Sessions (BTS)', desc: 'Educational workshops to train new blood activists with professional knowledge.', img: themePhoto('medicalTeam', 800) },
            ].map((camp, idx) => (
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
                  <Link to="/gallery" className="text-bcp-red font-semibold flex items-center gap-2 hover:text-red-700 transition-colors mt-auto">
                    Explore More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Province-Wise Presence */}
          <div className="bg-bcp-dark rounded-[2rem] p-10 md:p-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">
              Province-Wise <span className="text-bcp-red">Presence</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["KPK", "Punjab", "Sindh", "Baluchistan", "GB", "Kashmir", "Islamabad"].map((province, idx) => (
                <div key={idx} className="bg-[#052229] border border-white/10 text-white px-8 py-4 rounded-xl font-medium hover:border-bcp-red hover:bg-[#072d36] transition-all cursor-default">
                  {province}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Sections */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bcp-dark mb-4">Our Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The dedicated individuals driving Blood Chain Pakistan's mission forward.</p>
          </div>

          {/* BOGs */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-bcp-red mb-8 text-center border-b pb-4">Board of Governance (BOGs)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: "Dr Luqman Hakim", role: "Founder", img: Luqman },
                { name: "Engr Rehan Khan", role: "Co Founder", img: Rehan },
                { name: "Afaq Karim", role: "Member", img: Afaq },
                { name: "Engr Kamran Khan", role: "Member", img: Kamran },
                { name: "Ibadullah Jan", role: "Member", img: Ibadullah },
                { name: "Muhamad Waqas Bloodwala", role: "Member", img: Waqas },
                { name: "Saeed Anwar", role: "Member", img: Saeed },
                { name: "Usman Ali", role: "Member", img: Usman },
                { name: "Sajjad Saeed", role: "Member", img: Sajjad },
                { name: "Fawad Latif", role: "Member", img: Fawad },
                { name: "Rehan Ullah Tajakzai", role: "Member", img: RehanUllah }
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[3/4]"
                >
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark via-bcp-dark/20 to-transparent flex flex-col justify-end p-6">
                    <h4 className="font-bold text-white mb-1 text-lg">{member.name}</h4>
                    <p className="text-sm text-bcp-orange font-medium uppercase tracking-wider">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Country Cabinet */}
          <div>
            <h3 className="text-2xl font-bold text-bcp-dark mb-8 text-center border-b pb-4">Country Cabinet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Sana Ur Rehman', role: 'Country Governor', img: sanaImg },
                { name: 'Qandeel Saleem', role: 'Secretary General', img: qandeelImg },
                { name: 'Arsal Imran', role: 'Director Media and Communication', img: arsalImg },
                { name: 'Saif Ullah', role: 'Assistant Director Media and Communication', img: saifImg },
                { name: 'Arshia Amraiz', role: 'Director Communications and Liaisons', img: arshiaImg },
                { name: 'Ayesha Javaid', role: 'Director Donor Database and Volunteer Management', img: ayeshaImg },
                { name: 'Harnain Ayub', role: 'Assistant Director Donor Database and Volunteer Management', img: harnainImg },
                { name: 'Masood Khan', role: 'Director Training and Development', img: masoodImg },
                { name: 'Jehan Badshah', role: 'Director Thalassemia Prevention', img: jehanImg },
              ].map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[3/4]"
                >
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bcp-dark via-bcp-dark/20 to-transparent flex flex-col justify-end p-6">
                    <h4 className="font-bold text-white mb-1 text-lg">{member.name}</h4>
                    <p className="text-sm text-bcp-orange font-medium uppercase tracking-wider">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <PartnerLogos />
      </div>
    </div>
  );
}
