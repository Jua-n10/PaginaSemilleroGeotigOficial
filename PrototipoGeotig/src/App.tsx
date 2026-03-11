import { NavbarAlt } from "./components/NavbarAlt";
import { HeroSectionAlt } from "./components/HeroSectionAlt";
import { AboutSectionAlt } from "./components/AboutSectionAlt";
import { ResearchAreasAlt } from "./components/ResearchAreasAlt";
import { ProjectsSectionAlt } from "./components/ProjectsSectionAlt";
import { TeamSectionAlt } from "./components/TeamSectionAlt";
import { JoinSectionAlt } from "./components/JoinSectionAlt";
import { FooterAlt } from "./components/FooterAlt";
import { AngeloAvatarSection } from "./components/AngeloAvatarSection";
import { LoginModal } from "./components/LoginModal";
import { AdminPanel } from "./components/AdminPanel";
import { MonitorPanel } from "./components/MonitorPanel";
import { Carrera5KAnuncio } from "./components/Carrera5KAnuncio"; // ← nuevo
import { Toaster } from "sonner@2.0.3";
import { useState, useEffect } from "react";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isMonitorPanelOpen, setIsMonitorPanelOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("geotig_user");
    if (user) {
      // Usuario ya logueado — no se abre panel automáticamente
    }
  }, []);

  const handleLoginSuccess = () => {
    const role = localStorage.getItem("geotig_role");
    if (role === "admin") {
      setIsAdminPanelOpen(true);
      setIsMonitorPanelOpen(false);
    } else if (role === "monitor") {
      setIsMonitorPanelOpen(true);
      setIsAdminPanelOpen(false);
    }
  };

  // Panel admin — pantalla completa
  if (isAdminPanelOpen) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      </>
    );
  }

  // Panel monitor — pantalla completa
  if (isMonitorPanelOpen) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <MonitorPanel onClose={() => setIsMonitorPanelOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />

      {/* ── Anuncio Carrera 5K: aparece 800ms después de cargar, una vez por sesión ── */}
      <Carrera5KAnuncio delay={800} oncePerSession={true} />

      <NavbarAlt onLoginClick={() => setIsLoginOpen(true)} />
      <HeroSectionAlt />
      <AboutSectionAlt />
      <AngeloAvatarSection />
      <ResearchAreasAlt />
      <ProjectsSectionAlt />
      <TeamSectionAlt />
      <JoinSectionAlt />
      <FooterAlt />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
