// No arquivo app.routes.ts

import { Routes } from '@angular/router';
import { SplashScreenComponent } from './paginas/splash-screen/splash-screen.component';
import { HomeComponent } from './paginas/home/home.component'; // Supondo que sua tela 2 se chame HomeComponent
import { ImageClassifierComponent } from './componentes/image-classifier/image-classifier.component'; // Sua tela 3

export const routes: Routes = [
  // Rota inicial: Quando o app abre, carrega a SplashScreen
{
    path: '',
    component: SplashScreenComponent
  },

  // 2. ROTA 'HOME' (Tela 2):
  //    O SplashScreen irá redirecionar para cá após 3 segundos.
  {
    path: 'home',
    component: HomeComponent
  },

  // 3. ROTA 'CÂMERA' (Tela 3):
  //    A tela Home irá redirecionar para cá quando o botão da câmera for clicado.
  {
    path: 'camera',
    component: ImageClassifierComponent
  },

  // 4. ROTA CORINGA (Wildcard):
  //    Se o usuário digitar uma URL que não existe, ele será redirecionado
  //    para a tela inicial (o splash). É uma boa prática de segurança.
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];