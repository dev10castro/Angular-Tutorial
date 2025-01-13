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
    this.authservice.getUserDataAuth().subscribe(({user,person})=>{
      if(user){
        this.isLoggedIn = true;
        if(person && person.role){
          this.role = person.role;
          this.isLoggedIn=true;
          console.log(person.role);
        }
      }else{
        this.isLoggedIn = false;
      }
    })
  }

  logout(): void {
    // Manejar el cierre de sesión
    this.authservice.logout()
      .then(() => this.router.navigate(['/login']))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  }
}
