import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()

export class ConfigService{
    
    config;

    constructor( public afs: AngularFirestore){
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

    // Agregar Nuevo Tipo de Equipo
    saveTipo(tipo){
        console.log(tipo);        
        this.afs.collection('config').doc('tipos').update(tipo);
    }
    // Agregar Nuevo Modelo
    saveNew(modelo){
        this.afs.collection('config').doc('tipos').update(modelo);
    }

    // Leer usuarios que sean FSE y pasarlos a un array
    getFSEs(){
        return this.afs.collection('users', ref => ref.where('role', '==', 'fse')).snapshotChanges()
        .map( arr => {
            return arr.map(a => {
                const obj = a.payload.doc.data();
                return obj;                
            })
        })
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