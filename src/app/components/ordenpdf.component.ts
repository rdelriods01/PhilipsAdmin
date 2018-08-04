import { Component, Input} from '@angular/core';

import { ISwo, ICliente, IEquipo, IOperacion } from '../models/interfaces';

@Component({
   selector: 'ordenpdfC',
   templateUrl: '../views/ordenpdf.html',
   styleUrls: ['../css/ordenpdf.css']
})
export class OrdenPDFComponent{

    @Input() swo: ISwo;
    @Input() op:IOperacion;
    @Input() cliente: ICliente;
    @Input() equipo: IEquipo;

    descAct:string='';

    ngOnChanges(){
        if(!this.op.refacciones){           
            this.op.refacciones={refa1:['','',''],
            refa2:['','',''],
            refa3:['','',''],
            refa4:['','',''],
            refa5:['','',''],
            refa6:['','',''],
            refa7:['','',''],
            refa8:['','',''],
            refa9:['','','']};
        }
        console.log(this.op);
        
        if(this.op.actividad=='PMAI'){this.descAct='Preventivo'}
        if(this.op.actividad=='CMAI'){this.descAct='Correctivo'}
        if(this.op.actividad=='DIAG'){this.descAct='Diagnóstico'}
        if(this.op.actividad=='IN02'){this.descAct='Instalación'}
        if(this.op.actividad=='FCOA'){this.descAct='FCO'}
        if(this.op.actividad=='ADMI'){this.descAct='Administrativo'}
    }

}
