import { Component, ViewChild } from '@angular/core';
import { StaticSymbol } from '@angular/compiler';
import { ActivatedRoute, Params } from '@angular/router';

import { MatSort, Sort , MatDialog, MAT_SORT_HEADER_INTL_PROVIDER} from '@angular/material';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { fromMatSort, sortRows, } from './datasource-utils';

import { IEquipo } from '../models/interfaces'

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

import { NewSwoComponent } from '../components/newSwo.component';

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
    displayedSWO$:Observable<any[]>;
    listaDeSWOsFiltrados;
    swoBuscado;

    constructor(public _route:ActivatedRoute, 
                public dialog: MatDialog,
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public _swoService:SWOService,
                public auth: AuthService){
        this.auth.user.subscribe(us=>{this.user=us});
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._equipoService.getUnEquipo(id).subscribe(eq =>{
                this.equipo=eq;
                console.log(this.equipo);
                this._clienteService.getUnCliente(this.equipo.cliente).subscribe(cl=>{
                    this.cliente=cl;
                    console.log(this.cliente);
                    this._swoService.getSWOsEquipo(id).subscribe(or=>{
                        this.swos=or;
                        this.datosTablaSWOs(this.swos);
                    })
                })
            }) 
        })
    }

    datosTablaSWOs(data){
        const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
        const rows$ = of(data);
        this.displayedSWO$ = rows$.pipe(sortRows(sortEvents$));
    }

    leerOps(id){
        this._swoService.getOPs(id).subscribe(ops=>{
            this.ops=ops;
            console.log(ops);
        })
    }
    agregarSWO(){
        let dialogNewSwo= this.dialog.open(NewSwoComponent);
        dialogNewSwo.componentInstance.oper.op='10';
        dialogNewSwo.componentInstance.oper.status='Programado';
        dialogNewSwo.componentInstance.cliente=this.cliente.nombre;
        dialogNewSwo.componentInstance.equipo=this.equipo.serie; 
        dialogNewSwo.componentInstance.swo.cliente=this.cliente.id;
        dialogNewSwo.componentInstance.swo.equipo=this.equipo.id;    
    }

    filtrarSWOs(){
        console.log('Holi al filtro');
    }


    // Editar OP
    editarOP(ord,op){
        let dialogNewSwo = this.dialog.open(NewSwoComponent);
        dialogNewSwo.componentInstance.oper=op;
        dialogNewSwo.componentInstance.swo=ord;
        dialogNewSwo.componentInstance.editFlag=true;
        dialogNewSwo.componentInstance.equipo=this.equipo.serie; 
        dialogNewSwo.componentInstance.cliente=this.cliente.nombre;

    }
    

    getColor(stat){
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