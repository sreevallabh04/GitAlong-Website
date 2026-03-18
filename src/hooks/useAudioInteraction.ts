import { useEffect } from 'react';
import { audioEngine } from '../utils/audio';

export const useAudioInteraction = () => {
  useEffect(() => {
    let lastHoverTarget: HTMLElement | null = null;
    let clickInitDone = false;

    const initAudio = async () => {
      if (!clickInitDone) {
        await audioEngine.init();
        clickInitDone = true;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (!clickInitDone) return; // Wait until audio is initialized

      const target = e.target as HTMLElement;
      // Find closest interactive element
      const interactiveEl = target.closest('button, a, .btn-primary, .btn-secondary, .card-modern, .input-modern') as HTMLElement;
      
      if (interactiveEl && interactiveEl !== lastHoverTarget) {
        lastHoverTarget = interactiveEl;
        audioEngine.playHoverSound();
      } else if (!interactiveEl) {
        lastHoverTarget = null;
      }
    };

    const handleMouseOut = () => {
      lastHoverTarget = null;
    };

    const handleClick = async (e: MouseEvent) => {
      await initAudio(); // Initialize on first click if not already

      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('button, a, .btn-primary, .btn-secondary, .card-modern, .input-modern');
      
      if (interactiveEl) {
        audioEngine.playClickSound();
      }
    };

    // Listeners
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);
};
