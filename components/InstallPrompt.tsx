import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Verificar se o usuário já fechou o prompt antes
      const promptDismissed = localStorage.getItem('installPromptDismissed');
      const dismissedTime = localStorage.getItem('installPromptDismissedTime');
      
      // Mostrar novamente após 7 dias
      if (promptDismissed && dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed > 7) {
          localStorage.removeItem('installPromptDismissed');
          localStorage.removeItem('installPromptDismissedTime');
          setShowPrompt(true);
        }
      } else if (!promptDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setShowPrompt(false);
    } else {
      // Para iOS, mostrar prompt manual após 3 segundos
      if (iOS) {
        const promptDismissed = localStorage.getItem('installPromptDismissed');
        if (!promptDismissed) {
          setTimeout(() => {
            setShowPrompt(true);
          }, 3000);
        }
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOS) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      // Para iOS, apenas manter o prompt aberto com instruções
      // O usuário precisa usar o menu do Safari
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
    localStorage.setItem('installPromptDismissedTime', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[70] animate-slide-up">
      <div className="bg-gradient-to-r from-[#5B6B9E] to-[#4A5A8D] text-white p-4 rounded-2xl shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start gap-3 pr-8">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Download size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Instalar Maná</h3>
            
            {isIOS ? (
              // Instruções para iOS/iPad
              <>
                <p className="text-sm text-white/90 mb-2">
                  Instale o app para acesso rápido e funcione offline!
                </p>
                <div className="bg-white/10 p-3 rounded-lg mb-3 text-xs">
                  <p className="font-semibold mb-1">📱 Como instalar:</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/80">
                    <li>Toque no botão <strong>Compartilhar</strong> (□↑)</li>
                    <li>Role e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                    <li>Toque em <strong>"Adicionar"</strong></li>
                  </ol>
                </div>
                <button
                  onClick={handleDismiss}
                  className="bg-white text-[#5B6B9E] font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors text-sm w-full"
                >
                  Entendi
                </button>
              </>
            ) : (
              // Botão para Android/Chrome
              <>
                <p className="text-sm text-white/90 mb-3">
                  Instale o app para acesso rápido e funcione offline!
                </p>
                {deferredPrompt ? (
                  <button
                    onClick={handleInstall}
                    className="bg-white text-[#5B6B9E] font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors text-sm w-full"
                  >
                    Instalar Agora
                  </button>
                ) : (
                  <div className="bg-white/10 p-3 rounded-lg text-xs">
                    <p className="font-semibold mb-1">📱 Como instalar:</p>
                    <p className="text-white/80">
                      Toque no menu (⋮) e selecione <strong>"Adicionar à tela inicial"</strong>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
