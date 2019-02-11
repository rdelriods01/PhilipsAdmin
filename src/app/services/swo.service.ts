import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

import { ISwo, IOperacion } from '../models/interfaces';

import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { LayoutComponent } from "../components/layout.component";
import { map } from 'rxjs/operators';


@Injectable()

export class SWOService {

  swos: ISwo[];

  constructor(public afs: AngularFirestore,
    public _equipoService: EquipoService,
    public _clienteService: ClienteService,
    // public _layoutC: LayoutComponent
  ) {
  }

  // Agregar Nueva SWO y primer OP (10)
  saveSWO(swo: ISwo, op: IOperacion) {
    swo.id = this.afs.createId();
    op.swoid = swo.id;
    op.firmada = false;
    op.enviada = false;
    op.recibida = false;
    this.afs.collection('swos').doc(swo.id).set(swo);
    this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).set(op);
  }
  // Nueva OP en la SWO
  saveOP(swo: ISwo, op: IOperacion) {
    op.id = this.afs.createId();
    op.swoid = swo.id;
    op.firmada = false;
    op.enviada = false;
    op.recibida = false;
    this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).set(op);
  }
  // Actualizar SWO
  updateSWO(swo: ISwo) {
    this.afs.collection('swos').doc(swo.id).update(swo);
  }
  // Actualizar OP
  updateOP(swo: ISwo, op: IOperacion) {
    this.afs.collection('swos').doc(swo.id).update(swo);
    this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).update(op);
  }
  // Eliminar SWO
  deleteSWO(idS) {
    this.afs.collection('swos').doc(idS).delete();
  }
  // Eliminar OP
  deleteOP(swo, op) {
    if (op.op == '10') {
      this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).delete();
      this.deleteSWO(swo.id);
    } else {
      this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).delete();
    }
  }
  // =========================================SWO QUERYS=====================================
  // Leer todas los swos (TODO: filtrar por la zona)
  getSWOs() {
    return this.afs.collection('swos').valueChanges()
  }
  // Leer swos de un cliente
  getSWOsCliente(idC) {
    return this.afs.collection('swos', ref => ref.where('cliente', '==', idC).orderBy('fechainicio', "desc")).valueChanges()
    // .map( arr => {
    //     return arr.map(a => {
    //         const obj = a.payload.doc.data() as ISwo;
    //         return obj;
    //     })
    // })
  }
  // Leer swos de un equipo
  getSWOsEquipo(idS) {
    return this.afs.collection('swos', ref => ref.where('equipo', '==', idS)).valueChanges()
    // .map( arr => {
    //     return arr.map(a => {
    //         const obj = a.payload.doc.data() as ISwo;
    //         return obj;
    //     })
    // })
  }
  // Leer swos de un fse ,
  getSWOsFSE(inge) {
    return this.afs.collection('swos', ref => ref.where('fse', '==', inge)).valueChanges()
    // .map( arr => {
    //     return arr.map(a => {
    //         const obj = a.payload.doc.data() as ISwo;
    //         return obj;
    //     })
    // })
  }
  // Leer SWOs ordenadas
  getOrderedSWOs() {
    return this.afs.collection('swos', ref => ref.orderBy('fechainicio', "desc")).valueChanges()
    // .pipe(
    //   map( arr => {
    //     return arr.map(a => {
    //         const obj = a.payload.doc.data() as ISwo;
    //         return obj;
    //     })
    // })
    // )
  }
  // Leer una SWO en específico
  getUnaSWO(idS) {
    return this.afs.collection('swos').doc(idS).valueChanges();
  }

  // ==================================OP QUERYS==========================================
  // Leer las OPs de un FSE
  getOPsFSE(swo, inge) {
    return this.afs.collection('swos').doc(swo.id).collection('ops', ref => ref.where('fse', '==', inge).where('status', '==', 'Concluido')).snapshotChanges()
      .pipe(
        map(arr => {
          return arr.map(b => {
            let op = b.payload.doc.data();
            // this.updateOP(swo,op)
            op.falla = swo.falla;
            op.swo = swo.swo;
            op.equipoid = swo.equipo;
            op.clienteid = swo.cliente;
            return op;
          })
        })
      )
  }
  getOPsToSend(swo) {
    return this.afs.collection('swos').doc(swo.id).collection('ops', ref => ref.where('firmada', '==', true).where('enviada', '==', false)).snapshotChanges()
      .pipe(
        map(arr => {
          return arr.map(b => {
            let op = b.payload.doc.data();
            op.swo = swo.swo;
            op.equipoid = swo.equipo;
            op.clienteid = swo.cliente;
            // console.log(op);
            return op;
          })
        })
      )
  }
  getOPsToReceive(swo) {
    return this.afs.collection('swos').doc(swo.id).collection('ops', ref => ref.where('enviada', '==', true).where('recibida', '==', false)).snapshotChanges()
      .pipe(
        map(arr => {
          return arr.map(b => {
            let op = b.payload.doc.data();
            op.swo = swo.swo;
            op.equipoid = swo.equipo;
            op.clienteid = swo.cliente;
            // console.log(op);
            return op;
          })
        })
      )
  }


  // Leer las OPs de una SWO
  getOPs(swoid) {
    return this.afs.collection('swos').doc(swoid).collection('ops').valueChanges()
    // .map(arr => {
    // return arr.map(snap => {
    //     const obj = snap.payload.doc.data() as IOperacion;
    //     return obj;
    // });
    // })
    // .map(res=>{
    //     return res;
    // })
  }
  getOPsforClient(swo) {
    return this.afs.collection('swos').doc(swo.id).collection('ops').snapshotChanges()
      .pipe(
        map(arr => {
          return arr.map(b => {
            let op = b.payload.doc.data();
            // this.updateOP(swo,op)
            op.falla = swo.falla;
            op.swo = swo.swo;
            op.equipoid = swo.equipo;
            op.clienteid = swo.cliente;
            return op;
          })
        })
      )
  }

  // Obtener los datos de una OP en especifico de una SWO
  // getUnaOP(swo:ISwo, op:IOperacion){
  //     this.afs.collection('swos').doc(swo.id).collection('ops').doc(op.op).valueChanges();
  // }
  getOneOP(swoId, op) {
    return this.afs.collection('swos').doc(swoId).collection('ops').doc(op).valueChanges();
  }
  updateJustOP(swoId, op) {
    return this.afs.collection('swos').doc(swoId).collection('ops').doc(op.op).update(op);
  }



}
