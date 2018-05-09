import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { ClienteService } from '../services/cliente.service';

import { ICliente } from '../models/interfaces';

@Component({
   selector: 'newCliente',
   templateUrl: '../views/newCliente.html',
   styleUrls: ['../css/newCliente.css']
})
export class NewClienteComponent{

    cliente = {} as ICliente;

    // Variables para los Estados
    miEstado: FormControl = new FormControl();
    estados = ['Aguascalientes','Baja California','Baja California Sur','Campeche',
            'Coahuila','Colima','Chiapas','Chihuahua','Ciudad de México','Durango',
            'Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán',
            'Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo',
            'San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala',
            'Veracruz','Yucatán','Zacatecas'];
    filteredOptions: Observable<string[]>;
    
    constructor( public dialogRef: MatDialogRef<NewClienteComponent>,
                private _clienteService: ClienteService,
                ) {}

    ngOnInit(){
        this.filteredOptions = this.miEstado.valueChanges.pipe(
            startWith(''),
            map(val => this.filtrarEstados(val))
          );
    }

    filtrarEstados(val: string): string[] {
        return this.estados.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    getEstado(v){
        this.cliente.estado=v;
    }
    onSubmit(){
        this.cliente.nombre=this.toCapital(this.cliente.nombre);
        this._clienteService.saveCliente(this.cliente);
        this.dialogRef.close();
    }

    toCapital(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 
    }
//FIN
}
