import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {customValidator, customvalidatorPriority} from './taskform.validators';
import {Task, TaskPriority, TaskStatus} from '../../models/task.model';
import {TaskService} from '../../../service/task.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {NavbarComponent} from '../../navbar/navbar.component';
import {FooterComponent} from '../../footer/footer.component';
import {routes} from '../../../app.routes';

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



  constructor(formBuilder: FormBuilder,private taskService:TaskService, private router: Router,private route: ActivatedRoute) {
    this.formTaskEdit = formBuilder.group({

      'name': ['', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      'description': ['', [Validators.required, Validators.maxLength(250)]],
      'priority': ['', [Validators.required, customvalidatorPriority()]],
      'expireDate': ['', [Validators.required, customValidator()]]
    });
  }

  onSubmit(): void {
    if (this.formTaskEdit.valid) {
      const newTask: Task = new Task(
        this.formTaskEdit.get('id')?.value || '',
        this.formTaskEdit.get('name')?.value,
        this.formTaskEdit.get('description')?.value,
        this.formTaskEdit.get('priority')?.value || 'M',
        this.formTaskEdit.get('status')?.value || 'P', // Estado inicial: Pendiente
        this.formTaskEdit.get('creationDate')?.value || new Date().toISOString(), // Fecha de creación actual
        this.formTaskEdit.get('expireDate')?.value,
        this.formTaskEdit.get('isDelete')?.value || false
      );

      this.taskService.addTask(newTask)
        .then(() => {
          console.log('Tarea creada con éxito:', newTask);
          this.formTaskEdit.reset(); // Reinicia el formulario
          //vuelve a la pantalla tasklist
          this.router.navigate(['/tasks']);
        })
        .catch((error) => {
          console.error('Error al guardar la tarea:', error);
        });
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
