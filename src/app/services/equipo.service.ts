import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';

import { IEquipo } from '../models/interfaces';

@Injectable()

export class EquipoService{
    
    equipos:IEquipo[];

    constructor( public afs: AngularFirestore){
    } 

    // Agregar nuevo equipo
    saveEquipo (equipo:IEquipo){
        equipo.id=this.afs.createId();
        this.afs.collection('equipos').doc(equipo.id).set(equipo);
    }
    // Leer todos los equipos
    getEquipos() {
        return this.afs.collection('equipos').snapshotChanges()
            .map(arr => {
            return arr.map(snap => {
                const obj = snap.payload.doc.data() as IEquipo;
                // obj.id = snap.payload.doc.id;
                return obj;
            });
            })
            .map(res => {
            this.equipos = res;
            console.log('lista de equipos OK');
            return res;
            });
    }

    // Leer equipos de un cliente
    getEquiposC(idC){
        return this.afs.collection('equipos', ref => ref.where('cliente', '==', idC)).snapshotChanges()
        .map( arr => {
            return arr.map(a => {
                const obj = a.payload.doc.data() as IEquipo;
                return obj;                
            })
        })
    }

    // Eliminar Equipo
    deleteEquipo(idE){
        this.afs.collection('equipos').doc(idE).delete();
    }

}