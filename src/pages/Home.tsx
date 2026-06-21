import Hero from '../components/home/Hero';
import VideoPreview from '../components/home/VideoPreview';
import FocusAreas from '../components/home/FocusAreas';
import AboutUs from '../components/home/AboutUs';
import Leadership from '../components/home/Leadership';
import QuickStats from '../components/home/QuickStats';
import Gallery from '../components/home/Gallery';
import Campaigns from '../components/home/Campaigns';
import ProvincePresence from '../components/home/ProvincePresence';
import BlogPreview from '../components/home/BlogPreview';
import PartnerLogos from '../components/home/PartnerLogos';
import ContactSection from '../components/home/ContactSection';
import { useFeature } from '../lib/featureFlags';

export default function Home() {
  const galleryOn = useFeature('gallery');
  const blogOn = useFeature('blog');
  return (
    <div className="bg-white">
      <Hero />
      <VideoPreview />
      <QuickStats />
      <ProvincePresence />
      <FocusAreas />
      <AboutUs />
      <Leadership />
      {galleryOn && <Gallery />}
      <Campaigns />
      {blogOn && <BlogPreview />}
      <PartnerLogos />
      <ContactSection />
    </div>
  );
}
