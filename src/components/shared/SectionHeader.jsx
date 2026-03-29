import AnimatedSection from './AnimatedSection';

export default function SectionHeader({ badge, title, subtitle, center = true }) {
  return (
    <AnimatedSection className={`mb-12 ${center ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-light-color)' }}>
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}
