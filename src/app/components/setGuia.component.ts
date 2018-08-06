import { Component, Input} from '@angular/core';

import { SWOService } from "../services/swo.service";

import { LayoutComponent } from "../components/layout.component";

import { IOperacion } from '../models/interfaces';

@Component({
   selector: 'setGuiaC',
   templateUrl: '../views/setGuia.html',
   styleUrls: ['../css/setGuia.css']
})
export class SetGuiaComponent{

    @Input() inge;
    ops=[];
    ordenesAEnviar=[];
    guia='';
    saveDisabled:Boolean=true;

    constructor(public _swoService: SWOService,
                public _layoutC:LayoutComponent
    ){
        let equipos=this._layoutC.equipos;
        let clientes=this._layoutC.clientes;
        this._swoService.getSWOs().subscribe(swos=>{
            for(let j=0;j<swos.length;j++){
                this._swoService.getOPsToSend(swos[j]).subscribe(ops=>{
                    for(let i=0;i<ops.length;i++){
                        for(let k=0;k<equipos.length;k++){
                            if(ops[i].equipoid==equipos[k].id){
                                ops[i].equipoSerie=equipos[k].serie;
                                ops[i].equipoModelo=equipos[k].modelo;
                            }
                        }
                        for(let k=0;k<clientes.length;k++){
                            if(ops[i].clienteid==clientes[k].id){
                                ops[i].cliente=clientes[k].nombre;
                            }
                        }        

                        // Revisar si ya existe la OP
                        for(let k=0;k<this.ops.length;k++){
                            if(ops[i].id==this.ops[k].id){
                                this.ops.splice(k,1)
                            }
                        }
                        this.ops.push(ops[i]);                        
                    }
                });
            }
        })
    }

    setUnset(e, op){
        if(e.checked==true){
            this.ordenesAEnviar.push(op);
        }else{
            for(let i=0; i<this.ordenesAEnviar.length;i++){
                if(op.id==this.ordenesAEnviar[i].id){
                    this.ordenesAEnviar.splice(i,1);
                }
            }
        }        
        if(this.ordenesAEnviar.length>0){
            this.saveDisabled=false;
        }else{
            this.saveDisabled=true;
        }
    }

    back(){
        this.ordenesAEnviar=[];
        this.saveDisabled=true;
    }
    saveProceed(){
        this.ordenesAEnviar.forEach(op=>{
            this._swoService.getOneOP(op.swoid,op.op).subscribe(miop=>{
                miop['guia']=this.guia;
                miop['enviada']=true;
                this._swoService.updateJustOP(miop['swoid'],miop);
            })
        })
        this.ordenesAEnviar=[];
    }

}
