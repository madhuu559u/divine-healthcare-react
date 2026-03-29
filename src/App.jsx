import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/useThemeStore';
import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import ThemeSwitcher from './components/layout/ThemeSwitcher';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import JobApplicationPage from './pages/JobApplicationPage';
import MedicaidPage from './pages/MedicaidPage';
import ReferralsPage from './pages/ReferralsPage';
import NotFoundPage from './pages/NotFoundPage';

function Layout({ children }) {
  const location = useLocation();
  const isApplicationPage = location.pathname.includes('/careers/apply');

  if (isApplicationPage) return <>{children}</>;

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}

function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className={`preloader ${!visible ? 'hidden' : ''}`}>
      <div className="preloader-spinner" />
    </div>
  );
}

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <BrowserRouter>
      <Preloader />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/apply" element={<JobApplicationPage />} />
          <Route path="/medicaid" element={<MedicaidPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <WhatsAppButton />
      <ThemeSwitcher />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--white)', color: 'var(--text-main)', borderRadius: '12px' } }} />
    </BrowserRouter>
  );
}
