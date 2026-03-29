import { CheckCircle, Clock, Sun, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function JobDetailModal({ job, isOpen, onClose }) {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job.fullTitle} size="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-light-color)' }}>
            <Briefcase size={16} style={{ color: 'var(--primary)' }} /> {job.category}
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-light-color)' }}>
            <Clock size={16} style={{ color: 'var(--primary)' }} /> {job.types.join(', ')}
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-light-color)' }}>
            <Sun size={16} style={{ color: 'var(--primary)' }} /> {job.shifts.join(', ')}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-2" style={{ color: 'var(--text-main)' }}>Description</h4>
          <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>{job.description}</p>
        </div>

        <div>
          <h4 className="font-bold mb-3" style={{ color: 'var(--text-main)' }}>Requirements</h4>
          <ul className="space-y-2">
            {job.requirements.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--text-light-color)' }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3" style={{ color: 'var(--text-main)' }}>Responsibilities</h4>
          <ul className="space-y-2">
            {job.responsibilities.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-light-color)' }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--bg-alt)' }}>
          <Button to={`/careers/apply?job=${job.id}`} onClick={onClose} size="lg">
            Start Application <ArrowRight size={18} />
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
