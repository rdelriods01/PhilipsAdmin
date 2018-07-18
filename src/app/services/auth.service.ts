import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { EmailAuthProvider } from '../../../node_modules/@firebase/auth-types';

import { IUser } from '../models/interfaces';

@Injectable()
export class AuthService {

  user;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState.switchMap(us => {
          if (us) {
            return this.afs.doc(`users/${us.uid}`).valueChanges();
          } else {
            return Observable.of(null)
          }
        })       

  }



  login(email,pass) :any{
    return this.afAuth.auth.signInWithEmailAndPassword(email,pass)
      .catch(err => {
        let msg='Something went wrogn: ' + err.message;
        alert(msg);
      });
  }

  createUser(us){
    this.afAuth.auth.createUserWithEmailAndPassword(us.email, us.password)
      .then(user => {
        user.updateProfile({displayName:us.displayName})
        .then(()=>{         
          // Despues de agregarle el displayName, pasar los datos a un objeto del tipo IUser y asignarle el rol
          // para guardarlo en la base de datos
          const data: IUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: us.rol
          }        
          this.afs.doc(`users/${user.uid}`).set(data);  
        })
      })
      .catch(err => {
        let msg='Something went wrogn: ' + err.message;
        alert(msg);
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/login']);
    });
  }
}