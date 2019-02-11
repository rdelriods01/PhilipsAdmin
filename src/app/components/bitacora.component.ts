import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SWOService } from "../services/swo.service";

import { LayoutComponent } from "../components/layout.component";

@Component({
  selector: 'bitacoraC',
  templateUrl: '../views/bitacora.html',
  styleUrls: ['../css/bitacora.css']
})
export class BitacoraComponent {
  inge;
  ops = [];

  displayedColumns: string[] = ['fechaprog', 'swo', 'op', 'cliente', 'equipoModelo', 'equipoSerie', 'actividad', 'falla', 'status'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _swoService: SWOService,
    public _layoutC: LayoutComponent) {
    this.inge = this._layoutC.user.displayName;
    let equipos = this._layoutC.equipos;
    let clientes = this._layoutC.clientes;
    this._swoService.getOrderedSWOs().subscribe(swos => {
      for (let j = 0; j < swos.length; j++) {
        this._swoService.getOPsFSE(swos[j], this.inge).subscribe(ops => {
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
          }
          this.dataSource.data = this.ops;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
