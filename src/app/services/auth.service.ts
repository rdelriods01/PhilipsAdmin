import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })
  }

  login(email,pass) :any{
    return this.afAuth.auth.signInWithEmailAndPassword(email,pass)
      .then(fullUser => {
        console.log('Loggeado!');
        // fullUser.updateProfile({
        //   displayName: "Ricardo Del Rio",
        //   photoURL: "assets/images/pp.png"
        // }).then(()=>{
        //   this.updateUserData(fullUser);
        //   return this.user;
        // })
        this.updateUserData(fullUser);
        return this.user;
      })
      .catch(err => {
        console.log('Something went wrong: ', err.message);
      });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    userRef.set(data, { merge: true })
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/login']);
    });
  }
}