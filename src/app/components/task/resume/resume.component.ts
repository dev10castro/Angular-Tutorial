import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../service/task.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent {
  @Input()
  taskInput!: Task;

  @Output()
  eventEditTask = new EventEmitter<Task>(); // Evento para editar una tarea

  tasks: Task[] = [];

  constructor(private taskService: TaskService,private router: Router) {}



  changeStatus(taskId: string): void {
    this.taskService.changeStatus(taskId);
  }

  changePriorityDown(taskId: string): void {
    this.taskService.changePriorityDown(taskId);
  }

  changePriorityUp(taskId: string): void {
    this.taskService.changePriorityUp(taskId);
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId)
      .then(() => {
        console.log(`Task ${taskId} borrada correctamente.`);
      })
      .catch((error) => {
        console.error(`Error borrando tarea ${taskId}:`, error);
      });

  }


  editTask(taskId: string): void {

  }


}
