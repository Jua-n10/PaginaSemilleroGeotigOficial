import { Button } from './ui/button';
import { ArrowRight, MapPin } from 'lucide-react';

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"
              style={{
                top: `${20 + i * 15}%`,
                left: '-100%',
                right: '-100%',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-600/20 backdrop-blur-sm border border-teal-400/30 rounded-full px-4 py-2 mb-8">
          <MapPin className="w-4 h-4 text-teal-300" />
          <span className="text-teal-100 text-sm">Universidad del Cauca</span>
        </div>

        <h1 className="text-white mb-6">
          <span className="block text-5xl sm:text-6xl lg:text-7xl mb-2">
            Semillero GEOTIG
          </span>
          <span className="block text-xl sm:text-2xl lg:text-3xl text-teal-300">
            Geoestudios Territoriales y TIG
          </span>
        </h1>

        <p className="text-gray-200 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Explora, aprende y construye conocimiento geográfico a través de la investigación,
          tecnologías de información geográfica y estudios territoriales.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            onClick={() => scrollToSection('nosotros')}
          >
            Conocer más
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-teal-900 px-8"
            onClick={() => scrollToSection('unete')}
          >
            Quiero unirme
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          {[
            { number: '5+', label: 'Años de investigación' },
            { number: '20+', label: 'Proyectos activos' },
            { number: '50+', label: 'Estudiantes participantes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl text-teal-300 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
}
