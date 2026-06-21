import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { FeatureFlagsProvider } from './lib/featureFlags';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import RequireRole from './components/RequireRole';
import PageLoader from './components/PageLoader';
// Landing page stays eager so first paint isn't behind a chunk fetch.
import Home from './pages/Home';

// ── Public routes (lazy: each becomes its own chunk, fetched on demand) ──
const About = lazy(() => import('./pages/About'));
const Work = lazy(() => import('./pages/Work'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const RegisterDonor = lazy(() => import('./pages/RegisterDonor'));
const RegisterMember = lazy(() => import('./pages/RegisterMember'));
const RegisterPartner = lazy(() => import('./pages/RegisterPartner'));
const RegisterRequester = lazy(() => import('./pages/RegisterRequester'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ── Admin routes (lazy: public visitors never download admin code) ──
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/Overview'));
const AdminDonors = lazy(() => import('./pages/admin/Donors'));
const AdminFindDonors = lazy(() => import('./pages/admin/FindDonors'));
const AdminBloodRequests = lazy(() => import('./pages/admin/BloodRequests'));
const AdminVolunteers = lazy(() => import('./pages/admin/Volunteers'));
const AdminPartners = lazy(() => import('./pages/admin/Partners'));
const AdminTeam = lazy(() => import('./pages/admin/Team'));
const AdminFaq = lazy(() => import('./pages/admin/Faq'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminManageAdmins = lazy(() => import('./pages/admin/ManageAdmins'));
const AdminFeatures = lazy(() => import('./pages/admin/Features'));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="w-10 h-10 rounded-full border-4 border-bcp-red/20 border-t-bcp-red animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <AuthProvider>
        <FeatureFlagsProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public site */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="events" element={<Work />} />
                <Route path="events/:id" element={<WorkDetail />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="blogs/:id" element={<BlogDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="register-donor" element={<RegisterDonor />} />
                <Route path="register-member" element={<RegisterMember />} />
                <Route path="register-partner" element={<RegisterPartner />} />
                <Route path="register-requester" element={<RegisterRequester />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin (no public chrome) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<RequireRole role="admin" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="donors" element={<AdminDonors />} />
                  <Route path="find-donors" element={<AdminFindDonors />} />
                  <Route path="requests" element={<AdminBloodRequests />} />
                  <Route path="volunteers" element={<AdminVolunteers />} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="faq" element={<AdminFaq />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="admins" element={<AdminManageAdmins />} />
                  <Route path="features" element={<AdminFeatures />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </FeatureFlagsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
