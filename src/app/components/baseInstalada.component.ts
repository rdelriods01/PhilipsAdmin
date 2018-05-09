import { Component, ChangeDetectionStrategy, OnInit, ViewChild} from '@angular/core';

import { MatSort, Sort , MatPaginator, PageEvent, MatDialog, MAT_SORT_HEADER_INTL_PROVIDER} from '@angular/material';

import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { fromMatSort, sortRows, fromMatPaginator, paginateRows } from './datasource-utils';

import { ICliente } from '../models/interfaces'

import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { NewClienteComponent } from '../components/newCliente.component';
import { NewEquipoComponent } from '../components/newEquipo.component';

@Component({
  selector: 'baseInstaladaC',
  templateUrl: '../views/baseInstalada.html',
  styleUrls: ['../css/baseInstalada.css']
})
export class BaseInstaladaComponent {

  clientes:any=[];
  equipos:any=[];

  // Variables para la tabla Clientes
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedClientes$:Observable<any[]>;
  totalRowsClientes$: Observable<number>;
  listaDeClientesFiltrados;
  clienteBuscado;
  // Variables para la tabla Equipos
  @ViewChild('sortEquipos', {read: MatSort}) sortE: MatSort;
  @ViewChild('paginatorE', {read:MatPaginator}) paginatorE: MatPaginator;
  displayedEquipos$:Observable<any[]>;
  totalRowsEquipos$: Observable<number>;
  listaDeEquiposFiltrados;
  equipoBuscado;


  clienteActual = {} as ICliente;
  displayDerecha='none';

  constructor( 
    public _clienteService:ClienteService,
    public _equipoService:EquipoService,
    public dialog: MatDialog
  ){
    this._clienteService.getClientes().subscribe(res=>{
      this.clientes=res;
      this.datosTablaClientes(res);
    })
  }

  // Funcion para definir los datos de la tabla CLIENTES
datosTablaClientes(data){
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRowsClientes$ = rows$.pipe(map(rows => rows.length));
    this.displayedClientes$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }

  // Funciones para buscar en la tabla CLIENTES
  filtrarClientes(){
    this.listaDeClientesFiltrados=this.filterByProperty(this.clientes,"nombre",this.clienteBuscado.toLowerCase());
    this.datosTablaClientes(this.listaDeClientesFiltrados);
  }
  // Funcion para buscar los EQUIPOS
  getEquiposdelCliente(idC){
    this.clienteActual=idC;
    this.displayDerecha='block';
    this._equipoService.getEquiposC(idC.id).subscribe(res=>{
      this.equipos=res;
      this.datosTablaEquipos(res);
    })
  }
  // Funcion para definir los datos de la tabla EQUIPOS
  datosTablaEquipos(data){
    const sortEventsE$: Observable<Sort> = fromMatSort(this.sortE);
    const pageEventsE$: Observable<PageEvent> = fromMatPaginator(this.paginatorE);
    const rows$ = of(data);
    this.totalRowsEquipos$ = rows$.pipe(map(rows => rows.length));
    this.displayedEquipos$ = rows$.pipe(sortRows(sortEventsE$), paginateRows(pageEventsE$));
  }
  filtrarEquipos(){
    // TODO, ver como poder filtrar en todos los parametros (tipo, serie, modelo) ya 08-05-18
    // TODO, ver como poder eliminar propiedades del objeto (ej, quitar prop cliente, id) para filtrar solo por (tipo, serie, modelo)
    let newEquipos=JSON.parse(JSON.stringify(this.equipos));
    newEquipos.forEach(el => {
      delete el.id;
      delete el.cliente;
      delete el.ubicacion;
      delete el.sw;
    });
    this.listaDeEquiposFiltrados=this.filterAllProperties(newEquipos,this.equipoBuscado.toLowerCase());
    this.datosTablaEquipos(this.listaDeEquiposFiltrados);
  }






  agregarCliente(){
    this.dialog.open(NewClienteComponent);
  }
  agregarEquipo(){
    let dialogNewEquipos= this.dialog.open(NewEquipoComponent);
    dialogNewEquipos.componentInstance.idC=this.clienteActual.id;
  }
  eliminarCliente(idC){
    this._clienteService.deleteCliente(idC);
  }
  eliminarEquipo(idE){
    this._equipoService.deleteEquipo(idE);
  }
  // FUNCIONES UTILES
  filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){
        var obj = array[i];
        if(obj[prop].toLowerCase().indexOf(value)>=0){
                filtered.push(obj);
        }
    }   
    return filtered;
  }

  filterAllProperties(array,value){
    var filtrado = [];
    for (var i=0; i<array.length;i++){
      var obj=JSON.stringify(array[i]);
      // console.log(obj);      
      if(obj.toLowerCase().indexOf(value)>=0){
        filtrado.push(JSON.parse(obj));
      }
    }
    // console.log(filtrado);   
    return filtrado;
  }

}