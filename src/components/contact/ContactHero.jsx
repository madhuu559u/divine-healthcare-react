import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ContactHero() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'var(--primary)' }}>
      <div className="absolute top-0 left-1/2 w-80 h-80 rounded-full opacity-10" style={{ background: 'var(--accent)', filter: 'blur(80px)' }} />
      <div className="max-w-7xl mx-auto px-4 text-center text-white relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <nav className="text-sm mb-4 opacity-70"><Link to="/" className="hover:opacity-100">Home</Link> / <span>Contact</span></nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Contact Us</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">We'd love to hear from you. Reach out for a free consultation or any questions about our services.</p>
        </motion.div>
      </div>
    </section>
  );
}
