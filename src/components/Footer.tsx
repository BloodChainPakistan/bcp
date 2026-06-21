import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import BcpLogoSymbol from './BcpLogoSymbol';

export default function Footer() {
  return (
    <footer className="bg-[#021114] text-white relative overflow-hidden">
      {/* Huge Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 opacity-[0.03]">
        <h1 className="text-[15vw] font-bold leading-none whitespace-nowrap">Blood Chain</h1>
        <h1 className="text-[15vw] font-bold leading-none whitespace-nowrap">Pakistan</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top CTA Section */}
        <div className="py-20 border-b border-white/10">
          <h2 className="text-5xl md:text-6xl font-bold mb-10">
            Every drop <br />
            <span className="text-bcp-red">saves a life.</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/register-donor" className="bg-bcp-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
              <Heart className="h-5 w-5" /> Become a Donor
            </Link>
            <a href="tel:03499021062" className="bg-transparent border border-white/20 hover:border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-3">
              <Phone className="h-5 w-5" /> Emergency: 0349-9021062
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <BcpLogoSymbol className="h-14 w-auto" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-white tracking-wide">Blood Chain</span>
                <span className="font-semibold text-[10px] leading-tight text-white tracking-[0.2em]">PAKISTAN</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
              Building a nationwide culture of voluntary blood donation since 2018.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <a href="mailto:bloodchainpakistan@gmail.com" className="hover:text-white transition-colors">bloodchainpakistan@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <a href="https://wa.me/923499021062" className="hover:text-white transition-colors">0349-9021062</a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>Luqman Health Care, Shinwari Plaza Nasir Bagh Road, Peshawar</span>
              </li>
            </ul>
          </div>

          {/* Navigate Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-8 text-white">Navigate</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Work</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Get Involved Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-8 text-white">Get Involved</h3>
            <ul className="space-y-4">
              <li><Link to="/register-donor" className="text-gray-400 hover:text-white transition-colors">Register as Donor</Link></li>
              <li><Link to="/register-member" className="text-gray-400 hover:text-white transition-colors">Become a Volunteer</Link></li>
              <li><Link to="/register-partner" className="text-gray-400 hover:text-white transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-8 text-white">Follow Us</h3>
            <ul className="space-y-4">
              <li><a href="https://www.linkedin.com/company/bloodchainpk/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /> LinkedIn</a></li>
              <li><a href="https://facebook.com/BloodChainPK" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /> Facebook</a></li>
              <li><a href="https://instagram.com/bloodchainpk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /> Instagram</a></li>
              <li><a href="https://mobile.twitter.com/bloodchainpk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /> Twitter / X</a></li>
              <li><a href="https://tiktok.com/@bloodchainpakistan?lang=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> TikTok
              </a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Blood Chain Pakistan. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              Made with <Heart className="w-4 h-4 text-bcp-red fill-current" /> for Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
