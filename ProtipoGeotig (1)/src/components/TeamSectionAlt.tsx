import { GraduationCap, Users, Lightbulb, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import teamPhoto1 from 'figma:asset/48db8a8572c47c9997cbc280d07e080731452965.png';
import teamPhoto2 from 'figma:asset/52715ce0d40fe9d94e16995b489e09724dd3a6af.png';
import teamPhoto3 from 'figma:asset/f740552c3006c0b3d78b76ec0551bfcdd2a70aca.png';

export function TeamSectionAlt() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array de fotos reales del equipo
  const photos = [
    {
      src: teamPhoto1,
      title: 'Sesiones de formación',
      subtitle: 'Aprendizaje colaborativo en el aula',
      color: 'from-cyan-800/70'
    },
    {
      src: teamPhoto2,
      title: 'Equipo GEOTIG unido',
      subtitle: 'Familia de investigadores del territorio',
      color: 'from-green-700/70'
    },
    {
      src: teamPhoto3,
      title: 'Trabajo de campo - Los Nevados',
      subtitle: 'Explorando y estudiando nuestro territorio',
      color: 'from-slate-800/70'
    },
  ];

  // Cambio automático de slide cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      icon: GraduationCap,
      title: 'Dirección Académica',
      description: 'Docentes investigadores con amplia experiencia en geografía y TIG',
      count: '3',
      color: 'from-blue-900 to-blue-950',
    },
    {
      icon: Lightbulb,
      title: 'Coordinadores',
      description: 'Estudiantes de posgrado liderando líneas de investigación',
      count: '5',
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      icon: Users,
      title: 'Investigadores',
      description: 'Estudiantes de pregrado desarrollando proyectos activos',
      count: '30+',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Award,
      title: 'Colaboradores',
      description: 'Expertos externos y aliados institucionales',
      count: '10+',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const skills = [
    'ArcGIS', 'QGIS', 'Google Earth Engine', 'Python', 'R',
    'PostgreSQL/PostGIS', 'JavaScript', 'Remote Sensing',
    'Análisis Espacial', 'Cartografía', 'Geoestadística', 'WebGIS'
  ];

  return (
    <section id="equipo" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="text-emerald-600 uppercase tracking-wide text-sm">Nuestro Equipo</span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Talento multidisciplinario comprometido
          </h2>
          <p className="text-xl text-gray-600">
            Conformado por estudiantes y docentes apasionados por la investigación territorial
          </p>
        </div>

        {/* Dynamic Photo Collage */}
        <div className="mb-16 relative">
          {/* Main Carousel */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-110'
                }`}
              >
                <img 
                  src={photo.src} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${photo.color} via-transparent to-transparent`} />
                
                {/* Caption */}
                <div className={`absolute bottom-0 left-0 right-0 p-8 text-white transform transition-all duration-1000 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <h3 className="text-3xl mb-2">{photo.title}</h3>
                  <p className="text-lg text-gray-200">{photo.subtitle}</p>
                </div>
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-10">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} rounded-2xl transform group-hover:scale-105 transition-transform`} />
                <div className="relative bg-white rounded-2xl p-6 m-0.5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl mb-2 bg-gradient-to-br from-blue-900 to-emerald-600 bg-clip-text text-transparent">
                    {role.count}
                  </div>
                  <h3 className="text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border-2 border-gray-100">
          <h3 className="text-gray-900 mb-8 text-center">
            Herramientas y Tecnologías
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <div
                key={skill}
                className="px-5 py-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all cursor-default"
              >
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Join Team CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-br from-blue-950 to-emerald-900 rounded-2xl p-8 text-white">
            <h3 className="text-white mb-4">¿Quieres formar parte del equipo?</h3>
            <p className="text-gray-200 mb-6 max-w-2xl">
              Estamos en búsqueda constante de estudiantes motivados y comprometidos con la investigación
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('unete');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Ver cómo unirte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}