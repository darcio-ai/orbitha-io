import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UseInstallPWAOptions {
  manifestPath?: string; // e.g., '/manifest-fitness.json'
}

export const useInstallPWA = (options?: UseInstallPWAOptions) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInOtherPWA, setIsInOtherPWA] = useState(false);

  useEffect(() => {
    // Detect mobile devices via userAgent and screen width
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileDevice = mobileRegex.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    setIsMobile(isMobileDevice || isSmallScreen);

    // Listen for resize to update mobile status
    const handleResize = () => {
      const isSmall = window.innerWidth <= 768;
      const isMobileUA = mobileRegex.test(navigator.userAgent);
      setIsMobile(isMobileUA || isSmall);
    };
    window.addEventListener('resize', handleResize);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if running in standalone mode (actually installed as PWA)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isRunningAsPWA = isStandalone || isIOSStandalone;
      
      // Check if we're in the context of a different PWA
      if (isRunningAsPWA && options?.manifestPath) {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        const currentManifest = manifestLink?.getAttribute('href');
        
        // If we're running as PWA but the manifest doesn't match our expected one,
        // we're inside a different PWA (e.g., accessing /fitness from the main Orbitha PWA)
        if (currentManifest !== options.manifestPath) {
          setIsInOtherPWA(true);
          setIsInstalled(false); // Allow showing install prompt
          return;
        }
      }
      
      setIsInstalled(isRunningAsPWA);
      setIsInOtherPWA(false);
    };
    
    checkInstalled();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  };

  return {
    canInstall,
    isInstalled,
    promptInstall,
    isIOS,
    isMobile,
    isInOtherPWA,
  };
};
