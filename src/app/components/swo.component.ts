import { Component} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SWOService } from '../services/swo.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { ISwo, ICliente, IEquipo, IOperacion } from '../models/interfaces';

@Component({
   selector: 'SwoC',
   templateUrl: '../views/swo.html',
   styleUrls: ['../css/swo.css']
})
export class SwoComponent{

    swo;
    ops;
    cliente;
    equipo;
    

    constructor(public _route:ActivatedRoute, 
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public _swoService:SWOService){
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._swoService.getUnaSWO(id).subscribe(sw =>{
                this.swo=sw;
                console.log(this.swo);
                this._clienteService.getUnCliente(this.swo.cliente).subscribe(cl=>{
                    this.cliente=cl;
                    console.log(this.cliente);
                    this._equipoService.getUnEquipo(this.swo.equipo).subscribe(eq=>{
                        this.equipo=eq;
                        console.log(this.equipo);
                        this._swoService.getOPs(id).subscribe(ops=>{
                            this.ops=ops;
                            console.log(this.ops);
                        })
                        // this.datosTablaSWOs(this.swos);
                    })
                })
            }) 
        })
}

}
