import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Microscope, 
  UserPlus, 
  Settings, 
  LogOut, 
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  Mail,
  Calendar,
  TrendingUp,
  FileText,
  Award,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import angeloRobot from 'figma:asset/0a47a596dc809b83cc73cb9ecf830467255dfd5b.png';

interface AdminPanelProps {
  onClose: () => void;
}

type TabType = 'dashboard' | 'proyectos' | 'equipo' | 'areas' | 'solicitudes' | 'configuracion';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'completado' | 'en_desarrollo';
  fecha: string;
}

interface Miembro {
  id: string;
  nombre: string;
  rol: string;
  programa: string;
  email: string;
}

interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  programa: string;
  mensaje: string;
  fecha: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    { id: '1', nombre: 'Análisis de Cobertura Forestal', descripcion: 'Monitoreo satelital de bosques', estado: 'activo', fecha: '2024-01-15' },
    { id: '2', nombre: 'Mapeo de Riesgo Sísmico', descripcion: 'Evaluación territorial del Cauca', estado: 'en_desarrollo', fecha: '2024-02-10' },
  ]);
  
  const [miembros, setMiembros] = useState<Miembro[]>([
    { id: '1', nombre: 'Carlos Rodríguez', rol: 'Director', programa: 'Ingeniería Civil', email: 'carlos@unicauca.edu.co' },
    { id: '2', nombre: 'María González', rol: 'Investigadora', programa: 'Geografía', email: 'maria@unicauca.edu.co' },
  ]);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    { 
      id: '1', 
      nombre: 'Juan Pérez', 
      email: 'juan@unicauca.edu.co', 
      programa: 'Ingeniería Ambiental',
      mensaje: 'Tengo gran interés en GIS y teledetección',
      fecha: '2024-01-20',
      estado: 'pendiente'
    },
    { 
      id: '2', 
      nombre: 'Ana Martínez', 
      email: 'ana@unicauca.edu.co', 
      programa: 'Biología',
      mensaje: 'Quiero participar en proyectos de conservación',
      fecha: '2024-01-22',
      estado: 'pendiente'
    },
  ]);

  const [editingProyecto, setEditingProyecto] = useState<string | null>(null);
  const [newProyecto, setNewProyecto] = useState({ nombre: '', descripcion: '', estado: 'en_desarrollo' as const });

  const handleLogout = () => {
    localStorage.removeItem('geotig_user');
    localStorage.removeItem('geotig_login_time');
    toast.success('Sesión cerrada exitosamente');
    onClose();
  };

  const handleDeleteProyecto = (id: string) => {
    setProyectos(proyectos.filter(p => p.id !== id));
    toast.success('Proyecto eliminado');
  };

  const handleAddProyecto = () => {
    if (!newProyecto.nombre || !newProyecto.descripcion) {
      toast.error('Completa todos los campos');
      return;
    }
    const proyecto: Proyecto = {
      id: Date.now().toString(),
      ...newProyecto,
      fecha: new Date().toISOString().split('T')[0]
    };
    setProyectos([...proyectos, proyecto]);
    setNewProyecto({ nombre: '', descripcion: '', estado: 'en_desarrollo' });
    toast.success('Proyecto agregado exitosamente');
  };

  const handleAprobarSolicitud = (id: string) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'aprobada' as const } : s
    ));
    toast.success('Solicitud aprobada');
  };

  const handleRechazarSolicitud = (id: string) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'rechazada' as const } : s
    ));
    toast.info('Solicitud rechazada');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
    { id: 'equipo', label: 'Equipo', icon: Users },
    { id: 'areas', label: 'Áreas', icon: Microscope },
    { id: 'solicitudes', label: 'Solicitudes', icon: UserPlus },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={angeloRobot} alt="Angelo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold">Panel Administrativo GEOTIG</h1>
              <p className="text-teal-100 text-sm">Gestión del sitio web</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg border-r">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-900 to-teal-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Proyectos Activos</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {proyectos.filter(p => p.estado === 'activo').length}
                        </p>
                      </div>
                      <FolderKanban className="w-12 h-12 text-blue-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Miembros</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{miembros.length}</p>
                      </div>
                      <Users className="w-12 h-12 text-teal-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Solicitudes Pendientes</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {solicitudes.filter(s => s.estado === 'pendiente').length}
                        </p>
                      </div>
                      <UserPlus className="w-12 h-12 text-orange-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Áreas de Investigación</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                      </div>
                      <Microscope className="w-12 h-12 text-green-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Nuevo proyecto agregado</p>
                          <p className="text-sm text-gray-600">Mapeo de Riesgo Sísmico - hace 2 días</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                        <Users className="w-5 h-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Nuevo miembro aprobado</p>
                          <p className="text-sm text-gray-600">María González - hace 5 días</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Proyecto completado</p>
                          <p className="text-sm text-gray-600">Análisis de Cobertura Forestal - hace 1 semana</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Próximas Actividades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border-l-4 border-l-blue-600 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">Reunión de Equipo</p>
                        <p className="text-sm text-gray-600">25 de Enero, 2024 - 10:00 AM</p>
                      </div>
                      <div className="p-3 border-l-4 border-l-teal-600 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">Presentación de Resultados</p>
                        <p className="text-sm text-gray-600">30 de Enero, 2024 - 3:00 PM</p>
                      </div>
                      <div className="p-3 border-l-4 border-l-green-600 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">Workshop de Teledetección</p>
                        <p className="text-sm text-gray-600">5 de Febrero, 2024 - 2:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Proyectos */}
          {activeTab === 'proyectos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h2>
              </div>

              {/* Agregar nuevo proyecto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Agregar Nuevo Proyecto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto</label>
                      <input
                        type="text"
                        value={newProyecto.nombre}
                        onChange={(e) => setNewProyecto({ ...newProyecto, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Ej: Análisis de Cambio Climático"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        value={newProyecto.descripcion}
                        onChange={(e) => setNewProyecto({ ...newProyecto, descripcion: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={3}
                        placeholder="Describe brevemente el proyecto..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select
                        value={newProyecto.estado}
                        onChange={(e) => setNewProyecto({ ...newProyecto, estado: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="en_desarrollo">En Desarrollo</option>
                        <option value="activo">Activo</option>
                        <option value="completado">Completado</option>
                      </select>
                    </div>
                    <button
                      onClick={handleAddProyecto}
                      className="w-full bg-gradient-to-r from-blue-900 to-teal-600 text-white py-3 rounded-lg hover:from-blue-800 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Proyecto
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de proyectos */}
              <div className="grid gap-4">
                {proyectos.map((proyecto) => (
                  <Card key={proyecto.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{proyecto.nombre}</h3>
                          <p className="text-gray-600 mb-4">{proyecto.descripcion}</p>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              proyecto.estado === 'activo' ? 'bg-green-100 text-green-700' :
                              proyecto.estado === 'completado' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {proyecto.estado === 'activo' ? 'Activo' :
                               proyecto.estado === 'completado' ? 'Completado' :
                               'En Desarrollo'}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {proyecto.fecha}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProyecto(proyecto.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Equipo */}
          {activeTab === 'equipo' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Gestión del Equipo</h2>
              
              <div className="grid gap-4">
                {miembros.map((miembro) => (
                  <Card key={miembro.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {miembro.nombre.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{miembro.nombre}</h3>
                            <p className="text-teal-600 font-medium">{miembro.rol}</p>
                            <p className="text-gray-600 text-sm">{miembro.programa}</p>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                              <Mail className="w-4 h-4" />
                              {miembro.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Solicitudes */}
          {activeTab === 'solicitudes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Solicitudes de Estudiantes</h2>
              
              <div className="grid gap-4">
                {solicitudes.map((solicitud) => (
                  <Card key={solicitud.id} className={`hover:shadow-lg transition-shadow ${
                    solicitud.estado === 'pendiente' ? 'border-l-4 border-l-orange-500' :
                    solicitud.estado === 'aprobada' ? 'border-l-4 border-l-green-500' :
                    'border-l-4 border-l-red-500'
                  }`}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{solicitud.nombre}</h3>
                            <p className="text-gray-600">{solicitud.programa}</p>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                              <Mail className="w-4 h-4" />
                              {solicitud.email}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            solicitud.estado === 'pendiente' ? 'bg-orange-100 text-orange-700' :
                            solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {solicitud.estado === 'pendiente' ? 'Pendiente' :
                             solicitud.estado === 'aprobada' ? 'Aprobada' :
                             'Rechazada'}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{solicitud.mensaje}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {solicitud.fecha}
                          </span>
                          
                          {solicitud.estado === 'pendiente' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAprobarSolicitud(solicitud.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Aprobar
                              </button>
                              <button
                                onClick={() => handleRechazarSolicitud(solicitud.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Rechazar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Áreas */}
          {activeTab === 'areas' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Áreas de Investigación</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">Gestión de áreas de investigación (próximamente)</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Configuración */}
          {activeTab === 'configuracion' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Configuraciones Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Semillero</label>
                    <input
                      type="text"
                      defaultValue="GEOTIG"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                    <input
                      type="email"
                      defaultValue="geotig@unicauca.edu.co"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-900 to-teal-600 text-white py-3 rounded-lg hover:from-blue-800 hover:to-teal-500 transition-all flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
