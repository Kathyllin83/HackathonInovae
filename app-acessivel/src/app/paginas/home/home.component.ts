import { Component, OnInit } from '@angular/core';
import { AccessibilityService, AccessibilityProfile } from '../../servicos/accessibility.service';

// Importe os componentes que você vai usar no HTML
import { AccessibilityToolbarComponent } from '../../componentes/accessibility-toolbar/accessibility-toolbar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Defina uma "interface" para organizar os dados de cada local
interface Local {
  id: number;
  nome: string;
  bairro: string;
  descricao: string;
  recursos: string[];
  
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AccessibilityToolbarComponent,
  
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDescriptionEnabled = false;
  public cameraAtiva = false;
  
  // CORREÇÃO APLICADA AQUI
  perfilDoUsuario: AccessibilityProfile = null;
  
  locaisSugeridos: Local[] = [];
  todosOsLocais: Local[] = [
   
  ];

  constructor(private accessibilityService: AccessibilityService) {}

  ngOnInit(): void {
    this.perfilDoUsuario = this.accessibilityService.getProfile();

    if (this.accessibilityService.isProfileVisual()) {
      this.isDescriptionEnabled = true;
      document.body.classList.add('high-contrast');
    }
    if (this.accessibilityService.isProfileCognitiva()) {
      document.body.classList.add('dyslexia-friendly');
    }
    
  }

  

  toggleDescriptionFeature(): void {
    this.isDescriptionEnabled = !this.isDescriptionEnabled;
  }
}