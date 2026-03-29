import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import { ArrowRight } from 'lucide-react';

export default function CareersHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1400&q=80" alt="Healthcare team" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-white w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <nav className="text-sm mb-4 opacity-70"><Link to="/" className="hover:opacity-100">Home</Link> / <span>Careers</span></nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-heading max-w-3xl">Join Our Caregiving Family</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mb-8">Make a real difference in people's lives every day. We're looking for compassionate individuals who share our passion for care.</p>
          <div className="flex flex-wrap gap-4">
            <Button href="#positions" variant="accent" size="lg">View Open Positions <ArrowRight size={18} /></Button>
            <Button to="/careers/apply" size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">Apply Now</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
