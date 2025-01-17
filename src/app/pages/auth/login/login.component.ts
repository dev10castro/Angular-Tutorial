import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {FooterComponent} from '../../../components/footer/footer.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [

    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  formLogin : FormGroup;

  constructor(formBuilder: FormBuilder, private loginservice:AuthService, private router: Router) {
    this.formLogin = formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      console.log("Los campos de texto son válidos");

      this.loginservice.login(this.formLogin.value).subscribe({
        next: (userCredential) => {
          console.log('Login exitoso:', userCredential);
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error en el login:', err);
        },
      });

      console.log(this.loginservice.isAuthenticated);
    } else {
      // Mensaje de alerta para formulario inválido
      alert("Por favor, completa todos los campos correctamente.");
    }
  }


  loginWithGoogle() {
    this.loginservice.loginWithGoogle()
      .then(response => this.router.navigate(['/home']))
      .catch(error => console.log(error));

  }

  goToRegister() {
    this.router.navigate(['/signin']);
  }

}
