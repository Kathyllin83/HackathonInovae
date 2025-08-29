import { Injectable } from '@angular/core';

// Definimos os tipos de perfil para evitar erros de digitação
export type AccessibilityProfile = 'visual' | 'auditiva' | 'cognitiva' | 'fala' | null;

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly PROFILE_KEY = 'user-accessibility-profile';

  constructor() { }

  // Salva o perfil escolhido no localStorage
  saveProfile(profile: AccessibilityProfile): void {
    if (profile) {
      localStorage.setItem(this.PROFILE_KEY, profile);
    }
  }

  // Pega o perfil salvo do localStorage
  getProfile(): AccessibilityProfile {
    return localStorage.getItem(this.PROFILE_KEY) as AccessibilityProfile;
  }

  // Limpa o perfil para poder escolher de novo
  clearProfile(): void {
    localStorage.removeItem(this.PROFILE_KEY);
  }

  // Funções "ajudantes" para facilitar a verificação nos componentes
  isProfileVisual(): boolean {
    return this.getProfile() === 'visual';
  }
  isProfileAuditiva(): boolean {
    return this.getProfile() === 'auditiva';
  }
  isProfileCognitiva(): boolean {
    return this.getProfile() === 'cognitiva';
  }
}