import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccessibilityToolbarComponent } from '../accessibility-toolbar/accessibility-toolbar.component';
import * as tmImage from '@teachablemachine/image';

// Declara a API de Reconhecimento de Voz para o TypeScript
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-image-classifier',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    AccessibilityToolbarComponent 
  ],
  templateUrl: './image-classifier.component.html',
  styleUrls: ['./image-classifier.component.scss']
})
export class ImageClassifierComponent implements OnDestroy, OnInit {
  // Conecta com o <div #webcamContainer> no HTML
  @ViewChild('webcamContainer') webcamContainer!: ElementRef;
  
  // --- Propriedades de Configuração e Modelo ---
  readonly URL = "https://teachablemachine.withgoogle.com/models/y8BGHDjhX/"; // Substitua pelo seu modelo
  private model: any;
  private webcam: any;

  // --- Propriedades de Estado da Interface ---
  public isScanning = true;
  public cameraIniciada = false;
  public currentDescription: string = '';
  public isAudiodescricaoAtiva = true; // O "Narrador" começa ligado
public isDescriptionActive = true;
public isDyslexiaModeActive = false;
  // --- Propriedades de Controle Interno ---
  private animationFrameId: number | null = null;
  private recognition: any;
  private obraDetectadaAtualmente: string | null = null;

 private readonly artDescriptions: { [key: string]: string } = {
  'obra': `
    O Painel "Frei Caneca", de Cícero Dias, é uma obra que se destaca pelo seu estilo modernista, lúdico e onírico. 
    Em suas doze telas, o artista emprega uma paleta de cores vivas e puras, como azuis, vermelhos, verdes e amarelos, 
    para dar vida a figuras e cenários.

    As personagens, incluindo Frei Caneca, muitas vezes aparecem flutuando ou em escalas diferentes da paisagem, 
    criando um efeito de sonho. Os traços não são realistas, mas sim poéticos e expressivos, misturando elementos 
    do cotidiano rural e urbano de Pernambuco com a iconografia do herói. A obra se divide para retratar a Revolução 
    de 1817 e a Confederação do Equador de 1824.

    A intenção é mais do que contar a história: é convidar o espectador a entrar na memória e na fantasia do artista 
    sobre o martírio de Frei Caneca, fazendo da pintura uma celebração vibrante da história e cultura pernambucana.
  `,
  'cenário': `
    Cenário detectado, pessoas e objetos não identificados.
  `,
  'fundo': `
    Fundo detectado. Sem descrição.
  `
};
  
  constructor() {
    this.setupVoiceRecognition();
  }

  ngOnInit(): void {
    // Lógica do loading "Escaneando ambiente..." de 3 segundos
    setTimeout(() => {
      this.isScanning = false;
      this.iniciarCamera(); // Inicia a câmera DEPOIS que o loading terminar
    }, 3000);
  }
  
  private setupVoiceRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = true;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        if (command.includes('desativar áudio') || command.includes('desativar narrador')) {
          this.setNarradorState(false);
        } else if (command.includes('ativar áudio') || command.includes('ativar narrador')) {
          this.setNarradorState(true);
        }
      };

      this.recognition.onend = () => {
        if (this.cameraIniciada) {
          this.recognition.start();
        }
      };
    }
  }

  public toggleNarradorManual(): void {
    this.setNarradorState(!this.isAudiodescricaoAtiva);
  }

 private setNarradorState(ativo: boolean): void {
  this.isAudiodescricaoAtiva = ativo;

  // Apenas cancela a voz, não remove o texto
  if (!this.isAudiodescricaoAtiva) {
    window.speechSynthesis.cancel();
  } else if (this.obraDetectadaAtualmente) {
    // Se religar, fala a descrição novamente
    const textoParaFalar = new DOMParser().parseFromString(this.currentDescription, "text/html").documentElement.textContent || "";
    this.falarTexto(textoParaFalar);
  }
}

  private falarTexto(texto: string): void {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  async iniciarCamera(): Promise<void> {
    if (this.cameraIniciada) return;
    this.cameraIniciada = true;
    
    const modelURL = this.URL + "model.json";
    const metadataURL = this.URL + "metadata.json";

    try {
      this.model = await tmImage.load(modelURL, metadataURL);
      const flip = true;
      this.webcam = new tmImage.Webcam(400, 400, flip);
      await this.webcam.setup();
      await this.webcam.play();
      
      const container = this.webcamContainer.nativeElement;
      container.innerHTML = '';
      container.appendChild(this.webcam.canvas);

      this.animationFrameId = window.requestAnimationFrame(() => this.loop());
      
      if (this.recognition) {
        this.recognition.start();
        console.log("Reconhecimento de voz iniciado.");
      }
    } catch (error) {
      console.error("Erro ao iniciar a câmera. Verifique as permissões.", error);
      this.cameraIniciada = false;
      this.isScanning = true;
    }
  }

  private async loop(): Promise<void> {
    if (!this.webcam) return;
    this.webcam.update(); 
    await this.predict();
    this.animationFrameId = window.requestAnimationFrame(() => this.loop());
  }

  private async predict(): Promise<void> {
    if (!this.isAudiodescricaoAtiva || !this.model) return;

    const prediction = await this.model.predict(this.webcam.canvas);
    const topPrediction = prediction.reduce((prev: any, current: any) => (prev.probability > current.probability) ? prev : current);
    const confidenceThreshold = 0.90;

    let obraEncontrada: string | null = null;
    if (topPrediction.probability > confidenceThreshold && topPrediction.className.toLowerCase() !== 'fundo') {
      obraEncontrada = topPrediction.className;
    }

    if (obraEncontrada && obraEncontrada !== this.obraDetectadaAtualmente) {
      this.obraDetectadaAtualmente = obraEncontrada;
      const descricaoDaObra = this.artDescriptions[obraEncontrada] || `Obra "${obraEncontrada}" detectada. Descrição não encontrada.`;
      this.currentDescription = descricaoDaObra;

      if (this.isAudiodescricaoAtiva) {
        const textoParaFalar = new DOMParser().parseFromString(descricaoDaObra, "text/html").documentElement.textContent || "";
        this.falarTexto(textoParaFalar);
      }
    } 
    else if (!obraEncontrada && this.obraDetectadaAtualmente) {
      this.obraDetectadaAtualmente = null;
      this.currentDescription = '';
      window.speechSynthesis.cancel();
    }
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.webcam) {
      this.webcam.stop();
    }
    if (this.recognition) {
      this.recognition.stop();
    }
    window.speechSynthesis.cancel();
  }
  onToggleDescription(): void {
  this.isDescriptionActive = !this.isDescriptionActive;
}

toggleDyslexiaMode(): void {
  this.isDyslexiaModeActive = !this.isDyslexiaModeActive;
}
toggleContrast(): void {
  console.log('Contraste alternado');
}

increaseFontSize(): void {
  console.log('Fonte aumentada');
}

decreaseFontSize(): void {
  console.log('Fonte diminuída');
}

}