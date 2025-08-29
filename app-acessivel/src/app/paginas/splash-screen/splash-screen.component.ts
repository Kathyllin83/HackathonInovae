import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Define um temporizador de 3 segundos (3000 milissegundos)
    setTimeout(() => {
      // Após 3 segundos, navega para a rota '/home' (Tela 2)
      this.router.navigate(['/home']);
    }, 3000);
  }

}