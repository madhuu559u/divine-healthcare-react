import { motion } from 'framer-motion';
import { Clock, Sun, Moon, ArrowRight } from 'lucide-react';

export default function JobCard({ job, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-6 h-full flex flex-col transition-shadow"
      style={{ background: 'var(--white)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>
          {job.category}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>{job.fullTitle}</h3>
      <p className="text-sm font-medium mb-3" style={{ color: 'var(--primary)' }}>({job.title})</p>
      <p className="text-sm mb-4 flex-grow" style={{ color: 'var(--text-light-color)' }}>{job.description.slice(0, 120)}...</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.types.map(t => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-main)' }}>{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-light-color)' }}>
        <Sun size={12} /> Shifts: {job.shifts.join(', ')}
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold mt-auto" style={{ color: 'var(--primary)' }}>
        View Details <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}
