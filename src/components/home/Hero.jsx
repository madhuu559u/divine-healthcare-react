import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';

export default function Hero() {
  const [zip, setZip] = useState('');
  const navigate = useNavigate();

  const handleFindCare = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80"
          alt="Caregiver with patient" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
      </div>

      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20 hidden lg:block" style={{ background: 'var(--accent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-15 hidden lg:block" style={{ background: 'var(--primary)', filter: 'blur(50px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-white w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          <Shield size={16} /> Trusted Home Care Across Virginia
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mb-6 leading-tight font-heading">
          Medicaid-Approved Home Care in Virginia
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="text-lg md:text-xl max-w-2xl mb-8 opacity-90">
          We help families get approved for Personal Care, Respite, and Companion Services — without the paperwork stress.
        </motion.p>

        {/* ZIP Code Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          onSubmit={handleFindCare}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mb-8"
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your ZIP code"
              className="w-full pl-11 pr-4 py-3.5 rounded-full text-gray-800 text-base bg-white/95 backdrop-blur-sm border-0 focus:ring-2"
              style={{ '--tw-ring-color': 'var(--accent)' }}
              aria-label="ZIP code"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full font-medium text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--primary-dark)' }}
          >
            Find Care <ArrowRight size={16} className="inline ml-1" />
          </button>
        </motion.form>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 mb-6">
          <Button to="/contact" size="lg" variant="accent">
            Free Consultation <ArrowRight size={18} />
          </Button>
          <Button to="/services" size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">
            Our Services
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm opacity-90"
        >
          {[
            'Medicaid Accepted',
            'Licensed & Insured',
            'Same-Day Approval',
            '10+ Years Experience'
          ].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <CheckCircle size={14} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
