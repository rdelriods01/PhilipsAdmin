import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatDialogRef } from '@angular/material';

import { SWOService } from '../services/swo.service';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../services/auth.service';

import { ISwo, IOperacion } from '../models/interfaces';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
   selector: 'newOP',
   templateUrl: '../views/newOP.html',
   styleUrls: ['../css/newOP.css']
})
export class NewOPComponent{
    user;

    swo = {} as ISwo;
    oper= {} as IOperacion;

    actividades = ['DIAG','CMAI','ADMI','PMAI','FCOA'];
    ingenieros=[];

    pickerOptions: FlatpickrOptions = {
        minDate: 'today'
      };
    pickerFormGroup:FormGroup;

    constructor( public dialogRef: MatDialogRef<NewOPComponent>,
                public _swoService: SWOService,
                public _configService: ConfigService,
                public auth: AuthService
                ) {
                    this.auth.user.subscribe(us=>{this.user=us});
                    this.pickerFormGroup = new FormGroup({
                        pickerForm: new FormControl()
                     });
                }

    ngOnInit(){
        // cargar ingenieros 
        this._configService.getFSEs().subscribe(arr=>{
            arr.forEach(inge=>{
                this.ingenieros.push(inge.displayName)
            })            
        })
    }

    onSubmit(){
        let fecha = this.pickerFormGroup.controls['pickerForm'].value;
        if(fecha){        
            this.oper.fechaprog=fecha[0];
            this.swo.fechaop=this.oper.fechaprog;
            this.swo.status=this.oper.status;
            if(this.oper.actividad=='PMAI'){
                this.swo.falla='Mantenimiento Preventivo';
            }
            this.swo.actividad=this.oper.actividad;
            if(this.user.role=='fse'){
                this.oper.fse=this.user.displayName;
            }
            this.swo.fse=this.oper.fse;
            this._swoService.saveOP(this.swo,this.oper);
            this._swoService.updateSWO(this.swo);
            this.dialogRef.close();
        } else{
            alert('Por favor seleccione la fecha');
        }
    }

}
