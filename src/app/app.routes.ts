import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component'; // Importa los componentes
import { ContactComponent } from './contact/contact.component';
import { PruebaComponent } from './prueba/prueba.component';
import { InicioComponent } from './inicio/inicio.component';
import { TresEnRayaComponent } from './tres-en-raya/tres-en-raya.component';
import { BreakoutComponent } from './breakout/breakout.component';
import { QuizComponent } from './quiz/quiz.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'prueba', component: PruebaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto
  {path: 'TresenRaya', component: TresEnRayaComponent  },
  {path: 'Bricks', component: BreakoutComponent  },
  {path: 'Quiz', component: QuizComponent  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Asegúrate de usar forRoot
  exports: [RouterModule],
})
export class AppRoutingModule {}
