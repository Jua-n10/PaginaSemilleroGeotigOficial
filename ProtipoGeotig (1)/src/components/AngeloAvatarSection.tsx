import { motion } from 'motion/react';
import angeloAvatar from 'figma:asset/9a80882d3bb2501564786ff19cba9154cf26a379.png';

export function AngeloAvatarSection() {
  return (
    <section id="angelo" className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="angelo-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#10b981" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#angelo-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Under Construction Badge */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-full px-4 py-2">
                <span className="text-orange-700 text-sm font-semibold">🚧 Prototipo en Construcción</span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl mb-6">
              <span className="bg-gradient-to-r from-blue-900 to-emerald-600 bg-clip-text text-transparent">
                Conoce a Angelo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra mascota oficial, representando la innovación tecnológica y la exploración geoespacial
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Angelo Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 blur-3xl rounded-full scale-110" />
              
              {/* Avatar Container */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative bg-white rounded-3xl p-8 shadow-2xl border-4 border-emerald-100"
              >
                <img 
                  src={angeloAvatar} 
                  alt="Angelo - Mascota GEOTIG" 
                  className="w-full max-w-md h-auto"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
              <h3 className="text-2xl mb-4 text-blue-900">🤖 Angelo, tu guía tecnológico</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Angelo es más que una mascota, es el símbolo de nuestra pasión por la tecnología geoespacial 
                y la innovación territorial. Con su planeta en mano, representa nuestra misión de explorar, 
                analizar y transformar el mundo a través de las TIG.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-3xl mb-2">🌍</div>
                <h4 className="text-lg mb-2 text-blue-900">Visión Global</h4>
                <p className="text-sm text-gray-700">
                  Perspectiva internacional en análisis territorial
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                <div className="text-3xl mb-2">💡</div>
                <h4 className="text-lg mb-2 text-emerald-900">Innovación</h4>
                <p className="text-sm text-gray-700">
                  Tecnología de vanguardia en GIS
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="text-lg mb-2 text-purple-900">Educación</h4>
                <p className="text-sm text-gray-700">
                  Aprendizaje continuo y formación
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="text-lg mb-2 text-orange-900">Exploración</h4>
                <p className="text-sm text-gray-700">
                  Descubrimiento de nuevas fronteras
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}