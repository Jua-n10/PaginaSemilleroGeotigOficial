/**
 * Utilidades para la integración con Firebase Firestore
 * Sistema de solicitudes GEOTIG v2.0
 */

import {
  collection,
  query,
  orderBy,
  limit,
  Query,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firabase";

// ─────────────────────────────────────────────
// TIPOS — coinciden exactamente con lo que
// guarda JoinSectionAlt en Firestore
// ─────────────────────────────────────────────

export type TipoIdentificacion =
  | "Cédula de Ciudadanía"
  | "Tarjeta de Identidad"
  | "Otro";

export type Rol = "Nuevo Integrante" | "Miembro Activo" | "Egresado" | "Otro";

export type AreaInteres =
  | "Sistemas de Información Geográfica (SIG)"
  | "Ordenamiento Territorial y Manejo de Cuencas Hidrográficas"
  | "Geografía Urbana"
  | "Gestión del Riesgo y Medio Ambiente"
  | "Investigación y Publicaciones"
  | "Otro";

export type EstadoSolicitud = "pendiente" | "aceptada" | "rechazada";

// ─────────────────────────────────────────────
// INTERFACE PRINCIPAL
// ─────────────────────────────────────────────

export interface Solicitud {
  id: string;
  // Identificación
  codigoEstudiantil: string;
  fechaNacimiento: string;
  tipoIdentificacion: TipoIdentificacion;
  tipoIdentificacionOtro: string;
  numeroIdentificacion: string;
  // Datos personales
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  // Datos académicos
  facultad: string;
  programa: string;
  semestre: number | "noaplica";
  // Vinculación
  rol: Rol;
  rolOtro: string;
  areaInteres: AreaInteres;
  areaInteresOtro: string;
  motivacion: string;
  // Metadatos
  estado: EstadoSolicitud;
  fechaCreacion: Date;
  fechaRevision: Date | null;
  comentariosAdmin: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface SolicitudRaw {
  codigoEstudiantil: string;
  fechaNacimiento: string;
  tipoIdentificacion: TipoIdentificacion;
  tipoIdentificacionOtro: string;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  facultad: string;
  programa: string;
  semestre: number | "noaplica";
  rol: Rol;
  rolOtro: string;
  areaInteres: AreaInteres;
  areaInteresOtro: string;
  motivacion: string;
  estado: EstadoSolicitud;
  fechaCreacion: Timestamp | null;
  fechaRevision: Timestamp | null;
  comentariosAdmin: string;
  userAgent?: string;
  ipAddress?: string;
}

// ─────────────────────────────────────────────
// CONVERSIÓN
// ─────────────────────────────────────────────

export const convertSolicitudFromFirestore = (
  docId: string,
  data: any,
): Solicitud => {
  return {
    id: docId,
    codigoEstudiantil: data.codigoEstudiantil || "",
    fechaNacimiento: data.fechaNacimiento || "",
    tipoIdentificacion: data.tipoIdentificacion || "Cédula de Ciudadanía",
    tipoIdentificacionOtro: data.tipoIdentificacionOtro || "",
    numeroIdentificacion: data.numeroIdentificacion || "",
    nombres: data.nombres || "",
    apellidos: data.apellidos || "",
    celular: data.celular || "",
    email: data.email || "",
    facultad: data.facultad || "",
    programa: data.programa || "",
    semestre: data.semestre ?? "noaplica",
    rol: data.rol || "Nuevo Integrante",
    rolOtro: data.rolOtro || "",
    areaInteres: data.areaInteres || "Sistemas de Información Geográfica (SIG)",
    areaInteresOtro: data.areaInteresOtro || "",
    motivacion: data.motivacion || "",
    estado: data.estado || "pendiente",
    fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
    fechaRevision: data.fechaRevision?.toDate() || null,
    comentariosAdmin: data.comentariosAdmin || "",
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
  };
};

// ─────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────

export const getSolicitudesQuery = (): Query => {
  return query(
    collection(db, "solicitudes"),
    orderBy("fechaCreacion", "desc"),
    limit(500),
  );
};

// ─────────────────────────────────────────────
// ESTADÍSTICAS
// ─────────────────────────────────────────────

export interface EstadisticasSolicitudes {
  total: number;
  pendientes: number;
  aceptadas: number;
  rechazadas: number;
  tasaAceptacion: number;
}

export const calcularEstadisticas = (
  solicitudes: Solicitud[],
): EstadisticasSolicitudes => {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aceptadas = solicitudes.filter((s) => s.estado === "aceptada").length;
  const rechazadas = solicitudes.filter((s) => s.estado === "rechazada").length;
  const tasaAceptacion =
    aceptadas + rechazadas > 0
      ? Math.round((aceptadas / (aceptadas + rechazadas)) * 100)
      : 0;
  return { total, pendientes, aceptadas, rechazadas, tasaAceptacion };
};

// ─────────────────────────────────────────────
// VALIDACIONES
// ─────────────────────────────────────────────

export const isValidEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export const isValidCelular = (celular: string): boolean => {
  return /^3\d{9}$/.test(celular.replace(/\s/g, ""));
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

export const validateLength = (
  text: string,
  min: number,
  max: number,
): { valid: boolean; error?: string } => {
  const length = text.trim().length;
  if (length < min)
    return {
      valid: false,
      error: `Mínimo ${min} caracteres (actualmente: ${length})`,
    };
  if (length > max)
    return {
      valid: false,
      error: `Máximo ${max} caracteres (actualmente: ${length})`,
    };
  return { valid: true };
};

export const validateSolicitudData = (
  data: any,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!data.nombres || data.nombres.trim().length < 2)
    errors.push("Nombres debe tener al menos 2 caracteres");
  if (!data.apellidos || data.apellidos.trim().length < 2)
    errors.push("Apellidos debe tener al menos 2 caracteres");
  if (!isValidEmail(data.email)) errors.push("Email inválido");
  if (!isValidCelular(data.celular)) errors.push("Celular inválido");
  if (!data.programa || data.programa.trim().length === 0)
    errors.push("Programa es requerido");
  if (!data.motivacion || data.motivacion.trim().length < 20)
    errors.push("Motivación debe tener al menos 20 caracteres");
  return { valid: errors.length === 0, errors };
};

// ─────────────────────────────────────────────
// HELPERS DE PRESENTACIÓN
// ─────────────────────────────────────────────

export const formatearFecha = (date: Date, locale = "es-CO"): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getEstadoColor = (estado: EstadoSolicitud): string => {
  switch (estado) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "aceptada":
      return "bg-green-100 text-green-800 border-green-300";
    case "rechazada":
      return "bg-red-100 text-red-800 border-red-300";
  }
};

export const getEstadoIcon = (estado: EstadoSolicitud): string => {
  switch (estado) {
    case "pendiente":
      return "⏱️";
    case "aceptada":
      return "✅";
    case "rechazada":
      return "❌";
  }
};

export const getEstadoReadable = (estado: EstadoSolicitud): string => {
  switch (estado) {
    case "pendiente":
      return "Pendiente de Revisión";
    case "aceptada":
      return "Aceptado";
    case "rechazada":
      return "Rechazado";
  }
};
