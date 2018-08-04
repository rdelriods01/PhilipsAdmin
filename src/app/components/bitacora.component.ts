import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { SWOService } from "../services/swo.service";

import { IOperacion } from '../models/interfaces'

import { LayoutComponent } from "../components/layout.component";

@Component({
  selector: 'bitacoraC',
  templateUrl: '../views/bitacora.html',
  styleUrls: ['../css/bitacora.css']
})
export class BitacoraComponent {

    ops=[];

    displayedColumns: string[] = ['fechaprog', 'swo', 'op', 'cliente', 'equipoModelo', 'equipoSerie', 'actividad', 'falla', 'status'];

    dataSource= new MatTableDataSource();     

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor( public _swoService: SWOService,
       public _layoutC:LayoutComponent){
        this.ops=this._layoutC.myOPsFSE;
        console.log(this.ops);
      }

    sendEl(el){
      console.log(el);
    }
    ngAfterViewInit() {
      this.dataSource= new MatTableDataSource(this.ops);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;  
    }
        
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
}
