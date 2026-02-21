export default function HeroSection() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Student Innovation
            <span className="block text-primary">Council</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Empowering students to innovate, create, and transform ideas into reality through research, collaboration, and entrepreneurship.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Join Us
            </button>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              View Projects
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
