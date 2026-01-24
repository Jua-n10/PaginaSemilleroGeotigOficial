import { NavbarAlt } from './components/NavbarAlt';
import { HeroSectionAlt } from './components/HeroSectionAlt';
import { AboutSectionAlt } from './components/AboutSectionAlt';
import { ResearchAreasAlt } from './components/ResearchAreasAlt';
import { ProjectsSectionAlt } from './components/ProjectsSectionAlt';
import { TeamSectionAlt } from './components/TeamSectionAlt';
import { JoinSectionAlt } from './components/JoinSectionAlt';
import { FooterAlt } from './components/FooterAlt';
import { AngeloAvatarSection } from './components/AngeloAvatarSection';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { Toaster } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isMonitorPanelOpen, setIsMonitorPanelOpen] = useState(false);

  // Verificar si el usuario está logueado al cargar
  useEffect(() => {
    const user = localStorage.getItem('geotig_user');
    if (user) {
      // Usuario ya está logueado, pero no mostramos el panel automáticamente
      // Solo lo mostramos si hace login o si ya estaba en el panel
    }
  }, []);

  const handleLoginSuccess = () => {
    const role = localStorage.getItem('geotig_role');
    if (role === 'admin') {
      setIsAdminPanelOpen(true);
      setIsMonitorPanelOpen(false);
    } else if (role === 'monitor') {
      setIsMonitorPanelOpen(true);
      setIsAdminPanelOpen(false);
    }
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };

  const handleCloseMonitorPanel = () => {
    setIsMonitorPanelOpen(false);
  };

  // Si el panel de admin está abierto, solo mostrar el panel de admin
  if (isAdminPanelOpen) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminPanel onClose={handleCloseAdminPanel} />
      </>
    );
  }

  // Si el panel de monitor está abierto, solo mostrar el panel de monitor
  if (isMonitorPanelOpen) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <MonitorPanel onClose={handleCloseMonitorPanel} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
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