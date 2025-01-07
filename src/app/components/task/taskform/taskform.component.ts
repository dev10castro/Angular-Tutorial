import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {customValidator, customvalidatorPriority} from './taskform.validators';
import {Task, TaskPriority, TaskStatus} from '../../models/task.model';
import {TaskService} from '../../../service/task.service';
import {Route, Router} from '@angular/router';
import {NavbarComponent} from '../../navbar/navbar.component';
import {FooterComponent} from '../../footer/footer.component';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, FooterComponent,],
  templateUrl: './taskform.component.html',
  styleUrl: './taskform.component.css'
})
export class TaskformComponent implements OnChanges{

  formTaskEdit: FormGroup;

  @Input()
  taskInput:Task | null=null;



  constructor(formBuilder: FormBuilder,private taskService:TaskService) {
    this.formTaskEdit = formBuilder.group({

      'name': ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      'description': ['', [Validators.required, Validators.maxLength(250)]],
      'priority': ['', [Validators.required, customvalidatorPriority()]],
      'expireDate': ['', [Validators.required, customValidator()]]
    });
  }



  onsubmit(): void {
    if (this.formTaskEdit.valid) {
      console.log('Formulario correcto y creamos nueva tarea')
      if (this.formTaskEdit.valid) {
        console.log('Formulario correcto y creamos nueva tarea');

        // instanciamos las variables necesarias para crear una nueva tarea
        const id: string = this.formTaskEdit.get('id')?.value;
        const name = this.formTaskEdit.get('name')?.value;
        const description = this.formTaskEdit.get('description')?.value;
        const priority: TaskPriority = this.formTaskEdit.get('priority')?.value;
        const status: TaskStatus = TaskStatus.PENDING;
        const creationDate: string = new Date().toDateString();
        const expirationDate: string = this.formTaskEdit.get('expireDate')?.value;
        const idDelete: boolean = false;

        // Crear nueva instancia de Task
        let newTask = new Task(id, name, description, priority, status, creationDate, expirationDate, idDelete);
        this.taskService.addTask(newTask);


        // añadimos la tarea a la lista de tareas
        console.log(newTask);

        this.formTaskEdit.reset();


      } else {
        console.log(`Formulario con errores y voy a mostrar los errores ${this.formTaskEdit.get('name')?.errors}`)
      }

    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskInput']) {
      console.log(this.taskInput)

      if(this.taskInput!=null){

        this.formTaskEdit.setValue({

          name:this.taskInput.name,
          description:this.taskInput.description,
          priority:this.taskInput.priority,
          expireDate: this.taskInput.expirationDate.toString().slice(0, 16),

        })
      }

    }
  }




}
