import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TeamSection() {
  return (
    <section id="equipo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 mb-2">Nuestro Equipo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El semillero está conformado por estudiantes y docentes comprometidos con la investigación
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-gray-100 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                DR
              </div>
              <h3 className="text-gray-900 mb-1">Director Académico</h3>
              <p className="text-gray-500 mb-4">Profesor Investigador</p>
              <p className="text-gray-600 text-sm">
                Responsable de orientar las líneas de investigación y garantizar la calidad académica
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                CO
              </div>
              <h3 className="text-gray-900 mb-1">Coordinación</h3>
              <p className="text-gray-500 mb-4">Estudiantes de Posgrado</p>
              <p className="text-gray-600 text-sm">
                Gestión administrativa, planificación de actividades y seguimiento de proyectos
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                ES
              </div>
              <h3 className="text-gray-900 mb-1">Estudiantes</h3>
              <p className="text-gray-500 mb-4">Pregrado y Posgrado</p>
              <p className="text-gray-600 text-sm">
                Desarrollan proyectos de investigación y participan activamente en las actividades
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-gray-900 mb-6 text-center">Áreas de Expertise del Equipo</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Sistemas de Información Geográfica',
                'Teledetección y Procesamiento de Imágenes',
                'Análisis Espacial',
                'Cartografía Temática',
                'Geoestadística',
                'Programación Geoespacial',
                'Ordenamiento Territorial',
                'Estudios Ambientales',
              ].map((skill) => (
                <div key={skill} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-gray-700 text-sm">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
