import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


import { MatSort, Sort , MatPaginator, PageEvent, MatDialog, MAT_SORT_HEADER_INTL_PROVIDER} from '@angular/material';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { fromMatSort, sortRows, fromMatPaginator, paginateRows } from './datasource-utils';

import { IEquipo } from '../models/interfaces'

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

import { NewEquipoComponent } from '../components/newEquipo.component';

@Component({
  selector: 'perfilClienteC',
  templateUrl: '../views/perfilCliente.html',
  styleUrls: ['../css/perfilCliente.css']
})
export class PerfilClienteComponent {
    user;

    cliente;
    equipos=[]; 
    swos=[];
    ops;

    // Variables para la tabla Equipos
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedEquipos$:Observable<any[]>;
    totalRowsEquipos$: Observable<number>;
    listaDeEquiposFiltrados;
    equipoBuscado;
    //Variables para la tabla SWOs
    @ViewChild('sortSWOs', {read: MatSort}) sortSWO: MatSort;
    @ViewChild('paginatorSWO', {read:MatPaginator}) paginatorSWO: MatPaginator;
    displayedSWOs$:Observable<any[]>;
    totalRowsSWOs$: Observable<number>;
    listaDeSWOsFiltrados;
    swoBuscado;

    equipoActual = {} as IEquipo;
    displayDerecha='none';

    constructor(public _route:ActivatedRoute, 
                public dialog: MatDialog,
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public _swoService:SWOService,
                public auth: AuthService){
        // let misSwos;
        this.auth.user.subscribe(us=>{this.user=us});
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._clienteService.getUnCliente(id).subscribe(cl=>{
                this.cliente=cl;
                this._equipoService.getEquiposC(this.cliente.id).subscribe(eqs=>{
                    this.equipos=eqs;
                    this.datosTablaEquipos(eqs)
                })
            })
        })
    }
  // Funcion para definir los datos de la tabla EQUIPOS
    datosTablaEquipos(data){
        const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
        const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
        const rows$ = of(data);
        this.totalRowsEquipos$ = rows$.pipe(map(rows => rows.length));
        this.displayedEquipos$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$) );
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
    getSWOsdelEquipo(miE){
        this.equipoActual=miE;
        this.displayDerecha="block";
        this._swoService.getSWOsEquipo(miE.id).subscribe(res=>{
            this.swos=res;
            this.datosTablaSWOs(res);
        })
    }
// Funcion para definir los datos de la tabla EQUIPOS
    datosTablaSWOs(data){    
        const sortEventsSWO$: Observable<Sort> = fromMatSort(this.sortSWO);
        const pageEventsSWO$: Observable<PageEvent> = fromMatPaginator(this.paginatorSWO);
        const rows$ = of(data);
        this.totalRowsSWOs$ = rows$.pipe(map(rows => rows.length));
        this.displayedSWOs$ = rows$.pipe(sortRows(sortEventsSWO$), paginateRows(pageEventsSWO$));
    }
    filtrarSWOs(){
        let newSwos = JSON.parse(JSON.stringify(this.swos));
        newSwos.forEach(el => {
            delete el.cliente;
            delete el.equipo;
            delete el.fechafin;
        });
        this.listaDeSWOsFiltrados=this.filterAllProperties(newSwos, this.swoBuscado.toLowerCase());
        this.datosTablaSWOs(this.listaDeSWOsFiltrados);
    }
    getOPsdelSWO(id){
        this._swoService.getOPs(id).subscribe(ops=>{
            this.ops=ops;
        })
    }
// Funcion para Agregar y Editar Equipo
    agregarEquipo(){
        let dialogNewEquipos= this.dialog.open(NewEquipoComponent);
        dialogNewEquipos.componentInstance.idC=this.cliente.id;
    }
    editarEquipo(eq){
        let dialogEditEquipos= this.dialog.open(NewEquipoComponent);
        dialogEditEquipos.componentInstance.editFlag=true;
        dialogEditEquipos.componentInstance.equipo=eq;
        if(eq.accesorios){
          dialogEditEquipos.componentInstance.accesoriosBoolean=true;
        }
    }

    // FUNCIONES UTILES
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