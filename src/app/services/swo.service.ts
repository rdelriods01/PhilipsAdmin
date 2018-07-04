import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { ISwo, IOperacion } from '../models/interfaces';

@Injectable()

export class SWOService{
    
    swos:ISwo[];

    constructor( public afs: AngularFirestore){
    } 

    // Agregar Nueva SWO
    saveSWO (swo:ISwo, op:IOperacion){
        swo.id=this.afs.createId();
        this.afs.collection('swos').doc(swo.id).set(swo);
        this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).set(op);
    }
    // Leer todos los swos
    getSWOs() {
        return this.afs.collection('swos').snapshotChanges()
        .map(arr => {
        return arr.map(snap => {
            const obj = snap.payload.doc.data() as ISwo;
            // obj.id = snap.payload.doc.id;
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            this.swos=res;
            console.log('Lista de swos OK');
            return res;
        })
    }
    // Leer swos de un cliente
    getSWOsCliente(idS){
        return this.afs.collection('swos', ref => ref.where('cliente', '==', idS)).snapshotChanges()
        .map( arr => {
            return arr.map(a => {
                const obj = a.payload.doc.data() as ISwo;
                return obj;                
            })
        })
    }
    // Leer swos de un equipo
    getSWOsEquipo(idS){
        return this.afs.collection('swos', ref => ref.where('equipo', '==', idS)).snapshotChanges()
        .map( arr => {
            return arr.map(a => {
                const obj = a.payload.doc.data() as ISwo;
                return obj;                
            })
        })
    }
    // Leer swos de hoy
    // getSWOsHoy(){
    //     let hoy=new Date();
    //     console.log(hoy);
        
    // }
    // Leer las OPs de una swo
    getOPs(idS){
        return this.afs.collection('swos').doc(idS).collection('ops').snapshotChanges()
        .map(arr => {
        return arr.map(snap => {
            const obj = snap.payload.doc.data() as IOperacion;
            // obj.id = snap.payload.doc.id;
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            console.log('Lista de ops OK');
            return res;
        })
    }
    // Obtener los datos de una OP en especifico de una SWO
    getUnaOP(swo:ISwo, op:IOperacion){
        this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).valueChanges();
    }
    // Actualizar OP
    updateOP(swo:ISwo, op:IOperacion){
        this.afs.collection('swos').doc(swo.id).update(swo);
        this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).update(op);
    }

    // Leer un cliente en específico   
    getUnaSWO(idS){
        return this.afs.collection('swos').doc(idS).valueChanges();
    }
    // Actualizar SWO

    deleteSWO(idS){
        this.afs.collection('swos').doc(idS).delete();
    }
}