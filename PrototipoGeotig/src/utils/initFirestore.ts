/**
 * ══════════════════════════════════════════════
 * SCRIPT DE INICIALIZACIÓN — Colección "solicitudes"
 * Sistema GEOTIG v2.0
 *
 * INSTRUCCIONES:
 *   1. Copia este archivo en tu proyecto.
 *   2. Llama initFirestoreCollection() UNA SOLA VEZ
 *      (desde un botón temporal en tu panel admin).
 *   3. Verifica en Firebase Console que aparezca
 *      la colección "solicitudes".
 *   4. Elimina el documento de muestra desde Firebase Console.
 *   5. Puedes borrar este archivo después.
 * ══════════════════════════════════════════════
 */

import { db } from "./firabase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Esquema completo del documento en Firestore:
 *
 * solicitudes/{docId}
 * ├── codigoEstudiantil        : string
 * ├── fechaNacimiento          : string  "YYYY-MM-DD"
 * ├── tipoIdentificacion       : string  "Cédula de Ciudadanía" | "Tarjeta de Identidad" | "Otro"
 * ├── tipoIdentificacionOtro   : string  (solo si tipoIdentificacion === "Otro")
 * ├── numeroIdentificacion     : string
 * ├── nombres                  : string
 * ├── apellidos                : string
 * ├── celular                  : string
 * ├── email                    : string
 * ├── facultad                 : string
 * ├── programa                 : string
 * ├── semestre                 : number | "noaplica"
 * ├── rol                      : string  "Nuevo Integrante" | "Miembro Activo" | "Egresado" | "Otro"
 * ├── rolOtro                  : string  (solo si rol === "Otro")
 * ├── areaInteres              : string  ver opciones en firabaseUtils.ts
 * ├── areaInteresOtro          : string  (solo si areaInteres === "Otro")
 * ├── motivacion               : string
 * ├── estado                   : string  "pendiente" | "aceptada" | "rechazada"
 * ├── fechaCreacion            : Timestamp
 * ├── fechaRevision            : Timestamp | null
 * ├── comentariosAdmin         : string
 * ├── userAgent                : string
 * └── ipAddress                : string
 */

export const initFirestoreCollection = async (): Promise<void> => {
  try {
    console.log("🔄 Inicializando colección 'solicitudes' en Firestore...");

    const docRef = await addDoc(collection(db, "solicitudes"), {
      // Identificación
      codigoEstudiantil: "INIT-SAMPLE",
      fechaNacimiento: "2000-01-01",
      tipoIdentificacion: "Cédula de Ciudadanía",
      tipoIdentificacionOtro: "",
      numeroIdentificacion: "0000000000",
      // Datos personales
      nombres: "Documento",
      apellidos: "Inicialización",
      celular: "3000000000",
      email: "init@geotig.edu.co",
      // Datos académicos
      facultad: "Ciencias Naturales, Exactas y de la Educación",
      programa: "Programa de Inicialización",
      semestre: "noaplica",
      // Vinculación
      rol: "Nuevo Integrante",
      rolOtro: "",
      areaInteres: "Sistemas de Información Geográfica (SIG)",
      areaInteresOtro: "",
      motivacion: "Documento de inicialización automática. Puede eliminarse.",
      // Metadatos
      estado: "rechazada",
      fechaCreacion: serverTimestamp(),
      fechaRevision: null,
      comentariosAdmin: "⚠️ Documento de inicialización — eliminar desde Firebase Console",
      userAgent: "init-script",
      ipAddress: "",
    });

    console.log("✅ Colección inicializada. ID del documento de muestra:", docRef.id);
    console.log("ℹ️  Elimina el documento de muestra desde Firebase Console.");
  } catch (error) {
    console.error("❌ Error al inicializar la colección:", error);
    throw error;
  }
};

/**
 * Reglas de seguridad recomendadas para Firestore.
 * Pega esto en Firebase Console → Firestore → Reglas
 *
 * ────────────────────────────────────────────
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /solicitudes/{solicitudId} {
 *       allow create: if
 *         request.resource.data.keys().hasAll([
 *           'nombres', 'apellidos', 'email', 'celular',
 *           'codigoEstudiantil', 'fechaNacimiento',
 *           'tipoIdentificacion', 'numeroIdentificacion',
 *           'facultad', 'programa', 'semestre',
 *           'rol', 'areaInteres', 'motivacion',
 *           'estado', 'fechaCreacion'
 *         ]) &&
 *         request.resource.data.estado == 'pendiente' &&
 *         request.resource.data.email is string &&
 *         request.resource.data.email.size() > 5 &&
 *         request.resource.data.motivacion.size() >= 20;
 *
 *       allow read, update, delete: if request.auth != null;
 *     }
 *   }
 * }
 * ────────────────────────────────────────────
 */
