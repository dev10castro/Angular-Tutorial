import { Component } from '@angular/core';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {FooterComponent} from '../../../components/footer/footer.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../../service/auth.service';
import {passwordMatchValidator} from './signin.validators';
import {Router} from '@angular/router';
import {Person} from '../../../components/models/person.model';
import {dateTimestampProvider} from 'rxjs/internal/scheduler/dateTimestampProvider';
import {PersonService} from '../../../service/person.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  formSignin: FormGroup;

  constructor(private formBuilder: FormBuilder, private registerservice: AuthService, private router: Router, private personService: PersonService) {
    this.formSignin = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role:['',[]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onSubmit() {
    if (this.formSignin.valid) {
      // Obtener valores del formulario
      const name = this.formSignin.get("name")?.value;
      const surname = this.formSignin.get("surname")?.value;
      const email = this.formSignin.get("email")?.value;
      const role = this.formSignin.get("role")?.value ? "admin" : "user"; // Si el switch está activo, es admin; si no, es user.
      const password = this.formSignin.get("password")?.value;

      // Registrar al usuario en Firebase Authentication
      this.registerservice.register({ email, password })
        .then((response) => {
          const uid = response.user.uid; // Obtener el UID del usuario registrado

          // Crear el objeto Person con el UID del usuario
          const person = new Person(uid, name, surname, email, role, new Date().toISOString());

          // Guardar el usuario en la colección "persons"
          return this.personService.savePerson(person);
        })
        .then(() => {
          alert("Registro exitoso. Por favor, inicia sesión.");
          this.formSignin.reset();
          this.router.navigate(['/tasks']); // Redirigir a tasks
        })
        .catch((error) => {
          console.error("Error durante el registro:", error);
          alert("Hubo un error durante el registro. Intente nuevamente.");
        });
    } else {
      console.log("Formulario no válido");
      alert("Por favor, revisa los campos del formulario.");
    }
  }


}
