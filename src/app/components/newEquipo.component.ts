import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

import { EquipoService } from '../services/equipo.service';
import { ConfigService } from '../services/config.service';

import { IEquipo } from '../models/interfaces';

@Component({
   selector: 'newEquipo',
   templateUrl: '../views/newEquipo.html',
   styleUrls: ['../css/newEquipo.css']
})
export class NewEquipoComponent{

    equipo = {} as IEquipo;
    idC:string='';

    editFlag:Boolean=false;

    // Variables para el TIPO
    miTipo: FormControl = new FormControl();
    arrayTipos;
    // Este array, deberá leerse desde firebase, habiendolo configurado en el componente CONFIG
    tipos=[];
    filteredTipo;
    // Variables para el MODELO
    miModelo:FormControl = new FormControl();
    modelos = [];
    filteredModelo;

    accesoriosBoolean=false;

    constructor( public dialogRef: MatDialogRef<NewEquipoComponent>,
                private _equipoService: EquipoService,
                public _configService:ConfigService
                ) {
                    if(this.editFlag==true){
                        this.filteredTipo=this.equipo.tipo;
                        this.filteredModelo=this.equipo.modelo;
                    }else{
                        this.leerConfig();
                    }
                }

    leerConfig(){
        this._configService.getConfig().subscribe(res=>{
            this.arrayTipos=res[0];
            this.tipos=Object.keys(res[0]);
            this.filteredTipo=this.tipos; 
        })
    }

    filtrarTipos(val: string) {
        this.filteredTipo=this.tipos.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) >= 0);
    }
    getTipo(v){
        this.equipo.tipo=v;
        this.modelos=this.arrayTipos[v];
        this.filteredModelo=this.modelos;
        
    }   
    filtrarModelos(val: string){
        this.filteredModelo=this.modelos.filter(option => option.toLowerCase().indexOf(val.toLowerCase())>=0);
    }    
    getModelo(v){
        this.equipo.modelo=v;
    }
    
    onSubmit(){
        if(this.editFlag==true){
            this._equipoService.updateEquipo(this.equipo);
            console.log(this.equipo);
            this.dialogRef.close();
        }else{
            this.equipo.cliente=this.idC;
            this._equipoService.saveEquipo(this.equipo);
            this.dialogRef.close();
        }
    }

    toCapital(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 
    }
//FIN
}
