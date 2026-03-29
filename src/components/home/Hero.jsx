import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';

export default function Hero() {
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
          Compassionate care at home, when it matters most
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="text-lg md:text-xl max-w-2xl mb-8 opacity-90">
          Providing non-medical personal care, companionship, and support services to seniors
          and individuals with disabilities throughout Virginia.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4">
          <Button to="/contact" size="lg" variant="accent">
            Free Consultation <ArrowRight size={18} />
          </Button>
          <Button to="/services" size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">
            Our Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
