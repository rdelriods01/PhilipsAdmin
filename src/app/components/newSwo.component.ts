import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import * as firebase from 'firebase/app'
import 'firebase/firestore';

import { SWOService } from '../services/swo.service';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../services/auth.service';

import { ISwo, IOperacion } from '../models/interfaces';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'newSwo',
  templateUrl: '../views/newSwo.html',
  styleUrls: ['../css/newSwo.css']
})
export class NewSwoComponent {
  user;

  swo = {} as ISwo;
  oper = {} as IOperacion;

  cliente: string = '';
  equipo: string = '';
  actividades = ['PMAI', 'DIAG', 'CMAI', 'IN02', 'ADMI', 'FCOA'];
  ingenieros = [];

  editFlag = false;

  pickerOptions: FlatpickrOptions = {
    // minDate: 'today'
  };
  pickerFormGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewSwoComponent>,
    public _swoService: SWOService,
    public _configService: ConfigService,
    public auth: AuthService,
  ) {
    this.auth.user.subscribe(us => { this.user = us });
    this.pickerFormGroup = new FormGroup({
      pickerForm: new FormControl()
    });
  }

  ngOnInit() {
    if (this.oper.fechaprog) {
      this.pickerOptions.defaultDate = this.oper.fechaprog.toDate();
    }
    // cargar ingenieros
    this._configService.getFSEs().subscribe(arr => {
      arr.forEach(inge => {
        this.ingenieros.push(inge['displayName'])
      })
    })
  }

  onSubmit() {
    let fecha = this.pickerFormGroup.controls['pickerForm'].value;
    if (fecha) {
      this.oper.fechaprog = firebase.firestore.Timestamp.fromDate(fecha[0]);
      this.swo.status = this.oper.status;
      if (this.oper.actividad == 'PMAI') {
        this.swo.falla = 'Mantenimiento Preventivo';
      }
      this.swo.actividad = this.oper.actividad;
      if (this.user.role == 'fse') {
        this.oper.fse = this.user.displayName;
      }
      this.swo.fse = this.oper.fse;
      if (this.editFlag) {
        if (this.oper.op == '10') {
          this.swo.fechainicio = this.swo.fechaop = this.oper.fechaprog;
        }
        this.swo.fechaop = this.oper.fechaprog;
        this._swoService.updateOP(this.swo, this.oper);
      } else {
        this.swo.fechainicio = this.swo.fechaop = this.oper.fechaprog;
        this._swoService.saveSWO(this.swo, this.oper);
      }
      this.dialogRef.close();
    } else {
      alert('Por favor seleccione la fecha');
    }


  }

  //FIN
}
