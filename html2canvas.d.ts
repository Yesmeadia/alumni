// html2canvas.d.ts
import 'html2canvas';

// Extend the existing options interface
declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number; 
  }
}