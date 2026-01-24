import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Microscope, 
  UserPlus, 
  LogOut,
  CheckSquare,
  Calendar,
  TrendingUp,
  FileText,
  Award,
  Mail,
  Plus,
  Edit,
  Save,
  X,
  Eye,
  MessageSquare,
  Bell,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import angeloRobot from 'figma:asset/0a47a596dc809b83cc73cb9ecf830467255dfd5b.png';

interface MonitorPanelProps {
  onClose: () => void;
}

type TabType = 'dashboard' | 'proyectos' | 'equipo' | 'solicitudes' | 'tareas';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'completado' | 'en_desarrollo';
  fecha: string;
  responsable?: string;
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
  estado: 'pendiente' | 'revisada' | 'contactada';
}

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fecha: string;
}

export function MonitorPanel({ onClose }: MonitorPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    { id: '1', nombre: 'Análisis de Cobertura Forestal', descripcion: 'Monitoreo satelital de bosques', estado: 'activo', fecha: '2024-01-15', responsable: 'Carlos Rodríguez' },
    { id: '2', nombre: 'Mapeo de Riesgo Sísmico', descripcion: 'Evaluación territorial del Cauca', estado: 'en_desarrollo', fecha: '2024-02-10', responsable: 'María González' },
    { id: '3', nombre: 'Sistema de Alertas Tempranas', descripcion: 'Desarrollo de sistema GIS', estado: 'activo', fecha: '2024-01-05', responsable: 'Monitor' },
  ]);
  
  const [miembros] = useState<Miembro[]>([
    { id: '1', nombre: 'Carlos Rodríguez', rol: 'Investigador Senior', programa: 'Ingeniería Civil', email: 'carlos@unicauca.edu.co' },
    { id: '2', nombre: 'María González', rol: 'Investigadora', programa: 'Geografía', email: 'maria@unicauca.edu.co' },
    { id: '3', nombre: 'Juan Pérez', rol: 'Estudiante', programa: 'Ingeniería Ambiental', email: 'juan@unicauca.edu.co' },
    { id: '4', nombre: 'Ana Martínez', rol: 'Estudiante', programa: 'Biología', email: 'ana@unicauca.edu.co' },
  ]);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    { 
      id: '1', 
      nombre: 'Laura Sánchez', 
      email: 'laura@unicauca.edu.co', 
      programa: 'Ingeniería Topográfica',
      mensaje: 'Estoy interesada en cartografía digital y drones',
      fecha: '2024-01-20',
      estado: 'pendiente'
    },
    { 
      id: '2', 
      nombre: 'Pedro Ramírez', 
      email: 'pedro@unicauca.edu.co', 
      programa: 'Estadística',
      mensaje: 'Quiero aplicar análisis espacial en mis estudios',
      fecha: '2024-01-22',
      estado: 'pendiente'
    },
    { 
      id: '3', 
      nombre: 'Sofia Torres', 
      email: 'sofia@unicauca.edu.co', 
      programa: 'Arquitectura',
      mensaje: 'Me interesa el urbanismo y planificación territorial',
      fecha: '2024-01-23',
      estado: 'revisada'
    },
  ]);

  const [tareas, setTareas] = useState<Tarea[]>([
    { id: '1', titulo: 'Preparar presentación mensual', descripcion: 'Slides de avances de proyectos', prioridad: 'alta', estado: 'en_progreso', fecha: '2024-01-25' },
    { id: '2', titulo: 'Coordinar reunión de equipo', descripcion: 'Planificar agenda y convocar', prioridad: 'alta', estado: 'pendiente', fecha: '2024-01-24' },
    { id: '3', titulo: 'Actualizar base de datos de proyectos', descripcion: 'Revisar y actualizar información', prioridad: 'media', estado: 'pendiente', fecha: '2024-01-26' },
    { id: '4', titulo: 'Responder correos de solicitudes', descripcion: 'Contactar a nuevos interesados', prioridad: 'media', estado: 'completada', fecha: '2024-01-23' },
  ]);

  const [newTarea, setNewTarea] = useState({ titulo: '', descripcion: '', prioridad: 'media' as const });

  const handleLogout = () => {
    localStorage.removeItem('geotig_user');
    localStorage.removeItem('geotig_login_time');
    localStorage.removeItem('geotig_role');
    toast.success('Sesión cerrada exitosamente');
    onClose();
  };

  const handleMarcarRevisada = (id: string) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'revisada' as const } : s
    ));
    toast.success('Solicitud marcada como revisada');
  };

  const handleMarcarContactada = (id: string) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'contactada' as const } : s
    ));
    toast.success('Solicitud marcada como contactada');
  };

  const handleUpdateProyecto = (id: string, campo: string, valor: string) => {
    setProyectos(proyectos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
    toast.success('Proyecto actualizado');
  };

  const handleAddTarea = () => {
    if (!newTarea.titulo || !newTarea.descripcion) {
      toast.error('Completa todos los campos');
      return;
    }
    const tarea: Tarea = {
      id: Date.now().toString(),
      ...newTarea,
      estado: 'pendiente',
      fecha: new Date().toISOString().split('T')[0]
    };
    setTareas([...tareas, tarea]);
    setNewTarea({ titulo: '', descripcion: '', prioridad: 'media' });
    toast.success('Tarea agregada exitosamente');
  };

  const handleToggleTarea = (id: string) => {
    setTareas(tareas.map(t => 
      t.id === id ? { 
        ...t, 
        estado: t.estado === 'completada' ? 'pendiente' : 'completada' 
      } : t
    ));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
    { id: 'equipo', label: 'Equipo', icon: Users },
    { id: 'solicitudes', label: 'Solicitudes', icon: UserPlus },
    { id: 'tareas', label: 'Mis Tareas', icon: CheckSquare },
  ] as const;

  const tareasPendientes = tareas.filter(t => t.estado === 'pendiente' || t.estado === 'en_progreso').length;
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={angeloRobot} alt="Angelo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold">Panel de Monitor GEOTIG</h1>
              <p className="text-teal-100 text-sm">Gestión diaria del semillero</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <div className="relative">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6" />
                {(tareasPendientes + solicitudesPendientes) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tareasPendientes + solicitudesPendientes}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg border-r">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const showBadge = tab.id === 'tareas' && tareasPendientes > 0;
              const showSolicitudesBadge = tab.id === 'solicitudes' && solicitudesPendientes > 0;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-600 to-blue-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {showBadge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {tareasPendientes}
                    </span>
                  )}
                  {showSolicitudesBadge && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {solicitudesPendientes}
                    </span>
                  )}
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
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard del Monitor</h2>
                <p className="text-gray-600">Bienvenido, Monitor GEOTIG 👋</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-teal-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Proyectos Activos</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {proyectos.filter(p => p.estado === 'activo').length}
                        </p>
                      </div>
                      <FolderKanban className="w-12 h-12 text-teal-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Miembros del Equipo</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{miembros.length}</p>
                      </div>
                      <Users className="w-12 h-12 text-blue-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Solicitudes Pendientes</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {solicitudesPendientes}
                        </p>
                      </div>
                      <UserPlus className="w-12 h-12 text-orange-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Tareas Pendientes</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {tareasPendientes}
                        </p>
                      </div>
                      <CheckSquare className="w-12 h-12 text-red-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-teal-600" />
                      Tareas Prioritarias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tareas.filter(t => t.prioridad === 'alta' && t.estado !== 'completada').slice(0, 3).map(tarea => (
                        <div key={tarea.id} className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-l-red-500 rounded-lg">
                          <CheckSquare className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{tarea.titulo}</p>
                            <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {tarea.fecha}
                            </p>
                          </div>
                        </div>
                      ))}
                      {tareas.filter(t => t.prioridad === 'alta' && t.estado !== 'completada').length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay tareas prioritarias pendientes</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Nueva solicitud recibida</p>
                          <p className="text-sm text-gray-600">Laura Sánchez - Ing. Topográfica</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                        <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Proyecto actualizado</p>
                          <p className="text-sm text-gray-600">Sistema de Alertas Tempranas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Tarea completada</p>
                          <p className="text-sm text-gray-600">Responder correos de solicitudes</p>
                        </div>
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
              <h2 className="text-3xl font-bold text-gray-900">Proyectos del Semillero</h2>
              
              <div className="grid gap-4">
                {proyectos.map((proyecto) => (
                  <Card key={proyecto.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{proyecto.nombre}</h3>
                          <p className="text-gray-600 mb-4">{proyecto.descripcion}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Estado</label>
                              <select
                                value={proyecto.estado}
                                onChange={(e) => handleUpdateProyecto(proyecto.id, 'estado', e.target.value)}
                                className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                                  proyecto.estado === 'activo' ? 'bg-green-100 text-green-700 border-green-300' :
                                  proyecto.estado === 'completado' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                  'bg-orange-100 text-orange-700 border-orange-300'
                                }`}
                              >
                                <option value="en_desarrollo">En Desarrollo</option>
                                <option value="activo">Activo</option>
                                <option value="completado">Completado</option>
                              </select>
                            </div>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {proyecto.fecha}
                            </span>
                            {proyecto.responsable && (
                              <span className="text-sm text-teal-600 font-medium flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {proyecto.responsable}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
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
              <h2 className="text-3xl font-bold text-gray-900">Equipo del Semillero</h2>
              
              <div className="grid gap-4">
                {miembros.map((miembro) => (
                  <Card key={miembro.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {miembro.nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{miembro.nombre}</h3>
                          <p className="text-teal-600 font-medium">{miembro.rol}</p>
                          <p className="text-gray-600 text-sm">{miembro.programa}</p>
                          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <Mail className="w-4 h-4" />
                            {miembro.email}
                          </p>
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
                    solicitud.estado === 'revisada' ? 'border-l-4 border-l-blue-500' :
                    'border-l-4 border-l-green-500'
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
                            solicitud.estado === 'revisada' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {solicitud.estado === 'pendiente' ? 'Pendiente' :
                             solicitud.estado === 'revisada' ? 'Revisada' :
                             'Contactada'}
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
                          
                          <div className="flex gap-2">
                            {solicitud.estado === 'pendiente' && (
                              <button
                                onClick={() => handleMarcarRevisada(solicitud.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Marcar como Revisada
                              </button>
                            )}
                            {solicitud.estado === 'revisada' && (
                              <button
                                onClick={() => handleMarcarContactada(solicitud.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Marcar como Contactada
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tareas */}
          {activeTab === 'tareas' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Mis Tareas</h2>

              {/* Agregar nueva tarea */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Agregar Nueva Tarea
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título de la Tarea</label>
                      <input
                        type="text"
                        value={newTarea.titulo}
                        onChange={(e) => setNewTarea({ ...newTarea, titulo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Ej: Preparar informe semanal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        value={newTarea.descripcion}
                        onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={3}
                        placeholder="Describe la tarea..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                      <select
                        value={newTarea.prioridad}
                        onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    <button
                      onClick={handleAddTarea}
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-900 text-white py-3 rounded-lg hover:from-teal-500 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Tarea
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de tareas */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Pendientes</h3>
                {tareas.filter(t => t.estado !== 'completada').map((tarea) => (
                  <Card key={tarea.id} className={`hover:shadow-lg transition-shadow ${
                    tarea.prioridad === 'alta' ? 'border-l-4 border-l-red-500' :
                    tarea.prioridad === 'media' ? 'border-l-4 border-l-orange-500' :
                    'border-l-4 border-l-blue-500'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleTarea(tarea.id)}
                          className="mt-1"
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            tarea.estado === 'completada' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-teal-500'
                          }`}>
                            {tarea.estado === 'completada' && <CheckSquare className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{tarea.titulo}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              tarea.prioridad === 'alta' ? 'bg-red-100 text-red-700' :
                              tarea.prioridad === 'media' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {tarea.prioridad.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{tarea.descripcion}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {tarea.fecha}
                            </span>
                            <span className={`text-sm font-medium ${
                              tarea.estado === 'en_progreso' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {tarea.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tareas completadas */}
              {tareas.filter(t => t.estado === 'completada').length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Completadas</h3>
                  {tareas.filter(t => t.estado === 'completada').map((tarea) => (
                    <Card key={tarea.id} className="hover:shadow-lg transition-shadow opacity-60">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <button onClick={() => handleToggleTarea(tarea.id)}>
                            <div className="w-6 h-6 rounded border-2 bg-green-500 border-green-500 flex items-center justify-center">
                              <CheckSquare className="w-4 h-4 text-white" />
                            </div>
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 line-through">{tarea.titulo}</h3>
                            <p className="text-gray-600">{tarea.descripcion}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
