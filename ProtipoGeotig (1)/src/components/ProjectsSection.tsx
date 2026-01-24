import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: 'Análisis Territorial del Cauca',
    description: 'Estudio multidimensional del ordenamiento territorial del departamento del Cauca utilizando SIG y análisis espacial.',
    image: 'https://images.unsplash.com/photo-1628158088936-68ccaaa400dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHSVMlMjBtYXBwaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjEzNzcxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'En curso',
    year: '2024-2025',
    tags: ['SIG', 'Ordenamiento Territorial', 'Cartografía'],
  },
  {
    title: 'Monitoreo de Cobertura Vegetal',
    description: 'Uso de imágenes satelitales para el monitoreo de cambios en la cobertura vegetal y análisis de deforestación.',
    image: 'https://images.unsplash.com/photo-1602028328401-3cd3581af4fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY29uc2VydmF0aW9uJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2MTQ0ODU1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'En curso',
    year: '2024',
    tags: ['Teledetección', 'Ambiental', 'Conservación'],
  },
  {
    title: 'Atlas Digital Universitario',
    description: 'Creación de un atlas digital interactivo del campus universitario con información georreferenciada de servicios y espacios.',
    image: 'https://images.unsplash.com/photo-1574786198374-9461cb650c23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMGltYWdlcnl8ZW58MXx8fHwxNzYxNDQ4NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Completado',
    year: '2023',
    tags: ['WebGIS', 'Cartografía Digital', 'Universidad'],
  },
];

export function ProjectsSection() {
  return (
    <section id="proyectos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-teal-600 mb-2">Proyectos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce algunos de los proyectos en los que estamos trabajando
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.title}
              className="border-2 border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`${
                      project.status === 'En curso'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
                <h3 className="text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
            Ver todos los proyectos
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
