import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {



  cards = [
    {
      title: 'Ver Tareas',
      description: 'Accede y gestiona tus tareas de manera sencilla.',
      buttonText: 'Ir a Tareas',
      icon: 'fas fa-tasks', // Clase FontAwesome para el ícono
      action: '/tasks'
    },
    {
      title: 'Card 2',
      description: 'Descripción para la segunda tarjeta.',
      buttonText: 'Acción 2',
      icon: 'fas fa-cog',
      action: '/feature2'
    },
    {
      title: 'Card 3',
      description: 'Descripción para la tercera tarjeta.',
      buttonText: 'Acción 3',
      icon: 'fas fa-calendar-alt',
      action: '/feature3'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(): void {
    this.router.navigate([`/home`]);
  }


  navigateToThree(): void {
    this.router.navigate([`/TresenRaya`]);
  }

  navigateToBreakout() {
    this.router.navigate([`/Bricks`]);
    }

    navigateToQuiz() {
      this.router.navigate([`/Quiz`]);
      }

}
