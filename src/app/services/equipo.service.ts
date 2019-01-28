import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IEquipo } from '../models/interfaces';

@Injectable()

export class EquipoService {

  equipos: IEquipo[];

  constructor(public afs: AngularFirestore) {
  }

  // Agregar nuevo equipo
  saveEquipo(equipo: IEquipo) {
    equipo.id = this.afs.createId();
    this.afs.collection('equipos').doc(equipo.id).set(equipo);
    console.log(this.getUnEquipo(equipo.id))
  }
  // Leer todos los equipos
  getEquipos() {
    return this.afs.collection('equipos').valueChanges()
    // .map(arr => {
    //   return arr.map(snap => {
    //     const obj = snap.payload.doc.data() as IEquipo;
    //     // obj.id = snap.payload.doc.id;
    //     return obj;
    //   });
    // })
    // .map(res => {
    //   this.equipos = res;
    //   return res;
    // });
  }

  // Leer equipos de un cliente
  getEquiposC(idC) {
    return this.afs.collection('equipos', ref => ref.where('cliente', '==', idC)).valueChanges()
    // .map(arr => {
    //   return arr.map(a => {
    //     const obj = a.payload.doc.data() as IEquipo;
    //     return obj;
    //   })
    // })
  }
  // Leer un equipo en específico
  getUnEquipo(idE) {
    return this.afs.collection('equipos').doc(idE).valueChanges()
  }
  // Actualizar Equipo
  updateEquipo(eq: IEquipo) {
    this.afs.collection('equipos').doc(eq.id).update(eq);
  }
  // Eliminar Equipo
  deleteEquipo(idE) {
    this.afs.collection('equipos').doc(idE).delete();
  }

}
