import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutHero() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'var(--primary)' }}>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--accent)', filter: 'blur(80px)' }} />
      <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <nav className="text-sm mb-4 opacity-70"><Link to="/" className="hover:opacity-100">Home</Link> / <span>About Us</span></nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">About Us</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">Dedicated to providing compassionate, personalized home care with integrity and excellence.</p>
        </motion.div>
      </div>
    </section>
  );
}
