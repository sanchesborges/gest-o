import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Verificar se o usuário já fechou o prompt antes
      const promptDismissed = localStorage.getItem('installPromptDismissed');
      if (!promptDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start gap-3 pr-8">
          <div className="p-2 bg-white/20 rounded-lg">
            <Download size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Instalar Maná</h3>
            <p className="text-sm text-indigo-100 mb-3">
              Instale o app para acesso rápido e funcione offline!
            </p>
            <button
              onClick={handleInstall}
              className="bg-white text-indigo-600 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
            >
              Instalar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
