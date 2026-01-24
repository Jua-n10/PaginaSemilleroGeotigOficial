import { Target, Eye, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 mb-2">Quiénes Somos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un espacio de formación e investigación en geografía y tecnologías de información geográfica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="mb-4 text-gray-900">Misión</h3>
              <p className="text-gray-600">
                Fomentar la investigación y el aprendizaje en geoestudios territoriales,
                formando profesionales competentes en el análisis espacial y las TIG.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="mb-4 text-gray-900">Visión</h3>
              <p className="text-gray-600">
                Ser un semillero de investigación reconocido a nivel nacional e internacional
                por la calidad de sus proyectos y aportes al desarrollo territorial.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="mb-4 text-gray-900">Valores</h3>
              <p className="text-gray-600">
                Compromiso, colaboración, excelencia académica, innovación y responsabilidad
                social en todas nuestras actividades investigativas.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-gray-900 mb-6 text-center">¿Qué hacemos?</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Investigación Aplicada</h4>
                <p className="text-gray-600">
                  Desarrollamos proyectos de investigación en análisis territorial, cartografía
                  digital y sistemas de información geográfica.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Formación Académica</h4>
                <p className="text-gray-600">
                  Ofrecemos talleres, seminarios y cursos sobre herramientas geográficas
                  y metodologías de investigación territorial.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Colaboración Interinstitucional</h4>
                <p className="text-gray-600">
                  Trabajamos con entidades públicas, privadas y comunidades en proyectos
                  de desarrollo territorial sostenible.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Divulgación Científica</h4>
                <p className="text-gray-600">
                  Publicamos artículos, participamos en eventos académicos y compartimos
                  nuestros hallazgos con la comunidad científica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
