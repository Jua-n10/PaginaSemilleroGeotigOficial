import { Map, Satellite, Database, TreePine, Building2, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const areas = [
  {
    icon: Map,
    title: 'Cartografía Digital',
    description: 'Elaboración de mapas temáticos y análisis espacial utilizando tecnologías de vanguardia.',
    color: 'bg-blue-100 text-blue-600',
    image: 'https://images.unsplash.com/photo-1631016800686-1b3524982956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY2FydG9ncmFwaHklMjBtYXB8ZW58MXx8fHwxNzY4OTY4NDYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Satellite,
    title: 'Teledetección',
    description: 'Procesamiento de imágenes satelitales para análisis ambiental y territorial.',
    color: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1714255288526-cc155b548aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjByZW1vdGUlMjBzZW5zaW5nfGVufDF8fHx8MTc2ODk2ODQ2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Database,
    title: 'Sistemas de Información Geográfica',
    description: 'Desarrollo e implementación de SIG para la gestión de información espacial.',
    color: 'bg-teal-100 text-teal-600',
    image: 'https://images.unsplash.com/photo-1625428354222-ce52b4227b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9ncmFwaGljJTIwaW5mb3JtYXRpb24lMjBzeXN0ZW18ZW58MXx8fHwxNzY4OTY4NDYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: TreePine,
    title: 'Estudios Ambientales',
    description: 'Análisis territorial enfocado en la conservación y gestión de recursos naturales.',
    color: 'bg-green-100 text-green-600',
    image: 'https://images.unsplash.com/photo-1768765436369-6c0f965c59fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY29uc2VydmF0aW9uJTIwZm9yZXN0fGVufDF8fHx8MTc2ODk2ODQ2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Building2,
    title: 'Ordenamiento Territorial',
    description: 'Estudios para la planificación y desarrollo sostenible del territorio.',
    color: 'bg-orange-100 text-orange-600',
    image: 'https://images.unsplash.com/photo-1712697235739-c041c70c75df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBsYW5uaW5nJTIwY2l0eXxlbnwxfHx8fDE3Njg5MDAwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Users,
    title: 'Geografía Social',
    description: 'Investigación sobre dinámicas poblacionales y transformaciones territoriales.',
    color: 'bg-pink-100 text-pink-600',
    image: 'https://images.unsplash.com/photo-1530043123514-c01b94ef483b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzb2NpYWwlMjBnZW9ncmFwaHl8ZW58MXx8fHwxNzY4OTY4NDYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
];

export function ResearchAreas() {
  return (
    <section id="investigacion" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 mb-2">Áreas de Investigación</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Exploramos múltiples dimensiones del conocimiento geográfico y territorial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <Card
                key={area.title}
                className="border-2 border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 right-4 w-14 h-14 ${area.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-3">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            ¿Tienes una idea de investigación?{' '}
            <a href="#unete" className="text-teal-600 hover:underline">
              Únete a nosotros
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}