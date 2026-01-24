import { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import logo from 'figma:asset/775b8c572767ea025e0e8192b1b8c7be5684bea4.png';

export function NavbarAlt({ onLoginClick }: { onLoginClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Sobre Nosotros', id: 'nosotros' },
    { label: 'Angelo', id: 'angelo' },
    { label: 'Investigación', id: 'investigacion' },
    { label: 'Proyectos', id: 'proyectos' },
    { label: 'Equipo', id: 'equipo' },
    { label: 'Contacto', id: 'unete' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GEOTIG Logo" className="h-14 w-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-emerald-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              Acceder
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-gray-700 hover:text-emerald-600 transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLoginClick();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-teal-500 transition-all duration-300 w-full justify-center"
            >
              <LogIn className="w-4 h-4" />
              Acceder
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}