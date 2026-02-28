import { GraduationCap, Users, Lightbulb, Award } from "lucide-react";
import { useState, useEffect } from "react";
import semi1 from "../assets/semi1.jpeg";
import semi2 from "../assets/semi2.jpeg";
import semi3 from "../assets/semi3.jpeg";
import semi4 from "../assets/semi4.jpeg";
import semi5 from "../assets/semi5.jpeg";

export function TeamSectionAlt() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array de fotos del collage (reemplazadas por nuevas imágenes "semi1..semi4")
  const photos = [
    {
      src: semi1,
      title: "Taller de cartografía digital",
      subtitle: "Explorando herramientas GIS en equipo",
      color: "from-cyan-800/70",
    },
    {
      src: semi2,
      title: "Presentación del robot GEOTIG",
      subtitle: "Demostración tecnológica durante la jornada",
      color: "from-green-700/70",
    },
    {
      src: semi3,
      title: "Planificación de proyectos",
      subtitle: "Sesión colaborativa de ideas y post-its",
      color: "from-slate-800/70",
    },
    {
      src: semi4,
      title: "Estudiantes en campo",
      subtitle: "Trabajo práctico de terreno con instrumentos",
      color: "from-blue-900/70",
    },
    {
      src: semi5,
      title: "Cierre de seminario",
      subtitle: "Foto grupal en la ceremonia final",
      color: "from-purple-800/70",
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
      title: "Dirección Académica",
      description:
        "Docentes investigadores con amplia experiencia en geografía y TIG",
      count: "3",
      color: "from-blue-900 to-blue-950",
    },
    {
      icon: Lightbulb,
      title: "Coordinadores",
      description: "Estudiantes de posgrado liderando líneas de investigación",
      count: "5",
      color: "from-emerald-600 to-emerald-700",
    },
    {
      icon: Users,
      title: "Investigadores",
      description: "Estudiantes de pregrado desarrollando proyectos activos",
      count: "30+",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Award,
      title: "Colaboradores",
      description: "Expertos externos y aliados institucionales",
      count: "10+",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const skills = [
    "ArcGIS",
    "QGIS",
    "Google Earth Engine",
    "Python",
    "R",
    "PostgreSQL/PostGIS",
    "JavaScript",
    "Remote Sensing",
    "Análisis Espacial",
    "Cartografía",
    "Geoestadística",
    "WebGIS",
  ];

  return (
    <section id="equipo" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="text-emerald-600 uppercase tracking-wide text-sm">
              Nuestro Equipo
            </span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Talento multidisciplinario comprometido
          </h2>
          <p className="text-xl text-gray-600">
            Conformado por estudiantes y docentes apasionados por la
            investigación territorial
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
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                {/* Fondo blur (más sutil y elegante) */}
                <div
                  className="absolute inset-0 bg-center bg-cover scale-110 blur-xl opacity-70"
                  style={{ backgroundImage: `url(${photo.src})` }}
                />

                {/* Vignette (bordes oscuros) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.65)_100%)]" />

                {/* Imagen principal */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="relative w-full h-full object-contain"
                  loading="lazy"
                />

                {/* Gradiente inferior para el texto (suave) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${photo.color} via-transparent to-transparent`}
                />

                {/* Caption */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-8 text-white transform transition-all duration-1000 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <h3 className="text-3xl mb-2 drop-shadow-lg">
                    {photo.title}
                  </h3>
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
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
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
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.color} rounded-2xl transform group-hover:scale-105 transition-transform`}
                />
                <div className="relative bg-white rounded-2xl p-6 m-0.5">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-4`}
                  >
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
            <h3 className="text-white mb-4">
              ¿Quieres formar parte del equipo?
            </h3>
            <p className="text-gray-200 mb-6 max-w-2xl">
              Estamos en búsqueda constante de estudiantes motivados y
              comprometidos con la investigación
            </p>
            <button
              onClick={() => {
                const element = document.getElementById("unete");
                if (element) element.scrollIntoView({ behavior: "smooth" });
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
