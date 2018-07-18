import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { IEquipo } from '../models/interfaces'

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

@Component({
  selector: 'perfilClienteC',
  templateUrl: '../views/perfilCliente.html',
  styleUrls: ['../css/perfilCliente.css']
})
export class PerfilClienteComponent {
    user;

    cliente;

    swos;

    ops;

    constructor(public _route:ActivatedRoute, 
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public _swoService:SWOService,
                public auth: AuthService){
        this.auth.user.subscribe(us=>{this.user=us});
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._clienteService.getUnCliente(id).subscribe(cl=>{
                this.cliente=cl;
            })


            // this._equipoService.getUnEquipo(id).subscribe(eq =>{
            //     this.equipo=eq;
            //     console.log(this.equipo);
            //     this._clienteService.getUnCliente(this.equipo.cliente).subscribe(cl=>{
            //         this.cliente=cl;
            //         console.log(this.cliente);
            //         this._swoService.getSWOsEquipo(id).subscribe(or=>{
            //             this.swos=or;
            //             this.datosTablaSWOs(this.swos);
            //         })
            //     })
            // }) 
        })
    }
}