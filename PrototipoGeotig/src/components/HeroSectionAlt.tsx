import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import logo from 'figma:asset/775b8c572767ea025e0e8192b1b8c7be5684bea4.png';

export function HeroSectionAlt() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-20 min-h-screen flex items-center bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="white" />
              <path d="M0 30 L60 30 M30 0 L30 60" stroke="white" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-white mb-6">
              <span className="block text-4xl sm:text-5xl lg:text-6xl mb-3">
                Semillero
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                GEOTIG
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Innovación en Geoestudios Territoriales y Tecnologías de Información Geográfica
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                onClick={() => scrollToSection('nosotros')}
              >
                Descubre más
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 shadow-xl shadow-emerald-500/50 animate-pulse"
                onClick={() => scrollToSection('unete')}
              >
                Únete al semillero
              </Button>
            </div>
          </div>

          {/* Right Content - Logo */}
          <div className="relative">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-3xl rounded-full" />
              
              {/* Logo */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12">
                <img 
                  src={logo} 
                  alt="GEOTIG Logo" 
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('nosotros')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}