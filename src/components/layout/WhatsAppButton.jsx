import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY } from '../../utils/constants';

export default function WhatsAppButton() {
  return (
    <motion.a
      href={COMPANY.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
      style={{ background: '#25D366' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <MessageCircle size={26} fill="white" />
    </motion.a>
  );
}
