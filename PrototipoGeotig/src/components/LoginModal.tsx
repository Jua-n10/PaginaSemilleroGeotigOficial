import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { LogIn, User, Lock, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import angeloRobot from "figma:asset/0a47a596dc809b83cc73cb9ecf830467255dfd5b.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firabase"; // ajusta la ruta si tu LoginModal está en otra carpeta

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: "admin" | "monitor" | "user") => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.username || !formData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (formData.username.length < 3) {
      toast.error("El usuario debe tener al menos 3 caracteres");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    // Simulación de autenticación (en producción conectar con backend)

    /*
    setTimeout(() => {
      // Validación demo
      // Admin (Profesora): admin / geotig2024
      // Monitor: monitor / monitor2024
      if (formData.username === "admin" && formData.password === "geotig2024") {
        toast.success(
          "¡Bienvenida Profesora! Accediendo al panel de administración...",
        );
        localStorage.setItem("geotig_user", formData.username);
        localStorage.setItem("geotig_role", "admin");
        localStorage.setItem("geotig_login_time", new Date().toISOString());

        // Limpiar formulario y cerrar
        setFormData({ username: "", password: "" });
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      } else if (
        formData.username === "monitor" &&
        formData.password === "monitor2024"
      ) {
        toast.success("¡Bienvenido Monitor! Accediendo al panel de gestión...");
        localStorage.setItem("geotig_user", formData.username);
        localStorage.setItem("geotig_role", "monitor");
        localStorage.setItem("geotig_login_time", new Date().toISOString());

        // Limpiar formulario y cerrar
        setFormData({ username: "", password: "" });
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      } else {
        toast.error("Usuario o contraseña incorrectos");
      }
      setIsLoading(false);
    }, 1000);
    */

    // Autenticación con Firebase

    try {
      const userInput = formData.username.trim().toLowerCase();

      // ✅ Mapeo para manteneT USUARIO como "admin / monitor"
      const email =
        userInput === "admin"
          ? "admin@geotig.com"
          : userInput === "monitor"
            ? "monitor@geotig.com"
            : userInput; // si ya escriben un email, lo usa tal cual

      if (!email.includes("@")) {
        toast.error("Escribe 'admin', 'monitor' o un correo válido");
        return;
      }

      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        formData.password,
      );

      // ✅ Login OK
      const role =
        email === "admin@geotig.com"
          ? "admin"
          : email === "monitor@geotig.com"
            ? "monitor"
            : "user";

      localStorage.setItem("geotig_uid", cred.user.uid);
      localStorage.setItem("geotig_email", cred.user.email ?? "");
      localStorage.setItem("geotig_role", role);
      localStorage.setItem("geotig_login_time", new Date().toISOString());

      setFormData({ username: "", password: "" });
      onClose();
      onLoginSuccess?.(role);
    } catch (err: any) {
      const code = err?.code as string | undefined;

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password"
      ) {
        toast.error("Usuario o contraseña incorrectos");
      } else if (code === "auth/user-not-found") {
        toast.error("No existe un usuario con ese correo");
      } else if (code === "auth/too-many-requests") {
        toast.error("Demasiados intentos. Intenta más tarde.");
      } else {
        toast.error("Error iniciando sesión");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay con blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <Card className="border-2 border-gray-200 shadow-2xl">
          <CardContent className="p-8">
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <img
                  src={angeloRobot}
                  alt="Angelo - Robot GEOTIG"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <h2 className="text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Panel administrativo de GEOTIG</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-900 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-blue-800 hover:to-teal-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Info adicional */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Profesora:</span>{" "}
                <span className="font-mono text-blue-600">admin</span> /{" "}
                <span className="font-mono text-blue-600">geotig2024</span>
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Monitor:</span>{" "}
                <span className="font-mono text-teal-600">monitor</span> /{" "}
                <span className="font-mono text-teal-600">monitor2024</span>
              </p>
            </div>

            <div className="mt-4 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                ¿Olvidaste tu contraseña?{" "}
                <button
                  onClick={onClose}
                  className="text-teal-600 hover:underline"
                >
                  Contacta al administrador
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
