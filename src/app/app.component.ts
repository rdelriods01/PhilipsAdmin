import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.subscribe(us => {
      if (us) {
        this.router.navigate(['']);
      }
      else {
        console.log('No hay usuario');
        this.router.navigate(['login']);
      }
    })
  }

}



