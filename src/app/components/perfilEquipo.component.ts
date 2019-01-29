import { Component, ViewChild } from '@angular/core';
import { StaticSymbol } from '@angular/compiler';
import { ActivatedRoute, Params } from '@angular/router';

import { MatSort, Sort, MatPaginator, PageEvent, MatDialog, MAT_SORT_HEADER_INTL_PROVIDER } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromMatSort, sortRows, fromMatPaginator, paginateRows } from './datasource-utils';

import { IEquipo } from '../models/interfaces'

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

import { NewSwoComponent } from '../components/newSwo.component';
import { NewClienteComponent } from '../components/newCliente.component';
import { NewEquipoComponent } from '../components/newEquipo.component';

@Component({
  selector: 'perfilEquipoC',
  templateUrl: '../views/perfilEquipo.html',
  styleUrls: ['../css/perfilEquipo.css']
})
export class PerfilEquipoComponent {
  user;

  equipo;
  cliente;
  swos;
  ops;
  // Variables para la tabla Clientes
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedSWO$: Observable<any[]>;
  totalRowsSWO$: Observable<number>;
  listaDeSWOsFiltrados;
  swoBuscado;

  constructor(public _route: ActivatedRoute,
    public dialog: MatDialog,
    public _equipoService: EquipoService,
    public _clienteService: ClienteService,
    public _swoService: SWOService,
    public auth: AuthService) {
    this.auth.user.subscribe(us => { this.user = us });
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._equipoService.getUnEquipo(id).subscribe(eq => {
        this.equipo = eq;
        this._clienteService.getUnCliente(this.equipo.cliente).subscribe(cl => {
          this.cliente = cl;
          this._swoService.getSWOsEquipo(id).subscribe(or => {
            this.swos = or;
            this.datosTablaSWOs(this.swos);
          })
        })
      })
    })
  }

  datosTablaSWOs(data) {
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRowsSWO$ = rows$.pipe(map(rows => rows.length));
    this.displayedSWO$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }

  leerOps(id) {
    this._swoService.getOPs(id).subscribe(ops => {
      this.ops = ops;
    })
  }
  agregarSWO() {
    let dialogNewSwo = this.dialog.open(NewSwoComponent);
    dialogNewSwo.componentInstance.oper.op = '10';
    dialogNewSwo.componentInstance.oper.status = 'Programado';
    dialogNewSwo.componentInstance.cliente = this.cliente.nombre;
    dialogNewSwo.componentInstance.equipo = this.equipo.serie;
    dialogNewSwo.componentInstance.swo.cliente = this.cliente.id;
    dialogNewSwo.componentInstance.swo.equipo = this.equipo.id;
  }

  filtrarSWOs() {
    let newSwos = JSON.parse(JSON.stringify(this.swos));
    newSwos.forEach(el => {
      delete el.cliente;
      delete el.equipo;
      delete el.fechafin;
      delete el.fechaop;
    });
    this.listaDeSWOsFiltrados = this.filterAllProperties(newSwos, this.swoBuscado.toLowerCase());
    this.datosTablaSWOs(this.listaDeSWOsFiltrados);
  }

  // FUNCIONES UTILES
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


  // Editar OP
  editarOP(ord, op) {
    let dialogNewSwo = this.dialog.open(NewSwoComponent);
    dialogNewSwo.componentInstance.oper = op;
    dialogNewSwo.componentInstance.swo = ord;
    dialogNewSwo.componentInstance.editFlag = true;
    dialogNewSwo.componentInstance.equipo = this.equipo.serie;
    dialogNewSwo.componentInstance.cliente = this.cliente.nombre;
  }

  eliminarOP(swo, op) {
    let res = confirm('Desea eliminar ésta operación?');
    if (res == true) {
      this._swoService.deleteOP(swo, op);
      alert('Operación eliminada!');
    }
    else {
      alert('Operación no eliminada');
    }
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

  getColor(stat) {
    switch (stat) {
      case 'Concluido':
        return 'white';
      case 'Programado':
        return 'lightblue';
      case 'En espera de refacción':
        return 'lightgoldenrodyellow';
    }
  }
}
