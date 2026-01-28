/**
 * Utilidades para la integración con Firebase Firestore
 * Sistema de solicitudes GEOTIG
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

/**
 * Interface para una solicitud completa
 */
export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  programa: string;
  motivacion: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion: Date;
  fechaRevision: Date | null;
  comentariosAdmin: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Interface para datos sin procesar de Firestore
 */
export interface SolicitudRaw {
  nombre: string;
  email: string;
  programa: string;
  motivacion: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion: Timestamp | null;
  fechaRevision: Timestamp | null;
  comentariosAdmin: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Convierte documento raw de Firestore a objeto Solicitud
 */
export const convertSolicitudFromFirestore = (
  docId: string,
  data: any,
): Solicitud => {
  return {
    id: docId,
    nombre: data.nombre || "",
    email: data.email || "",
    programa: data.programa || "",
    motivacion: data.motivacion || "",
    estado: data.estado || "pendiente",
    fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
    fechaRevision: data.fechaRevision?.toDate() || null,
    comentariosAdmin: data.comentariosAdmin || "",
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
  };
};

/**
 * Obtiene la query base para solicitudes
 */
export const getSolicitudesQuery = (): Query => {
  return query(
    collection(db, "solicitudes"),
    orderBy("fechaCreacion", "desc"),
    limit(500), // Límite de seguridad
  );
};

/**
 * Valida que un email sea válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Obtiene estadísticas de solicitudes
 */
export interface EstadisticasSolicitudes {
  total: number;
  pendientes: number;
  aceptadas: number;
  rechazadas: number;
  tasaAceptacion: number; // Porcentaje
}

/**
 * Calcula estadísticas a partir de un array de solicitudes
 */
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

  return {
    total,
    pendientes,
    aceptadas,
    rechazadas,
    tasaAceptacion,
  };
};

/**
 * Formatea una fecha para mostrar
 */
export const formatearFecha = (
  date: Date,
  locale: string = "es-CO",
): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Obtiene el color del badge según el estado
 */
export const getEstadoColor = (
  estado: "pendiente" | "aceptada" | "rechazada",
): string => {
  switch (estado) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "aceptada":
      return "bg-green-100 text-green-800 border-green-300";
    case "rechazada":
      return "bg-red-100 text-red-800 border-red-300";
  }
};

/**
 * Obtiene el icono del estado
 */
export const getEstadoIcon = (
  estado: "pendiente" | "aceptada" | "rechazada",
): string => {
  switch (estado) {
    case "pendiente":
      return "⏱️";
    case "aceptada":
      return "✅";
    case "rechazada":
      return "❌";
  }
};

/**
 * Sanitiza entrada de usuario para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

/**
 * Valida longitud de texto
 */
export const validateLength = (
  text: string,
  min: number,
  max: number,
): { valid: boolean; error?: string } => {
  const length = text.trim().length;
  if (length < min) {
    return {
      valid: false,
      error: `Mínimo ${min} caracteres (actualmente: ${length})`,
    };
  }
  if (length > max) {
    return {
      valid: false,
      error: `Máximo ${max} caracteres (actualmente: ${length})`,
    };
  }
  return { valid: true };
};

/**
 * Obtiene el estado de revisión legible
 */
export const getEstadoReadable = (
  estado: "pendiente" | "aceptada" | "rechazada",
): string => {
  switch (estado) {
    case "pendiente":
      return "Pendiente de Revisión";
    case "aceptada":
      return "Aceptado";
    case "rechazada":
      return "Rechazado";
  }
};

/**
 * Valida una solicitud completa
 */
export const validateSolicitudData = (
  data: any,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.nombre || data.nombre.trim().length < 3) {
    errors.push("Nombre debe tener al menos 3 caracteres");
  }

  if (!isValidEmail(data.email)) {
    errors.push("Email inválido");
  }

  if (!data.programa || data.programa.trim().length === 0) {
    errors.push("Programa es requerido");
  }

  if (!data.motivacion || data.motivacion.trim().length < 20) {
    errors.push("Motivación debe tener al menos 20 caracteres");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
