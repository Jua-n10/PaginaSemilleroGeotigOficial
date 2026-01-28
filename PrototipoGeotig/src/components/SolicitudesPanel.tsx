import { useState, useEffect } from "react";
import { db } from "../firabase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Mail,
  Calendar,
  BookOpen,
  Edit2,
  X,
  ThumbsUp,
  ThumbsDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  programa: string;
  motivacion: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion: Date;
  fechaRevision: Date | null;
  comentariosAdmin: string;
}

interface SolicitudesPanelProps {
  rol?: "admin" | "monitor";
}

export function SolicitudesPanel({ rol = "monitor" }: SolicitudesPanelProps) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(
    null,
  );
  const [editingComentarios, setEditingComentarios] = useState("");
  const [nuevoEstado, setNuevoEstado] =
    useState<Solicitud["estado"]>("pendiente");
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "pendiente" | "aceptada" | "rechazada"
  >("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar solicitudes en tiempo real desde Firestore
  useEffect(() => {
    const q = query(
      collection(db, "solicitudes"),
      orderBy("fechaCreacion", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Solicitud[] = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            id: doc.id,
            nombre: docData.nombre,
            email: docData.email,
            programa: docData.programa,
            motivacion: docData.motivacion,
            estado: docData.estado || "pendiente",
            fechaCreacion: docData.fechaCreacion?.toDate() || new Date(),
            fechaRevision: docData.fechaRevision?.toDate() || null,
            comentariosAdmin: docData.comentariosAdmin || "",
          });
        });
        setSolicitudes(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar solicitudes:", error);
        toast.error("Error al cargar las solicitudes");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleActualizarEstado = async (
    solicitudId: string,
    nuevoEst: Solicitud["estado"],
    comentarios: string,
  ) => {
    try {
      const solicitudRef = doc(db, "solicitudes", solicitudId);
      await updateDoc(solicitudRef, {
        estado: nuevoEst,
        fechaRevision: new Date(),
        comentariosAdmin: comentarios,
      });

      // Mostrar mensaje según estado
      if (nuevoEst === "aceptada") {
        toast.success("✅ ¡Solicitud ACEPTADA!");
      } else if (nuevoEst === "rechazada") {
        toast.error("❌ Solicitud rechazada");
      } else {
        toast.success("Solicitud actualizada");
      }

      setSelectedSolicitud(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar la solicitud");
    }
  };

  const handleEliminar = async (solicitudId: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta solicitud?")
    ) {
      try {
        await deleteDoc(doc(db, "solicitudes", solicitudId));
        toast.success("Solicitud eliminada");
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar la solicitud");
      }
    }
  };

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const cumpleFiltro = filtroEstado === "todos" || s.estado === filtroEstado;
    const cumpleBusqueda =
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.programa.toLowerCase().includes(searchTerm.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  const getEstadoColor = (estado: Solicitud["estado"]) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "aceptada":
        return "bg-green-100 text-green-800 border-green-300";
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  const getEstadoIcon = (estado: Solicitud["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "aceptada":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rechazada":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Solicitudes de Vinculación
          </h2>
          <p className="text-gray-600 mt-1">
            Total: {solicitudesFiltradas.length} solicitudes
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="🔍 Buscar por nombre, email o programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300 text-lg py-3"
          />

          <div className="flex items-center gap-3 mb-2">
            <Filter className="w-5 h-5 text-gray-700 font-semibold" />
            <span className="text-sm font-semibold text-gray-700">
              Filtrar por estado:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "todos", label: "Todos", icon: "📋", color: "gray" },
              {
                id: "pendiente",
                label: "Pendiente",
                icon: "⏱️",
                color: "yellow",
              },
              { id: "aceptada", label: "Aceptada", icon: "✅", color: "green" },
              { id: "rechazada", label: "Rechazada", icon: "❌", color: "red" },
            ].map((estado) => (
              <button
                key={estado.id}
                onClick={() => setFiltroEstado(estado.id as any)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform
                  flex items-center justify-center gap-2 border-2
                  ${
                    filtroEstado === estado.id
                      ? `
                      ${estado.color === "yellow" ? "bg-yellow-500 border-yellow-600 text-white shadow-lg scale-105" : ""}
                      ${estado.color === "green" ? "bg-green-500 border-green-600 text-white shadow-lg scale-105" : ""}
                      ${estado.color === "red" ? "bg-red-500 border-red-600 text-white shadow-lg scale-105" : ""}
                      ${estado.color === "gray" ? "bg-gray-700 border-gray-800 text-white shadow-lg scale-105" : ""}
                    `
                      : `
                      bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:shadow-md
                    `
                  }
                `}
              >
                <span className="text-lg">{estado.icon}</span>
                <span>{estado.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Solicitudes */}
      <div className="space-y-3 animate-in fade-in duration-300">
        {solicitudesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 text-lg font-semibold">
                  📭 No hay solicitudes
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Con los filtros aplicados
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          solicitudesFiltradas.map((solicitud) => (
            <Card
              key={solicitud.id}
              className={`hover:shadow-lg transition-all duration-200 border-l-4 animate-in fade-in slide-in-from-top ${
                solicitud.estado === "pendiente"
                  ? "border-l-yellow-500 bg-yellow-50/30 hover:bg-yellow-50/50"
                  : solicitud.estado === "aceptada"
                    ? "border-l-green-500 bg-green-50/30 hover:bg-green-50/50"
                    : "border-l-red-500 bg-red-50/30 hover:bg-red-50/50"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {solicitud.nombre}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${
                          solicitud.estado === "pendiente"
                            ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                            : solicitud.estado === "aceptada"
                              ? "bg-green-100 border-green-400 text-green-800"
                              : "bg-red-100 border-red-400 text-red-800"
                        }`}
                      >
                        {solicitud.estado === "pendiente" && <>⏱️ Pendiente</>}
                        {solicitud.estado === "aceptada" && <>✅ Aceptada</>}
                        {solicitud.estado === "rechazada" && <>❌ Rechazada</>}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${solicitud.email}`}
                          className="text-teal-600 hover:underline"
                        >
                          {solicitud.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {solicitud.programa}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(solicitud.fechaCreacion)}
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Motivación:</span>{" "}
                        {solicitud.motivacion}
                      </p>
                    </div>

                    {solicitud.comentariosAdmin && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Comentarios:</span>{" "}
                          {solicitud.comentariosAdmin}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedSolicitud(solicitud);
                        setNuevoEstado(solicitud.estado);
                        setEditingComentarios(solicitud.comentariosAdmin);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-teal-600 border-teal-600 hover:bg-teal-50"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Revisar
                    </Button>
                    {rol === "admin" && (
                      <Button
                        onClick={() => handleEliminar(solicitud.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Edición */}
      {selectedSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-blue-50 to-teal-50">
              <CardTitle className="text-xl font-bold text-gray-900">
                📋 Revisar y Decidir sobre Solicitud
              </CardTitle>
              <button
                onClick={() => setSelectedSolicitud(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Información de la solicitud */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border-2 border-blue-200">
                <div>
                  <label className="text-xs font-bold text-blue-700 uppercase">
                    👤 Nombre
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {selectedSolicitud.nombre}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-700 uppercase">
                    📧 Email
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {selectedSolicitud.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-blue-700 uppercase">
                    🎓 Programa
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {selectedSolicitud.programa}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-blue-700 uppercase">
                    💭 Motivación
                  </label>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSolicitud.motivacion}
                  </p>
                </div>
              </div>

              {/* Decisión Clara: Aceptar o Rechazar */}
              <div className="space-y-3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-3 border-indigo-200">
                <label className="block text-base font-bold text-gray-900 text-center">
                  ¿Qué deseas hacer con esta solicitud?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setNuevoEstado("aceptada")}
                    className={`p-6 rounded-xl border-3 transition-all font-bold flex flex-col items-center gap-3 ${
                      nuevoEstado === "aceptada"
                        ? "bg-green-400 border-green-600 text-white shadow-2xl scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:shadow-lg"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-8 h-8 ${nuevoEstado === "aceptada" ? "animate-bounce" : ""}`}
                    />
                    <span className="text-base">✅ ACEPTAR</span>
                  </button>
                  <button
                    onClick={() => setNuevoEstado("rechazada")}
                    className={`p-6 rounded-xl border-3 transition-all font-bold flex flex-col items-center gap-3 ${
                      nuevoEstado === "rechazada"
                        ? "bg-red-400 border-red-600 text-white shadow-2xl scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:shadow-lg"
                    }`}
                  >
                    <ThumbsDown
                      className={`w-8 h-8 ${nuevoEstado === "rechazada" ? "animate-bounce" : ""}`}
                    />
                    <span className="text-base">❌ RECHAZAR</span>
                  </button>
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  💬 Comentarios (Opcional)
                </label>
                <Textarea
                  value={editingComentarios}
                  onChange={(e) => setEditingComentarios(e.target.value)}
                  placeholder="Escribe comentarios si es necesario..."
                  rows={4}
                  className="border-2 border-gray-300 focus:border-teal-500 rounded-lg"
                />
              </div>

              {/* Resumen de decisión */}
              <div
                className={`p-5 rounded-lg border-3 font-bold text-center text-lg transition-all ${
                  nuevoEstado === "aceptada"
                    ? "bg-green-100 border-green-400 text-green-800 shadow-lg"
                    : "bg-red-100 border-red-400 text-red-800 shadow-lg"
                }`}
              >
                <p>
                  {nuevoEstado === "aceptada"
                    ? "✅ Este estudiante será ACEPTADO en el semillero GEOTIG"
                    : "❌ Este estudiante será RECHAZADO"}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    handleActualizarEstado(
                      selectedSolicitud.id,
                      nuevoEstado,
                      editingComentarios,
                    );
                  }}
                  className={`flex-1 text-white font-bold text-base py-3 rounded-lg transition-all ${
                    nuevoEstado === "aceptada"
                      ? "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                      : "bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {nuevoEstado === "aceptada"
                    ? "✅ Confirmar Aceptación"
                    : "❌ Confirmar Rechazo"}
                </Button>
                <Button
                  onClick={() => setSelectedSolicitud(null)}
                  variant="outline"
                  className="flex-1 text-base py-3"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
