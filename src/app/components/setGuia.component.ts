import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SWOService } from "../services/swo.service";
import * as firebase from 'firebase/app'

import { LayoutComponent } from "../components/layout.component";
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'setGuiaC',
  templateUrl: '../views/setGuia.html',
  styleUrls: ['../css/setGuia.css']
})
export class SetGuiaComponent {

  ops = [];
  saveOps = [];
  ordenesAEnviar = [];
  guia = '';
  saveDisabled: Boolean = true;
  showProceedDetails;
  allChk = false;

  opBuscada = "";

  pickerOptions: FlatpickrOptions = {
    // minDate: 'today'
  };
  pickerFormGroup: FormGroup;

  constructor(public _swoService: SWOService,
    public _layoutC: LayoutComponent,
    public router: Router
  ) {
    let equipos = this._layoutC.equipos;
    let clientes = this._layoutC.clientes;
    this.pickerFormGroup = new FormGroup({
      pickerForm: new FormControl()
    });
    this._swoService.getOrderedSWOs().subscribe(swos => {
      for (let j = 0; j < swos.length; j++) {
        this._swoService.getOPsToSend(swos[j]).subscribe(ops => {
          for (let i = 0; i < ops.length; i++) {
            for (let k = 0; k < equipos.length; k++) {
              if (ops[i].equipoid == equipos[k].id) {
                ops[i].equipoSerie = equipos[k].serie;
                ops[i].equipoModelo = equipos[k].modelo;
              }
            }
            for (let k = 0; k < clientes.length; k++) {
              if (ops[i].clienteid == clientes[k].id) {
                ops[i].cliente = clientes[k].nombre;
              }
            }
            this.ops.push(ops[i]);
            this.saveOps = [...this.ops];
          }
        });
      }
    })
  }

  filtrarOPs() {
    this.ops = this.filterAllProperties(this.saveOps, this.opBuscada.toLowerCase());
    for (let i = 0; i < this.ops.length; i++) {
      this.ops[i].checked = false;
    }
    this.allChk = false;
    this.ordenesAEnviar = [];
  }
  filterAllProperties(array, value) {
    var filtrado = [];
    for (var i = 0; i < array.length; i++) {
      const fecfin = array[i].fechafin;
      var obj = JSON.stringify(array[i]);
      if (obj.toLowerCase().indexOf(value) >= 0) {
        let newobj = JSON.parse(obj)
        newobj.fechafin = fecfin;
        filtrado.push(newobj);
      }
    }
    return filtrado;
  }

  setUnset(e, op) {
    if (e.checked == true) {
      op.checked = true;
      this.ordenesAEnviar.push(op);
    } else {
      op.checked == false;
      for (let i = 0; i < this.ordenesAEnviar.length; i++) {
        if (op.id == this.ordenesAEnviar[i].id) {
          this.ordenesAEnviar.splice(i, 1);
        }
      }
    }
    if (this.ordenesAEnviar.length > 0) {
      this.saveDisabled = false;
    } else {
      this.saveDisabled = true;
    }
  }
  toggleAllChecked() {
    this.allChk = !this.allChk;
    if (this.allChk == true) {
      for (let i = 0; i < this.ops.length; i++) {
        this.ops[i].checked = true;
      }
      this.ordenesAEnviar = JSON.parse(JSON.stringify(this.ops));
      this.saveDisabled = false;
    } else {
      for (let i = 0; i < this.ops.length; i++) {
        this.ops[i].checked = false;
      }
      this.ordenesAEnviar = [];
      this.saveDisabled = true;
    }
  }

  back() {
    for (let i = 0; i < this.ops.length; i++) {
      this.ops[i].checked = false;
    }
    this.allChk = false;
    this.ordenesAEnviar = [];
    this.saveDisabled = true;
  }

  saveProceed() {
    let fecha = this.pickerFormGroup.controls['pickerForm'].value;
    if (fecha) {
      this.ordenesAEnviar.map(op => {
        delete op.checked
        delete op.cliente
        delete op.clienteid
        delete op.equipoModelo
        delete op.equipoSerie
        delete op.equipoid
        delete op.swo
        op['guia'] = this.guia;
        op['enviada'] = true;
        op['fechaenviada'] = firebase.firestore.Timestamp.fromDate(fecha[0]);
        this._swoService.updateJustOP(op['swoid'], op).then(res => {
          console.log(op);
        })
        // this._swoService.getOneOP(op.swoid, op.op).subscribe(miop => {
        //   miop['guia'] = this.guia;
        //   miop['enviada'] = true;
        //   miop['fechaenviada'] = firebase.firestore.Timestamp.fromDate(fecha[0]);
        //   this._swoService.updateJustOP(miop['swoid'], miop).then(res => {
        //     console.log(op['swo'] + '-' + op['op'] + ' enviada');
        //   })
        // })
      })
      for (let i = 0; i < this.ops.length; i++) {
        this.ops[i].checked = false;
      }
      this.allChk = false;
      this.ordenesAEnviar = [];
      this.router.navigate(['/']);
    } else {
      alert('Por favor seleccione la fecha');
    }
  }
}
