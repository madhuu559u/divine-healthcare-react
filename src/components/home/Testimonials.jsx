import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../../data/testimonials';
import SectionHeader from '../shared/SectionHeader';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => { setDir(1); setCurrent((c) => (c + 1) % testimonials.length); }, 6000);
    return () => clearInterval(timer);
  }, []);

  const go = (n) => { setDir(n > current ? 1 : -1); setCurrent(n); };
  const prev = () => { setDir(-1); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setDir(1); setCurrent((c) => (c + 1) % testimonials.length); };

  const t = testimonials[current];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader badge="Testimonials" title="What Families Say" />
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 min-h-[280px]" style={{ background: 'var(--white)' }}>
          <Quote size={48} className="absolute top-6 left-6 opacity-10" style={{ color: 'var(--primary)' }} />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={current}
              initial={{ opacity: 0, x: dir * 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 50 }}
              transition={{ duration: 0.3 }}
              className="text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="var(--accent)" style={{ color: 'var(--accent)' }} />)}
              </div>
              <p className="text-lg md:text-xl italic mb-6 leading-relaxed" style={{ color: 'var(--text-main)' }}>"{t.text}"</p>
              <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full mx-auto mb-3 object-cover" />
              <p className="font-bold" style={{ color: 'var(--text-main)' }}>{t.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{t.relation}</p>
            </motion.div>
          </AnimatePresence>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors" aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to testimonial ${i + 1}`}
              className="w-3 h-3 rounded-full transition-all"
              style={{ background: i === current ? 'var(--primary)' : 'var(--accent-light)', transform: i === current ? 'scale(1.3)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
