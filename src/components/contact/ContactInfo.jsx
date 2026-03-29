import { Phone, Mail, MapPin, Clock, Printer, MessageCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';
import Card from '../shared/Card';

const items = [
  { icon: Phone, label: 'Phone', value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
  { icon: Mail, label: 'Email', value: COMPANY.infoEmail, href: `mailto:${COMPANY.infoEmail}` },
  { icon: Printer, label: 'Fax', value: COMPANY.fax },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: COMPANY.whatsapp },
  { icon: MapPin, label: 'Address', value: `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}` },
  { icon: Clock, label: 'Hours', value: `${COMPANY.hours.weekday}\n${COMPANY.hours.saturday}\n${COMPANY.hours.emergency}` },
];

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.label} className="flex items-start gap-4 !p-4" hover={false}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-light)' }}>
            <item.icon size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide block mb-0.5" style={{ color: 'var(--text-light-color)' }}>{item.label}</span>
            {item.href ? (
              <a href={item.href} className="text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }} target={item.label === 'WhatsApp' ? '_blank' : undefined} rel={item.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}>{item.value}</a>
            ) : (
              <span className="text-sm whitespace-pre-line" style={{ color: 'var(--text-main)' }}>{item.value}</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
