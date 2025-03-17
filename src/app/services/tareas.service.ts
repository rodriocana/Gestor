import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tarea } from '../../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private apiUrl = 'http://192.168.210.176:3000/tareas'; // URL del backend
  private apiUrlCompletadas = 'http://192.168.210.176:3000'; // URL del backend

  public tareasCompletadasUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  obtenerTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  agregarTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  completarTarea(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/completar/${id}`, {});
  }


  obtenerTareasCompletadas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrlCompletadas}/completadas`);
  }


}
