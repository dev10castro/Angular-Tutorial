import {Component, OnInit} from '@angular/core';
import {Task} from '../../models/task.model';
import {CommonModule} from '@angular/common';
import {ResumeComponent} from "../resume/resume.component";
import {TaskformComponent} from '../taskform/taskform.component';
import {FormsModule} from '@angular/forms';
import {TaskService} from '../../../service/task.service';
import {AuthService} from '../../../service/auth.service';
import {PersonService} from '../../../service/person.service';
import {Person} from '../../models/person.model';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [CommonModule, ResumeComponent,TaskformComponent,FormsModule],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css'
})

export class TasklistComponent implements OnInit{

  tasks: Task[] = [];

  taskOutput:Task|null=null;

  // Variables para el nombre y apellido del usuario
  personName: string = '';
  personSurname: string = '';

  constructor(private taskService: TaskService, private authService: AuthService, private personService: PersonService) {}

  ngOnInit(): void {
    // Escuchar las tareas en tiempo real
    this.taskService.getTasksAll().subscribe((tasks) => {
      this.tasks = tasks;
      console.log('Tareas actualizadas en tiempo real:', this.tasks);
    });

    // Obtener información del usuario autenticado
    const user = this.authService.getCurrentUser();
    if (user) {
      const uid = user.uid;

      this.personService.getByUid(uid).subscribe({
        next: (person) => {
          if (person) {
            this.personName = person.name;
            this.personSurname = person.surname;
          }
        },
        error: (error) => {
          console.error('Error al cargar los datos de la persona:', error);
        },
      });
    }
  }


}



