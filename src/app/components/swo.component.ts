import { Component } from '@angular/core';
import { FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { SWOService } from '../services/swo.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { IOperacion } from '../models/interfaces';

import { NewOPComponent } from '../components/newOP.component';
import { NewSwoComponent } from '../components/newSwo.component';
import { NewClienteComponent } from '../components/newCliente.component';
import { NewEquipoComponent } from '../components/newEquipo.component';

@Component({
  selector: 'SwoC',
  templateUrl: '../views/swo.html',
  styleUrls: ['../css/swo.css']
})
export class SwoComponent {
  user;

  swo;
  ops = [];
  cliente;
  equipo;

  showProceedDetails = false;
  showRefas = false;

  operando: Boolean;
  status: string = '';
  statuses = ['Concluido', 'En espera de refacción', 'Pendiente'];
  resultados: string = '';
  observaciones: string = '';
  duracion: number;
  fechafin: Date;
  refas: any;
  firmada: Boolean = false;
  enviada: Boolean = false;
  guia: string;

  // Variables para subirfoto
  uploadPercent: Observable<number>;
  showProgressBar = false;

  constructor(public _route: ActivatedRoute,
    public _equipoService: EquipoService,
    public _clienteService: ClienteService,
    public _swoService: SWOService,
    public dialog: MatDialog,
    public auth: AuthService,
    public storage: AngularFireStorage) {
    this.auth.user.subscribe(us => { this.user = us });
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._swoService.getUnaSWO(id).subscribe(sw => {
        this.swo = sw;
        this._clienteService.getUnCliente(this.swo.cliente).subscribe(cl => {
          this.cliente = cl;
          this._equipoService.getUnEquipo(this.swo.equipo).subscribe(eq => {
            this.equipo = eq;
            this._swoService.getOPs(id).subscribe(ops => {
              this.ops = ops;
              this.uploadPercent = of(0)
            })
          })
        })
      })
    })
    this.fechafin = new Date();
    this.refas = {
      refa1: ['', '', ''],
      refa2: ['', '', ''],
      refa3: ['', '', ''],
      refa4: ['', '', ''],
      refa5: ['', '', ''],
      refa6: ['', '', ''],
      refa7: ['', '', ''],
      refa8: ['', '', ''],
      refa9: ['', '', '']
    };
  }
  changeFecha(op) {
    let dialogNewSwo = this.dialog.open(NewSwoComponent);
    dialogNewSwo.componentInstance.oper = op;
    dialogNewSwo.componentInstance.swo = this.swo;
    dialogNewSwo.componentInstance.editFlag = true;
    dialogNewSwo.componentInstance.equipo = this.equipo.serie;
    dialogNewSwo.componentInstance.cliente = this.cliente.nombre;
  }
  proceed() {
    if (this.swo.actividad == 'PMAI') {
      this.operando = true;
      this.status = 'Concluido';
      this.resultados = 'Se revisa equipo. Se realiza seguimiento de checklist anexo. Se comprueba funcionamiento general del equipo según especificaciones técnicas del fabricante. Se realiza limpieza externa e interna.';
      this.observaciones = 'El equipo queda operando Correctamente';
      this.duracion = 1;
    }
  }

  saveProceed(oper) {
    this.swo.status = this.status;
    if (this.status == 'Concluido') {
      this.swo.fechafin = new Date();
    }
    oper.status = 'Concluido';
    oper.fechafin = new Date();
    oper.operando = this.operando;
    oper.resultados = this.resultados;
    oper.observaciones = this.observaciones;
    oper.duracion = this.duracion;
    if (this.showRefas) {
      oper.refacciones = this.refas;
    }
    this._swoService.updateOP(this.swo, oper);
  }

  firmarOP(operF) {
    console.log(this.firmada);
    console.log(operF);
    operF.firmada = this.firmada;
    this._swoService.updateOP(this.swo, operF);
    this.firmada = false;
  }
  enviarOP(oper) {
    console.log(this.enviada);
    oper.enviada = this.enviada;
    oper.guia = this.guia;
    this._swoService.updateOP(this.swo, oper);
    this.enviada = false;
  }
  nuevaOP() {
    console.log('Nueva OP!!');
    let newOP = {} as IOperacion;
    newOP.op = String(Number(this.ops[this.ops.length - 1].op) + 10);
    newOP.status = 'Programado';
    let dialogNewSwo = this.dialog.open(NewOPComponent);
    dialogNewSwo.componentInstance.oper = newOP;
    dialogNewSwo.componentInstance.swo = this.swo;
  }

  print() {
    window.print();
  }


  subirFoto(event, op) {
    console.log(op);
    this.showProgressBar = true;
    const file = event.target.files[0];
    const filePath = this.swo.swo + '-' + op.op;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // download url
    // task.downloadURL().subscribe(url=>{
    //     console.log(url);
    //     op.fotoSwoURL=url;
    //     this._swoService.updateOP(this.swo,op);
    //     this.showProgressBar=false;
    // });

    // new download url
    task.snapshotChanges().pipe(
      finalize(() => {
        op.fotoSwoURL = fileRef.getDownloadURL();
        this._swoService.updateOP(this.swo, op);
        this.showProgressBar = false;
      })
    )
  }
  verFoto(url) {
    window.open(url);
  }
  editarEquipo() {
    let dialogEditEquipos = this.dialog.open(NewEquipoComponent);
    dialogEditEquipos.componentInstance.editFlag = true;
    dialogEditEquipos.componentInstance.equipo = this.equipo;
    if (this.equipo.accesorios) {
      dialogEditEquipos.componentInstance.accesoriosBoolean = true;
    }
  }

  editarCliente() {
    let dialogEditCliente = this.dialog.open(NewClienteComponent);
    dialogEditCliente.componentInstance.editFlag = true;
    dialogEditCliente.componentInstance.cliente = this.cliente;
  }

}
