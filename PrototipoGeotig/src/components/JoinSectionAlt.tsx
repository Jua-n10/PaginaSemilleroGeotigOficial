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

interface FormData {
  nombre: string;
  email: string;
  programa: string;
  motivacion: string;
  honeypot: string; // Campo oculto para detectar bots
}

// Función para sanitizar entradas y prevenir inyección de código
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Eliminar scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Eliminar iframes
    .replace(/javascript:/gi, "") // Eliminar javascript: URLs
    .replace(/on\w+\s*=/gi, "") // Eliminar event handlers (onclick, onload, etc.)
    .trim();
};

export function JoinSectionAlt() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const submitCount = useRef(0);
  const submitTimeWindow = useRef<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Verificar honeypot - Si está lleno, es un bot
      if (data.honeypot) {
        console.warn("Intento de bot detectado");
        return;
      }

      // 2. Rate limiting - Prevenir envíos demasiado rápidos
      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTime;

      // No permitir más de un envío cada 10 segundos
      if (timeSinceLastSubmit < 10000) {
        toast.error(
          "Por favor espera unos segundos antes de enviar otra solicitud.",
        );
        return;
      }

      // 3. Prevenir spam - No más de 3 envíos en 5 minutos
      submitTimeWindow.current.push(now);
      submitTimeWindow.current = submitTimeWindow.current.filter(
        (time) => now - time < 300000, // 5 minutos
      );

      if (submitTimeWindow.current.length > 3) {
        toast.error(
          "Has alcanzado el límite de envíos. Por favor intenta más tarde.",
        );
        return;
      }

      // 4. Sanitizar todos los campos de entrada
      const sanitizedData = {
        nombre: sanitizeInput(data.nombre),
        email: sanitizeInput(data.email),
        programa: sanitizeInput(data.programa),
        motivacion: sanitizeInput(data.motivacion),
      };

      // 5. Validación adicional de longitud después de sanitización
      if (
        sanitizedData.nombre.length < 3 ||
        sanitizedData.nombre.length > 100
      ) {
        toast.error("El nombre debe tener entre 3 y 100 caracteres.");
        return;
      }

      if (
        sanitizedData.motivacion.length < 20 ||
        sanitizedData.motivacion.length > 500
      ) {
        toast.error("La motivación debe tener entre 20 y 500 caracteres.");
        return;
      }

      // 6. Verificar que los datos sanitizados no estén vacíos
      if (
        !sanitizedData.nombre ||
        !sanitizedData.email ||
        !sanitizedData.programa ||
        !sanitizedData.motivacion
      ) {
        toast.error("Por favor completa todos los campos correctamente.");
        return;
      }

      // 7. Guardar en Firebase Firestore
      try {
        const docRef = await addDoc(collection(db, "solicitudes"), {
          nombre: sanitizedData.nombre,
          email: sanitizedData.email,
          programa: sanitizedData.programa,
          motivacion: sanitizedData.motivacion,
          estado: "pendiente", // Estados: pendiente, revisada, aceptada, rechazada
          fechaCreacion: serverTimestamp(),
          fechaRevision: null,
          comentariosAdmin: "",
        });

        console.log("Solicitud guardada en Firebase con ID:", docRef.id);
      } catch (firebaseError) {
        console.error("Error al guardar en Firebase:", firebaseError);
        toast.error(
          "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
        );
        return;
      }

      // Actualizar tiempo del último envío
      setLastSubmitTime(now);
      submitCount.current += 1;

      toast.success(
        "¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.",
      );
      setIsSubmitted(true);
      reset();

      // Resetear el estado después de 5 segundos
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error(
        "Hubo un error al enviar la solicitud. Por favor intenta nuevamente.",
      );
    }
  };

  const benefits = [
    "Acceso a software especializado (ArcGIS, ENVI, etc.)",
    "Bases de datos geoespaciales y satelitales",
    "Tutorías personalizadas con expertos",
    "Certificación de participación",
    "Oportunidad de publicar artículos",
    "Networking con investigadores y profesionales",
  ];

  return (
    <section id="unete" className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Más grande y prominente */}
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
          {/* Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 lg:p-10 border-2 border-emerald-100">
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

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-blue-950 to-emerald-900 rounded-3xl p-8 lg:p-10 text-white">
            <h3 className="text-white mb-2">Solicita tu vinculación</h3>
            <p className="text-gray-300 mb-6">
              Completa el formulario y nos pondremos en contacto contigo
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-100 text-sm">
                    ¡Solicitud enviada exitosamente! Revisaremos tu información
                    y nos pondremos en contacto pronto.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Juan Pérez García"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                    errors.nombre ? "border-red-400 focus:border-red-400" : ""
                  }`}
                  {...register("nombre", {
                    required: "El nombre completo es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "El nombre no puede exceder 100 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message:
                        "El nombre solo puede contener letras y espacios",
                    },
                  })}
                />
                {errors.nombre && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      {errors.nombre.message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@unicauca.edu.co"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                    errors.email ? "border-red-400 focus:border-red-400" : ""
                  }`}
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Por favor ingresa un correo electrónico válido",
                    },
                  })}
                />
                {errors.email && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      {errors.email.message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-2">
                  Programa académico <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Ingeniería Civil, Geografía, Biología"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                    errors.programa ? "border-red-400 focus:border-red-400" : ""
                  }`}
                  {...register("programa", {
                    required: "El programa académico es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El programa debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "El programa no puede exceder 100 caracteres",
                    },
                  })}
                />
                {errors.programa && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      {errors.programa.message}
                    </p>
                  </div>
                )}
              </div>

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
                      message:
                        "Por favor escribe al menos 20 caracteres describiendo tu motivación",
                    },
                    maxLength: {
                      value: 500,
                      message: "La motivación no puede exceder 500 caracteres",
                    },
                  })}
                />
                {errors.motivacion && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">
                      {errors.motivacion.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Campo oculto para detectar bots */}
              <div className="hidden">
                <Input
                  type="text"
                  placeholder="Deja este campo vacío"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  {...register("honeypot")}
                />
              </div>

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
