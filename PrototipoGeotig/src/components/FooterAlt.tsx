import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import logo from 'figma:asset/775b8c572767ea025e0e8192b1b8c7be5684bea4.png';

export function FooterAlt() {
  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <img src={logo} alt="GEOTIG Logo" className="h-24 w-auto mb-4 brightness-0 invert" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Semillero de investigación especializado en geoestudios territoriales y tecnologías de información geográfica.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Navegación</h4>
            <ul className="space-y-3 text-sm">
              {['Inicio', 'Sobre Nosotros', 'Investigación', 'Proyectos', 'Equipo', 'Contacto'].map((item) => {
                const id = item === 'Inicio' ? 'hero' : item === 'Sobre Nosotros' ? 'nosotros' : item === 'Contacto' ? 'unete' : item.toLowerCase();
                return (
                  <li key={item}>
                    <a 
                      href={`#${id}`}
                      className="text-gray-300 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{item}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4">Recursos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Publicaciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Material de Estudio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Eventos y Talleres
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Galería de Mapas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Repositorio de Datos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">Universidad del Cauca</p>
                  <p className="text-gray-400">Popayán, Cauca, Colombia</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <Mail className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <a 
                  href="mailto:geotig@unicauca.edu.co" 
                  className="text-gray-300 hover:text-emerald-300 transition-colors"
                >
                  geotig@unicauca.edu.co
                </a>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span className="text-gray-300">+57 (2) 820 9800</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © 2025 GEOTIG - Semillero de Investigación. Universidad del Cauca.
            </p>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-emerald-300 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-emerald-300 transition-colors">
                Términos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
