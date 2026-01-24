import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

const projects = [
  {
    title: 'Monitoreo de Deforestación en el Cauca',
    description: 'Análisis multitemporal mediante imágenes Landsat y Sentinel-2 para identificar patrones de deforestación y cambios en la cobertura boscosa del departamento.',
    status: 'En desarrollo',
    category: 'Teledetección',
    impact: 'Se identificaron 12,500 ha de pérdida forestal en los últimos 3 años',
    technologies: ['Sentinel-2', 'Google Earth Engine', 'QGIS', 'Python'],
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    title: 'Cartografía de Riesgo por Inundación',
    description: 'Modelamiento hidrológico e hidráulico para mapear zonas de amenaza por inundación en cuencas de municipios del norte del Cauca.',
    status: 'Completado',
    category: 'Análisis Espacial',
    impact: '15 municipios cuentan con mapas actualizados de riesgo',
    technologies: ['HEC-RAS', 'ArcGIS', 'DEM ALOS', 'ModelBuilder'],
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Atlas Socioterritorial del Cauca',
    description: 'Desarrollo de un atlas digital interactivo que integra variables demográficas, económicas y ambientales del departamento.',
    status: 'En desarrollo',
    category: 'Cartografía Digital',
    impact: 'Herramienta consultada por 5 entidades gubernamentales',
    technologies: ['Leaflet', 'PostgreSQL/PostGIS', 'React', 'D3.js'],
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
    gradient: 'from-purple-600 to-pink-600',
  },
];

export function ProjectsSectionAlt() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section id="proyectos" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="text-emerald-600 uppercase tracking-wide text-sm">Nuestro Trabajo</span>
          </div>
          <h2 className="text-gray-900 mb-6">
            Proyectos de Investigación
          </h2>
          <p className="text-xl text-gray-600">
            Iniciativas que generan conocimiento y transforman territorios
          </p>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="activo">Activos</TabsTrigger>
            <TabsTrigger value="finalizado">Finalizados</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activo" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.status === 'En desarrollo').map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finalizado" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.status === 'Completado').map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-950 to-emerald-900 rounded-3xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl mb-2">20+</div>
              <div className="text-gray-300">Proyectos Completados</div>
            </div>
            <div>
              <div className="text-4xl mb-2">15</div>
              <div className="text-gray-300">Publicaciones</div>
            </div>
            <div>
              <div className="text-4xl mb-2">8</div>
              <div className="text-gray-300">Convenios Activos</div>
            </div>
            <div>
              <div className="text-4xl mb-2">100%</div>
              <div className="text-gray-300">Impacto Social</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="group overflow-hidden border-2 border-gray-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className={`${
            project.status === 'En desarrollo' 
              ? 'bg-emerald-500 hover:bg-emerald-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}>
            {project.status === 'En desarrollo' ? 'En Curso' : 'Finalizado'}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
          <Calendar className="w-4 h-4" />
          <span>{project.year}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-gray-900 flex-1">{project.title}</h3>
          <button className="text-gray-400 hover:text-emerald-600 transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Impacto:</span>
          <Badge variant="outline" className="text-xs">
            {project.impact}
          </Badge>
        </div>
      </div>
    </Card>
  );
}