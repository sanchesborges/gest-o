import { useEffect } from 'react';

export const useDarkMode = () => {
  useEffect(() => {
    console.log('🎨 useDarkMode hook executado');
    
    const applyDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      console.log('🌓 Aplicando dark mode. isDark:', isDark);
      
      if (isDark) {
        // Aplicar dark mode aos fundos brancos - REMOVER classe bg-white temporariamente
        const fundosBrancos = document.querySelectorAll('.bg-white');
        console.log('🎨 Fundos brancos encontrados:', fundosBrancos.length);
        fundosBrancos.forEach((el, index) => {
          const element = el as HTMLElement;
          // Remover bg-white e adicionar classe dark customizada
          element.classList.remove('bg-white');
          element.classList.add('dark-bg-custom');
          element.style.setProperty('background-color', '#1e293b', 'important');
          
          const computedBg = window.getComputedStyle(element).backgroundColor;
          if (index < 3) {
            console.log(`🖌️ Fundo ${index + 1}:`, computedBg, '| Classes:', element.className.substring(0, 50));
          }
        });
        
        // Aplicar dark mode aos títulos
        const titulos = document.querySelectorAll('h1, h2, h3');
        console.log('📝 Títulos encontrados:', titulos.length);
        titulos.forEach(el => {
          (el as HTMLElement).style.setProperty('color', '#f1f5f9', 'important');
          const computedColor = window.getComputedStyle(el as HTMLElement).color;
          const computedBg = window.getComputedStyle(el as HTMLElement).backgroundColor;
          console.log('✅ Título:', (el as HTMLElement).textContent?.substring(0, 30), '| Cor:', computedColor, '| Fundo:', computedBg);
        });
        
        // Aplicar dark mode aos textos
        const textos800 = document.querySelectorAll('.text-gray-800');
        console.log('📝 Elementos text-gray-800:', textos800.length);
        textos800.forEach(el => {
          (el as HTMLElement).style.setProperty('color', '#f1f5f9', 'important');
        });
        
        const textos900 = document.querySelectorAll('.text-gray-900');
        console.log('📝 Elementos text-gray-900:', textos900.length);
        textos900.forEach(el => {
          (el as HTMLElement).style.setProperty('color', '#ffffff', 'important');
        });
      } else {
        console.log('☀️ Light mode - removendo estilos inline');
        // Remover estilos inline quando não estiver em dark mode
        document.querySelectorAll('h1, h2, h3, .text-gray-800, .text-gray-900').forEach(el => {
          (el as HTMLElement).style.removeProperty('color');
        });
        
        // Restaurar bg-white
        document.querySelectorAll('.dark-bg-custom').forEach(el => {
          const element = el as HTMLElement;
          element.classList.remove('dark-bg-custom');
          element.classList.add('bg-white');
          element.style.removeProperty('background-color');
        });
      }
    };
    
    // Aplicar imediatamente
    applyDarkMode();
    
    // Aplicar após delays progressivos
    const timer1 = setTimeout(applyDarkMode, 100);
    const timer2 = setTimeout(applyDarkMode, 500);
    const timer3 = setTimeout(applyDarkMode, 1000);
    
    // Observer para detectar mudanças
    const observer = new MutationObserver(() => {
      console.log('🔄 Mudança detectada no HTML');
      applyDarkMode();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);
};
