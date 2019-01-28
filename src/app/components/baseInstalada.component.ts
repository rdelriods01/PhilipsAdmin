import { Component, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, Sort , MatPaginator, PageEvent, MatDialog, MAT_SORT_HEADER_INTL_PROVIDER} from '@angular/material';

import { Observable  ,  of  } from 'rxjs';
import { map } from 'rxjs/operators';

import { fromMatSort, sortRows, fromMatPaginator, paginateRows } from './datasource-utils';

import { ICliente } from '../models/interfaces';

import { AuthService } from '../services/auth.service';
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
  user;

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
    public dialog: MatDialog,
    public router: Router,
    public auth: AuthService
  ){
    this.auth.user.subscribe(us=>{this.user=us});
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
    let newEquipos=JSON.parse(JSON.stringify(this.equipos));
    newEquipos.forEach(el => {
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
  editarEquipo(idE){
    let eq;
    this.equipos.forEach(el => {
      if(el.id==idE){
        eq=el;
      }
    });
    let dialogEditEquipos= this.dialog.open(NewEquipoComponent);
    dialogEditEquipos.componentInstance.editFlag=true;
    dialogEditEquipos.componentInstance.equipo=eq;
    if(eq.accesorios){
      dialogEditEquipos.componentInstance.accesoriosBoolean=true;
    }
  }
  editarCliente(cl){
    let dialogEditCliente= this.dialog.open(NewClienteComponent);
    dialogEditCliente.componentInstance.editFlag=true;
    dialogEditCliente.componentInstance.cliente=cl;
  }

  eliminarCliente(idC){
    let res= confirm('Desea eliminar este cliente?');
    if(res==true){
      this._clienteService.deleteCliente(idC);
      alert('Cliente eliminado!');
    }else{
      alert('Cliente no eliminado');
    }    
  }
  eliminarEquipo(serie){
    let res= confirm('Desea eliminar esta equipo?');
    if(res==true){
      let idE;
      this.equipos.forEach(el => {
        if(el.serie==serie){
          idE=el.id;
        }
      });
      this._equipoService.deleteEquipo(idE);
      alert('Equipo eliminado!');
    }else{
      alert('Equipo no eliminada');
    }
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
      if(obj.toLowerCase().indexOf(value)>=0){
        filtrado.push(JSON.parse(obj));
      }
    }
    return filtrado;
  }

}