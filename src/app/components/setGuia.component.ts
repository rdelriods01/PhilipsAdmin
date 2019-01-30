import { Component, Input } from '@angular/core';

import { SWOService } from "../services/swo.service";

import { LayoutComponent } from "../components/layout.component";

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

  constructor(public _swoService: SWOService,
    public _layoutC: LayoutComponent
  ) {
    let equipos = this._layoutC.equipos;
    let clientes = this._layoutC.clientes;
    this._swoService.getSWOs().subscribe(swos => {
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
            // Revisar si ya existe la OP
            for (let k = 0; k < this.ops.length; k++) {
              if (ops[i].id == this.ops[k].id) {
                this.ops.splice(k, 1)
              }
            }
            this.ops.push(ops[i]);
            this.saveOps = JSON.parse(JSON.stringify(this.ops));
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
      var obj = JSON.stringify(array[i]);
      if (obj.toLowerCase().indexOf(value) >= 0) {
        filtrado.push(JSON.parse(obj));
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
    this.ordenesAEnviar.forEach(op => {
      this._swoService.getOneOP(op.swoid, op.op).subscribe(miop => {
        miop['guia'] = this.guia;
        miop['enviada'] = true;
        console.log(miop);
        this._swoService.updateJustOP(miop['swoid'], miop);
      })
    })
    for (let i = 0; i < this.ops.length; i++) {
      this.ops[i].checked = false;
    }
    this.allChk = false;
    this.ordenesAEnviar = [];
  }

}
