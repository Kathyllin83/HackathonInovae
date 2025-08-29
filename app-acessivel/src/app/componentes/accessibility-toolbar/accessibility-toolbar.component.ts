import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import necessário se você estiver usando ngIf ou outros
import { RouterLink } from '@angular/router'; // Import necessário se estiver em um componente com roteamento

@Component({
  selector: 'app-accessibility-toolbar',
  standalone: true, // Adicionei standalone para que possa ser usado sozinho se necessário
  imports: [CommonModule, RouterLink],
  templateUrl: './accessibility-toolbar.component.html',
  styleUrls: ['./accessibility-toolbar.component.scss']
})
export class AccessibilityToolbarComponent {
  private currentFontSize = 1;
  isDyslexiaModeActive = false;
  isDescriptionActive = false;
  public isAudiodescricaoAtiva = false;
  @Output() descriptionToggled = new EventEmitter<void>();
ngOnInit(): void {
    // Exemplo: se o usuário já tiver o leitor de tela ativado,
    // o botão já começa ligado
    this.isAudiodescricaoAtiva = true;
  }
  toggleContrast(): void {
    document.body.classList.toggle('high-contrast');
  }

  increaseFontSize(): void {
    if (this.currentFontSize < 1.6) {
      this.currentFontSize += 0.2;
      this.updateFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.currentFontSize > 0.6) {
      this.currentFontSize -= 0.2;
      this.updateFontSize();
    }
  }

  onToggleDescription(): void {
    this.isDescriptionActive = !this.isDescriptionActive;
    this.descriptionToggled.emit();
  }

  toggleDyslexiaMode(): void {
    this.isDyslexiaModeActive = !this.isDyslexiaModeActive;
    document.body.classList.toggle('dyslexia-friendly');
  }

  private updateFontSize(): void {
    document.body.style.fontSize = `${this.currentFontSize}rem`;
  }
  toggleNarradorManual(): void {
    this.isAudiodescricaoAtiva = !this.isAudiodescricaoAtiva;
    
    // Se o leitor de tela for ativado, ele lê um texto de exemplo
    if (this.isAudiodescricaoAtiva) {
      this.falarTexto("Leitor de tela ativado. Bem-vindo à página.");
    } else {
      // Se for desativado, a leitura é interrompida
      window.speechSynthesis.cancel();
    }
  }

  // Método para converter texto em voz
  private falarTexto(texto: string): void {
    // Cancela qualquer leitura anterior
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
}