import { Satellite, Map, Mountain, Users } from 'lucide-react';

const areas = [
  {
    icon: Satellite,
    title: 'Teledetección y Observación de la Tierra',
    description: 'Procesamiento de imágenes satelitales para monitoreo ambiental, análisis de cambios en el territorio y estudios de cobertura vegetal.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    icon: Map,
    title: 'Sistemas de Información Geográfica',
    description: 'Desarrollo de soluciones SIG para análisis espacial, cartografía digital, modelamiento territorial y gestión de recursos naturales.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
  },
  {
    icon: Mountain,
    title: 'Geografía Física y Ambiental',
    description: 'Estudio de procesos geomorfológicos, hidrológicos y climáticos mediante técnicas geoespaciales y trabajo de campo.',
    color: 'from-green-600 to-green-700',
    bgColor: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
  },
  {
    icon: Users,
    title: 'Estudios Socioterritoriales',
    description: 'Análisis de dinámicas sociales, ordenamiento territorial, planificación urbana y rural con enfoque participativo.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
  },
];

export function ResearchAreasAlt() {
  return (
    <section id="investigacion" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="text-emerald-600 uppercase tracking-wide text-sm">Líneas de Investigación</span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Áreas de estudio y desarrollo
          </h2>
          <p className="text-xl text-gray-600">
            Nuestro trabajo se enfoca en múltiples dimensiones del análisis territorial y geográfico
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} 
                     style={{ padding: '2px' }} 
                />
                
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${area.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
            <p className="text-gray-700 mb-4">
              ¿Tienes interés en alguna de estas áreas o una propuesta de investigación?
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('unete');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all"
            >
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}