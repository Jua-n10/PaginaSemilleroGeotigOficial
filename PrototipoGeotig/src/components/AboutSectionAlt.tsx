import { Compass, Globe, Layers } from 'lucide-react';

export function AboutSectionAlt() {
  return (
    <section id="nosotros" className="py-16 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="text-emerald-600 uppercase tracking-wide text-sm">Sobre Nosotros</span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Explorando el territorio a través de la ciencia y la tecnología
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            GEOTIG es un espacio académico dedicado a la investigación en geografía, 
            sistemas de información geográfica y estudios territoriales, donde estudiantes 
            y profesores trabajan juntos en proyectos innovadores.
          </p>
        </div>

        {/* Three Column Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl transform group-hover:scale-105 transition-transform" />
            <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-emerald-300 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-4">Investigación Aplicada</h3>
              <p className="text-gray-600">
                Desarrollamos proyectos de investigación con impacto real en el territorio, 
                aplicando metodologías científicas y tecnologías de vanguardia.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl transform group-hover:scale-105 transition-transform" />
            <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-300 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-4">Formación Integral</h3>
              <p className="text-gray-600">
                Ofrecemos capacitación en herramientas SIG, teledetección, análisis espacial 
                y otras tecnologías geográficas esenciales.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl transform group-hover:scale-105 transition-transform" />
            <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-emerald-300 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-4">Colaboración</h3>
              <p className="text-gray-600">
                Trabajamos con instituciones, comunidades y organizaciones para generar 
                conocimiento útil y transformador.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl p-8 lg:p-10 text-white">
            <div className="inline-block bg-emerald-500/20 rounded-lg px-3 py-1 mb-4">
              <span className="text-emerald-300 text-sm uppercase tracking-wide">Misión</span>
            </div>
            <p className="text-lg leading-relaxed text-gray-100">
              Fomentar la investigación científica en geoestudios territoriales y tecnologías de 
              información geográfica, formando profesionales competentes y comprometidos con el 
              desarrollo sostenible del territorio.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 lg:p-10 text-white">
            <div className="inline-block bg-white/20 rounded-lg px-3 py-1 mb-4">
              <span className="text-white text-sm uppercase tracking-wide">Visión</span>
            </div>
            <p className="text-lg leading-relaxed text-gray-50">
              Ser reconocidos como un semillero de investigación líder en el sur de Colombia, 
              destacado por la excelencia de sus proyectos y su contribución al conocimiento 
              geográfico y territorial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}