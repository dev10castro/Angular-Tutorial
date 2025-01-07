import { Injectable } from '@angular/core';
import {Task, TaskPriority, TaskStatus} from '../components/models/task.model';
import {TaskEvent} from '../components/models/TaskEvent.model';
import {Database, ref, listVal, remove, onValue} from '@angular/fire/database';
import {map, Observable} from 'rxjs';
import {list} from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskList: Task[] = [];

  constructor(private database:Database) { }


  getTasks(): Task[] {
    return this.taskList;
  }

  modifyTask(taskEvent: TaskEvent) {
    switch (taskEvent.action) {
      case "changePriorityUp":
        this.changePriorityUp(taskEvent.taskId);
        break;
      case "changeStatus":
        this.changeStatus(taskEvent.taskId);
        break;
      case "changePriorityDown":
        this.changePriorityDown(taskEvent.taskId);
        break;

    }
  }

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



  addTask(task:Task){
    this.taskList.push(task);
    console.log('Nueva tarea añadida:', task);
  }

  getTask(taskId:string){
   return this.taskList.filter((task1:Task)=>{
      return taskId==task1.id;
    })
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


  deleteTask(taskId: string): Promise<void> {
    const taskRef = ref(this.database, `/taskList/task${taskId}`);
    return remove(taskRef)
      .then(() => {
        console.log(`Tarea con ID ${taskId} borrada correctamente.`);
      })
      .catch((error) => {
        console.error(`Error borrando tarea con ID ${taskId}:`, error);
        throw error; // Vuelve a lanzar el error si es necesario
      });
  }




}
