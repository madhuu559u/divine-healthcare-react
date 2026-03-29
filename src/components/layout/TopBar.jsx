import { Mail, Clock, Phone } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

export default function TopBar() {
  return (
    <div className="hidden md:block text-sm py-2 px-4 transition-colors duration-300" style={{ background: 'var(--primary-dark)', color: 'var(--white)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {COMPANY.hours.weekday} | {COMPANY.hours.saturday}
          </span>
          <a href={`mailto:${COMPANY.infoEmail}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Mail size={14} /> {COMPANY.infoEmail}
          </a>
        </div>
        <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 font-semibold hover:opacity-80 transition-opacity">
          <Phone size={14} /> {COMPANY.phone}
        </a>
      </div>
    </div>
  );
}
