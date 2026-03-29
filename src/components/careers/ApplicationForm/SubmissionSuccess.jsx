import { motion } from 'framer-motion';
import { CheckCircle, Home, Briefcase } from 'lucide-react';
import Button from '../../shared/Button';

export default function SubmissionSuccess({ name, email }) {
  const refNumber = `DHH-${Date.now().toString().slice(-8)}`;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto text-center py-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: 'var(--primary)', color: 'var(--white)' }}>
        <CheckCircle size={48} />
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-3xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>
        Thank you, {name || 'Applicant'}!
      </motion.h2>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="space-y-4">
        <p className="text-lg" style={{ color: 'var(--text-light-color)' }}>Your application has been received.</p>

        <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-alt)' }}>
          <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>Application Reference #</p>
          <p className="text-xl font-bold font-mono" style={{ color: 'var(--primary)' }}>{refNumber}</p>
        </div>

        <p className="text-sm" style={{ color: 'var(--text-light-color)' }}>
          Our team will review your application within <strong>48 hours</strong>.
          {email && <> A confirmation will be sent to <strong>{email}</strong>.</>}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button to="/careers" variant="outline"><Briefcase size={16} /> Return to Careers</Button>
          <Button to="/"><Home size={16} /> Return Home</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
