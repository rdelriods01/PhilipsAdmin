import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SWOService } from "../services/swo.service";
import { LayoutComponent } from "../components/layout.component";
import { ICliente } from '../models/interfaces';

@Component({
  selector: 'serviciosClienteC',
  templateUrl: '../views/serviciosCliente.html',
  styleUrls: ['../css/serviciosCliente.css']
})
export class serviciosClienteComponent {

  @Input() cliente: ICliente;
  ops = [];
  equipos;
  clientes;

  displayedColumns: string[] = ['fechaprog', 'swo', 'op', 'cliente', 'equipoModelo', 'equipoSerie', 'actividad', 'falla', 'status', 'firmada', 'enviada', 'recibida'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public _swoService: SWOService,
    public _layoutC: LayoutComponent
  ) {

    this.equipos = this._layoutC.equipos;
    this.clientes = this._layoutC.clientes;
  }

  ngOnInit() {
    this._swoService.getSWOsCliente(this.cliente.id).subscribe(swos => {
      for (let j = 0; j < swos.length; j++) {
        this._swoService.getOPsforClient(swos[j]).subscribe(ops => {
          for (let i = 0; i < ops.length; i++) {
            for (let k = 0; k < this.equipos.length; k++) {
              if (ops[i].equipoid == this.equipos[k].id) {
                ops[i].equipoSerie = this.equipos[k].serie;
                ops[i].equipoModelo = this.equipos[k].modelo;
              }
            }
            for (let k = 0; k < this.clientes.length; k++) {
              if (ops[i].clienteid == this.clientes[k].id) {
                ops[i].cliente = this.clientes[k].nombre;
              }
            }

            this.ops.push(ops[i]);
          }
          console.log(this.ops);
          this.dataSource.data = this.ops;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    })
  }
}
