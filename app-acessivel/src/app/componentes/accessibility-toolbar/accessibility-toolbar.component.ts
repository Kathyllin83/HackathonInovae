import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accessibility-toolbar',
  templateUrl: './accessibility-toolbar.component.html',
  styleUrls: ['./accessibility-toolbar.component.scss']
})
export class AccessibilityToolbarComponent {
  private currentFontSize = 1; 
isDyslexiaModeActive = false;
  toggleContrast() {

    document.body.classList.toggle('high-contrast');
  }

  increaseFontSize() {
    if (this.currentFontSize < 1.6) { // Limite para não ficar gigante
      this.currentFontSize += 0.2;
      this.updateFontSize();
    }
  }
 @Output() descriptionToggled = new EventEmitter<void>();
  isDescriptionActive = false; // Para controlar o estado visual do botão

  // 2. Crie uma função para ser chamada pelo clique do botão
  onToggleDescription(): void {
    this.isDescriptionActive = !this.isDescriptionActive; // Inverte o estado visual
    this.descriptionToggled.emit(); // Emite o "aviso" para o componente pai
  }
  decreaseFontSize() {
    if (this.currentFontSize > 0.6) { // Limite para não ficar ilegível
      this.currentFontSize -= 0.2;
      this.updateFontSize();
    }
  }
toggleDyslexiaMode(): void {
    this.isDyslexiaModeActive = !this.isDyslexiaModeActive;
    document.body.classList.toggle('dyslexia-friendly');
  }
  private updateFontSize() {
    document.body.style.fontSize = `${this.currentFontSize}rem`;
  }
}