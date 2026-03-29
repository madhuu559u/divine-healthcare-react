import { useState } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import { jobs } from '../../data/jobs';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import SectionHeader from '../shared/SectionHeader';
import AnimatedSection from '../shared/AnimatedSection';

export default function JobListings() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const categories = ['All', ...new Set(jobs.map(j => j.category))];
  const types = ['All', 'Full-Time', 'Part-Time', 'PRN'];

  const filtered = jobs.filter(j => {
    if (categoryFilter !== 'All' && j.category !== categoryFilter) return false;
    if (typeFilter !== 'All' && !j.types.includes(typeFilter)) return false;
    return true;
  });

  return (
    <section id="positions" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Open Positions" title="Find Your Role" subtitle="Browse our current openings and find the perfect fit for your skills and passion." />

        <AnimatedSection className="flex flex-wrap items-center gap-3 mb-10 justify-center">
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-light-color)' }}>
            <Filter size={16} /> Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={categoryFilter === c ? { background: 'var(--primary)', color: 'var(--white)' } : { background: 'var(--bg-alt)', color: 'var(--text-main)' }}>
                {c}
              </button>
            ))}
          </div>
          <div className="w-px h-6 hidden sm:block" style={{ background: 'var(--bg-alt)' }} />
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={typeFilter === t ? { background: 'var(--accent)', color: 'var(--primary-dark)' } : { background: 'var(--bg-alt)', color: 'var(--text-main)' }}>
                {t}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium" style={{ color: 'var(--text-light-color)' }}>No positions match your filters</p>
            <button onClick={() => { setCategoryFilter('All'); setTypeFilter('All'); }} className="mt-2 text-sm underline" style={{ color: 'var(--primary)' }}>Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job, i) => (
              <AnimatedSection key={job.id} delay={i * 0.08}>
                <JobCard job={job} onClick={() => setSelectedJob(job)} />
              </AnimatedSection>
            ))}
          </div>
        )}

        <JobDetailModal job={selectedJob} isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} />
      </div>
    </section>
  );
}
