import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { ISwo, IOperacion } from '../models/interfaces';

import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { Observable } from '../../../node_modules/rxjs';

@Injectable()

export class SWOService{
    
    swos:ISwo[];

    constructor( public afs: AngularFirestore,
                public _equipoService: EquipoService,
                public _clienteService: ClienteService){
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
    getSWOsFSE(inge){
        return this.afs.collection('swos', ref => ref.where('fse', '==', inge)).snapshotChanges()
        .map( arr => {
            return arr.map(a => {
                const obj = a.payload.doc.data() as ISwo;
                return obj;                
            })
        })
    }

    getOPsFSE(inge){
        let ops=[];
        this.afs.collection('swos').snapshotChanges()
        .subscribe(arr=>{    
            arr.map(a=>{
                let swo= a.payload.doc.data(); 
                this.afs.collection('swos').doc(swo.id).collection('ops', ref => ref.where('fse','==', inge)).snapshotChanges()
                .subscribe(arr=>{ 
                    arr.map(b=>{
                        let op= b.payload.doc.data();
                        this.getUnaSWO(op.swoid).subscribe(swo=>{
                            op.falla=swo['falla'];
                            op.swo=swo['swo']; 
                            op.equipoid=swo['equipo'];
                            this._equipoService.getUnEquipo(op.equipoid).subscribe(eq=>{
                                op.equipoSerie=eq['serie'];
                                op.equipoModelo=eq['modelo'];
                            })
                            op.clienteid=swo['cliente'];
                            this._clienteService.getUnCliente(op.clienteid).subscribe(cl=>{
                                op.cliente=cl['nombre'];
                            })
                            ops.push(op);
                        })
                    })
                })
            })
        })

        return ops;
    }


    // getOPsFSE(inge){
    //     let ops=[];
    //     this.afs.collection('swos').snapshotChanges()
    //     .subscribe(arr=>{    
    //         arr.map(a=>{
    //             let swo= a.payload.doc.data(); 
    //             this.afs.collection('swos').doc(swo.id).collection('ops', ref => ref.where('fse','==', inge)).snapshotChanges()
    //             .subscribe(arr=>{ 
    //                 arr.map(b=>{
    //                     let op= b.payload.doc.data();
    //                     this.getUnaSWO(op.swoid).subscribe(swo=>{
    //                         op.falla=swo['falla'];
    //                         op.swo=swo['swo']; 
    //                         op.equipoid=swo['equipo'];
    //                         this._equipoService.getUnEquipo(op.equipoid).subscribe(eq=>{
    //                             op.equipoSerie=eq['serie'];
    //                             op.equipoModelo=eq['modelo'];
    //                         })
    //                         op.clienteid=swo['cliente'];
    //                         this._clienteService.getUnCliente(op.clienteid).subscribe(cl=>{
    //                             op.cliente=cl['nombre'];
    //                         })
    //                         ops.push(op);
    //                     })
    //                 })
    //             })
    //         })
    //     })

    //     return ops;
    // }
        
    // Leer las OPs de una swo
    getOPs(idSWO){
        return this.afs.collection('swos').doc(idSWO).collection('ops').snapshotChanges()
        .map(arr => {
        return arr.map(snap => {
            const obj = snap.payload.doc.data() as IOperacion;
            return obj;
        });
        })
        .map(res=>{
            // res, ya es un array de objetos
            console.log('Lista de ops OK');
            return res;
        })
    }
    // Nueva OP
    saveOP(swo:ISwo, op:IOperacion){
        this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).set(op);
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

    // Leer una SWO en específico   
    getUnaSWO(idS){
        return this.afs.collection('swos').doc(idS).valueChanges();
    }
    // Actualizar SWO
    updateSWO(swo:ISwo){
        this.afs.collection('swos').doc(swo.id).update(swo);
    }
    // Eliminar SWO
    deleteSWO(idS){
        this.afs.collection('swos').doc(idS).delete();
    }
}