import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatDialogRef } from '@angular/material';

import { SWOService } from '../services/swo.service';

import { ISwo, ICliente, IEquipo, IOperacion } from '../models/interfaces';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
   selector: 'newSwo',
   templateUrl: '../views/newSwo.html',
   styleUrls: ['../css/newSwo.css']
})
export class NewSwoComponent{

    swo = {} as ISwo;
    oper= {} as IOperacion;

    cliente:string='';
    equipo:string='';
    states = ['Programado','Concluido','En espera de refacción', 'Pendiente'];
    actividades = ['PMAI','DIAG','CMAI','IN02','ADMI','FCOA'];

    editFlag=false;

    pickerOptions: FlatpickrOptions = {
        defaultDate: 'today'
      };
    pickerFormGroup:FormGroup;

    constructor( public dialogRef: MatDialogRef<NewSwoComponent>,
                public _swoService: SWOService,
                ) {
                    this.pickerFormGroup = new FormGroup({
                        pickerForm: new FormControl()
                     });
                }

    ngOnInit(){
        if(this.oper.fechaprog){
            this.pickerOptions.defaultDate=this.oper.fechaprog;
        }
    }

    onSubmit(){
        let fecha = this.pickerFormGroup.controls['pickerForm'].value;
        if(fecha){        
            console.log(fecha[0]);
            this.oper.fechaprog=fecha[0];
        }        

        if(this.editFlag){
            if(this.swo.status=='Concluido'){
                this.oper.fechafin= new Date();
                this.swo.fechafin=this.oper.fechafin;
            }
            this.swo.fechainicio=this.oper.fechaprog;
            this.swo.status=this.oper.status;
            this._swoService.updateOP(this.swo,this.oper);
        }else{
            if(this.oper.actividad=='PMAI'){
                this.swo.falla='Mantenimiento Preventivo';
            }
            this.swo.actividad=this.oper.actividad;
            this.swo.fechainicio=this.oper.fechaprog;
            this.swo.status=this.oper.status;
            this._swoService.saveSWO(this.swo,this.oper);
        }
        this.dialogRef.close();
    }

//FIN
}
