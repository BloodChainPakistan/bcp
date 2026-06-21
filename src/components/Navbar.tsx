import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown, HeartPulse, Droplet, Users, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BcpLogoSymbol from './BcpLogoSymbol';
import { useFeature } from '../lib/featureFlags';

interface MemberOption {
  to: string;
  label: string;
  Icon: LucideIcon;
  highlight?: boolean;
}

/** "Become A Member" menu — shared by the desktop dropdown and mobile menu. */
const MEMBER_OPTIONS: MemberOption[] = [
  { to: '/register-requester', label: 'Request Blood', Icon: HeartPulse, highlight: true },
  { to: '/register-donor', label: 'Donor', Icon: Droplet },
  { to: '/register-partner', label: 'Partner', Icon: Handshake },
  { to: '/register-member', label: 'Volunteer', Icon: Users },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const galleryOn = useFeature('gallery');
  const blogOn = useFeature('blog');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Work', path: '/events' },
    ...(galleryOn ? [{ name: 'Gallery', path: '/gallery' }] : []),
    ...(blogOn ? [{ name: 'Blogs', path: '/blogs' }] : []),
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BcpLogoSymbol className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight text-bcp-dark tracking-wide">BLOOD CHAIN</span>
                <span className="font-semibold text-xs leading-tight text-bcp-red tracking-[0.2em]">PAKISTAN</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium transition-colors hover:text-bcp-red ${isActive ? 'text-bcp-red' : 'text-bcp-dark'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn btn-primary"
              >
                Become A Member <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-2 z-50 origin-top-right">
                  {MEMBER_OPTIONS.map((opt) => (
                    <Link
                      key={opt.to}
                      to={opt.to}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                        opt.highlight
                          ? 'bg-red-50 hover:bg-red-100 mb-1'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          opt.highlight
                            ? 'bg-bcp-red text-white'
                            : 'bg-red-50 text-bcp-red group-hover:bg-bcp-red group-hover:text-white'
                        }`}
                      >
                        <opt.Icon className="w-5 h-5" />
                      </span>
                      <span className={`text-sm font-semibold ${opt.highlight ? 'text-bcp-red' : 'text-bcp-dark group-hover:text-bcp-red'}`}>{opt.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-bcp-dark hover:text-bcp-red focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? 'text-bcp-red bg-red-50'
                    : 'text-bcp-dark hover:text-bcp-red hover:bg-red-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-100 mt-2 space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Become A Member</p>
              {MEMBER_OPTIONS.map((opt) => (
                <Link
                  key={opt.to}
                  to={opt.to}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    opt.highlight ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      opt.highlight
                        ? 'bg-bcp-red text-white'
                        : 'bg-red-50 text-bcp-red group-hover:bg-bcp-red group-hover:text-white'
                    }`}
                  >
                    <opt.Icon className="w-5 h-5" />
                  </span>
                  <span className={`text-sm font-semibold ${opt.highlight ? 'text-bcp-red' : 'text-bcp-dark group-hover:text-bcp-red'}`}>{opt.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
