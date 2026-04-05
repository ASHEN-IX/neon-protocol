// Simple sound effects manager using Web Audio API
export const SoundManager = {
  context: null,
  
  init() {
    if (!this.context && typeof window !== 'undefined') {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playBeep(frequency = 800, duration = 50) {
    if (!this.context) this.init();
    if (!this.context) return; // Audio context not available
    
    try {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.connect(gain);
      gain.connect(this.context.destination);
      
      osc.frequency.value = frequency;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.1, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration / 1000);
      
      osc.start(this.context.currentTime);
      osc.stop(this.context.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio playback not available');
    }
  },

  playSuccess() {
    if (!this.context) this.init();
    if (!this.context) return;
    
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        setTimeout(() => this.playBeep(freq, 150), i * 100);
      });
    } catch (e) {
      console.log('Audio playback not available');
    }
  },

  playError() {
    if (!this.context) this.init();
    if (!this.context) return;
    
    try {
      this.playBeep(300, 100);
      setTimeout(() => this.playBeep(200, 100), 100);
    } catch (e) {
      console.log('Audio playback not available');
    }
  },

  playTypeSound() {
    this.playBeep(1200, 20);
  },
};
