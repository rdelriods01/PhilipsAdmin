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
        return arr.map(snap => {
            const obj = snap.payload.doc.data() as ICliente;
            // obj.id = snap.payload.doc.id;
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            this.clientes=res;
            console.log('Lista de clientes OK');
            return res;
        })
    }

    deleteCliente(idC){
        this.afs.collection('clientes').doc(idC).delete();
    }
}