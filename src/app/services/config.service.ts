import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// import { ICliente } from '../models/interfaces';

@Injectable()

export class ConfigService{
    
    // clientes:ICliente[];
    config;

    constructor( public afs: AngularFirestore){
    } 

    // Agregar Nuevo Tipo de Equipo
    saveTipo(tipo){
        console.log(tipo);
        
        this.afs.collection('config').doc('tipos').update(tipo);
    }
    // Leer toda la configuración
    getConfig() {
        return this.afs.collection('config').snapshotChanges()
        .map(arr => {
        return arr.map(snap => {
            const obj = snap.payload.doc.data();
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            this.config=res;
            return res;
        })
    }
    // Agregar Nuevo Modelo
    saveNew(modelo){
        this.afs.collection('config').doc('tipos').update(modelo);
    }

    // // Leer un cliente en específico   
    // getUnCliente(idC){
    //     return this.afs.collection('clientes').doc(idC).valueChanges();
    // }
    // // Eliminar Cliente
    // deleteCliente(idC){
    //     this.afs.collection('clientes').doc(idC).delete();
    // }
}