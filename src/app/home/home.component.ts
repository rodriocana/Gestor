import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { TareasService } from '../services/tareas.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  contactForm!: FormGroup;
  seleccionado: number | null = null;
  categoriaSeleccionada: string = '';
  mostrandoCompletadas: boolean = false;
  mostrarModal: boolean = false;
  tareas: any[] = [];

  tareasCompletadas: any[] = [];
  totalTareasInicial: number = this.tareas.length;
  tareasPorPagina: number = 8;
  paginaActual: number = 1;

  constructor(private formBuilder: FormBuilder, private route:Router, private tareasService: TareasService) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempo: ['', Validators.required],
      ordenarPor: ['categoria']
    });

    this.obtenerTareas();

    console.log

  }

  obtenerTareas(): void {
    this.tareasService.obtenerTareas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.totalTareasInicial = this.tareas.length;
        console.log('Tareas:', this.totalTareasInicial);
        console.log('Tareas:', this.tareas);

      },
      error: (error) => {
        console.error('Error al obtener las tareas:', error);
      }
    });
  }

  obtenerTareasCompletadas(): void {
    this.tareasService.obtenerTareasCompletadas().subscribe({
      next: (data) => {
        this.tareasCompletadas = data;
        console.log('Tareas completadas:', this.tareasCompletadas);
      },
      error: (error) => {
        console.error('Error al obtener las tareas completadas:', error);
      }
    });
  }

  get tareasFiltradas() {
    return this.categoriaSeleccionada
      ? this.tareas.filter(t => t.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase())
      : this.tareas;
  }

  get tareasPagina() {
    const lista = this.mostrandoCompletadas ? this.tareasCompletadas : this.tareasFiltradas;
    const inicio = (this.paginaActual - 1) * this.tareasPorPagina;
    const fin = inicio + this.tareasPorPagina;
    return lista.slice(inicio, fin);
  }

  get totalTareas() {
    return this.mostrandoCompletadas ? this.tareasCompletadas.length : this.tareasFiltradas.length;
  }

  get totalPaginas() {
    return Math.ceil(this.totalTareas / this.tareasPorPagina);
  }

  nextPage() {
    if (this.paginaActual * this.tareasPorPagina < this.totalTareas) {
      this.paginaActual++;
      this.seleccionado = null;
    }
  }

  prevPage() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.seleccionado = null;
    }
  }

  seleccionarFila(index: number) {
    this.seleccionado = this.seleccionado === index ? null : index;
  }


  completarTarea(index: number): void {
    const tareaCompletada = this.tareasFiltradas[(this.paginaActual - 1) * this.tareasPorPagina + index];

    if (tareaCompletada.id !== undefined && tareaCompletada.id !== null) {
      this.tareasService.completarTarea(tareaCompletada.id).subscribe({
        next: () => {
          this.obtenerTareas(); // Recargar lista de pendientes
          this.obtenerTareasCompletadas(); // Opcional: recargar completadas para mantener consistencia local
          alert("Tarea completada!! Enhorabuena!!");
        },
        error: (error) => console.error('Error al completar tarea:', error)
      });
    } else {
      console.error("Error: La tarea no tiene un ID válido.");
    }

    this.seleccionado = null;
  }

  eliminar(): void {
    if (this.seleccionado !== null) {
      const tareaEliminada = this.tareasFiltradas[(this.paginaActual - 1) * this.tareasPorPagina + this.seleccionado];

      if (tareaEliminada.id !== undefined) {  // Verifica si la tarea tiene ID antes de eliminar
        this.tareasService.eliminarTarea(tareaEliminada.id).subscribe({
          next: () => {

            alert(`Tarea "${tareaEliminada.descripcion}" eliminada correctamente`);
            this.obtenerTareas();
          },
          error: (error) => console.error('Error al eliminar tarea:', error)
        });
      }
    }
  }

  // Método para ajustar la página actual si se eliminan tareas
  ajustarPagina() {
    const maxPagina = Math.ceil(this.totalTareas / this.tareasPorPagina);
    if (this.paginaActual > maxPagina && maxPagina > 0) {
      this.paginaActual = maxPagina;
    } else if (this.totalTareas === 0) {
      this.paginaActual = 1;
    }
  }

  alternarVista(): void {
    this.mostrandoCompletadas = !this.mostrandoCompletadas;
    this.paginaActual = 1;
    this.seleccionado = null;
    if (this.mostrandoCompletadas) {
      this.obtenerTareasCompletadas(); // Cargar tareas completadas
    } else {
      this.obtenerTareas(); // Volver a cargar tareas pendientes
    }
  }

  abrirCerrarModal() {
    this.mostrarModal = !this.mostrarModal;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  addTarea(): void {
    if (this.contactForm.valid) {
      const nuevaTarea = {
        categoria: this.contactForm.value.categoria,
        descripcion: this.contactForm.value.descripcion,
        tiempo: this.contactForm.value.tiempo
      };

      console.log("prueba");

      this.tareasService.agregarTarea(nuevaTarea).subscribe({
        next: (response) => {
          console.log('Respuesta recibida:', response); // Verifica la respuesta
          this.obtenerTareas(); // Recargar la lista
          this.contactForm.reset();
          this.cerrarModal();
          console.log("prueb2a");
        },
        error: (error) => {
          console.error('Error al agregar tarea:', error);
        }
      });
    }
  }

  ordenarTareas() {
    const criterio = this.contactForm.value.ordenarPor;
    if (criterio === 'categoria') {
      this.tareas.sort((a, b) => a.categoria.localeCompare(b.categoria));
    } else if (criterio === 'Maxtiempo') {
      this.tareas.sort((a, b) => b.tiempo - a.tiempo);
    } else if (criterio === 'Mintiempo') {
      this.tareas.sort((a, b) => a.tiempo - b.tiempo);
    }
  }

  verPorCategoria() {
    this.categoriaSeleccionada = this.contactForm.value.ordenarPor;
    this.paginaActual = 1;
  }

  guardarCompletadas() {
    if (this.tareasCompletadas.length === 0) {
      alert('No hay tareas completadas para guardar.');
      return;
    }
    const contenido = this.tareasCompletadas.map(tarea =>
      `Categoría: ${tarea.categoria}, Descripción: ${tarea.descripcion}, Tiempo: ${tarea.tiempo} minutos`
    ).join('\n');
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'tareas_completadas.txt');
  }

  TareasVacias(): boolean {
    return this.mostrandoCompletadas ? this.tareasCompletadas.length === 0 : this.tareasFiltradas.length === 0;
  }

  NavigateTo() {
    this.route.navigate(['/inicio']);
    }
}
