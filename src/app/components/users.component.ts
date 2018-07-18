import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'usersC',
  templateUrl: '../views/users.html',
  styleUrls: ['../css/users.css']
})
export class UsersComponent {

    roles = ['fse','admin'];
    displayName;
    email;
    password;
    rol;


  constructor(public _authService: AuthService) {}

  nuevoUsuario(userData){
      if(userData.valid){
          console.log(userData.value);
          this._authService.createUser(userData.value);
      }
  }

}
