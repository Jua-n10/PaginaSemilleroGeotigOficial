import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check, Mail, Calendar, Users, BookOpen } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function JoinSection() {
  return (
    <section id="unete" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 mb-2">Únete a GEOTIG</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sé parte de nuestra comunidad de investigación y desarrollo territorial
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-gray-900 mb-6">¿Por qué unirte al semillero?</h3>
            <div className="space-y-4">
              {[
                'Desarrolla habilidades en tecnologías geoespaciales',
                'Participa en proyectos reales de investigación',
                'Accede a software especializado y bases de datos',
                'Trabaja con expertos en geografía y SIG',
                'Publica artículos y presenta en eventos académicos',
                'Amplía tu red profesional y académica',
              ].map((benefit) => (
                <div key={benefit} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758270705482-cee87ea98738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MTQyNDkyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Estudiantes colaborando"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-xl shadow-lg max-w-xs">
              <p className="text-sm">
                "El semillero me permitió aplicar mis conocimientos en proyectos reales y desarrollar mi tesis de grado"
              </p>
              <p className="text-xs mt-2 text-teal-100">- Estudiante GEOTIG</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="mb-8 text-center text-white">Proceso de Vinculación</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Mail,
                step: '1',
                title: 'Contacto Inicial',
                description: 'Envía tu hoja de vida y carta de motivación',
              },
              {
                icon: Calendar,
                step: '2',
                title: 'Entrevista',
                description: 'Conversamos sobre tus intereses y expectativas',
              },
              {
                icon: BookOpen,
                step: '3',
                title: 'Inducción',
                description: 'Conoce el semillero y las líneas de trabajo',
              },
              {
                icon: Users,
                step: '4',
                title: 'Integración',
                description: 'Únete a un grupo de investigación',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-teal-300 text-sm mb-2">Paso {item.step}</div>
                  <h4 className="text-white mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-gray-900 mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Estamos abiertos a estudiantes de todas las carreras interesados en geografía, tecnología y territorio
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8">
              <Mail className="mr-2 h-5 w-5" />
              Enviar Solicitud
            </Button>
            <Button size="lg" variant="outline" className="border-2 px-8">
              Más Información
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
