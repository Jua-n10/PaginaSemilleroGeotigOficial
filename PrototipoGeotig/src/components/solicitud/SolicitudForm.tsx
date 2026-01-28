import { useState, useRef } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { db } from "../../firabase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner@2.0.3";
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react";

interface FormData {
  nombre: string;
  email: string;
  programa: string;
  motivacion: string;
  honeypot: string;
}

/**
 * Sanitiza la entrada del usuario para prevenir inyecciones XSS
 */
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

/**
 * Valida el formato del email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export interface SolicitudFormProps {
  onSuccess?: (solicitudId: string) => void;
  onError?: (error: string) => void;
  variant?: "full" | "compact";
  showHeader?: boolean;
}

export function SolicitudForm({
  onSuccess,
  onError,
  variant = "full",
  showHeader = true,
}: SolicitudFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const submitTimeWindow = useRef<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Verificar honeypot
      if (data.honeypot) {
        console.warn("Bot detection - honeypot field filled");
        return;
      }

      // 2. Rate limiting - máximo 1 envío cada 10 segundos
      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTime;

      if (timeSinceLastSubmit < 10000) {
        const errorMsg =
          "Por favor espera unos segundos antes de enviar otra solicitud.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 3. Spam prevention - máximo 3 envíos en 5 minutos
      submitTimeWindow.current.push(now);
      submitTimeWindow.current = submitTimeWindow.current.filter(
        (time) => now - time < 300000,
      );

      if (submitTimeWindow.current.length > 3) {
        const errorMsg =
          "Has alcanzado el límite de envíos. Por favor intenta más tarde.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 4. Sanitizar entrada
      const sanitizedData = {
        nombre: sanitizeInput(data.nombre).trim(),
        email: sanitizeInput(data.email).trim().toLowerCase(),
        programa: sanitizeInput(data.programa).trim(),
        motivacion: sanitizeInput(data.motivacion).trim(),
      };

      // 5. Validar campos no estén vacíos
      if (
        !sanitizedData.nombre ||
        !sanitizedData.email ||
        !sanitizedData.programa ||
        !sanitizedData.motivacion
      ) {
        const errorMsg = "Por favor completa todos los campos.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 6. Validar longitudes
      if (
        sanitizedData.nombre.length < 3 ||
        sanitizedData.nombre.length > 100
      ) {
        const errorMsg = "El nombre debe tener entre 3 y 100 caracteres.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      if (!isValidEmail(sanitizedData.email)) {
        const errorMsg = "Por favor ingresa un email válido.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      if (
        sanitizedData.motivacion.length < 20 ||
        sanitizedData.motivacion.length > 1000
      ) {
        const errorMsg = "La motivación debe tener entre 20 y 1000 caracteres.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 7. Guardar en Firebase Firestore
      let docRef;
      try {
        docRef = await addDoc(collection(db, "solicitudes"), {
          nombre: sanitizedData.nombre,
          email: sanitizedData.email,
          programa: sanitizedData.programa,
          motivacion: sanitizedData.motivacion,
          estado: "pendiente",
          fechaCreacion: serverTimestamp(),
          fechaRevision: null,
          comentariosAdmin: "",
          ipAddress: "", // Puede agregarse si es necesario
          userAgent: navigator.userAgent,
        });

        console.log("✅ Solicitud guardada con ID:", docRef.id);
      } catch (firebaseError) {
        console.error("❌ Error Firebase:", firebaseError);
        const errorMsg =
          "Error al guardar tu solicitud. Por favor intenta nuevamente.";
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // 8. Actualizar estado y mostrar éxito
      setLastSubmitTime(now);
      setIsSubmitted(true);

      toast.success(
        "✅ ¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.",
      );
      onSuccess?.(docRef.id);

      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Error inesperado. Por favor intenta nuevamente.";
      toast.error(errorMsg);
      onError?.(errorMsg);
    }
  };

  if (isSubmitted && variant === "full") {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="w-16 h-16 text-green-600 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            ¡Solicitud Enviada!
          </h3>
          <p className="text-green-700 text-center max-w-md">
            Hemos recibido tu solicitud de vinculación. Nos pondremos en
            contacto contigo pronto para continuar con el proceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={
        variant === "compact" ? "" : "border-2 border-teal-200 shadow-lg"
      }
    >
      {showHeader && variant === "full" && (
        <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Solicita tu Vinculación
          </CardTitle>
          <p className="text-teal-100 text-sm mt-2">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </CardHeader>
      )}

      <CardContent className={variant === "full" ? "pt-6" : "p-0"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            {...register("honeypot")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Juan Pérez García"
              {...register("nombre", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "Mínimo 3 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "Máximo 100 caracteres",
                },
              })}
              className={`border-2 ${
                errors.nombre
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              } py-3 text-base`}
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.nombre.message}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="correo@universidaduni.edu.co"
              {...register("email", {
                required: "El email es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              })}
              className={`border-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              } py-3 text-base`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Programa Académico */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Programa académico <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ej: Ingeniería Civil, Geografía, Biología"
              {...register("programa", {
                required: "El programa es requerido",
              })}
              className={`border-2 ${
                errors.programa
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              } py-3 text-base`}
              disabled={isSubmitting}
            />
            {errors.programa && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.programa.message}
              </div>
            )}
          </div>

          {/* Motivación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ¿Por qué quieres unirte? <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Cuéntanos sobre tus intereses en GIS, investigación territorial, proyectos que te gustaría desarrollar..."
              {...register("motivacion", {
                required: "La motivación es requerida",
                minLength: {
                  value: 20,
                  message: "Mínimo 20 caracteres",
                },
                maxLength: {
                  value: 1000,
                  message: "Máximo 1000 caracteres",
                },
              })}
              rows={5}
              className={`border-2 ${
                errors.motivacion
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-teal-500"
              } py-3 text-base`}
              disabled={isSubmitting}
            />
            {errors.motivacion && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.motivacion.message}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5 mr-2" />
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
