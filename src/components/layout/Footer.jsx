import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Printer, Globe, Heart, Users, Share2 } from 'lucide-react';
import { COMPANY, NAV_LINKS } from '../../utils/constants';

export default function Footer() {
  const serviceLinks = [
    { label: 'Personal Care', path: '/services#personal-care' },
    { label: 'Companionship', path: '/services#companionship' },
    { label: 'Medication Reminders', path: '/services#medication-reminders' },
    { label: 'Post-Hospital Support', path: '/services#post-hospital' },
    { label: 'Medicaid Services', path: '/medicaid' },
  ];

  const quickLinks = [
    ...NAV_LINKS,
    { label: 'Referrals', path: '/referrals' },
  ];

  const socialIcons = [
    { Icon: Globe, href: COMPANY.social.facebook, label: 'Facebook' },
    { Icon: Heart, href: COMPANY.social.instagram, label: 'Instagram' },
    { Icon: Users, href: COMPANY.social.linkedin, label: 'LinkedIn' },
    { Icon: Share2, href: COMPANY.social.twitter, label: 'Twitter' },
  ];

  return (
    <footer className="relative z-10 transition-colors duration-300" style={{ background: 'var(--primary-dark)', color: 'rgba(255,255,255,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <img src="https://img1.wsimg.com/isteam/ip/2b5573a4-2ac2-4b6d-b528-244db817d67f/FullLogo_Transparent_NoBuffer%20(9).png/:/rs=h:102,cg:true,m/qt=q:95"
                alt="Divine Healthcare Services" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">{COMPANY.tagline}</p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}><Link to={link.path} className="hover:text-white transition-colors opacity-80 hover:opacity-100">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.path}><Link to={link.path} className="hover:text-white transition-colors opacity-80 hover:opacity-100">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{COMPANY.address.street}, {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.zip}</span>
              </li>
              <li><a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={16} className="shrink-0" /> {COMPANY.phone}</a></li>
              <li className="flex items-center gap-2"><Printer size={16} className="shrink-0" /> Fax: {COMPANY.fax}</li>
              <li><a href={`mailto:${COMPANY.infoEmail}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={16} className="shrink-0" /> {COMPANY.infoEmail}</a></li>
              <li className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0" /><span>{COMPANY.hours.weekday}<br />{COMPANY.hours.saturday}<br />{COMPANY.hours.emergency}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 px-4 text-center text-sm opacity-70">
        © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. | Licensed & Insured
      </div>
    </footer>
  );
}
