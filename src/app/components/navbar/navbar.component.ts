import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Person } from '../models/person.model';
import { PersonService } from '../../service/person.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Indica si el usuario está autenticado
  role: string | null = null; // Rol del usuario, si está autenticado

  constructor(
    private router: Router,
    private authservice: AuthService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.authservice.getUserAuthenticated().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.isLoggedIn = true;
          // Obtener el rol del usuario
          this.personService.getByUid(user.uid).subscribe({
            next: (person: Person | null) => {
              if (person) {
                this.role = person.role; // Asignar rol
              }
            },
            error: (error) => {
              console.error('Error al obtener la información del usuario:', error);
            }
          });
        } else {
          this.isLoggedIn = false;
          this.role = null;
        }
      },
      error: (error) => {
        console.error('Error al verificar el estado del usuario:', error);
      }
    });
  }

  logout(): void {
    // Manejar el cierre de sesión
    this.authservice.logout()
      .then(() => this.router.navigate(['/login']))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  }
}
