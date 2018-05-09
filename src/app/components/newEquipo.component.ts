import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { EquipoService } from '../services/equipo.service';

import { IEquipo } from '../models/interfaces';

@Component({
   selector: 'newEquipo',
   templateUrl: '../views/newEquipo.html',
   styleUrls: ['../css/newEquipo.css']
})
export class NewEquipoComponent{

    equipo = {} as IEquipo;
    idC:string='';

    // Variables para el TIPO
    miTipo: FormControl = new FormControl();
    tipos = ['Monitor de Signos Vitales', 'Desfibrilador','Electrocardiografo','Modulo','Banda de Esfuerzo'];
    filteredTipo: Observable<string[]>;
    // Variables para el MODELO
    miModelo:FormControl = new FormControl();
    modelos = ['IntelliVue MP20', 'IntelliVue MP30', 'IntelliVue MP40', 'IntelliVue MP50', 'IntelliVue MP60',
                'IntelliVue MP70', 'M3001A', 'HeartStar MRx', 'StressVue','PageWriter TC50'];
    filteredModelo: Observable<string[]>;


    constructor( public dialogRef: MatDialogRef<NewEquipoComponent>,
                private _equipoService: EquipoService,
                ) {}

    ngOnInit(){
        this.filteredTipo = this.miTipo.valueChanges.pipe(
            startWith(''),
            map(val => this.filtrarTipos(val))
            );
        this.filteredModelo = this.miModelo.valueChanges.pipe(
            startWith(''),
            map(val => this.filtrarModelos(val))
        );
        
    }

    filtrarTipos(val: string): string[] {
        return this.tipos.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    getTipo(v){
        this.equipo.tipo=v;
    }   
    filtrarModelos(val: string): string[]{
        return this.modelos.filter(option => option.toLowerCase().indexOf(val.toLowerCase())===0);
    }    
    getModelo(v){
        this.equipo.modelo=v;
    }


    onSubmit(){
        this.equipo.cliente=this.idC;
        this._equipoService.saveEquipo(this.equipo);
        this.dialogRef.close();
    }

    toCapital(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 
    }
//FIN
}
