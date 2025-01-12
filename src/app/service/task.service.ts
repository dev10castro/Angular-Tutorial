import { Injectable } from '@angular/core';
import {Task, TaskPriority, TaskStatus} from '../components/models/task.model';
import {TaskEvent} from '../components/models/TaskEvent.model';
import {Database, ref, remove, onValue, push, set} from '@angular/fire/database';
import {catchError, from, map, Observable, tap, throwError} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskList: Task[] = [];

  constructor(private database:Database) { }



  changeStatus(taskId: string){
    const task = this.taskList.find(task => task.id === taskId); // Encuentra la tarea por su ID
    if (task) {
      switch (task.status) {
        case TaskStatus.PENDING:
          task.status = TaskStatus.IN_PROGRESS;
          break;
        case TaskStatus.IN_PROGRESS:
          task.status = TaskStatus.COMPLETED;
          break;
        case TaskStatus.COMPLETED:
          task.status = TaskStatus.PENDING;
          break;
      }
    }
  }

  changePriorityDown(taskId: string){
    const task = this.taskList.find(task => task.id === taskId); // Encuentra la tarea por su ID
    if (task) {
      switch (task.priority) {
        case TaskPriority.HIGH:
          task.priority = TaskPriority.MEDIUM;
          break;
        case TaskPriority.MEDIUM:
          task.priority = TaskPriority.LOW;
          break;
        case TaskPriority.LOW:
          task.priority = TaskPriority.HIGH;
          break;
      }
    }
  }

  changePriorityUp(taskId: string){
    const task = this.taskList.find(t => t.id === taskId); // Encuentra la tarea por su ID
    if (task) {
      switch (task.priority) {
        case TaskPriority.HIGH:
          task.priority = TaskPriority.LOW;
          break;
        case TaskPriority.MEDIUM:
          task.priority = TaskPriority.HIGH;
          break;
        case TaskPriority.LOW:
          task.priority = TaskPriority.MEDIUM;
          break;
      }
    }
  }



  addTask(task: Task): Promise<string> {
    const taskRef = ref(this.database, 'taskList'); // Referencia a la lista de tareas en Firebase
    const newTaskRef = push(taskRef); // Crear una nueva entrada en Firebase
    task.id = newTaskRef.key as string; // Asignar el ID generado por Firebase
    return set(newTaskRef, task)
      .then(() => {
        console.log('Tarea guardada exitosamente en Firebase.');
        return task.id; // Retornar el ID generado
      })
      .catch((error) => {
        console.error('Error al guardar la tarea:', error);
        throw error;
      });
  }




  getTasksAll(): Observable<Task[]> {
    const taskRef = ref(this.database, "taskList");
    return new Observable((observer) => {
      onValue(
        taskRef,
        (snapshot) => {
          const tasks: Task[] = [];
          snapshot.forEach((childSnapshot) => {
            tasks.push({
              id: childSnapshot.key, // Incluye la clave única como parte del objeto
              ...childSnapshot.val(),
            } as Task);
          });
          observer.next(tasks); // Emite las tareas al suscriptor
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }


  deleteTask(taskId: string): Observable<void> {
    const taskRef = ref(this.database, `taskList/${taskId}`);
    return from(remove(taskRef)).pipe(
      tap(() => console.log(`Tarea con ID ${taskId} borrada correctamente.`)),
      catchError((error) => {
        console.error(`Error borrando la tarea con ID ${taskId}:`, error);
        return throwError(() => error);
      })
    );
  }





}
