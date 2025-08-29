// DENTRO DE: src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // 1. IMPORTE O provideRouter
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // 2. IMPORTE NOSSAS ROTAS

bootstrapApplication(AppComponent, {
  // 3. ADICIONE A CONFIGURAÇÃO DE PROVIDERS AQUI
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));