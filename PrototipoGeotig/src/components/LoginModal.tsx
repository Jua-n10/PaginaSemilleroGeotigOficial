import { useState, useEffect } from "react";
import { LogIn, User, Lock, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import angeloRobot from "figma:asset/0a47a596dc809b83cc73cb9ecf830467255dfd5b.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firabase";

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
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<"username" | "password" | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    try {
      const userInput = formData.username.trim().toLowerCase();
      const email =
        userInput === "admin"
          ? "admin@geotig.com"
          : userInput === "monitor"
            ? "monitor@geotig.com"
            : userInput;

      if (!email.includes("@")) {
        toast.error("Escribe 'admin', 'monitor' o un correo válido");
        return;
      }

      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        formData.password,
      );
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
      if (code === "auth/invalid-credential" || code === "auth/wrong-password")
        toast.error("Usuario o contraseña incorrectos");
      else if (code === "auth/user-not-found")
        toast.error("No existe un usuario con ese correo");
      else if (code === "auth/too-many-requests")
        toast.error("Demasiados intentos. Intenta más tarde.");
      else {
        toast.error("Error iniciando sesión");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

        .lm-card {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(155deg, #0a1628 0%, #0f2744 50%, #0a2218 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
        }
        .lm-title { font-family: 'Syne', sans-serif; }

        .lm-grid {
          background-image:
            linear-gradient(rgba(32,178,140,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(32,178,140,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .lm-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          border-radius: 12px;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .lm-input::placeholder { color: rgba(255,255,255,0.2); }
        .lm-input:focus { outline: none; }
        .lm-input.lm-focused {
          background: rgba(255,255,255,0.07);
          border-color: rgba(32,178,140,0.55);
          box-shadow: 0 0 0 3px rgba(32,178,140,0.09);
        }

        .lm-btn {
          background: linear-gradient(135deg, #0d9488, #1d4ed8);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          transition: transform 0.25s, box-shadow 0.25s, filter 0.25s;
          position: relative;
          overflow: hidden;
        }
        .lm-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .lm-btn:hover:not(:disabled)::after { opacity: 1; }
        .lm-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(13,148,136,0.38);
        }
        .lm-btn:active:not(:disabled) { transform: translateY(0); }
        .lm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .lm-btn-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .lm-close {
          color: rgba(255,255,255,0.3);
          border-radius: 8px;
          padding: 5px;
          transition: color 0.2s, background 0.2s;
        }
        .lm-close:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.08); }

        .lm-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(32,178,140,0.1);
          border: 1px solid rgba(32,178,140,0.22);
          color: rgba(32,178,140,0.85);
          font-family: 'Syne', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 99px;
        }

        .lm-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(32,178,140,0.65);
          display: block; margin-bottom: 8px;
        }

        .lm-icon { color: rgba(255,255,255,0.22); transition: color 0.2s; }
        .lm-icon.lm-icon-active { color: rgba(32,178,140,0.65); }

        .lm-divider { border-color: rgba(255,255,255,0.07); margin: 20px 0; }
        .lm-footer { color: rgba(255,255,255,0.28); font-size: 12px; text-align: center; }
        .lm-footer a, .lm-footer button {
          color: rgba(32,178,140,0.7);
          text-decoration: underline; text-underline-offset: 3px;
          transition: color 0.2s; background: none; border: none; padding: 0; cursor: pointer;
          font-size: 12px;
        }
        .lm-footer a:hover, .lm-footer button:hover { color: rgba(32,178,140,1); }

        .lm-overlay { animation: lmFadeIn 0.2s ease; }
        .lm-modal { animation: lmPopIn 0.28s cubic-bezier(0.34,1.56,0.64,1); }

        @keyframes lmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lmPopIn {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
      `}</style>

      <div
        className="lm-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* Click fuera */}
        <div style={{ position: "absolute", inset: 0 }} onClick={onClose} />

        {/* Card */}
        <div
          className="lm-modal lm-card"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "380px",
            boxShadow:
              "0 0 0 1px rgba(32,178,140,0.12), 0 32px 64px rgba(0,0,0,0.65), 0 0 80px rgba(32,178,140,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Grid BG */}
          <div
            className="lm-grid"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />

          {/* Orbes */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 220,
              height: 220,
              borderRadius: "50%",
              pointerEvents: "none",
              background:
                "radial-gradient(circle, rgba(32,178,140,0.14) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 180,
              height: 180,
              borderRadius: "50%",
              pointerEvents: "none",
              background:
                "radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 65%)",
            }}
          />

          <div style={{ position: "relative", padding: "36px 32px 28px" }}>
            {/* Cerrar */}
            <button
              className="lm-close"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ position: "absolute", top: 14, right: 14 }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>

            {/* ── Header ── */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span className="lm-badge" style={{ marginBottom: 18 }}>
                <span>✦</span> GEOTIG <span>✦</span>
              </span>

              {/* Angelo */}
              <div
                style={{
                  position: "relative",
                  width: 108,
                  height: 108,
                  margin: "0 auto 18px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(32,178,140,0.22) 0%, transparent 70%)",
                    filter: "blur(10px)",
                  }}
                />
                <img
                  src={angeloRobot}
                  alt="Angelo"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
                  }}
                />
              </div>

              <h2
                className="lm-title"
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                Panel Administrativo
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
                Semillero de Investigación Geoespacial
              </p>
            </div>

            {/* ── Formulario ── */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Usuario */}
              <div>
                <label htmlFor="username" className="lm-label">
                  Usuario
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 13,
                      pointerEvents: "none",
                    }}
                  >
                    <User
                      className={`lm-icon ${focused === "username" ? "lm-icon-active" : ""}`}
                      style={{ width: 15, height: 15 }}
                    />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    className={`lm-input ${focused === "username" ? "lm-focused" : ""}`}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      fontSize: 14,
                    }}
                    placeholder="admin / monitor"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="lm-label">
                  Contraseña
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 13,
                      pointerEvents: "none",
                    }}
                  >
                    <Lock
                      className={`lm-icon ${focused === "password" ? "lm-icon-active" : ""}`}
                      style={{ width: 15, height: 15 }}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className={`lm-input ${focused === "password" ? "lm-focused" : ""}`}
                    style={{
                      width: "100%",
                      padding: "11px 42px 11px 38px",
                      fontSize: 14,
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="lm-icon"
                    style={{
                      position: "absolute",
                      right: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: 15, height: 15 }} />
                    ) : (
                      <Eye style={{ width: 15, height: 15 }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="lm-btn"
                style={{
                  width: "100%",
                  padding: "12px",
                  color: "#fff",
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                <div className="lm-btn-inner">
                  {isLoading ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn style={{ width: 15, height: 15 }} />
                      Iniciar Sesión
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Footer */}
            <hr className="lm-divider" />
            <p className="lm-footer">
              ¿Olvidaste tu contraseña?{" "}
              <button onClick={onClose}>Contacta al administrador</button>
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
