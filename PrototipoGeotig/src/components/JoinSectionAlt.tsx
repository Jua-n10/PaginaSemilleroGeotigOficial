import { Button } from "./ui/button";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form@7.55.0";
import { useState, useRef } from "react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { db } from "../firabase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

const TIPOS_IDENTIFICACION = [
  "Cédula de Ciudadanía",
  "Tarjeta de Identidad",
  "Otro",
] as const;

const ROLES = [
  "Nuevo Integrante",
  "Miembro Activo",
  "Egresado",
  "Otro",
] as const;

const AREAS_INTERES = [
  "Sistemas de Información Geográfica (SIG)",
  "Ordenamiento Territorial y Manejo de Cuencas Hidrográficas",
  "Geografía Urbana",
  "Gestión del Riesgo y Medio Ambiente",
  "Investigación y Publicaciones",
  "Otro",
] as const;

const FACULTADES = [
  "Ciencias Naturales, Exactas y de la Educación",
  "Ciencias Agropecuarias",
  "Ciencias Contables, Económicas y Administrativas",
  "Ciencias Humanas y Sociales",
  "Derecho, Ciencias Políticas y Sociales",
  "Ingeniería Civil",
  "Ingeniería Electrónica y Telecomunicaciones",
  "Ingeniería Mecánica",
  "Otra",
];

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

interface FormData {
  honeypot: string;
  // Identificación
  codigoEstudiantil: string;
  fechaNacimiento: string;
  tipoIdentificacion: (typeof TIPOS_IDENTIFICACION)[number];
  tipoIdentificacionOtro: string;
  numeroIdentificacion: string;
  // Personales
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  // Académico
  facultad: string;
  programa: string;
  semestre: number;
  noAplicaSemestre: boolean;
  // Vinculación
  rol: (typeof ROLES)[number];
  rolOtro: string;
  areaInteres: (typeof AREAS_INTERES)[number];
  areaInteresOtro: string;
  motivacion: string;
}

// ─────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────

const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

