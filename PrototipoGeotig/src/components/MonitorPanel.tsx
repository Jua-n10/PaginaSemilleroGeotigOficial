import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";
import angeloRobot from "../assets/avatarPos.png";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firabase";
import emailjs from "@emailjs/browser";

// Configuración EmailJS
const SERVICE_ID = "service_37lpii8";
const TEMPLATE_ID_BIENVENIDA = "template_2bae6in";
const TEMPLATE_ID_RECHAZO = "template_vc220xa";
const PUBLIC_KEY = "DgX-I2W97YTL57c6K";

interface MonitorPanelProps {
  onClose: () => void;
}

type TabType = "dashboard" | "proyectos" | "equipo" | "solicitudes" | "tareas";

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: "activo" | "completado" | "en_desarrollo";
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
  estado: "pendiente" | "aceptada" | "rechazada";
}

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  estado: "pendiente" | "en_progreso" | "completada";
  fecha: string;
}

// Funciones para enviar emails con EmailJS
async function enviarCorreoBienvenida(
  solicitud: Solicitud,
  comentario: string,
) {
  const comentarioFinal =
    comentario?.trim() ||
    "Pronto recibirás más información sobre nuestras actividades.";

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_BIENVENIDA,
      {
        to_email: solicitud.email,
        nombre: solicitud.nombre,
        programa: solicitud.programa,
        comentario: comentarioFinal,
      },
      { publicKey: PUBLIC_KEY },
    );
    console.log("Email de bienvenida enviado a:", solicitud.email);
  } catch (error) {
    console.error("Error enviando email de bienvenida:", error);
    throw error;
  }
}

async function enviarCorreoRechazo(solicitud: Solicitud, comentario: string) {
  const comentarioFinal =
    comentario?.trim() ||
    "Puedes solicitar nuevamente en próximas convocatorias.";

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_RECHAZO,
      {
        to_email: solicitud.email,
        nombre: solicitud.nombre,
        programa: solicitud.programa,
        comentario: comentarioFinal,
      },
      { publicKey: PUBLIC_KEY },
    );
    console.log("Email de rechazo enviado a:", solicitud.email);
  } catch (error) {
    console.error("Error enviando email de rechazo:", error);
    throw error;
  }
}

