// Centralized team roster + bundled photos.
//
// The website's team sections are DRIVEN BY THE DATABASE (admin → Team). These
// hardcoded lists are only a fallback shown if the DB is unreachable, and the
// `photoByName` map lets DB rows (which have no photo_url when seeded) still show
// their bundled picture — matched by exact name. Admin photo uploads override it.

// ── BOG photos ───────────────────────────────────────────────────────────────
import Luqman from '../assets/team/Bogs/Dr Luqman Hakeem.jpeg';
import Afaq from '../assets/team/Bogs/Afaq Karim.jpg';
import Rehan from '../assets/team/Bogs/engr Rehan Khan.jpeg';
import Kamran from '../assets/team/Bogs/Engr Kamran Khan.jpg';
import Waqas from '../assets/team/Bogs/Muhammad Waqas Blood Wala.jpeg';
import Ibadullah from '../assets/team/Bogs/IbadUllah Jan.jpeg';
import Saeed from '../assets/team/Bogs/Saeed Anwar.jpeg';
import Usman from '../assets/team/Bogs/Usman Ali.jpeg';
import Sajjad from '../assets/team/Bogs/Sajjad Saeed.jpeg';
import Fawad from '../assets/team/Bogs/Fawad Latif.jpeg';
import RehanUllah from '../assets/team/Bogs/Rehan Ullah Tajakzai.jpeg';

// ── Core Cabinet photos ──────────────────────────────────────────────────────
import sanaImg from '../assets/team/CoreCabinet/Sana Ur Rehman.jpeg';
import qandeelImg from '../assets/team/CoreCabinet/Qandeel Saleem.jpeg';
import arsalImg from '../assets/team/CoreCabinet/Arsal Imran.jpeg';
import saifImg from '../assets/team/CoreCabinet/Saif Ullah.jpeg';
import arshiaImg from '../assets/team/CoreCabinet/Arshia Amraiz.jpeg';
import ayeshaImg from '../assets/team/CoreCabinet/Ayesha Javaid.jpeg';
import harnainImg from '../assets/team/CoreCabinet/Harnain Ayub.jpeg';
import masoodImg from '../assets/team/CoreCabinet/Masood Khan.jpeg';
import jehanImg from '../assets/team/CoreCabinet/Jehan Badshah.jpeg';

export interface TeamMember {
  name: string;
  role: string;
  img: string;
}

export const bogFallback: TeamMember[] = [
  { name: 'Dr Luqman Hakim', role: 'Founder', img: Luqman },
  { name: 'Engr Rehan Khan', role: 'Co Founder', img: Rehan },
  { name: 'Afaq Karim', role: 'Member', img: Afaq },
  { name: 'Engr Kamran Khan', role: 'Member', img: Kamran },
  { name: 'Ibadullah Jan', role: 'Member', img: Ibadullah },
  { name: 'Muhamad Waqas Bloodwala', role: 'Member', img: Waqas },
  { name: 'Saeed Anwar', role: 'Member', img: Saeed },
  { name: 'Usman Ali', role: 'Member', img: Usman },
  { name: 'Sajjad Saeed', role: 'Member', img: Sajjad },
  { name: 'Fawad Latif', role: 'Member', img: Fawad },
  { name: 'Rehan Ullah Tajakzai', role: 'Member', img: RehanUllah },
];

export const coreFallback: TeamMember[] = [
  { name: 'Sana Ur Rehman', role: 'Country Governor', img: sanaImg },
  { name: 'Qandeel Saleem', role: 'Secretary General', img: qandeelImg },
  { name: 'Arsal Imran', role: 'Director Media and Communication', img: arsalImg },
  { name: 'Saif Ullah', role: 'Assistant Director Media and Communication', img: saifImg },
  { name: 'Arshia Amraiz', role: 'Director Communications and Liaisons', img: arshiaImg },
  { name: 'Ayesha Javaid', role: 'Director Donor Database and Volunteer Management', img: ayeshaImg },
  { name: 'Harnain Ayub', role: 'Assistant Director Donor Database and Volunteer Management', img: harnainImg },
  { name: 'Masood Khan', role: 'Director Training and Development', img: masoodImg },
  { name: 'Jehan Badshah', role: 'Director Thalassemia Prevention', img: jehanImg },
];

/** name → bundled photo, so DB rows without a photo_url still show a picture. */
export const photoByName: Record<string, string> = Object.fromEntries(
  [...bogFallback, ...coreFallback].map((m) => [m.name, m.img]),
);