// ─────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 mt-2">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-red-300 text-sm">{message}</p>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
        {title}
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export function JoinSectionAlt() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const submitTimeWindow = useRef<number[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const watchTipoId = watch("tipoIdentificacion");
  const watchRol = watch("rol");
  const watchArea = watch("areaInteres");
  const watchSemestre = watch("semestre");
  const watchNoAplicaSemestre = watch("noAplicaSemestre");

  // ── ESTILOS REUTILIZABLES ──────────────────
  const inputCls = (hasError: boolean) =>
    `bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
      hasError ? "border-red-400 focus:border-red-400" : ""
    }`;

  const radioItemCls =
    "flex items-center gap-3 px-4 py-3 rounded-xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/5 cursor-pointer transition-all";

  // ── SUBMIT ─────────────────────────────────
  const onSubmit = async (data: FormData) => {
    try {
      if (data.honeypot) {
        console.warn("Bot detectado - honeypot lleno");
        return;
      }

      const now = Date.now();
      if (now - lastSubmitTime < 10000) {
        toast.error(
          "Por favor espera unos segundos antes de enviar otra solicitud.",
        );
        return;
      }

      submitTimeWindow.current.push(now);
      submitTimeWindow.current = submitTimeWindow.current.filter(
        (t) => now - t < 300000,
      );
      if (submitTimeWindow.current.length > 3) {
        toast.error(
          "Has alcanzado el límite de envíos. Por favor intenta más tarde.",
        );
        return;
      }

      // Sanitizar
      const s = {
        codigoEstudiantil: sanitizeInput(data.codigoEstudiantil),
        fechaNacimiento: data.fechaNacimiento,
        tipoIdentificacion: data.tipoIdentificacion,
        tipoIdentificacionOtro: sanitizeInput(
          data.tipoIdentificacionOtro || "",
        ),
        numeroIdentificacion: sanitizeInput(data.numeroIdentificacion),
        nombres: sanitizeInput(data.nombres),
        apellidos: sanitizeInput(data.apellidos),
        celular: sanitizeInput(data.celular).replace(/\s/g, ""),
        email: sanitizeInput(data.email).toLowerCase(),
        facultad: sanitizeInput(data.facultad),
        programa: sanitizeInput(data.programa),
        semestre: Number(data.semestre),
        rol: data.rol,
        rolOtro: sanitizeInput(data.rolOtro || ""),
        areaInteres: data.areaInteres,
        areaInteresOtro: sanitizeInput(data.areaInteresOtro || ""),
        motivacion: sanitizeInput(data.motivacion),
      };

      try {
        const docRef = await addDoc(collection(db, "solicitudes"), {
          // Identificación
          codigoEstudiantil: s.codigoEstudiantil,
          fechaNacimiento: s.fechaNacimiento,
          tipoIdentificacion: s.tipoIdentificacion,
          tipoIdentificacionOtro:
            s.tipoIdentificacion === "Otro" ? s.tipoIdentificacionOtro : "",
          numeroIdentificacion: s.numeroIdentificacion,
          // Personales
          nombres: s.nombres,
          apellidos: s.apellidos,
          celular: s.celular,
          email: s.email,
          // Académico
          facultad: s.facultad,
          programa: s.programa,
          semestre: s.semestre,
          // Vinculación
          rol: s.rol,
          rolOtro: s.rol === "Otro" ? s.rolOtro : "",
          areaInteres: s.areaInteres,
          areaInteresOtro: s.areaInteres === "Otro" ? s.areaInteresOtro : "",
          motivacion: s.motivacion,
          // Metadatos
          estado: "pendiente",
          fechaCreacion: serverTimestamp(),
          fechaRevision: null,
          comentariosAdmin: "",
          userAgent: navigator.userAgent,
          ipAddress: "",
        });

        console.log("✅ Solicitud guardada con ID:", docRef.id);
      } catch (firebaseError) {
        console.error("❌ Error Firebase:", firebaseError);
        toast.error(
          "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
        );
        return;
      }

      setLastSubmitTime(now);
      setIsSubmitted(true);
      toast.success(
        "¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.",
      );
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error(
        "Hubo un error al enviar la solicitud. Por favor intenta nuevamente.",
      );
    }
  };

  // ── BENEFICIOS ─────────────────────────────
  const benefits = [
    "Acceso a software especializado (ArcGIS, ENVI, etc.)",
    "Bases de datos geoespaciales y satelitales",
    "Tutorías personalizadas con expertos",
    "Certificación de participación",
    "Oportunidad de publicar artículos",
    "Networking con investigadores y profesionales",
  ];

  // ── RENDER ─────────────────────────────────
  return (
    <section id="unete" className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="text-emerald-600 uppercase tracking-widest text-lg font-semibold">
              ¡Es tu momento!
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-blue-900 via-emerald-600 to-blue-900 bg-clip-text text-transparent leading-tight"
          >
            ÚNETE A GEOTIG
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl text-gray-600"
          >
            Forma parte de nuestra comunidad de investigación
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ── COLUMNA IZQUIERDA: Beneficios ── */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 lg:p-10 border-2 border-emerald-100 sticky top-8 self-start">
            <h3 className="text-gray-900 mb-6">Beneficios de unirte</h3>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl border-2 border-emerald-200">
              <p className="text-sm text-gray-600 italic">
                "El semillero GEOTIG me permitió desarrollar mis habilidades en
                SIG y publicar mi primer artículo científico. Una experiencia
                transformadora."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                  AM
                </div>
                <div>
                  <div className="text-sm text-gray-900">Ana María G.</div>
                  <div className="text-xs text-gray-500">
                    Estudiante Ingeniería Civil
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Formulario ── */}
          <div className="bg-gradient-to-br from-blue-950 to-emerald-900 rounded-3xl p-8 lg:p-10 text-white">
            <h3 className="text-white mb-2">Solicita tu vinculación</h3>
            <p className="text-gray-300 mb-6">
              Completa el formulario y nos pondremos en contacto contigo
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-100 text-sm">
                  ¡Solicitud enviada exitosamente! Revisaremos tu información y
                  nos pondremos en contacto pronto.
                </p>
              </div>
            )}

            {/* Honeypot */}
            <div className="hidden">
              <Input
                type="text"
                {...register("honeypot")}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* ══ IDENTIFICACIÓN ══ */}
              <SectionDivider title="Identificación" />

              {/* Código Estudiantil */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Código Estudiantil <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Ej: 2023100123"
                  className={inputCls(!!errors.codigoEstudiantil)}
                  {...register("codigoEstudiantil", {
                    required: "El código estudiantil es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                />
                <FieldError message={errors.codigoEstudiantil?.message} />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Fecha de Nacimiento <span className="text-red-400">*</span>
                </label>
                <Input
                  type="date"
                  className={inputCls(!!errors.fechaNacimiento)}
                  {...register("fechaNacimiento", {
                    required: "La fecha de nacimiento es obligatoria",
                  })}
                />
                <FieldError message={errors.fechaNacimiento?.message} />
              </div>

              {/* Tipo de Identificación */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Tipo de Identificación <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  {TIPOS_IDENTIFICACION.map((tipo) => (
                    <label key={tipo} className={radioItemCls}>
                      <input
                        type="radio"
                        value={tipo}
                        className="w-4 h-4 accent-emerald-400"
                        {...register("tipoIdentificacion", {
                          required: "Selecciona un tipo de identificación",
                        })}
                      />
                      <span className="text-sm text-gray-200">{tipo}</span>
                    </label>
                  ))}
                </div>
                <FieldError message={errors.tipoIdentificacion?.message} />
                {watchTipoId === "Otro" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Especifica el tipo de identificación"
                      className={inputCls(!!errors.tipoIdentificacionOtro)}
                      {...register("tipoIdentificacionOtro", {
                        required: "Por favor especifica el tipo",
                      })}
                    />
                    <FieldError
                      message={errors.tipoIdentificacionOtro?.message}
                    />
                  </div>
                )}
              </div>

              {/* Número de Identificación */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Número de Identificación{" "}
                  <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Ej: 1234567890"
                  className={inputCls(!!errors.numeroIdentificacion)}
                  {...register("numeroIdentificacion", {
                    required: "El número de identificación es obligatorio",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    maxLength: { value: 20, message: "Máximo 20 caracteres" },
                  })}
                />
                <FieldError message={errors.numeroIdentificacion?.message} />
              </div>

              {/* ══ DATOS PERSONALES ══ */}
              <SectionDivider title="Datos Personales" />

              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-200 mb-2">
                    Nombres <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Juan Andrés"
                    className={inputCls(!!errors.nombres)}
                    {...register("nombres", {
                      required: "Los nombres son obligatorios",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo letras",
                      },
                    })}
                  />
                  <FieldError message={errors.nombres?.message} />
                </div>
                <div>
                  <label className="block text-sm text-gray-200 mb-2">
                    Apellidos <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="Pérez García"
                    className={inputCls(!!errors.apellidos)}
                    {...register("apellidos", {
                      required: "Los apellidos son obligatorios",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        message: "Solo letras",
                      },
                    })}
                  />
                  <FieldError message={errors.apellidos?.message} />
                </div>
              </div>

              {/* Celular */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Celular <span className="text-red-400">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="3001234567"
                  className={inputCls(!!errors.celular)}
                  {...register("celular", {
                    required: "El celular es obligatorio",
                    pattern: {
                      value: /^3\d{9}$/,
                      message: "Número colombiano de 10 dígitos (inicia con 3)",
                    },
                  })}
                />
                <FieldError message={errors.celular?.message} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@unicauca.edu.co"
                  className={inputCls(!!errors.email)}
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Por favor ingresa un correo válido",
                    },
                  })}
                />
                <FieldError message={errors.email?.message} />
              </div>

              {/* ══ DATOS ACADÉMICOS ══ */}
              <SectionDivider title="Datos Académicos" />

              {/* Facultad */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Facultad <span className="text-red-400">*</span>
                </label>
                <select
                  className={`w-full rounded-md px-3 py-2 text-sm bg-white/10 border text-white
                    ${errors.facultad ? "border-red-400" : "border-white/20"}
                    focus:outline-none focus:border-emerald-400`}
                  {...register("facultad", {
                    required: "La facultad es obligatoria",
                  })}
                >
                  <option value="" style={{ background: "#1e3a5f" }}>
                    Selecciona tu facultad
                  </option>
                  {FACULTADES.map((f) => (
                    <option key={f} value={f} style={{ background: "#1e3a5f" }}>
                      {f}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.facultad?.message} />
              </div>

              {/* Programa */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Programa académico <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="Ej: Ingeniería Civil, Geografía, Biología"
                  className={inputCls(!!errors.programa)}
                  {...register("programa", {
                    required: "El programa académico es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                    maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  })}
                />
                <FieldError message={errors.programa?.message} />
              </div>

              {/* Semestre */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Semestre <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="1 - 10"
                    min={1}
                    max={10}
                    disabled={!!watchNoAplicaSemestre}
                    className={`w-32 ${inputCls(!!errors.semestre)} disabled:opacity-40`}
                    {...register("semestre", {
                      validate: (val) =>
                        !!watchNoAplicaSemestre ||
                        (Number(val) >= 1 && Number(val) <= 10) ||
                        "Ingresa un semestre entre 1 y 10",
                    })}
                  />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-emerald-400"
                      {...register("noAplicaSemestre")}
                    />
                    <span className="text-sm text-gray-300">No aplica</span>
                  </label>
                </div>
                <FieldError message={errors.semestre?.message} />
              </div>

              {/* ══ VINCULACIÓN ══ */}
              <SectionDivider title="Vinculación al Semillero" />

              {/* Rol */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Rol <span className="text-red-400">*</span>
                </label>
                <select
                  className={`w-full rounded-md px-3 py-2 text-sm bg-white/10 border text-white
                    ${errors.rol ? "border-red-400" : "border-white/20"}
                    focus:outline-none focus:border-emerald-400`}
                  {...register("rol", { required: "Selecciona un rol" })}
                >
                  <option value="" style={{ background: "#1e3a5f" }}>
                    Selecciona tu rol
                  </option>
                  {ROLES.map((rol) => (
                    <option
                      key={rol}
                      value={rol}
                      style={{ background: "#1e3a5f" }}
                    >
                      {rol}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.rol?.message} />
                {watchRol === "Otro" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Especifica tu rol"
                      className={inputCls(!!errors.rolOtro)}
                      {...register("rolOtro", {
                        required: "Por favor especifica el rol",
                      })}
                    />
                    <FieldError message={errors.rolOtro?.message} />
                  </div>
                )}
              </div>

              {/* Área de Interés */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Área de Interés <span className="text-red-400">*</span>
                </label>
                <select
                  className={`w-full rounded-md px-3 py-2 text-sm bg-white/10 border text-white
                    ${errors.areaInteres ? "border-red-400" : "border-white/20"}
                    focus:outline-none focus:border-emerald-400`}
                  {...register("areaInteres", {
                    required: "Selecciona un área de interés",
                  })}
                >
                  <option value="" style={{ background: "#1e3a5f" }}>
                    Selecciona tu área de interés
                  </option>
                  {AREAS_INTERES.map((area) => (
                    <option
                      key={area}
                      value={area}
                      style={{ background: "#1e3a5f" }}
                    >
                      {area}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.areaInteres?.message} />
                {watchArea === "Otro" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Especifica tu área de interés"
                      className={inputCls(!!errors.areaInteresOtro)}
                      {...register("areaInteresOtro", {
                        required: "Por favor especifica el área",
                      })}
                    />
                    <FieldError message={errors.areaInteresOtro?.message} />
                  </div>
                )}
              </div>

              {/* Motivación */}
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  ¿Por qué quieres unirte?{" "}
                  <span className="text-red-400">*</span>
                </label>
                <Textarea
                  placeholder="Cuéntanos sobre tus intereses en GIS, investigación territorial, proyectos que te gustaría desarrollar..."
                  rows={4}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                    errors.motivacion
                      ? "border-red-400 focus:border-red-400"
                      : ""
                  }`}
                  {...register("motivacion", {
                    required: "Por favor cuéntanos tu motivación para unirte",
                    minLength: {
                      value: 20,
                      message: "Por favor escribe al menos 20 caracteres",
                    },
                    maxLength: {
                      value: 1000,
                      message: "La motivación no puede exceder 1000 caracteres",
                    },
                  })}
                />
                <FieldError message={errors.motivacion?.message} />
              </div>

              {/* Botón enviar */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Enviar solicitud
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <p className="text-sm text-gray-300 mb-2">
                También puedes contactarnos por:
              </p>
              <a
                href="mailto:geotig@unicauca.edu.co"
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                geotig@unicauca.edu.co
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
