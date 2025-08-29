import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccessibilityService } from './servicos/accessibility.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Apenas o RouterOutlet é necessário aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-acessivel';

  constructor(
    private router: Router,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit(): void {
    const profile = this.accessibilityService.getProfile();
    if (!profile) {
      this.router.navigate(['/cadastro']);
    } else {
      // Se já tem perfil, garante que o usuário está na home
      this.router.navigate(['/home']);
    }
  }
}