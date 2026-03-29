import AnimatedSection from '../shared/AnimatedSection';

export default function Story() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <AnimatedSection direction="left">
          <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80" alt="Our story" className="rounded-3xl w-full object-cover shadow-lg" style={{ maxHeight: 500 }} />
        </AnimatedSection>
        <AnimatedSection direction="right">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'var(--accent-light)', color: 'var(--primary-dark)' }}>Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Born from a Passion for Care</h2>
          <div className="space-y-4" style={{ color: 'var(--text-light-color)' }}>
            <p>Divine Healthcare Services was founded in 2014 with a simple yet powerful mission: to provide compassionate, high-quality home care that preserves the dignity and independence of every individual we serve.</p>
            <p>What began as a family-inspired vision has grown into a trusted provider of non-medical personal care services across the state of Virginia. With over a decade of experience, we've had the privilege of serving hundreds of families.</p>
            <p>Our team of dedicated caregivers is the heart of our organization. Each member is carefully selected, thoroughly trained, and deeply committed to making a positive difference in the lives of our clients.</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
