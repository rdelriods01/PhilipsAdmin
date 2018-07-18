import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

// import { Observable } from 'rxjs/Observable';

import { ICliente } from '../models/interfaces';

@Injectable()

export class ClienteService{
    
    clientes:ICliente[];

    constructor( public afs: AngularFirestore){
    } 

    // Agregar Nuevo Cliente
    saveCliente (cliente:ICliente){
        cliente.id=this.afs.createId();
        this.afs.collection('clientes').doc(cliente.id).set(cliente);
    }
    // Leer todos los clientes
    getClientes() {
        return this.afs.collection('clientes').snapshotChanges()
        .map(arr => {
            console.log(arr);
            
        return arr.map(snap => {
            const obj = snap.payload.doc.data() as ICliente;
            // obj.id = snap.payload.doc.id;
            console.log(obj);
            
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            console.log(res);
            
            this.clientes=res;
            return res;
        })
    }
    // Leer un cliente en específico   
    getUnCliente(idC){
        return this.afs.collection('clientes').doc(idC).valueChanges();
    }
    // Actualizar Equipo
    updateCliente(cl:ICliente){
        this.afs.collection('clientes').doc(cl.id).update(cl);
    }
    // Eliminar Cliente
    deleteCliente(idC){
        this.afs.collection('clientes').doc(idC).delete();
    }
}