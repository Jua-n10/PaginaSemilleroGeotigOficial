import { useState, useEffect } from "react";
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
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";
import angeloRobot from "../assets/avatarPos.png";
import { SolicitudesPanel } from "./SolicitudesPanel";
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
const TEMPLATE_ID_RECHAZO = "template_rechazo"; // Asegúrate de crear este template
const PUBLIC_KEY = "DgX-I2W97YTL57c6K";

interface AdminPanelProps {
  onClose: () => void;
}

type TabType =
  | "dashboard"
  | "proyectos"
  | "equipo"
  | "areas"
  | "solicitudes"
  | "configuracion";

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: "activo" | "completado" | "en_desarrollo";
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
  estado: "pendiente" | "aceptada" | "rechazada";
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

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    {
      id: "1",
      nombre: "Análisis de Cobertura Forestal",
      descripcion: "Monitoreo satelital de bosques",
      estado: "activo",
      fecha: "2024-01-15",
    },
    {
      id: "2",
      nombre: "Mapeo de Riesgo Sísmico",
      descripcion: "Evaluación territorial del Cauca",
      estado: "en_desarrollo",
      fecha: "2024-02-10",
    },
  ]);

  const [miembros, setMiembros] = useState<Miembro[]>([
    {
      id: "1",
      nombre: "Carlos Rodríguez",
      rol: "Director",
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
  ]);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [editingProyecto, setEditingProyecto] = useState<string | null>(null);
  const [comentarioSolicitud, setComentarioSolicitud] = useState("");
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<Solicitud | null>(null);
  const [modalAceptar, setModalAceptar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [solicitudesSubTab, setSolicitudesSubTab] = useState<
    "pendientes" | "aprobadas" | "rechazadas"
  >("pendientes");

  const [newProyecto, setNewProyecto] = useState({
    nombre: "",
    descripcion: "",
    estado: "en_desarrollo" as const,
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
    // Para que salga solo una vez por sesión del navegador
    const alreadyWelcomed = sessionStorage.getItem("geotig_admin_welcome");

    if (!alreadyWelcomed) {
      toast.success(
        "¡Bienvenida Profesora! Has ingresado al Panel Administrativo de GEOTIG 👩‍🏫",
        { duration: 5000 },
      );
      sessionStorage.setItem("geotig_admin_welcome", "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("geotig_user");
    localStorage.removeItem("geotig_login_time");
    sessionStorage.removeItem("geotig_admin_welcome");
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

  const handleDeleteProyecto = (id: string) => {
    setProyectos(proyectos.filter((p) => p.id !== id));
    toast.success("Proyecto eliminado");
  };

  const handleAddProyecto = () => {
    if (!newProyecto.nombre || !newProyecto.descripcion) {
      toast.error("Completa todos los campos");
      return;
    }
    const proyecto: Proyecto = {
      id: Date.now().toString(),
      ...newProyecto,
      fecha: new Date().toISOString().split("T")[0],
    };
    setProyectos([...proyectos, proyecto]);
    setNewProyecto({ nombre: "", descripcion: "", estado: "en_desarrollo" });
    toast.success("Proyecto agregado exitosamente");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "proyectos", label: "Proyectos", icon: FolderKanban },
    { id: "equipo", label: "Equipo", icon: Users },
    { id: "areas", label: "Áreas", icon: Microscope },
    { id: "solicitudes", label: "Solicitudes", icon: UserPlus },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ] as const;

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
              <h1 className="text-2xl font-bold">
                Panel Administrativo GEOTIG
              </h1>
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
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-600">
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
                      <FolderKanban className="w-12 h-12 text-blue-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Miembros</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {miembros.length}
                        </p>
                      </div>
                      <Users className="w-12 h-12 text-teal-600 opacity-50" />
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
                          {
                            solicitudes.filter((s) => s.estado === "pendiente")
                              .length
                          }
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
                        <p className="text-gray-600 text-sm">
                          Áreas de Investigación
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          6
                        </p>
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
                          <p className="font-medium text-gray-900">
                            Nuevo proyecto agregado
                          </p>
                          <p className="text-sm text-gray-600">
                            Mapeo de Riesgo Sísmico - hace 2 días
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                        <Users className="w-5 h-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Nuevo miembro aprobado
                          </p>
                          <p className="text-sm text-gray-600">
                            María González - hace 5 días
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Proyecto completado
                          </p>
                          <p className="text-sm text-gray-600">
                            Análisis de Cobertura Forestal - hace 1 semana
                          </p>
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
                        <p className="font-medium text-gray-900">
                          Reunión de Equipo
                        </p>
                        <p className="text-sm text-gray-600">
                          25 de Enero, 2024 - 10:00 AM
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-l-teal-600 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">
                          Presentación de Resultados
                        </p>
                        <p className="text-sm text-gray-600">
                          30 de Enero, 2024 - 3:00 PM
                        </p>
                      </div>
                      <div className="p-3 border-l-4 border-l-green-600 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">
                          Workshop de Teledetección
                        </p>
                        <p className="text-sm text-gray-600">
                          5 de Febrero, 2024 - 2:00 PM
                        </p>
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
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Gestión de Proyectos
                </h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Proyecto
                      </label>
                      <input
                        type="text"
                        value={newProyecto.nombre}
                        onChange={(e) =>
                          setNewProyecto({
                            ...newProyecto,
                            nombre: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Ej: Análisis de Cambio Climático"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={newProyecto.descripcion}
                        onChange={(e) =>
                          setNewProyecto({
                            ...newProyecto,
                            descripcion: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        rows={3}
                        placeholder="Describe brevemente el proyecto..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <select
                        value={newProyecto.estado}
                        onChange={(e) =>
                          setNewProyecto({
                            ...newProyecto,
                            estado: e.target.value as any,
                          })
                        }
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
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                proyecto.estado === "activo"
                                  ? "bg-green-100 text-green-700"
                                  : proyecto.estado === "completado"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {proyecto.estado === "activo"
                                ? "Activo"
                                : proyecto.estado === "completado"
                                  ? "Completado"
                                  : "En Desarrollo"}
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
          {activeTab === "equipo" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Gestión del Equipo
              </h2>

              <div className="grid gap-4">
                {miembros.map((miembro) => (
                  <Card
                    key={miembro.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {miembro.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
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
            </div>
          )}

          {/* Áreas */}
          {activeTab === "areas" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Áreas de Investigación
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">
                    Gestión de áreas de investigación (próximamente)
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Configuración */}
          {activeTab === "configuracion" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Configuración del Sitio
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Configuraciones Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Semillero
                    </label>
                    <input
                      type="text"
                      defaultValue="GEOTIG"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
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