export function MonitorPanel({ onClose }: MonitorPanelProps) {
  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init({ publicKey: PUBLIC_KEY });
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const [proyectos, setProyectos] = useState<Proyecto[]>([
    {
      id: "1",
      nombre: "Análisis de Cobertura Forestal",
      descripcion: "Monitoreo satelital de bosques",
      estado: "activo",
      fecha: "2024-01-15",
      responsable: "Carlos Rodríguez",
    },
    {
      id: "2",
      nombre: "Mapeo de Riesgo Sísmico",
      descripcion: "Evaluación territorial del Cauca",
      estado: "en_desarrollo",
      fecha: "2024-02-10",
      responsable: "María González",
    },
    {
      id: "3",
      nombre: "Sistema de Alertas Tempranas",
      descripcion: "Desarrollo de sistema GIS",
      estado: "activo",
      fecha: "2024-01-05",
      responsable: "Monitor",
    },
  ]);

  const [miembros] = useState<Miembro[]>([
    {
      id: "1",
      nombre: "Carlos Rodríguez",
      rol: "Investigador Senior",
      programa: "Ingeniería Civil",
      email: "carlos@unicauca.edu.co",
    },
    {
      id: "2",
      nombre: "María González",
      rol: "Investigadora",
      programa: "Geografía",
      email: "maria@unicauca.edu.co",
    },
    {
      id: "3",
      nombre: "Juan Pérez",
      rol: "Estudiante",
      programa: "Ingeniería Ambiental",
      email: "juan@unicauca.edu.co",
    },
    {
      id: "4",
      nombre: "Ana Martínez",
      rol: "Estudiante",
      programa: "Biología",
      email: "ana@unicauca.edu.co",
    },
  ]);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [comentarioSolicitud, setComentarioSolicitud] = useState("");
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<Solicitud | null>(null);
  const [modalAceptar, setModalAceptar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [solicitudesSubTab, setSolicitudesSubTab] = useState<
    "pendientes" | "aprobadas" | "rechazadas"
  >("pendientes");

  const [tareas, setTareas] = useState<Tarea[]>([
    {
      id: "1",
      titulo: "Preparar presentación mensual",
      descripcion: "Slides de avances de proyectos",
      prioridad: "alta",
      estado: "en_progreso",
      fecha: "2024-01-25",
    },
    {
      id: "2",
      titulo: "Coordinar reunión de equipo",
      descripcion: "Planificar agenda y convocar",
      prioridad: "alta",
      estado: "pendiente",
      fecha: "2024-01-24",
    },
    {
      id: "3",
      titulo: "Actualizar base de datos de proyectos",
      descripcion: "Revisar y actualizar información",
      prioridad: "media",
      estado: "pendiente",
      fecha: "2024-01-26",
    },
    {
      id: "4",
      titulo: "Responder correos de solicitudes",
      descripcion: "Contactar a nuevos interesados",
      prioridad: "media",
      estado: "completada",
      fecha: "2024-01-23",
    },
  ]);

  const [newTarea, setNewTarea] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media" as const,
  });

  useEffect(() => {
    const q = query(
      collection(db, "solicitudes"),
      orderBy("fechaCreacion", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          nombre: docData.nombre || "",
          email: docData.email || "",
          programa: docData.programa || "",
          mensaje: docData.motivacion || "",
          fecha: docData.fechaCreacion
            ? new Date(docData.fechaCreacion.toDate())
                .toISOString()
                .split("T")[0]
            : "",
          estado: docData.estado || "pendiente",
        } as Solicitud;
      });
      setSolicitudes(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const alreadyWelcomed = sessionStorage.getItem("geotig_monitor_welcome");

    if (!alreadyWelcomed) {
      toast.success(
        "¡Bienvenido Monitor! Has ingresado al Panel de Monitor de GEOTIG 👨‍💻",
        { duration: 5000 },
      );
      sessionStorage.setItem("geotig_monitor_welcome", "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("geotig_user");
    localStorage.removeItem("geotig_login_time");
    localStorage.removeItem("geotig_role");
    sessionStorage.removeItem("geotig_monitor_welcome");
    toast.success("Sesión cerrada exitosamente");
    onClose();
  };

  const handleAprobarSolicitud = async (solicitud: Solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setComentarioSolicitud("");
    setModalAceptar(true);
  };

  const handleConfirmarAceptacion = async () => {
    if (!solicitudSeleccionada) return;
    try {
      await updateDoc(doc(db, "solicitudes", solicitudSeleccionada.id), {
        estado: "aceptada",
        comentariosAdmin: comentarioSolicitud,
        fechaRevision: new Date(),
      });

      // Enviar email de bienvenida
      await enviarCorreoBienvenida(solicitudSeleccionada, comentarioSolicitud);

      toast.success("Solicitud aprobada y correo enviado");
      setModalAceptar(false);
      setComentarioSolicitud("");
      setSolicitudSeleccionada(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al aprobar solicitud o enviar email");
    }
  };

  const handleRechazarSolicitud = async (solicitud: Solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setComentarioSolicitud("");
    setModalRechazar(true);
  };

  const handleConfirmarRechazo = async () => {
    if (!solicitudSeleccionada) return;
    try {
      await updateDoc(doc(db, "solicitudes", solicitudSeleccionada.id), {
        estado: "rechazada",
        comentariosAdmin: comentarioSolicitud,
        fechaRevision: new Date(),
      });

      // Enviar email de rechazo
      await enviarCorreoRechazo(solicitudSeleccionada, comentarioSolicitud);

      toast.success("Solicitud rechazada y correo enviado");
      setModalRechazar(false);
      setComentarioSolicitud("");
      setSolicitudSeleccionada(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al rechazar solicitud o enviar email");
    }
  };

  const handleUpdateProyecto = (id: string, campo: string, valor: string) => {
    setProyectos(
      proyectos.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
    );
    toast.success("Proyecto actualizado");
  };

  const handleAddTarea = () => {
    if (!newTarea.titulo || !newTarea.descripcion) {
      toast.error("Completa todos los campos");
      return;
    }
    const tarea: Tarea = {
      id: Date.now().toString(),
      ...newTarea,
      estado: "pendiente",
      fecha: new Date().toISOString().split("T")[0],
    };
    setTareas([...tareas, tarea]);
    setNewTarea({ titulo: "", descripcion: "", prioridad: "media" });
    toast.success("Tarea agregada exitosamente");
  };

  const handleToggleTarea = (id: string) => {
    setTareas(
      tareas.map((t) =>
        t.id === id
          ? {
              ...t,
              estado: t.estado === "completada" ? "pendiente" : "completada",
            }
          : t,
      ),
    );
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "proyectos", label: "Proyectos", icon: FolderKanban },
    { id: "equipo", label: "Equipo", icon: Users },
    { id: "solicitudes", label: "Solicitudes", icon: UserPlus },
    { id: "tareas", label: "Mis Tareas", icon: CheckSquare },
  ] as const;

  const tareasPendientes = tareas.filter(
    (t) => t.estado === "pendiente" || t.estado === "en_progreso",
  ).length;
  const solicitudesPendientes = solicitudes.filter(
    (s) => s.estado === "pendiente",
  ).length;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={angeloRobot}
              alt="Angelo"
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">Panel de Monitor GEOTIG</h1>
              <p className="text-teal-100 text-sm">
                Gestión diaria del semillero
              </p>
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
                      ? "bg-gradient-to-r from-blue-900 to-teal-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
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
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Dashboard del Monitor
                </h2>
                <p className="text-gray-600">Bienvenido, Monitor GEOTIG 👋</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-teal-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">
                          Proyectos Activos
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {
                            proyectos.filter((p) => p.estado === "activo")
                              .length
                          }
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
                        <p className="text-gray-600 text-sm">
                          Miembros del Equipo
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {miembros.length}
                        </p>
                      </div>
                      <Users className="w-12 h-12 text-blue-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">
                          Solicitudes Pendientes
                        </p>
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
                        <p className="text-gray-600 text-sm">
                          Tareas Pendientes
                        </p>
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
                      <CheckSquare className="w-5 h-5 text-teal-600" />
                      Tareas Prioritarias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tareas
                        .filter(
                          (t) =>
                            t.prioridad === "alta" && t.estado !== "completada",
                        )
                        .slice(0, 3)
                        .map((tarea) => (
                          <div
                            key={tarea.id}
                            className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-l-red-500 rounded-lg"
                          >
                            <CheckSquare className="w-5 h-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {tarea.titulo}
                              </p>
                              <p className="text-sm text-gray-600">
                                {tarea.descripcion}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {tarea.fecha}
                              </p>
                            </div>
                          </div>
                        ))}
                      {tareas.filter(
                        (t) =>
                          t.prioridad === "alta" && t.estado !== "completada",
                      ).length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No hay tareas prioritarias pendientes
                        </p>
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
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Nueva solicitud recibida
                          </p>
                          <p className="text-sm text-gray-600">
                            Laura Sánchez - Ing. Topográfica
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                        <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Proyecto actualizado
                          </p>
                          <p className="text-sm text-gray-600">
                            Sistema de Alertas Tempranas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Tarea completada
                          </p>
                          <p className="text-sm text-gray-600">
                            Responder correos de solicitudes
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Proyectos */}
          {activeTab === "proyectos" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Proyectos del Semillero
              </h2>

              <div className="grid gap-4">
                {proyectos.map((proyecto) => (
                  <Card
                    key={proyecto.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {proyecto.nombre}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {proyecto.descripcion}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">
                                Estado
                              </label>
                              <select
                                value={proyecto.estado}
                                onChange={(e) =>
                                  handleUpdateProyecto(
                                    proyecto.id,
                                    "estado",
                                    e.target.value,
                                  )
                                }
                                className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                                  proyecto.estado === "activo"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : proyecto.estado === "completado"
                                      ? "bg-blue-100 text-blue-700 border-blue-300"
                                      : "bg-orange-100 text-orange-700 border-orange-300"
                                }`}
                              >
                                <option value="en_desarrollo">
                                  En Desarrollo
                                </option>
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
          {activeTab === "equipo" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Equipo del Semillero
              </h2>

              <div className="grid gap-4">
                {miembros.map((miembro) => (
                  <Card
                    key={miembro.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {miembro.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {miembro.nombre}
                          </h3>
                          <p className="text-teal-600 font-medium">
                            {miembro.rol}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {miembro.programa}
                          </p>
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
          {activeTab === "solicitudes" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Solicitudes de Estudiantes
              </h2>

              {/* Submenú de Solicitudes */}
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setSolicitudesSubTab("pendientes")}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    solicitudesSubTab === "pendientes"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Pendientes (
                  {solicitudes.filter((s) => s.estado === "pendiente").length})
                </button>
                <button
                  onClick={() => setSolicitudesSubTab("aprobadas")}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    solicitudesSubTab === "aprobadas"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Aprobadas (
                  {solicitudes.filter((s) => s.estado === "aceptada").length})
                </button>
                <button
                  onClick={() => setSolicitudesSubTab("rechazadas")}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    solicitudesSubTab === "rechazadas"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Rechazadas (
                  {solicitudes.filter((s) => s.estado === "rechazada").length})
                </button>
              </div>

              {/* Contenido del Submenú - Pendientes */}
              {solicitudesSubTab === "pendientes" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {solicitudes
                      .filter((s) => s.estado === "pendiente")
                      .map((solicitud) => (
                        <Card
                          key={solicitud.id}
                          className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {solicitud.nombre}
                                  </h3>
                                  <p className="text-teal-600 font-medium text-sm mt-1">
                                    {solicitud.programa}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                    <Mail className="w-4 h-4" />
                                    {solicitud.email}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {solicitud.fecha}
                                  </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                                  Pendiente
                                </span>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                  Motivación:
                                </p>
                                <p className="text-gray-700">
                                  {solicitud.mensaje}
                                </p>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() =>
                                    handleAprobarSolicitud(solicitud)
                                  }
                                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Save className="w-4 h-4" />
                                  Aprobar
                                </button>
                                <button
                                  onClick={() =>
                                    handleRechazarSolicitud(solicitud)
                                  }
                                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  Rechazar
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {solicitudes.filter((s) => s.estado === "pendiente")
                      .length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                          No hay solicitudes pendientes
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Contenido del Submenú - Aprobadas */}
              {solicitudesSubTab === "aprobadas" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {solicitudes
                      .filter((s) => s.estado === "aceptada")
                      .map((solicitud) => (
                        <Card
                          key={solicitud.id}
                          className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {solicitud.nombre}
                                  </h3>
                                  <p className="text-teal-600 font-medium text-sm mt-1">
                                    {solicitud.programa}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                    <Mail className="w-4 h-4" />
                                    {solicitud.email}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {solicitud.fecha}
                                  </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                  Aceptada
                                </span>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                  Motivación:
                                </p>
                                <p className="text-gray-700">
                                  {solicitud.mensaje}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {solicitudes.filter((s) => s.estado === "aceptada")
                      .length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                          No hay solicitudes aprobadas
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Contenido del Submenú - Rechazadas */}
              {solicitudesSubTab === "rechazadas" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {solicitudes
                      .filter((s) => s.estado === "rechazada")
                      .map((solicitud) => (
                        <Card
                          key={solicitud.id}
                          className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {solicitud.nombre}
                                  </h3>
                                  <p className="text-teal-600 font-medium text-sm mt-1">
                                    {solicitud.programa}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                    <Mail className="w-4 h-4" />
                                    {solicitud.email}
                                  </p>
                                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {solicitud.fecha}
                                  </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                  Rechazada
                                </span>
                              </div>

                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                  Motivación:
                                </p>
                                <p className="text-gray-700">
                                  {solicitud.mensaje}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {solicitudes.filter((s) => s.estado === "rechazada")
                      .length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                          No hay solicitudes rechazadas
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Modal de Confirmación para Aceptar */}
              {modalAceptar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md mx-4">
                    <CardHeader>
                      <CardTitle>Aceptar Solicitud</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">
                        ¿Deseas aceptar la solicitud de{" "}
                        <strong>{solicitudSeleccionada?.nombre}</strong>?
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comentario (opcional)
                        </label>
                        <textarea
                          value={comentarioSolicitud}
                          onChange={(e) =>
                            setComentarioSolicitud(e.target.value)
                          }
                          placeholder="Agrega un comentario sobre la decisión..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setModalAceptar(false);
                            setComentarioSolicitud("");
                            setSolicitudSeleccionada(null);
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleConfirmarAceptacion}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Confirmar
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Modal de Confirmación para Rechazar */}
              {modalRechazar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md mx-4">
                    <CardHeader>
                      <CardTitle>Rechazar Solicitud</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">
                        ¿Deseas rechazar la solicitud de{" "}
                        <strong>{solicitudSeleccionada?.nombre}</strong>?
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comentario (opcional)
                        </label>
                        <textarea
                          value={comentarioSolicitud}
                          onChange={(e) =>
                            setComentarioSolicitud(e.target.value)
                          }
                          placeholder="Agrega un comentario sobre la decisión..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setModalRechazar(false);
                            setComentarioSolicitud("");
                            setSolicitudSeleccionada(null);
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleConfirmarRechazo}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Confirmar
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Tareas */}
          {activeTab === "tareas" && (
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Tarea
                      </label>
                      <input
                        type="text"
                        value={newTarea.titulo}
                        onChange={(e) =>
                          setNewTarea({ ...newTarea, titulo: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Ej: Preparar informe semanal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={newTarea.descripcion}
                        onChange={(e) =>
                          setNewTarea({
                            ...newTarea,
                            descripcion: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={3}
                        placeholder="Describe la tarea..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridad
                      </label>
                      <select
                        value={newTarea.prioridad}
                        onChange={(e) =>
                          setNewTarea({
                            ...newTarea,
                            prioridad: e.target.value as any,
                          })
                        }
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
                {tareas
                  .filter((t) => t.estado !== "completada")
                  .map((tarea) => (
                    <Card
                      key={tarea.id}
                      className={`hover:shadow-lg transition-shadow ${
                        tarea.prioridad === "alta"
                          ? "border-l-4 border-l-red-500"
                          : tarea.prioridad === "media"
                            ? "border-l-4 border-l-orange-500"
                            : "border-l-4 border-l-blue-500"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleToggleTarea(tarea.id)}
                            className="mt-1"
                          >
                            <div
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                tarea.estado === "completada"
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300 hover:border-teal-500"
                              }`}
                            >
                              {tarea.estado === "completada" && (
                                <CheckSquare className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </button>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {tarea.titulo}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  tarea.prioridad === "alta"
                                    ? "bg-red-100 text-red-700"
                                    : tarea.prioridad === "media"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {tarea.prioridad.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {tarea.descripcion}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {tarea.fecha}
                              </span>
                              <span
                                className={`text-sm font-medium ${
                                  tarea.estado === "en_progreso"
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {tarea.estado === "en_progreso"
                                  ? "En Progreso"
                                  : "Pendiente"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Tareas completadas */}
              {tareas.filter((t) => t.estado === "completada").length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Completadas
                  </h3>
                  {tareas
                    .filter((t) => t.estado === "completada")
                    .map((tarea) => (
                      <Card
                        key={tarea.id}
                        className="hover:shadow-lg transition-shadow opacity-60"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <button onClick={() => handleToggleTarea(tarea.id)}>
                              <div className="w-6 h-6 rounded border-2 bg-green-500 border-green-500 flex items-center justify-center">
                                <CheckSquare className="w-4 h-4 text-white" />
                              </div>
                            </button>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 line-through">
                                {tarea.titulo}
                              </h3>
                              <p className="text-gray-600">
                                {tarea.descripcion}
                              </p>
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

        {/* Modal para comentario al aceptar */}
        {modalAceptar && (
          <div className="fixed inset-0 z-[200] bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Agregar Comentario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (opcional)
                  </label>
                  <textarea
                    value={comentarioSolicitud}
                    onChange={(e) => setComentarioSolicitud(e.target.value)}
                    placeholder="Agrega un comentario sobre la aceptación..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalAceptar(false);
                      setComentarioSolicitud("");
                      setSolicitudSeleccionada(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarAceptacion}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Aceptar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal para comentario al rechazar */}
        {modalRechazar && (
          <div className="fixed inset-0 z-[200] bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Agregar Comentario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del rechazo (opcional)
                  </label>
                  <textarea
                    value={comentarioSolicitud}
                    onChange={(e) => setComentarioSolicitud(e.target.value)}
                    placeholder="Agrega un comentario sobre el rechazo..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setModalRechazar(false);
                      setComentarioSolicitud("");
                      setSolicitudSeleccionada(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarRechazo}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Rechazar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
