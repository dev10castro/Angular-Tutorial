import {Component, OnInit} from '@angular/core';
import {PersonService} from '../../../service/person.service';
import {AuthService} from '../../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  userName:string='';
  userSurname:string = '';
  userEmail : string = '';
  userRole : string = '';


  constructor(private personservice:PersonService,private authService:AuthService) {
  }



  ngOnInit(): void {

    const user = this.authService.getCurrentUser();
    if (user) {
      const uid = user.uid;


    this.personservice.getByUid(uid).subscribe({
      next: (person) => {
        if (person) {
          this.userName = person.name;
          this.userSurname = person.surname;
          this.userEmail = person.email;
          this.userRole = person.role;
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos de la persona:', error);
      },
    });

  }

}
}
