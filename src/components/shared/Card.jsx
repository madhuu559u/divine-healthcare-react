import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-6 ${className}`}
      style={{ background: 'var(--white)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
